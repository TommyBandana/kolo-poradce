import puppeteer from 'puppeteer'
import { createServer } from 'http'
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs'
import { join, dirname } from 'path'

const DIST = 'dist'
const PORT = 4173

const routes = [
  '/',
  '/blog',
  '/blog/co-je-to-gravel-bike',
  '/blog/gravel-nebo-krosove-kolo',
  '/blog/horske-kolo-nebo-gravel',
  '/blog/jak-vybrat-elektrokolo',
  '/blog/jak-vybrat-horske-kolo',
  '/blog/jak-vybrat-kolo',
  '/blog/jak-vybrat-velikost-kola',
  '/blog/jake-kolo-pro-zenu',
  '/blog/kde-jezdit-na-kole-okoli-prahy-brna',
  '/blog/kolik-stoji-dobre-kolo',
  '/blog/kotoucove-nebo-rafkove-brzdy',
  '/blog/priprava-kola-na-sezonu',
  '/blog/silnicni-nebo-gravel-kolo',
]

// Simple static file server that falls back to index.html (SPA)
function startServer() {
  const indexHtml = readFileSync(join(DIST, 'index.html'), 'utf-8')
  const mimeTypes = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.woff2': 'font/woff2' }

  const server = createServer((req, res) => {
    const url = req.url.split('?')[0]
    const filePath = join(DIST, url)
    try {
      if (existsSync(filePath) && !filePath.endsWith('/')) {
        const ext = '.' + filePath.split('.').pop()
        res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'application/octet-stream' })
        res.end(readFileSync(filePath))
      } else {
        res.writeHead(200, { 'Content-Type': 'text/html' })
        res.end(indexHtml)
      }
    } catch {
      res.writeHead(200, { 'Content-Type': 'text/html' })
      res.end(indexHtml)
    }
  })

  return new Promise(resolve => server.listen(PORT, () => resolve(server)))
}

async function prerender() {
  console.log('Starting prerender...')
  const server = await startServer()
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] })

  for (const route of routes) {
    const page = await browser.newPage()
    const url = `http://localhost:${PORT}${route}`
    console.log(`  Rendering ${route}`)
    await page.goto(url, { waitUntil: 'networkidle0', timeout: 15000 })

    // Wait a bit for React to set meta tags
    await page.waitForFunction(() => document.title !== '', { timeout: 5000 }).catch(() => {})

    const html = await page.content()
    const outPath = route === '/'
      ? join(DIST, 'index.html')
      : join(DIST, route, 'index.html')

    const outDir = dirname(outPath)
    if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true })
    writeFileSync(outPath, `<!DOCTYPE html>${html.replace(/^<!DOCTYPE html>/i, '')}`)
    await page.close()
  }

  await browser.close()
  server.close()
  console.log(`Prerendered ${routes.length} pages.`)
}

prerender().catch(e => { console.error(e); process.exit(1) })
