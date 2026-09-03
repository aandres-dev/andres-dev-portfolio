import fs from 'node:fs';
import path from 'node:path';

const CONFIG = {
  maxLinesPerHtmlFile: 200,
  srcDir: path.resolve('src'),
  allowedExtensions: ['.html', '.css', '.js'],
};

const stats = {
  filesChecked: 0,
  errors: 0,
  warnings: 0,
};

function logError(file, line, message) {
  stats.errors++;
  const loc = line ? `:${line}` : '';
  console.error(`\x1b[31m[ERROR]\x1b[0m ${path.relative(process.cwd(), file)}${loc} -> ${message}`);
}

function logWarning(file, line, message) {
  stats.warnings++;
  const loc = line ? `:${line}` : '';
  console.warn(`\x1b[33m[WARN]\x1b[0m ${path.relative(process.cwd(), file)}${loc} -> ${message}`);
}

function logSuccess(message) {
  console.log(`\x1b[32m[PASS]\x1b[0m ${message}`);
}

function getFilesRecursively(dir) {
  if (!fs.existsSync(dir)) return [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  let files = [];
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files = files.concat(getFilesRecursively(fullPath));
    } else {
      files.push(fullPath);
    }
  }
  return files;
}

function validateFileLines(file, content) {
  const lines = content.split('\n');
  const lineCount = lines.length;
  if (lineCount > CONFIG.maxLinesPerHtmlFile) {
    logError(
      file,
      null,
      `Archivo excede el límite de ${CONFIG.maxLinesPerHtmlFile} líneas (tiene ${lineCount} líneas). Modulariza en secciones más pequeñas.`
    );
  }
  return lines;
}

function validateHtmlSemantics(file, content, lines) {
  // 1. Naked divs: <div> without attributes
  const nakedDivRegex = /<div(\s*>|\s*$)/i;
  // 2. Div with interactive handlers or roles
  const interactiveDivRegex = /<div[^>]*(onclick|role=["'](button|link)["'])[^>]*>/i;
  // 3. Deprecated presentation tags
  const deprecatedTags = /<(center|font|marquee|blink|strike|big|tt)(\s|>)/i;
  // 4. Images without alt
  const imgWithoutAlt = /<img(?![^>]*\balt=)[^>]*>/i;

  lines.forEach((lineText, index) => {
    const lineNum = index + 1;

    if (nakedDivRegex.test(lineText)) {
      logError(
        file,
        lineNum,
        `Se encontró un <div> desnudo sin clase ni identificador. Usa una etiqueta semántica (<section>, <article>, <figure>) o asigna una clase de maquetación justificada.`
      );
    }

    if (interactiveDivRegex.test(lineText)) {
      logError(
        file,
        lineNum,
        `<div> interactivo detectado (onclick/role). En la web estándar se debe usar <button> o <a> para accesibilidad y navegación por teclado.`
      );
    }

    if (deprecatedTags.test(lineText)) {
      logError(
        file,
        lineNum,
        `Etiqueta HTML obsoleta detectada. Usa CSS moderno para estilos y maquetación.`
      );
    }

    if (imgWithoutAlt.test(lineText)) {
      logError(
        file,
        lineNum,
        `Etiqueta <img> sin atributo alt. Todos los elementos de imagen requieren 'alt' para accesibilidad (a11y).`
      );
    }
  });

  // 5. Check structural landmarks in full/assembled pages
  if (file.endsWith('index.html')) {
    const hasHeader = /<header[\s>]/i.test(content);
    const hasMain = /<main[\s>]/i.test(content);
    const hasFooter = /<footer[\s>]/i.test(content);
    const hasNav = /<nav[\s>]/i.test(content);

    if (!hasMain) {
      logError(file, null, `Estructura incompleta: falta la etiqueta semántica principal <main>.`);
    }
    if (!hasHeader) {
      logWarning(file, null, `Se recomienda incluir un landmark <header> para la cabecera del sitio.`);
    }
    if (!hasFooter) {
      logWarning(file, null, `Se recomienda incluir un landmark <footer> para el pie de página.`);
    }
    if (!hasNav) {
      logWarning(file, null, `Se recomienda incluir un landmark <nav> para la navegación.`);
    }
  }
}

function run() {
  console.log('\n--- INICIANDO AUDITORÍA DE CALIDAD Y SEMÁNTICA HTML ---\n');

  if (!fs.existsSync(CONFIG.srcDir)) {
    console.error(`\x1b[31m[FATAL]\x1b[0m Directorio fuente '${CONFIG.srcDir}' no existe.`);
    process.exit(1);
  }

  const files = getFilesRecursively(CONFIG.srcDir);
  const htmlFiles = files.filter((f) => f.endsWith('.html'));

  if (htmlFiles.length === 0) {
    logWarning(CONFIG.srcDir, null, 'No se encontraron archivos HTML en el directorio src.');
  }

  for (const file of htmlFiles) {
    stats.filesChecked++;
    const content = fs.readFileSync(file, 'utf8');
    const lines = validateFileLines(file, content);
    validateHtmlSemantics(file, content, lines);
  }

  console.log('\n----------------- RESUMEN DE AUDITORÍA -----------------');
  console.log(`Archivos evaluados: ${stats.filesChecked}`);
  console.log(`Errores encontrados: ${stats.errors}`);
  console.log(`Advertencias: ${stats.warnings}`);

  if (stats.errors > 0) {
    console.error('\n\x1b[31mFallo en la validación: Corrige las infracciones semánticas o de tamaño antes de continuar.\x1b[0m\n');
    process.exit(1);
  }

  logSuccess('¡Todo el código cumple con los estándares de arquitectura, límites de líneas y semántica!\n');
}

run();
