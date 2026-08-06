import type { ToolContent } from './types';

// Deutsch. Keine Wort-für-Wort-Übersetzung, sondern Transkreation auf Basis der
// Begriffe und Wendungen, die deutsche Base64-Tools tatsächlich verwenden.
// Keine Werbefloskeln (einfach / schnell / kinderleicht / perfekt) — Datenschutz
// wird strukturell, nicht als Versprechen, dargestellt (BRAND-OPERATING-MODEL).

export const de: ToolContent = {
  htmlLang: 'de',

  meta: {
    title: 'Base64 kodieren & dekodieren — Text und Dateien, ohne Upload | runlocally',
    description:
      'Text oder Dateien im Browser zu Base64 kodieren, oder Base64 zurück in Text oder eine Datei dekodieren. Unicode-Text und Binärdateien werden korrekt behandelt. Nichts wird hochgeladen — Open Source, funktioniert offline.',
    ogTitle: 'Base64 kodieren & dekodieren — Text und Dateien',
    ogDescription:
      'Base64 im Browser kodieren oder dekodieren, für Text und Dateien. Unicode und Binärdaten werden korrekt behandelt. Nichts wird hochgeladen.',
  },

  hero: {
    h1: 'Base64 kodieren / dekodieren',
    tagline:
      'Text oder Dateien zu Base64 kodieren, oder Base64 zurückwandeln — im Browser. Unicode-sicher, binär-sicher. Nichts wird hochgeladen.',
  },

  intro: {
    h2: 'Base64 kodieren oder dekodieren, ohne den Browser zu verlassen',
    paras: [
      'Base64 wandelt beliebige Bytes in reinen ASCII-Text um — deshalb taucht es in Data-URIs, E-Mail-Anhängen, API-Payloads und Konfigurationsdateien auf. Dieses Tool funktioniert in beide Richtungen: Text eingeben oder einfügen, um ihn zu Base64 zu kodieren, oder einen Base64-String einfügen, um den ursprünglichen Text oder die Datei zurückzubekommen.',
      'Die Textkodierung geht korrekt über UTF-8-Bytes, sodass Japanisch, Emoji und jeder andere Unicode-Text exakt hin- und zurückkonvertiert wird — anders als ein einfaches btoa(), das bei allem außerhalb von Latin-1 abbricht. Die Dateikodierung liest die Datei in Blöcken, sodass es auch bei großen Dateien nicht an ein Browser-Limit stößt. Wenn etwas Eingefügtes zu Bytes dekodiert, die kein gültiger UTF-8-Text sind, bietet das Tool stattdessen einen Download der rohen Bytes an, statt einen wirren String anzuzeigen.',
    ],
  },

  privacy: {
    h2: 'Warum dein Text und deine Dateien auf deinem Gerät bleiben',
    lead: 'Datenschutz ist hier strukturell, kein Versprechen. Es gibt keinen Upload-Schritt, weil es keinen Server gibt, an den hochgeladen werden könnte — das ist hier besonders wichtig, weil das, was Leute kodieren, oft sensibel ist: ein API-Token, ein Zertifikat, eine Konfigurationsdatei oder ein privates Dokument:',
    points: [
      'Kodieren und Dekodieren laufen vollständig im Browser ab.',
      'Die Seite wird als statische Dateien ausgeliefert und sendet keine Anfrage mit deiner Eingabe.',
      'Der Quellcode ist offen und für jeden einsehbar (MIT).',
      'Es funktioniert offline — nur möglich, weil nichts das Gerät verlässt.',
    ],
    note: 'Wenn du es selbst prüfen willst: Öffne beim Kodieren oder Dekodieren das Network-Panel deines Browsers — keine Anfrage transportiert deine Daten.',
    sourceLinkText: 'Quellcode ansehen.',
  },

  howto: {
    h2: 'So funktioniert es',
    steps: [
      {
        h3: 'Text- oder Datei-Modus wählen',
        p: 'Der Text-Modus arbeitet mit einem eingegebenen oder eingefügten String. Der Datei-Modus arbeitet mit einer ausgewählten oder abgelegten Datei.',
      },
      {
        h3: 'Kodieren oder Dekodieren wählen',
        p: 'Das Einfügen eines Strings, der wie Base64 aussieht, wechselt automatisch zu Dekodieren — du kannst jederzeit manuell zurückschalten.',
      },
      {
        h3: 'Eingabe hinzufügen',
        p: 'Text eingeben oder einfügen, oder eine Datei auswählen/ablegen. Jeder Dateityp lässt sich kodieren.',
      },
      {
        h3: 'Ergebnis kopieren oder herunterladen',
        p: 'Das Base64 (oder die Data-URI) in die Zwischenablage kopieren oder herunterladen. Beim Dekodieren einer Datei wird zuerst nach einem Dateinamen gefragt, da der ursprüngliche Name nicht im Base64-String selbst gespeichert ist.',
      },
    ],
  },

  faqHeading: 'FAQ',
  faq: [
    {
      q: 'Werden mein Text oder meine Datei irgendwohin hochgeladen?',
      a: 'Nein. Kodieren und Dekodieren laufen vollständig im Browser ab. Es gibt keine Serverkomponente, deine Daten haben also keinen Weg, das Gerät zu verlassen. Der Quellcode ist offen, und du kannst das im Network-Panel deines Browsers nachprüfen.',
    },
    {
      q: 'Warum nicht einfach btoa() in der Browser-Konsole verwenden?',
      a: 'btoa() verarbeitet nur Latin-1-Text (Zeichencodes 0–255) — bei Japanisch, Emoji oder den meisten anderen Unicode-Zeichen wirft es einen Fehler. Dieses Tool kodiert die tatsächliche UTF-8-Byte-Sequenz, sodass jeder Text korrekt hin- und zurückkonvertiert wird. Beim Dekodieren geschieht das Gleiche umgekehrt über einen UTF-8-Decoder statt über die Annahme von Latin-1.',
    },
    {
      q: 'Was passiert, wenn ich Base64 dekodiere, das kein gültiger UTF-8-Text ist?',
      a: 'Statt dir einen String voller Ersatzzeichen zu zeigen (ein häufiges Fehlerbild), erkennt das Tool, dass die dekodierten Bytes kein gültiges UTF-8 sind, und bietet stattdessen einen Download der rohen Bytes an — nützlich, wenn das Base64 tatsächlich eine Binärdatei und keinen Text darstellt.',
    },
    {
      q: 'Kann ich eine große Datei kodieren?',
      a: 'Es gibt keine feste Grenze, abgesehen von einer weichen Obergrenze, die die Seite reaktionsfähig hält. Dateien werden in Blöcken konvertiert, was den Absturz vermeidet, den eine naive Konvertierung in einem einzigen Durchgang bei großen Eingaben verursachen kann. Sehr große Dateien können trotzdem einen Moment dauern, weil alles auf deinem Gerät läuft.',
    },
    {
      q: 'Was ist eine Data-URI, und wann würde ich sie verwenden?',
      a: 'Eine Data-URI bettet die Base64-Daten einer Datei direkt in einen String wie data:image/png;base64,... ein, sodass er anstelle einer URL verwendet werden kann — zum Beispiel inline in CSS oder HTML. Der Datei-Modus kann entweder das reine Base64 oder die vollständige Data-URI anzeigen.',
    },
    {
      q: 'Funktioniert es offline?',
      a: 'Ja. Es ist eine PWA. Nach dem ersten Besuch wird sie zwischengespeichert, sodass Kodieren und Dekodieren auch ohne Netzwerkverbindung funktionieren. Du kannst sie auch auf deinem Startbildschirm installieren.',
    },
  ],

  footer: {
    openSourceLabel: 'Open Source (MIT)',
    partOf: 'Teil von',
    brandTail: '— kleine Tools, die lokal auf deinem Gerät laufen.',
    colophon:
      'Entwickelt und betreut von Geppetto. Ein Teil des Codes ist mit KI-Unterstützung geschrieben; Prüfung und Entscheidungen liegen vollständig beim Maintainer.',
    securityText: 'Sicherheit',
  },

  related: {
    h2: 'Ähnliche Tools',
    blogLinkText: 'Technische Hintergründe lesen',
  },
};
