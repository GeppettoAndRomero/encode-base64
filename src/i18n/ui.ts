/**
 * Preact アイランド（クライアント UI）の文言。ロケール別。
 * ページレベル content (`en.ts` / `ja.ts`) とは別に、インタラクティブな
 * アイランドが表示する文字列をここに集約する。
 *
 * 重要: アイランドは locale を PROP で受け取り（SSR 時に存在）、
 * `document` 等から読まない。SSR とクライアントで同一文字列を描画して
 * hydration mismatch を防ぐ。
 *
 * 補間文字列は `{name}` / `{bytes}` などのテンプレートを持ち、
 * アイランド側で `.replace('{name}', x)` する。
 */
export const ui = {
  en: {
    // EncodeBase64Tool — mode switches
    topModeLabel: 'Mode',
    topModeText: 'Text',
    topModeFile: 'File',
    directionLabel: 'Direction',
    directionEncode: 'Encode',
    directionDecode: 'Decode',

    // EncodeBase64Tool — Text mode
    textInputHeading: 'Text input',
    textInputSubtitleEncode: 'Type or paste text to encode to Base64.',
    textInputSubtitleDecode: 'Paste a Base64 string to decode back to text.',
    textInputPlaceholderEncode: 'Type or paste text here…',
    textInputPlaceholderDecode: 'Paste a Base64 string here…',
    sizeInput: 'Input: {bytes} bytes',
    sizeOutput: 'Output: {bytes} bytes',
    clearInput: 'Clear',

    // EncodeBase64Tool — output
    outputHeading: 'Output',
    outputEmptyHint: 'Type or paste something above to see the result here.',
    invalidBase64Heading: 'Not a valid Base64 string',
    invalidBase64Notice: "This doesn't decode as Base64. Switch to Encode, or check for missing characters.",
    rawBytesHeading: 'Decoded bytes are not valid UTF-8 text',
    rawBytesNotice: "This Base64 decodes to bytes that aren't a valid UTF-8 string, so showing it as text would just be garbled. Download the raw bytes instead.",
    downloadRawBytes: 'Download raw bytes',
    copyOutput: 'Copy',
    copied: 'Copied!',
    copyFailed: 'Could not copy — select the text above and copy it manually.',
    downloadOutput: 'Download',
    notificationsAria: 'Notifications',

    // EncodeBase64Tool — File mode: encode
    fileEncodeHeading: 'Choose a file to encode',
    fileEncodeSubtitle: 'Any file type. It stays on your device — nothing is uploaded.',
    chooseFileButton: 'Choose a file',
    fileDropHint: 'or drop a file anywhere on this page',
    loadedFileLabel: 'Loaded: {name}',
    errFileTooLarge: '{name} is larger than {max} bytes and was not encoded.',
    fileEncodingStatus: 'Encoding…',
    fileReprLabel: 'Show as',
    fileReprBase64: 'Base64',
    fileReprDataUri: 'Data URI',

    // EncodeBase64Tool — File mode: decode
    fileDecodeHeading: 'Paste Base64 to rebuild a file',
    fileDecodeSubtitle: "The original filename can't be recovered from the Base64 string, so enter one below.",
    decodeBase64Placeholder: 'Paste a Base64 string or data: URI here…',
    filenameLabel: 'Filename',
    filenamePlaceholder: 'e.g. photo.jpg',
    filenameHelp: 'Used for the downloaded file, including its extension.',
    downloadFileButton: 'Download file',

    // InstallPrompt
    installHeading: 'Install app',
    installBody: 'Add to your home screen for quick access.',
    install: 'Install',
    later: 'Later',

    // GlobalDropZone
    dzProcessing: 'Adding {count} file(s)...',
    dzPleaseWait: 'Please wait',
    dzDropTitle: 'Drop a file to encode it',
    dzDropSub: 'It will replace the current file result',

    // ThemeToggle
    themeToLight: 'Switch to light mode',
    themeToDark: 'Switch to dark mode',
    themeLabel: 'Theme',

    // shared
    close: 'Close',
    required: 'Required',
  },
  ja: {
    // EncodeBase64Tool — mode switches
    topModeLabel: 'モード',
    topModeText: 'テキスト',
    topModeFile: 'ファイル',
    directionLabel: '方向',
    directionEncode: 'エンコード',
    directionDecode: 'デコード',

    // EncodeBase64Tool — Text mode
    textInputHeading: 'テキスト入力',
    textInputSubtitleEncode: 'Base64 にエンコードするテキストを入力または貼り付けてください。',
    textInputSubtitleDecode: 'デコードする Base64 文字列を貼り付けてください。',
    textInputPlaceholderEncode: 'ここにテキストを入力または貼り付け…',
    textInputPlaceholderDecode: 'ここに Base64 文字列を貼り付け…',
    sizeInput: '入力: {bytes} バイト',
    sizeOutput: '出力: {bytes} バイト',
    clearInput: 'クリア',

    // EncodeBase64Tool — output
    outputHeading: '出力',
    outputEmptyHint: '上にテキストを入力または貼り付けると、ここに結果が表示されます。',
    invalidBase64Heading: '有効な Base64 文字列ではありません',
    invalidBase64Notice: 'この文字列は Base64 としてデコードできません。エンコードに切り替えるか、文字の欠落を確認してください。',
    rawBytesHeading: 'デコード結果は有効な UTF-8 テキストではありません',
    rawBytesNotice: 'この Base64 をデコードすると有効な UTF-8 文字列にならないバイト列になるため、テキストとして表示すると文字化けします。代わりに生バイトをダウンロードしてください。',
    downloadRawBytes: '生バイトをダウンロード',
    copyOutput: 'コピー',
    copied: 'コピーしました！',
    copyFailed: 'コピーできませんでした。上のテキストを選択して手動でコピーしてください。',
    downloadOutput: 'ダウンロード',
    notificationsAria: '通知',

    // EncodeBase64Tool — File mode: encode
    fileEncodeHeading: 'エンコードするファイルを選択',
    fileEncodeSubtitle: 'どんな種類のファイルでも構いません。端末内で処理され、アップロードはされません。',
    chooseFileButton: 'ファイルを選択',
    fileDropHint: 'またはページ上のどこにでもファイルをドロップ',
    loadedFileLabel: '読み込み済み: {name}',
    errFileTooLarge: '{name} は {max} バイトを超えているため、エンコードされませんでした。',
    fileEncodingStatus: 'エンコード中…',
    fileReprLabel: '表示形式',
    fileReprBase64: 'Base64',
    fileReprDataUri: 'データ URI',

    // EncodeBase64Tool — File mode: decode
    fileDecodeHeading: 'Base64 を貼り付けてファイルを復元',
    fileDecodeSubtitle: '元のファイル名は Base64 文字列から復元できないため、下に入力してください。',
    decodeBase64Placeholder: 'ここに Base64 文字列または data: URI を貼り付け…',
    filenameLabel: 'ファイル名',
    filenamePlaceholder: '例: photo.jpg',
    filenameHelp: '拡張子を含め、ダウンロードするファイルの名前として使われます。',
    downloadFileButton: 'ファイルをダウンロード',

    // InstallPrompt
    installHeading: 'アプリを追加',
    installBody: 'ホーム画面に追加すると、すぐに開けます。',
    install: '追加',
    later: 'あとで',

    // GlobalDropZone
    dzProcessing: '{count} 件のファイルを追加中…',
    dzPleaseWait: 'お待ちください',
    dzDropTitle: 'ファイルをドロップしてエンコード',
    dzDropSub: '現在のファイル結果は置き換わります',

    // ThemeToggle
    themeToLight: 'ライトモードに切り替え',
    themeToDark: 'ダークモードに切り替え',
    themeLabel: 'テーマ',

    // shared
    close: '閉じる',
    required: '必須',
  },
  zh: {
    // EncodeBase64Tool — mode switches
    topModeLabel: '模式',
    topModeText: '文本',
    topModeFile: '文件',
    directionLabel: '方向',
    directionEncode: '编码',
    directionDecode: '解码',

    // EncodeBase64Tool — Text mode
    textInputHeading: '文本输入',
    textInputSubtitleEncode: '输入或粘贴要编码为 Base64 的文本。',
    textInputSubtitleDecode: '粘贴要解码的 Base64 字符串。',
    textInputPlaceholderEncode: '在此输入或粘贴文本…',
    textInputPlaceholderDecode: '在此粘贴 Base64 字符串…',
    sizeInput: '输入：{bytes} 字节',
    sizeOutput: '输出：{bytes} 字节',
    clearInput: '清除',

    // EncodeBase64Tool — output
    outputHeading: '输出',
    outputEmptyHint: '在上方输入或粘贴内容，结果会显示在这里。',
    invalidBase64Heading: '不是有效的 Base64 字符串',
    invalidBase64Notice: '该内容无法作为 Base64 解码。请切换到编码模式，或检查是否有字符缺失。',
    rawBytesHeading: '解码后的字节不是有效的 UTF-8 文本',
    rawBytesNotice: '这段 Base64 解码后得到的字节并非有效的 UTF-8 字符串，若以文本显示会乱码。请改为下载原始字节。',
    downloadRawBytes: '下载原始字节',
    copyOutput: '复制',
    copied: '已复制！',
    copyFailed: '无法复制——请手动选择上方文本并复制。',
    downloadOutput: '下载',
    notificationsAria: '通知',

    // EncodeBase64Tool — File mode: encode
    fileEncodeHeading: '选择要编码的文件',
    fileEncodeSubtitle: '任意文件类型均可。文件保留在你的设备上——不会上传。',
    chooseFileButton: '选择文件',
    fileDropHint: '或将文件拖放到页面任意位置',
    loadedFileLabel: '已加载：{name}',
    errFileTooLarge: '{name} 超过 {max} 字节，未进行编码。',
    fileEncodingStatus: '正在编码…',
    fileReprLabel: '显示为',
    fileReprBase64: 'Base64',
    fileReprDataUri: '数据 URI',

    // EncodeBase64Tool — File mode: decode
    fileDecodeHeading: '粘贴 Base64 以还原文件',
    fileDecodeSubtitle: '无法从 Base64 字符串中恢复原始文件名，请在下方输入一个。',
    decodeBase64Placeholder: '在此粘贴 Base64 字符串或 data: URI…',
    filenameLabel: '文件名',
    filenamePlaceholder: '例如：photo.jpg',
    filenameHelp: '将用作下载文件的名称（含扩展名）。',
    downloadFileButton: '下载文件',

    // InstallPrompt
    installHeading: '安装应用',
    installBody: '添加到主屏幕，方便随时打开。',
    install: '安装',
    later: '以后再说',

    // GlobalDropZone
    dzProcessing: '正在添加 {count} 个文件…',
    dzPleaseWait: '请稍候',
    dzDropTitle: '拖放文件以编码',
    dzDropSub: '将替换当前的文件结果',

    // ThemeToggle
    themeToLight: '切换到浅色模式',
    themeToDark: '切换到深色模式',
    themeLabel: '主题',

    // shared
    close: '关闭',
    required: '必填',
  },
  de: {
    // EncodeBase64Tool — mode switches
    topModeLabel: 'Modus',
    topModeText: 'Text',
    topModeFile: 'Datei',
    directionLabel: 'Richtung',
    directionEncode: 'Kodieren',
    directionDecode: 'Dekodieren',

    // EncodeBase64Tool — Text mode
    textInputHeading: 'Texteingabe',
    textInputSubtitleEncode: 'Text eingeben oder einfügen, der zu Base64 kodiert werden soll.',
    textInputSubtitleDecode: 'Einen Base64-String einfügen, um ihn zu dekodieren.',
    textInputPlaceholderEncode: 'Text hier eingeben oder einfügen …',
    textInputPlaceholderDecode: 'Base64-String hier einfügen …',
    sizeInput: 'Eingabe: {bytes} Bytes',
    sizeOutput: 'Ausgabe: {bytes} Bytes',
    clearInput: 'Leeren',

    // EncodeBase64Tool — output
    outputHeading: 'Ausgabe',
    outputEmptyHint: 'Oben Text eingeben oder einfügen, um hier das Ergebnis zu sehen.',
    invalidBase64Heading: 'Kein gültiger Base64-String',
    invalidBase64Notice: 'Das lässt sich nicht als Base64 dekodieren. Wechsle zu Kodieren oder prüfe auf fehlende Zeichen.',
    rawBytesHeading: 'Dekodierte Bytes sind kein gültiger UTF-8-Text',
    rawBytesNotice: 'Dieses Base64 dekodiert zu Bytes, die kein gültiger UTF-8-String sind — als Text angezeigt wäre das nur wirres Zeichensalat. Lade stattdessen die rohen Bytes herunter.',
    downloadRawBytes: 'Rohe Bytes herunterladen',
    copyOutput: 'Kopieren',
    copied: 'Kopiert!',
    copyFailed: 'Konnte nicht kopiert werden — markiere den Text oben und kopiere ihn manuell.',
    downloadOutput: 'Herunterladen',
    notificationsAria: 'Benachrichtigungen',

    // EncodeBase64Tool — File mode: encode
    fileEncodeHeading: 'Datei zum Kodieren auswählen',
    fileEncodeSubtitle: 'Jeder Dateityp. Sie bleibt auf deinem Gerät — nichts wird hochgeladen.',
    chooseFileButton: 'Datei auswählen',
    fileDropHint: 'oder eine Datei irgendwo auf dieser Seite ablegen',
    loadedFileLabel: 'Geladen: {name}',
    errFileTooLarge: '{name} ist größer als {max} Bytes und wurde nicht kodiert.',
    fileEncodingStatus: 'Kodieren …',
    fileReprLabel: 'Anzeigen als',
    fileReprBase64: 'Base64',
    fileReprDataUri: 'Data-URI',

    // EncodeBase64Tool — File mode: decode
    fileDecodeHeading: 'Base64 einfügen, um eine Datei wiederherzustellen',
    fileDecodeSubtitle: 'Der ursprüngliche Dateiname lässt sich aus dem Base64-String nicht wiederherstellen — bitte unten einen eingeben.',
    decodeBase64Placeholder: 'Base64-String oder data:-URI hier einfügen …',
    filenameLabel: 'Dateiname',
    filenamePlaceholder: 'z. B. foto.jpg',
    filenameHelp: 'Wird für die heruntergeladene Datei verwendet, inklusive Dateiendung.',
    downloadFileButton: 'Datei herunterladen',

    // InstallPrompt
    installHeading: 'App installieren',
    installBody: 'Zum Startbildschirm hinzufügen, um es direkt zu öffnen.',
    install: 'Installieren',
    later: 'Später',

    // GlobalDropZone
    dzProcessing: '{count} Datei(en) werden hinzugefügt …',
    dzPleaseWait: 'Bitte warten',
    dzDropTitle: 'Datei ablegen, um sie zu kodieren',
    dzDropSub: 'Ersetzt das aktuelle Dateiergebnis',

    // ThemeToggle
    themeToLight: 'Zum hellen Modus wechseln',
    themeToDark: 'Zum dunklen Modus wechseln',
    themeLabel: 'Design',

    // shared
    close: 'Schließen',
    required: 'Erforderlich',
  },
  es: {
    // EncodeBase64Tool — mode switches
    topModeLabel: 'Modo',
    topModeText: 'Texto',
    topModeFile: 'Archivo',
    directionLabel: 'Dirección',
    directionEncode: 'Codificar',
    directionDecode: 'Decodificar',

    // EncodeBase64Tool — Text mode
    textInputHeading: 'Entrada de texto',
    textInputSubtitleEncode: 'Escribe o pega el texto que quieres codificar a Base64.',
    textInputSubtitleDecode: 'Pega una cadena Base64 para decodificarla de nuevo a texto.',
    textInputPlaceholderEncode: 'Escribe o pega texto aquí…',
    textInputPlaceholderDecode: 'Pega una cadena Base64 aquí…',
    sizeInput: 'Entrada: {bytes} bytes',
    sizeOutput: 'Salida: {bytes} bytes',
    clearInput: 'Borrar',

    // EncodeBase64Tool — output
    outputHeading: 'Salida',
    outputEmptyHint: 'Escribe o pega algo arriba para ver aquí el resultado.',
    invalidBase64Heading: 'No es una cadena Base64 válida',
    invalidBase64Notice: 'Esto no se decodifica como Base64. Cambia a Codificar, o revisa si faltan caracteres.',
    rawBytesHeading: 'Los bytes decodificados no son texto UTF-8 válido',
    rawBytesNotice: 'Este Base64 decodifica a bytes que no forman una cadena UTF-8 válida, así que mostrarlo como texto solo daría caracteres corruptos. Descarga los bytes originales en su lugar.',
    downloadRawBytes: 'Descargar bytes originales',
    copyOutput: 'Copiar',
    copied: '¡Copiado!',
    copyFailed: 'No se pudo copiar — selecciona el texto de arriba y cópialo manualmente.',
    downloadOutput: 'Descargar',
    notificationsAria: 'Notificaciones',

    // EncodeBase64Tool — File mode: encode
    fileEncodeHeading: 'Elige un archivo para codificar',
    fileEncodeSubtitle: 'Cualquier tipo de archivo. Se queda en tu dispositivo — no se sube nada.',
    chooseFileButton: 'Elegir un archivo',
    fileDropHint: 'o suelta un archivo en cualquier parte de esta página',
    loadedFileLabel: 'Cargado: {name}',
    errFileTooLarge: '{name} supera los {max} bytes y no se codificó.',
    fileEncodingStatus: 'Codificando…',
    fileReprLabel: 'Mostrar como',
    fileReprBase64: 'Base64',
    fileReprDataUri: 'URI de datos',

    // EncodeBase64Tool — File mode: decode
    fileDecodeHeading: 'Pega Base64 para reconstruir un archivo',
    fileDecodeSubtitle: 'El nombre de archivo original no se puede recuperar de la cadena Base64, así que indica uno abajo.',
    decodeBase64Placeholder: 'Pega aquí una cadena Base64 o una URI data:…',
    filenameLabel: 'Nombre de archivo',
    filenamePlaceholder: 'p. ej. foto.jpg',
    filenameHelp: 'Se usa para el archivo descargado, incluida su extensión.',
    downloadFileButton: 'Descargar archivo',

    // InstallPrompt
    installHeading: 'Instalar la app',
    installBody: 'Añádela a tu pantalla de inicio para tenerla siempre a mano.',
    install: 'Instalar',
    later: 'Más tarde',

    // GlobalDropZone
    dzProcessing: 'Añadiendo {count} archivo(s)...',
    dzPleaseWait: 'Espera un momento',
    dzDropTitle: 'Suelta un archivo para codificarlo',
    dzDropSub: 'Reemplazará el resultado de archivo actual',

    // ThemeToggle
    themeToLight: 'Cambiar al modo claro',
    themeToDark: 'Cambiar al modo oscuro',
    themeLabel: 'Tema',

    // shared
    close: 'Cerrar',
    required: 'Obligatorio',
  },
} as const;

export type UiStrings = (typeof ui)['en'];
