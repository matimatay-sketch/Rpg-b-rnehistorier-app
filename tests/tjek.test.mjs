import { test } from 'node:test';
import assert from 'node:assert';
import { tjek } from '../tools/tjek-historier.mjs';

const beskeder = (fil) => tjek(['tests/fixtures/' + fil]).map(f => f.besked).join('\n');

test('en god historie giver ingen fejl', () => assert.deepEqual(tjek(['tests/fixtures/god.js']), []));
test('blindgyde', () => assert.match(beskeder('blindgyde.js'), /Blindgyde: ingen valg/));
test('manglende mål', () => assert.match(beskeder('manglende-maal.js'), /fører til "findesikke"/));
test('manglende spørgsmål', () => assert.match(beskeder('mangler-spoergsmaal.js'), /Mangler spørgsmål til børnene/));
test('kode der kaster', () => assert.match(beskeder('kaster-fejl.js'), /Fejl i koden/));
test('fejl peger på historie og scene', () => {
  const f = tjek(['tests/fixtures/blindgyde.js'])[0];
  assert.equal(f.historie, 'blindgyde');
  assert.equal(f.scene, 'b');
});

const billedBeskeder = (fil) => tjek(['tests/fixtures/' + fil], { kraevBilleder: true });
test('mangler billede', () => {
  const f = billedBeskeder('mangler-billede.js');
  assert.deepEqual(f.map(x => x.scene + ': ' + x.besked), ['b: Mangler billede']);
});
test('billede med ukendt del', () => assert.match(billedBeskeder('forkert-billede.js').map(f => f.besked).join('\n'), /Billedfejl: Ukendt sted: mars/));
test('uden krav om billeder er et manglende billede i orden', () => assert.deepEqual(tjek(['tests/fixtures/mangler-billede.js']), []));
