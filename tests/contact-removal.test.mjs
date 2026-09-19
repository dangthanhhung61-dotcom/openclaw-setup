import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import test from 'node:test';

const read = (relative) => readFileSync(new URL(`../${relative}`, import.meta.url), 'utf8');

test('installer UI contains no personal contacts or donation details', () => {
  const source = read('src/web/app.js');
  const distributed = read('dist/web/app.js');
  assert.equal(distributed.replace(/\r\n/g, '\n'), source.replace(/\r\n/g, '\n'));
  for (const ui of [source, distributed]) {
    assert.doesNotMatch(ui, /zalo\.me\/|facebook\.com\/holeminhtuan|t\.me\/holeminhtuan|0962794917|bvvbank\.jpg|momo\.jpg|data-donate|donateModal\(/i);
    // Contact links are gone, but channel setup and its modals remain available.
    assert.match(ui, /id: 'telegram'/);
    assert.match(ui, /id: 'zalo-personal'/);
    assert.match(ui, /id: 'fb-messenger'/);
    assert.match(ui, /function zaloLoginModal\(/);
    assert.match(ui, /function fbPluginModal\(/);
  }
  for (const tree of ['src', 'dist']) {
    for (const asset of ['bvvbank.jpg', 'momo.jpg']) {
      assert.equal(existsSync(new URL(`../${tree}/web/${asset}`, import.meta.url)), false);
    }
  }
});
