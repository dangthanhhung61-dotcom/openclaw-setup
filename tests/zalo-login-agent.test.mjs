import assert from 'node:assert/strict';
import { EventEmitter } from 'node:events';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import test from 'node:test';
import vm from 'node:vm';

const root = new URL('../', import.meta.url);
const projectDir = 'D:/project with spaces';
const clone = (value) => JSON.parse(JSON.stringify(value));
const config = () => ({
  agents: { entries: { main: {}, jarvis: {} }, defaults: {} },
  bindings: [{ agentId: 'jarvis', match: { channel: 'zalo-connect', accountId: 'default' } }],
});

function harness(tree, cfg = config(), native = false) {
  const source = readFileSync(new URL(`${tree}/server/local-server.js`, root), 'utf8');
  const functions = ['startZaloLogin', 'startZaloConnectLogin'].map((name) => {
    const match = source.match(new RegExp(`async function ${name}\\([^\\n]*\\) \\{[\\s\\S]*?\\n\\}`));
    assert.ok(match, name);
    return match[0];
  });
  const spawns = [], logs = [], timers = [];
  const png = Buffer.alloc(200, 1);
  const context = vm.createContext({
    join, Buffer, process: { env: { EXISTING_ENV: 'preserved' } },
    existsSync: () => true,
    fsp: {
      readFile: async (path) => path.endsWith('openclaw.json') ? JSON.stringify(cfg) : png,
      stat: async () => ({ size: png.length }),
    },
    httpError: (status, message) => Object.assign(new Error(message), { status }),
    probeCacheClear: () => {}, isNativeProject: () => native,
    getBotContainerName: () => 'openclaw-bot', sendLog: (line) => logs.push(line),
    waitForDockerContainer: async () => true,
    waitForGatewayZaloReady: async () => true,
    waitForNativeGatewayZaloReady: async () => true,
    resolveBinPath: () => 'openclaw', nativeEnv: () => ({ PROJECT_ENV: 'preserved' }),
    extractCompletePngBase64: (text) => text,
    runCapture: async () => ({ stdout: png.toString('base64'), stderr: '' }),
    restartNativeRuntime: async () => {}, restartDockerBotContainer: async () => {},
    setTimeout: (callback, delay) => timers.push({ callback, delay }),
    spawn: (command, args, options) => {
      const child = new EventEmitter();
      child.stdout = new EventEmitter(); child.stderr = new EventEmitter();
      child.killed = false;
      spawns.push({ command, args: clone(args), options: clone(options), child });
      return child;
    },
  });
  vm.runInContext(`let zaloLoginInFlight = false; let zaloLoginChild = null;\n${functions.join('\n')}`, context);
  const argv = (index = 0) => {
    const call = spawns[index];
    return native ? call.args : call.args.slice(call.args.indexOf('openclaw') + 1);
  };
  return { context, spawns, logs, timers, argv };
}

for (const tree of ['src', 'dist']) {
  for (const native of [false, true]) {
    const label = `${tree}/${native ? 'native' : 'docker'}`;
    test(`${label}: selected agent and its account reach the CLI`, async () => {
      const cfg = config();
      cfg.bindings.unshift({ agentId: 'main', match: { channel: 'zalo-connect', accountId: 'main-account' } });
      cfg.bindings[1].match.accountId = 'jarvis-account';
      const h = harness(tree, cfg, native);
      await h.context.startZaloLogin(projectDir, 'jarvis');
      assert.deepEqual(h.argv(), ['channels', 'login', '--channel', 'zalo-connect', '--account', 'jarvis-account', '--agent', 'jarvis', '--verbose']);
      const call = h.spawns[0];
      assert.equal(call.options.cwd, projectDir);
      assert.equal(call.options.shell, false);
      assert.equal(call.options.windowsHide, true);
      if (native) {
        assert.equal(call.options.env.PROJECT_ENV, 'preserved');
        assert.equal(call.options.env.EXISTING_ENV, 'preserved');
      } else {
        assert.equal(call.command, 'docker');
        assert.deepEqual(call.args.slice(0, 5), ['exec', '-w', '/home/node/project', 'openclaw-bot', 'openclaw']);
      }
    });
    test(`${label}: retries retain the same agent and account`, async () => {
      const h = harness(tree, config(), native);
      await h.context.startZaloLogin(projectDir, 'jarvis');
      h.spawns[0].child.emit('close', 1);
      assert.equal(h.timers[0].delay, 10000);
      h.timers[0].callback();
      assert.deepEqual(h.argv(1), h.argv(0));
    });
    test(`${label}: QR output still reaches the browser log stream`, async () => {
      const h = harness(tree, config(), native);
      await h.context.startZaloLogin(projectDir, 'jarvis');
      h.spawns[0].child.stdout.emit('data', Buffer.from('QR image saved at: /tmp/zalo-connect-qr-test.png\n'));
      await new Promise((resolve) => setImmediate(resolve));
      assert.ok(h.logs.some((line) => line.startsWith('[zalo-connect:qr] data:image/png;base64,')));
    });
  }
  test(`${tree}: missing UI agent is inferred from its Zalo binding`, async () => {
    const h = harness(tree);
    await h.context.startZaloLogin(projectDir);
    assert.equal(h.argv()[h.argv().indexOf('--agent') + 1], 'jarvis');
  });
  test(`${tree}: configured System Agent is used when no Zalo binding exists`, async () => {
    const cfg = config(); cfg.bindings = [];
    cfg.agents.defaults.systemAgent = { agentId: 'main' };
    const h = harness(tree, cfg);
    await h.context.startZaloLogin(projectDir);
    assert.equal(h.argv()[h.argv().indexOf('--agent') + 1], 'main');
  });
  test(`${tree}: explicit UI agent takes precedence over System Agent`, async () => {
    const cfg = config(); cfg.bindings = [];
    cfg.agents.defaults.systemAgent = { agentId: 'main' };
    const h = harness(tree, cfg);
    await h.context.startZaloLogin(projectDir, 'jarvis');
    assert.equal(h.argv()[h.argv().indexOf('--agent') + 1], 'jarvis');
  });
  test(`${tree}: sole entry and legacy sole agent are supported`, async () => {
    for (const agents of [{ entries: { jarvis: {} } }, { list: [{ id: 'jarvis' }] }]) {
      const h = harness(tree, { agents, bindings: [] });
      await h.context.startZaloLogin(projectDir);
      assert.equal(h.argv()[h.argv().indexOf('--agent') + 1], 'jarvis');
    }
  });
  test(`${tree}: ambiguous or unknown owners fail before spawning a login`, async () => {
    const cfg = config(); cfg.bindings = [];
    for (const agentId of ['', 'missing-agent']) {
      const h = harness(tree, cfg);
      await assert.rejects(() => h.context.startZaloLogin(projectDir, agentId), (error) => error.status === 400);
      assert.equal(h.spawns.length, 0);
      assert.equal(vm.runInContext('zaloLoginInFlight', h.context), false);
    }
  });
  test(`${tree}: account values are literal arguments, never shell input`, async () => {
    const cfg = config(); const accountId = 'account; echo unsafe $(command)';
    cfg.bindings[0].match.accountId = accountId;
    const h = harness(tree, cfg);
    await h.context.startZaloLogin(projectDir, 'jarvis');
    assert.equal(h.argv()[h.argv().indexOf('--account') + 1], accountId);
    assert.ok(!h.spawns[0].args.includes('sh'));
  });
}
