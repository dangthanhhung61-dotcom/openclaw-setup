import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createRequire } from 'node:module';
import test from 'node:test';
import vm from 'node:vm';

const require = createRequire(import.meta.url);
const sha = text => createHash('sha256').update(text).digest('hex');
const root = new URL('../', import.meta.url);

for (const tree of ['src', 'dist']) {
  const source = readFileSync(new URL(`${tree}/setup/shared/common-gen.js`, root), 'utf8');
  const match = source.match(/function patchZaloLifecycle\(spec\) \{[\s\S]*?\n  \}/);
  assert.ok(match, `${tree}: patch implementation exists`);

  test(`${tree}: version/hash guard, backup, idempotency`, () => {
    const home = mkdtempSync(join(tmpdir(), 'openclaw-zalo-patch-'));
    const plugin = join(home, 'extensions', 'zalo-connect');
    const dist = join(plugin, 'dist');
    mkdirSync(dist, { recursive: true });
    const pkg = join(plugin, 'package.json');
    const bundle = join(dist, 'index.js');
    const before = 'alpha\nbeta\n';
    const after = 'alpha\nBETA\n';
    const spec = ['dist/index.js', sha(before), sha(after), [[1, 1, ['BETA']]]];
    const logs = [];
    const run = () => vm.runInNewContext(`(${match[0]})(${JSON.stringify(spec)})`, {
      require, process: { env: { OPENCLAW_HOME: home }, pid: 12345 },
      console: { log: line => logs.push(line) },
    });
    try {
      writeFileSync(pkg, JSON.stringify({ version: '3.1.6' }));
      writeFileSync(bundle, before);
      run();
      assert.equal(readFileSync(bundle, 'utf8'), before);
      assert.match(logs.at(-1), /unsupported version/);

      writeFileSync(pkg, JSON.stringify({ version: '3.1.5' }));
      writeFileSync(bundle, 'unknown bundle');
      run();
      assert.equal(readFileSync(bundle, 'utf8'), 'unknown bundle');
      assert.match(logs.at(-1), /unknown bundle/);

      writeFileSync(bundle, before);
      run();
      assert.equal(readFileSync(bundle, 'utf8'), after);
      assert.equal(readFileSync(bundle + '.openclaw-setup-lifecycle.before', 'utf8'), before);
      run();
      assert.equal(readFileSync(bundle, 'utf8'), after);
      assert.match(logs.at(-1), /already applied/);
    } finally {
      rmSync(home, { recursive: true, force: true });
    }
  });

  test(`${tree}: generated Docker startup contains guarded Zalo patch`, () => {
    const context = vm.createContext({ Buffer });
    vm.runInContext(source, context);
    vm.runInContext(readFileSync(new URL(`${tree}/setup/shared/docker-gen.js`, root), 'utf8'), context);
    const common = context.__openclawCommon;
    const artifacts = context.__openclawDockerGen.buildDockerArtifacts({
      is9Router: true, osChoice: 'win', zaloBackend: 'zalo-connect',
    });
    assert.ok(artifacts.entrypointScript.includes(common.buildZaloLifecyclePatchScript()));
    assert.match(artifacts.entrypointScript, /duckduckgo_installed\(\)/);
    assert.match(artifacts.entrypointScript, /authHeader=true/);
    assert.equal(common.build9RouterProviderConfig().auth, 'api-key');
    assert.equal(common.build9RouterProviderConfig().authHeader, true);
  });
}
