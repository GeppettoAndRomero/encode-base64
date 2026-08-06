import type { ToolContent } from './types';

// Español. Transcreación basada en el vocabulario que usan las herramientas Base64
// en español, no traducción literal. Sin palabras publicitarias (fácil / rápido /
// perfecto…); la privacidad se explica de forma estructural, no como promesa.
// Español pan-regional (neutro), sin modismos locales.

export const es: ToolContent = {
  htmlLang: 'es',

  meta: {
    title: 'Codificar y decodificar Base64 — Texto y archivos, sin subirlos | runlocally',
    description:
      'Codifica texto o archivos a Base64, o decodifica Base64 de vuelta a texto o a un archivo, directamente en tu navegador. Maneja correctamente texto Unicode y archivos binarios. Nada se sube — código abierto, funciona sin conexión.',
    ogTitle: 'Codificar y decodificar Base64 — Texto y archivos',
    ogDescription:
      'Codifica o decodifica Base64 para texto y archivos en tu navegador. Maneja Unicode y binarios correctamente. Nada se sube.',
  },

  hero: {
    h1: 'Codificar / decodificar Base64',
    tagline:
      'Codifica texto o archivos a Base64, o decodifica Base64 de vuelta — en tu navegador. Seguro con Unicode y con binarios. Nada se sube.',
  },

  intro: {
    h2: 'Codifica o decodifica Base64 sin salir de tu navegador',
    paras: [
      'Base64 convierte bytes arbitrarios en texto ASCII plano, por eso aparece en URIs de datos, adjuntos de correo, payloads de API y archivos de configuración. Esta herramienta funciona en ambos sentidos: escribe o pega texto para codificarlo a Base64, o pega una cadena Base64 para recuperar el texto o archivo original.',
      'La codificación de texto pasa correctamente por bytes UTF-8, así que el japonés, los emojis y cualquier otro texto Unicode se recuperan exactamente igual — a diferencia de un btoa() simple, que falla con cualquier carácter fuera de Latin-1. La codificación de archivos los lee en fragmentos, por lo que funciona con archivos grandes sin toparse con un límite del navegador. Si pegas algo que decodifica a bytes que no son texto UTF-8 válido, la herramienta ofrece descargar esos bytes en bruto en lugar de mostrarte una cadena ilegible.',
    ],
  },

  privacy: {
    h2: 'Por qué tu texto y tus archivos no salen de tu dispositivo',
    lead: 'Aquí la privacidad es estructural, no una promesa. No hay paso de subida porque no hay ningún servidor al que subir nada — esto importa especialmente aquí, ya que lo que se codifica suele ser algo sensible: un token de API, un certificado, un archivo de configuración o un documento privado:',
    points: [
      'Codificar y decodificar ocurre por completo en tu navegador.',
      'La página se sirve como archivos estáticos y no hace ninguna solicitud con tu entrada.',
      'El código fuente es abierto y cualquiera puede leerlo (MIT).',
      'Funciona sin conexión, algo que solo es posible porque nada sale del dispositivo.',
    ],
    note: 'Si quieres comprobarlo tú mismo, abre el panel de red de tu navegador mientras codificas o decodificas — ninguna solicitud transporta tus datos.',
    sourceLinkText: 'Ver el código fuente.',
  },

  howto: {
    h2: 'Cómo usarlo',
    steps: [
      {
        h3: 'Elige modo Texto o Archivo',
        p: 'El modo Texto trabaja con una cadena que escribes o pegas. El modo Archivo trabaja con un archivo que eliges o sueltas.',
      },
      {
        h3: 'Elige Codificar o Decodificar',
        p: 'Pegar una cadena que parece Base64 cambia automáticamente a Decodificar; siempre puedes volver a cambiarlo manualmente.',
      },
      {
        h3: 'Añade tu entrada',
        p: 'Escribe o pega texto, o elige/suelta un archivo. Se puede codificar cualquier tipo de archivo.',
      },
      {
        h3: 'Copia o descarga el resultado',
        p: 'Copia el Base64 (o la URI de datos) al portapapeles, o descárgalo. Al decodificar un archivo se pide primero un nombre, ya que el nombre original no queda guardado en la propia cadena Base64.',
      },
    ],
  },

  faqHeading: 'Preguntas frecuentes',
  faq: [
    {
      q: '¿Se sube mi texto o archivo a algún sitio?',
      a: 'No. Codificar y decodificar ocurre por completo en tu navegador. No hay componente de servidor, así que tus datos no tienen forma de salir de tu dispositivo. El código fuente es abierto y puedes confirmarlo en el panel de red de tu navegador.',
    },
    {
      q: '¿Por qué no usar simplemente btoa() en la consola del navegador?',
      a: 'btoa() solo maneja texto Latin-1 (códigos de carácter 0–255): falla con japonés, emojis o la mayoría de los demás textos Unicode. Esta herramienta codifica la secuencia real de bytes UTF-8, así que cualquier texto se recupera correctamente. Al decodificar ocurre lo mismo a la inversa, mediante un decodificador UTF-8 en lugar de asumir Latin-1.',
    },
    {
      q: '¿Qué pasa si decodifico Base64 que no es texto UTF-8 válido?',
      a: 'En lugar de mostrarte una cadena llena de caracteres de reemplazo (un fallo habitual), la herramienta detecta que los bytes decodificados no son UTF-8 válido y ofrece descargarlos en bruto — útil cuando el Base64 en realidad representa un archivo binario, no texto.',
    },
    {
      q: '¿Puedo codificar un archivo grande?',
      a: 'No hay un límite fijo, salvo un tope flexible pensado para mantener la página receptiva. Los archivos se convierten por fragmentos, evitando el fallo que puede producir una conversión ingenua de un solo paso con entradas grandes. Los archivos muy grandes pueden tardar un momento porque todo se ejecuta en tu dispositivo.',
    },
    {
      q: '¿Qué es una URI de datos y cuándo la usaría?',
      a: 'Una URI de datos incrusta los datos Base64 de un archivo directamente en una cadena como data:image/png;base64,..., de modo que puede usarse en lugar de una URL — por ejemplo, incrustada en CSS o HTML. El modo Archivo puede mostrar el Base64 simple o la URI de datos completa.',
    },
    {
      q: '¿Funciona sin conexión?',
      a: 'Sí. Es una PWA. Tras la primera visita queda en caché, así que codificar y decodificar funcionan sin conexión a internet. También puedes instalarla en tu pantalla de inicio.',
    },
  ],

  footer: {
    openSourceLabel: 'Código abierto (MIT)',
    partOf: 'parte de',
    brandTail: '— pequeñas herramientas que funcionan localmente en tu dispositivo.',
    colophon:
      'Creado y mantenido por Geppetto. Parte del código se escribe con asistencia de IA; toda revisión y decisión es del mantenedor.',
    securityText: 'Seguridad',
  },

  related: {
    h2: 'Herramientas relacionadas',
    blogLinkText: 'Leer las notas técnicas',
  },
};
