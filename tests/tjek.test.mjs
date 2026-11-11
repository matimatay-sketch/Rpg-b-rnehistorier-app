import { test } from 'node:test';
import assert from 'node:assert';
import { tjek, tjekKatalog } from '../tools/tjek-historier.mjs';

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

test('månedshistorierne i e2e-kataloget har billeder og er i orden', () => {
  const filer = ['tests/fixtures/stories-maaned/efteraar/historie.js', 'tests/fixtures/stories-maaned/juletraeet/historie.js'];
  assert.deepEqual(tjek(filer, { kraevBilleder: true }), []);
});

test('samme scene-id i to historier er en fejl', () => {
  const f = tjek(['tests/fixtures/god.js', 'tests/fixtures/god.js']);
  assert.deepEqual(f.map(x => x.scene + ': ' + x.besked), ['a: Scene-id findes også i historien god', 'b: Scene-id findes også i historien god', 'c: Scene-id findes også i historien god']);
});
test('en månedshistorie må ikke sætte et venne-flag', () => {
  assert.match(beskeder('maaned-venneflag.js'), /En månedshistorie må ikke sætte venne-flaget "tutVen"/);
  assert.doesNotMatch(beskeder('maaned-venneflag.js'), /eget/);
});

// Magi- og mester-valgenes funktioner køres kun, når en helt har magien eller 5 i trækket. Tjekket kører dem alle.
test('magi med en show(), der kaster, er en fejl', () => {
  const f = tjek(['tests/fixtures/magi-show-kaster.js']);
  assert.deepEqual(f.map(x => x.scene), ['ms_a']);
  assert.match(f[0].besked, /^Fejl i koden: .*magien "gnist"/);
});
test('mester-valg med en n(), der kaster, er en fejl', () => {
  const f = tjek(['tests/fixtures/mester-n-kaster.js']);
  assert.deepEqual(f.map(x => x.scene), ['mn_a']);
  assert.match(f[0].besked, /^Fejl i koden: .*mester-valget "Mod"/);
});
test('magi og mester-valg, der bruger helten som motoren, er i orden', () => assert.deepEqual(tjek(['tests/fixtures/magi-eff.js']), []));

// Hver post i kataloget skal passe med historien i sin fil.
const katalogFejl = () => tjekKatalog('tests/fixtures/katalog-tjek/katalog.js');
const forPost = (id) => katalogFejl().filter(f => f.historie === id).map(f => f.besked).join('\n');
test('et katalog, hvor alt passer, giver ingen fejl', () => assert.deepEqual(tjekKatalog('tests/fixtures/katalog-tjek/god-katalog.js'), []));
test('kataloget: historien har et andet id end posten', () => {
  assert.match(forPost('rigtig'), /Historien i filen har id "forkert", men kataloget kalder den "rigtig"/);
});
test('kataloget: historien har en anden type end posten', () => {
  assert.equal(forPost('ftype'), 'Historien i filen har type "saga", men kataloget siger "maaned"');
});
test('kataloget: historien har en anden udgivelsesdato end posten', () => {
  assert.equal(forPost('fudg'), 'Historien i filen har udgives "2027-03-15", men kataloget siger "2027-03-01"');
});
test('kataloget: filen registrerer to historier', () => assert.match(forPost('toa'), /registrerer 2 historier/));
test('kataloget: filen registrerer ingen historie', () => assert.match(forPost('ingen'), /registrerer ingen historie/));
test('kataloget: de gode poster giver ingen fejl', () => {
  assert.equal(forPost('gsaga'), '');
  assert.equal(forPost('gmaaned'), '');
});
test('det rigtige katalog passer med sine filer', () => assert.deepEqual(tjekKatalog('stories/katalog.js', { kraevBilleder: true }), []));

// Bevægelser: et valg med bevaeg: { goer, stat, target, win, lose }.
test('god bevægelse giver ingen fejl', () => assert.deepEqual(tjek(['tests/fixtures/bevaeg-god.js']), []));
test('uden instruktion', () => assert.match(beskeder('bevaeg-uden-goer.js'), /Bevægelse uden instruktion/));
test('uden terning', () => assert.match(beskeder('bevaeg-uden-terning.js'), /Bevægelse uden træk og sværhed til terningen/));
test('for mange', () => assert.match(beskeder('bevaeg-for-mange.js'), /For mange bevægelser \(højst 2\)/));
test('to bevægelser i samme scene', () => assert.match(beskeder('bevaeg-to-i-scene.js'), /To bevægelser i samme scene/));
test('månedshistorie uden bevægelse', () => assert.match(beskeder('maaned-uden-bevaeg.js'), /Månedshistorien har ingen bevægelser/));
test('bevægelsens mål tjekkes', () => {
  const f = tjek(['tests/fixtures/bevaeg-lose-findes-ikke.js']).map(x => x.besked).join('\n');
  assert.match(f, /fører til "findesikke"/);
});

test('valg med både terning og bevægelse', () => assert.match(beskeder('bevaeg-begge.js'), /Valget har både terning og bevægelse/));
test('bevægelse med brudt sværhed', () => assert.match(beskeder('bevaeg-brokent-maal.js'), /Bevægelse uden træk og sværhed til terningen/));
