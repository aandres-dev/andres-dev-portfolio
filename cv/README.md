# CV — Alcides Andrés López Martínez

Two deliverables, same facts:

| File | Use |
| --- | --- |
| `alcides-andres-lopez-martinez-cv.md` | ATS / plain-text source |
| `alcides-andres-lopez-martinez-cv.docx` | ATS Word (regenerate from the Markdown) |
| `alcides-andres-lopez-martinez-cv.html` | Visual editorial source (237 layout, portfolio palette, no photo) |
| `alcides-andres-lopez-martinez-cv.pdf` | Visual one-page PDF generated from the HTML |

Do not invent certificates, metrics, GitHub, or LinkedIn. Keep Spanish, tildes, and the authorized contact data.

## Regenerate the visual PDF

```bash
chromium --headless --disable-gpu --no-pdf-header-footer \
  --print-to-pdf=cv/alcides-andres-lopez-martinez-cv.pdf \
  file://$PWD/cv/alcides-andres-lopez-martinez-cv.html
```

Then copy it to the portfolio download path:

```bash
cp cv/alcides-andres-lopez-martinez-cv.pdf assets/docs/andres-lopez-cv.pdf
```

The visual PDF must stay on a single A4 page with selectable text.
