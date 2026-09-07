import { readdir, readFile } from 'node:fs/promises'
import { resolve } from 'node:path'

const root = resolve(import.meta.dirname, '..')
const read = (path) => readFile(resolve(root, path), 'utf8')
const collectSourceFiles = async (directory) => {
  const entries = await readdir(resolve(root, directory), { withFileTypes: true })
  const nested = await Promise.all(entries.map(async (entry) => {
    const path = `${directory}/${entry.name}`
    if (entry.isDirectory()) return collectSourceFiles(path)
    return /\.(css|jsx|js)$/.test(entry.name) ? [path] : []
  }))
  return nested.flat()
}

const [tokens, components, pageStyles, primitives, createPage, poolPage, launchPage] = await Promise.all([
  read('src/design-system/tokens.css'),
  read('src/design-system/components.css'),
  read('src/styles.css'),
  read('src/design-system/index.jsx'),
  read('src/pages/CreatePage.jsx'),
  read('src/pages/PoolDetailPage.jsx'),
  read('src/pages/LaunchPage.jsx'),
])
const sourceFiles = await collectSourceFiles('src')
const allSource = (await Promise.all(sourceFiles.map(async (path) => `/* ${path} */\n${await read(path)}`))).join('\n')

const failures = []
const requireMatch = (condition, message) => { if (!condition) failures.push(message) }

requireMatch(tokens.includes('--surface-brand: var(--brand-gradient)'), 'Missing semantic brand-surface token.')
requireMatch(tokens.includes('--surface-brand-subtle: var(--interaction-gradient)'), 'Missing semantic interaction-surface token.')
requireMatch(components.includes('.ds-brand-surface'), 'Missing shared ds-brand-surface class.')
requireMatch(components.includes('background: var(--surface-brand) border-box'), 'Brand surface must fill the complete border box with the CSS gradient token.')
requireMatch(primitives.includes("tone === 'brand' ? 'ds-brand-surface'"), 'Brand badges must opt into ds-brand-surface.')
requireMatch(primitives.includes('<Badge size="sm" className="quick-select__recommended">Recommended</Badge>'), 'Recommended must use the shared Badge component.')
requireMatch(createPage.match(/<Badge>Powered by ALMM<\/Badge>/), 'Powered by ALMM must use the shared brand Badge.')
requireMatch(createPage.match(/<Badge>Powered by ARL<\/Badge>/), 'Powered by ARL must use the shared brand Badge.')
requireMatch(poolPage.includes('<BrandSurface>Current price</BrandSurface>'), 'Current price label must use the shared BrandSurface component.')
requireMatch(launchPage.includes('<BrandSurface>{tokenSymbol.slice(0, 1)'), 'Launch review mark must use the shared BrandSurface component.')
requireMatch(!pageStyles.includes('var(--brand-gradient)'), 'Page styles must not render the raw brand gradient directly.')
requireMatch(!pageStyles.includes('var(--interaction-gradient)'), 'Page styles must use semantic interaction tokens.')
requireMatch(!pageStyles.includes('linear-gradient('), 'Gradient definitions belong in design-system tokens, not page styles.')
requireMatch(!components.includes('linear-gradient('), 'Shared components must consume tokens instead of redefining gradients.')
requireMatch(!/style=\{\{[^}]*background(?:Image)?\s*:/i.test(allSource), 'Inline background styles are not allowed for gradient UI.')
requireMatch(!/background(?:-image)?\s*:[^;{}]*url\(/i.test(`${components}\n${pageStyles}`), 'UI backgrounds must not use image URLs.')

requireMatch(!/(badge|chip|gradient)[^'"\n]*\.(png|jpe?g|webp)/i.test(allSource), 'Badge, chip, and gradient surfaces cannot use raster assets.')

if (failures.length) {
  console.error('Design-system checks failed:')
  failures.forEach((failure) => console.error(`- ${failure}`))
  process.exit(1)
}

console.log('Design-system checks passed: brand surfaces are tokenized CSS and shared components are enforced.')
