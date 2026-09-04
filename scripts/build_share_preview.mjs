import { readFile, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'

const root = resolve(import.meta.dirname, '..')
const dist = resolve(root, 'dist')
const index = await readFile(resolve(dist, 'index.html'), 'utf8')

const scriptPath = index.match(/<script[^>]+src="([^"]+)"/u)?.[1]
const stylePath = index.match(/<link[^>]+href="([^"]+\.css)"/u)?.[1]

if (!scriptPath || !stylePath) {
  throw new Error('Could not locate the Vite JavaScript and CSS assets.')
}

const assetPath = (pathname) => resolve(dist, pathname.replace(/^\//u, ''))
const logo = await readFile(resolve(root, 'public', 'ammora-logo-optimized.webp'))
const logoDataUrl = `data:image/webp;base64,${logo.toString('base64')}`
const giwaLogo = await readFile(resolve(root, 'public', 'giwa-black.svg'))
const giwaLogoDataUrl = `data:image/svg+xml;base64,${giwaLogo.toString('base64')}`
const almmGraphic = await readFile(resolve(root, 'public', 'strategy-almm-optimized.webp'))
const almmGraphicDataUrl = `data:image/webp;base64,${almmGraphic.toString('base64')}`
const arlGraphic = await readFile(resolve(root, 'public', 'strategy-arl-optimized.webp'))
const arlGraphicDataUrl = `data:image/webp;base64,${arlGraphic.toString('base64')}`

let script = await readFile(assetPath(scriptPath), 'utf8')
let style = await readFile(assetPath(stylePath), 'utf8')

// FontSource emits many language-specific local font files. The shared preview
// uses the same families from an absolute web-font URL so the artifact remains
// one compact, portable file.
style = style.replace(/@font-face\{[^}]*\}/gu, '')
script = script.replaceAll('/ammora-logo-optimized.webp', logoDataUrl)
script = script.replaceAll('/giwa-black.svg', giwaLogoDataUrl)
script = script.replaceAll('/strategy-almm-optimized.webp', almmGraphicDataUrl)
script = script.replaceAll('/strategy-arl-optimized.webp', arlGraphicDataUrl)

const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="theme-color" content="#ffffff" />
    <meta name="description" content="Ammora protocol service UI preview" />
    <title>Ammora · Explore UI Preview</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700&family=Nunito+Sans:wght@600;700;800&display=swap" rel="stylesheet" />
    <style>${style}</style>
  </head>
  <body>
    <div id="root"></div>
    <script type="module">${script.replaceAll('</script>', '<\\/script>')}</script>
  </body>
</html>
`

const output = resolve(root, 'ammora-ui-preview.html')
await writeFile(output, html)
console.log(output)
