import fs from 'node:fs';
import path from 'node:path';

const SRC_DIR = path.resolve('src');
const DIST_DIR = path.resolve('dist');

function copyDirRecursive(src, dest) {
  if (!fs.existsSync(src)) return;
  if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });

  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      if (entry.name !== 'sections') {
        copyDirRecursive(srcPath, destPath);
      }
    } else if (!entry.name.endsWith('.html') || entry.name === 'favicon.ico') {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

function build() {
  console.log('\n--- CONSTRUYENDO DISTRIBUCIÓN LIMPIA Y MODULAR ---\n');

  if (!fs.existsSync(SRC_DIR)) {
    console.error(`\x1b[31m[ERROR]\x1b[0m La carpeta 'src' no existe.`);
    process.exit(1);
  }

  // Clean or create dist
  if (fs.existsSync(DIST_DIR)) {
    fs.rmSync(DIST_DIR, { recursive: true, force: true });
  }
  fs.mkdirSync(DIST_DIR, { recursive: true });

  const templatePath = path.join(SRC_DIR, 'index.html');
  if (!fs.existsSync(templatePath)) {
    console.error(`\x1b[31m[ERROR]\x1b[0m No se encontró src/index.html como plantilla base.`);
    process.exit(1);
  }

  let template = fs.readFileSync(templatePath, 'utf8');

  // Replace injection tags: <!-- @include:sections/hero.html -->
  const includeRegex = /<!--\s*@include:([a-zA-Z0-9_\-\.\/]+)\s*-->/g;
  template = template.replace(includeRegex, (match, relPath) => {
    const sectionPath = path.join(SRC_DIR, relPath);
    if (!fs.existsSync(sectionPath)) {
      console.warn(`\x1b[33m[WARN]\x1b[0m Sección no encontrada: ${relPath}`);
      return `<!-- Error: ${relPath} no encontrado -->`;
    }
    console.log(`  + Incluyendo sección: ${relPath}`);
    return fs.readFileSync(sectionPath, 'utf8').trim();
  });

  // Write assembled index.html
  const outputPath = path.join(DIST_DIR, 'index.html');
  fs.writeFileSync(outputPath, template, 'utf8');
  console.log(`\n\x1b[32m[OK]\x1b[0m index.html generado con éxito en dist/index.html`);

  // Copy CSS and JS
  copyDirRecursive(path.join(SRC_DIR, 'css'), path.join(DIST_DIR, 'css'));
  copyDirRecursive(path.join(SRC_DIR, 'js'), path.join(DIST_DIR, 'js'));
  copyDirRecursive(path.join(SRC_DIR, 'assets'), path.join(DIST_DIR, 'assets'));

  console.log(`\x1b[32m[OK]\x1b[0m Assets, CSS y JS copiados a dist/`);
}

build();
