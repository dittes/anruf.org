// Automatische Durchläufe für tools/test.html. ACHTUNG, SPOILER: enthält alle Lösungen im Klartext.
//
// Jeder Durchlauf: Fall, erwarteter Ausgang, Antworten pro Rätsel und optional
//   asks:  Reihenfolge der Fragen im Verhör (Options-IDs); sonst „Beweise zuerst“
//   votes: Wahl pro Abstimmung (ID → Option); sonst die erste Option
//   expire: ['solve', rätsel]  springt zu diesem Rätsel und lässt den Countdown sofort ablaufen

const NS = {stimme: 'Leuchtturm', fach: '4071', nummer: '0712289', krell: 'Krell', ping: 'St. Gallen', strom: '01011011', morse: 'Säntis', abschaltung: '49172'}
const FS = {boje: 'D4', echo: '21 Uhr', fass: 'Bleischlamm', kanal: 'Pricke', pegel: '3,00 m', licht: 'Nur zwei'}
const OB = {konsole: 'Leipzig9102', kai: 'Orion', spiegel: 'neugierig', echt: 'Narbe', farben: 'rot blau gelb grün rot blau', notaus: 'Bruno'}
const HW = {tuer: '1954', uhr: '4:10', kassette: 'libelle', nummer: '0571883011', strom: '00101', truhe: '714', wer: 'Irma'}
const NP = {blatt: 'Blatt sieben', gruppen: 'falter', fernwahl: '04215573', klartext: 'senderchef', schalter: '10101101', kranich: 'Wendt'}
const ZS = {echt: '11100000', ort: 'St. Jakobi', erhoehung: '0205', mail: 'Das Original bleibt hier'}

export const PLAYS = [
  {case: 'nachtschicht', name: 'Hauptweg', answers: NS, votes: 'last', expect: 'leuchtturm'},
  {case: 'nachtschicht', name: 'Abschaltung verpasst', answers: NS, expire: ['solve', 'abschaltung'], expect: 'verloren'},
  {case: 'funkstille', name: 'Hauptweg', answers: FS, votes: 'last', expect: 'warft'},
  {case: 'onboarding', name: 'Hauptweg', answers: OB, votes: 'last', expect: 'kai'},
  {case: 'onboarding', name: 'Upload fertig', answers: OB, expire: ['solve', 'notaus'], expect: 'zwilling'},
  {case: 'zuschlag', name: 'Polizei', answers: ZS, votes: {roth: 'polizei'}, expect: 'polizei'},
  {case: 'zuschlag', name: 'Angebot', answers: ZS, votes: {roth: 'deal'}, expect: 'deal'},
  {case: 'zuschlag', name: 'Zum Dritten', answers: ZS, expire: ['solve', 'ort'], expect: 'verkauft'},
  {case: 'erbe', name: 'Libelle', answers: HW, asks: ['libelle', 'tot', 'testament', 'weserkraft', 'polizei', 'durchschaut'], votes: {sofort: 'ansehen'}, expect: 'irma'},
  {case: 'erbe', name: 'Haus', answers: HW, asks: ['libelle', 'tot', 'testament', 'polizei', 'danke'], votes: {sofort: 'ansehen'}, expect: 'haus'},
  {case: 'erbe', name: 'Sofort unterschrieben', answers: HW, votes: {sofort: 'unterschreiben'}, expect: 'verzicht'},
  {case: 'erbe', name: 'Mitternacht', answers: HW, expire: ['solve', 'truhe'], expect: 'mitternacht'},
  {case: 'nachtprogramm', name: 'Kranich', answers: NP, asks: ['name', 'weiter', 'chef', 'schwaermer', 'geständnis', 'weiss'], expect: 'kranich'},
  {case: 'nachtprogramm', name: 'Live', answers: NP, asks: ['name', 'weiter', 'chef', 'schwaermer', 'geständnis', 'nichts'], votes: {regler: 'live'}, expect: 'live'},
  {case: 'nachtprogramm', name: 'Regler runter', answers: NP, asks: ['name', 'weiter', 'chef', 'schwaermer', 'geständnis', 'nichts'], votes: {regler: 'aus'}, expect: 'aus'},
  {case: 'nachtprogramm', name: 'Netzagentur', answers: NP, expire: ['solve', 'schalter'], expect: 'stoerung'}
]
