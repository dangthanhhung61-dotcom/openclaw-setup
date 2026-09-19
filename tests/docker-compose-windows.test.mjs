import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import vm from 'node:vm';

const docker = spawnSync('docker', ['compose', 'version'], { encoding: 'utf8' });
const hasCompose = docker.status === 0;

for (const tree of ['src', 'dist']) {
  test(`${tree}: Windows Compose variants are valid`, { skip: !hasCompose }, () => {
    const context = vm.createContext({ Buffer });
    for (const file of ['common-gen.js', 'docker-gen.js']) {
      vm.runInContext(readFileSync(new URL(`../${tree}/setup/shared/${file}`, import.meta.url), 'utf8'), context);
    }
    for (const isMultiBot of [false, true]) {
      for (const provider of ['9router', 'local', 'direct']) {
        const artifacts = context.__openclawDockerGen.buildDockerArtifacts({
          openClawNpmSpec: 'openclaw@2026.9.4', osChoice: 'win', isMultiBot,
          is9Router: provider === '9router', isLocal: provider === 'local',
        });
        // `docker compose config` only parses Compose; no container is started.
        // The generated env file does not exist in the repository, so omit that line.
        const compose = artifacts.compose
          .replace(/    env_file:\s*\n      - \.\.\/\.\.\/\.env\n/g, '')
          .replace(/    env_file: \.\.\/\.\.\/\.env\n/g, '');
        const check = spawnSync('docker', ['compose', '-f', '-', 'config', '--quiet'], {
          input: compose, encoding: 'utf8', timeout: 15000,
        });
        assert.equal(check.status, 0, `${isMultiBot ? 'multi' : 'single'} ${provider}: ${check.stderr}`);
      }
    }
  });
}
