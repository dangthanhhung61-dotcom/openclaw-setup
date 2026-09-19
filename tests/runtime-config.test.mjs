import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import vm from 'node:vm';

const projectRoot = new URL('../', import.meta.url);
const source = (path) => readFileSync(new URL(path, projectRoot), 'utf8');
const expectedSpec = 'openclaw@2026.9.4';
const boundaryCases = [
  ['v22.22.3', false], ['v23.11.0', false],
  ['v24.0.0', false], ['v24.15.99', false],
  ['v24.16.0', true], ['24.16.1', true], ['v24.18.0', true],
  ['v25.0.0', false], ['v25.9.0', false],
  ['v26.0.99', false], ['v26.1.0', true], ['v26.2.0', true],
  ['v27.0.0', true], ['v28.0.0', true],
  ['', false], ['invalid', false], ['v24.16', false],
  ['v24.16.0-rc.1', false], ['v26.1.0-rc.1', false],
];

for (const tree of ['src', 'dist']) {
  test(`${tree}: pinned package and generated Docker runtime`, () => {
    const context = vm.createContext({ Buffer });
    vm.runInContext(source(`${tree}/setup/shared/common-gen.js`), context);
    vm.runInContext(source(`${tree}/setup/shared/docker-gen.js`), context);
    const common = context.__openclawCommon;
    assert.equal(common.OPENCLAW_NPM_SPEC, expectedSpec);
    assert.equal(common.NINE_ROUTER_NPM_SPEC, '9router@latest');
    assert.equal(common.build9RouterProviderConfig().auth, 'api-key');
    assert.equal(common.build9RouterProviderConfig().authHeader, true);
    for (const osChoice of ['win', 'macos', 'linux']) {
      for (const provider of ['9router', 'local', 'direct']) {
        for (const isMultiBot of [false, true]) {
          const artifacts = context.__openclawDockerGen.buildDockerArtifacts({
            openClawNpmSpec: common.OPENCLAW_NPM_SPEC,
            openClawRuntimePackages: common.OPENCLAW_RUNTIME_PACKAGES,
            osChoice, isMultiBot,
            is9Router: provider === '9router', isLocal: provider === 'local',
            selectedModel: 'test-model', agentId: 'test-bot',
          });
          assert.match(artifacts.dockerfile, /^FROM node:24-slim\r?\n/);
          assert.ok(artifacts.dockerfile.includes(`ARG OPENCLAW_VER="${expectedSpec}"`));
          if (provider === '9router') assert.match(artifacts.compose, /image: node:22-slim/);
        }
      }
    }
  });

  test(`${tree}: host Node version gate and install/update preflight`, () => {
    const server = source(`${tree}/server/local-server.js`);
    const gate = server.match(/function nodeVersionSupported\(version\) \{[\s\S]*?\n\}/);
    const preflight = server.match(/function assertOpenclawNodeVersion\(\) \{[\s\S]*?\n\}/);
    assert.ok(gate);
    assert.ok(preflight);
    const context = vm.createContext({
      process: { version: 'v24.18.0' }, OPENCLAW_NPM_SPEC: expectedSpec,
      httpError: (status, message) => Object.assign(new Error(message), { status }),
    });
    vm.runInContext(`${gate[0]}\n${preflight[0]}`, context);
    for (const [version, supported] of boundaryCases) {
      assert.equal(context.nodeVersionSupported(version), supported, version);
      context.process.version = version;
      if (supported) assert.doesNotThrow(() => context.assertOpenclawNodeVersion());
      else assert.throws(() => context.assertOpenclawNodeVersion(), /requires Node\.js/);
    }
    assert.match(server, /async function installCore\([^\n]+\) \{\s*\/\/[^\n]+\s*assertOpenclawNodeVersion\(\);\s*state\.installing = true;/);
    assert.match(server, /if \(isNativeProject\(projectDir\)\) \{\s*if \(!isRouter\) assertOpenclawNodeVersion\(\);\s*sendLog\(`\[native\] Updating/);
  });
  test(`${tree}: 9Router auth migration fills only missing fields`, () => {
    const context = vm.createContext({ Buffer });
    vm.runInContext(source(`${tree}/setup/shared/common-gen.js`), context);
    vm.runInContext(source(`${tree}/setup/shared/docker-gen.js`), context);
    const script = context.__openclawDockerGen.routerAuthDefaultsScript;
    for (const initial of [
      { apiKey: 'test-key' },
      { apiKey: 'test-key', auth: 'custom', authHeader: false },
    ]) {
      let cfg = { models: { providers: { '9router': { ...initial } } }, unrelated: { kept: true } };
      const fs = {
        existsSync: () => true,
        readFileSync: () => JSON.stringify(cfg),
        writeFileSync: (_, value) => { cfg = JSON.parse(value); },
      };
      vm.runInNewContext(script, { require: id => id === 'fs' ? fs : path, process: { cwd: () => '/project' } });
      const provider = cfg.models.providers['9router'];
      assert.equal(provider.apiKey, 'test-key');
      assert.equal(provider.auth, initial.auth ?? 'api-key');
      assert.equal(provider.authHeader, initial.authHeader ?? true);
      assert.equal(cfg.unrelated.kept, true);
    }
  });
  test(`${tree}: unsupported Node stops before mutations; 9router update is unchanged`, async () => {
    const server = source(`${tree}/server/local-server.js`);
    const names = ['nodeVersionSupported', 'assertOpenclawNodeVersion', 'installCore', 'updateRuntime'];
    const functions = names.map((name) => {
      const match = server.match(new RegExp(`(?:async )?function ${name}\\([^\\n]*\\) \\{[\\s\\S]*?\\n\\}`));
      assert.ok(match, name);
      return match[0];
    });
    const calls = [];
    const context = vm.createContext({
      process: { version: 'v22.22.3' }, OPENCLAW_NPM_SPEC: expectedSpec,
      NINE_ROUTER_NPM_SPEC: '9router@latest', state: {},
      httpError: (status, message) => Object.assign(new Error(message), { status }),
      isNativeProject: () => true, sendLog: () => {}, probeCacheClear: () => {},
      run: async (command, args) => calls.push([command, ...args]),
      startNative9Router: async () => {}, restartNativeRuntime: async () => {},
      syncRuntimeState: async () => {},
    });
    vm.runInContext(functions.join('\n'), context);
    await assert.rejects(() => context.installCore({ mode: 'native', projectDir: 'test' }), /requires Node\.js/);
    assert.deepEqual(Object.keys(context.state), []);
    await assert.rejects(() => context.updateRuntime('openclaw', 'test'), /requires Node\.js/);
    assert.equal(calls.length, 0);
    await context.updateRuntime('9router', 'test');
    assert.equal(calls[0].join(' '), 'npm install -g 9router@latest');
    context.process.version = 'v24.16.0';
    await context.updateRuntime('openclaw', 'test');
    assert.equal(calls[1].join(' '), `npm install -g ${expectedSpec}`);
  });
}

test('edited source and distributed files remain identical', () => {
  for (const path of ['setup/shared/common-gen.js', 'setup/shared/docker-gen.js', 'server/local-server.js']) {
    assert.equal(source(`src/${path}`).replace(/\r\n/g, '\n'), source(`dist/${path}`).replace(/\r\n/g, '\n'), path);
  }
  assert.equal(JSON.parse(source('package.json')).version, '5.16.6');
});
