import coJeToGravelBike from './articles/co-je-to-gravel-bike.md?raw'
import gravelNeboKrosoveKolo from './articles/gravel-nebo-krosove-kolo.md?raw'
import horskeKoloNeboGravel from './articles/horske-kolo-nebo-gravel.md?raw'
import jakVybratElektrokolo from './articles/jak-vybrat-elektrokolo.md?raw'
import jakVybratHorskeKolo from './articles/jak-vybrat-horske-kolo.md?raw'
import jakVybratKolo from './articles/jak-vybrat-kolo.md?raw'
import jakVybratVelikostKola from './articles/jak-vybrat-velikost-kola.md?raw'
import jakeKoloProZenu from './articles/jake-kolo-pro-zenu.md?raw'
import kdeJezditNaKole from './articles/kde-jezdit-na-kole-okoli-prahy-brna.md?raw'
import kolikStojiDobreKolo from './articles/kolik-stoji-dobre-kolo.md?raw'
import kotoucoveNeboRafkoveBrzdy from './articles/kotoucove-nebo-rafkove-brzdy.md?raw'
import pripravaKolaNaSezonu from './articles/priprava-kola-na-sezonu.md?raw'
import silnicniNeboGravelKolo from './articles/silnicni-nebo-gravel-kolo.md?raw'

function parseFrontmatter(raw) {
  const match = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/)
  if (!match) return { meta: {}, content: raw }
  const meta = {}
  match[1].split('\n').forEach(line => {
    const m = line.match(/^(\w+):\s*"?(.*?)"?\s*$/)
    if (m) meta[m[1]] = m[2]
  })
  return { meta, content: match[2].trim() }
}

function processArticle(raw) {
  const { meta, content } = parseFrontmatter(raw)
  const slug = (meta.slug || '').replace(/^\//, '')
  // Extract first paragraph as excerpt
  const firstPara = content.split('\n\n').find(p => p && !p.startsWith('#') && !p.startsWith('---'))
  return {
    title: meta.title || '',
    slug,
    canonical: meta.canonical || '',
    metaDescription: meta.metaDescription || '',
    excerpt: firstPara ? firstPara.slice(0, 200) + (firstPara.length > 200 ? '…' : '') : '',
    content,
  }
}

const rawArticles = [
  jakVybratKolo,
  jakVybratVelikostKola,
  jakVybratHorskeKolo,
  jakVybratElektrokolo,
  silnicniNeboGravelKolo,
  kotoucoveNeboRafkoveBrzdy,
  jakeKoloProZenu,
  coJeToGravelBike,
  gravelNeboKrosoveKolo,
  horskeKoloNeboGravel,
  pripravaKolaNaSezonu,
  kolikStojiDobreKolo,
  kdeJezditNaKole,
]

export const articles = rawArticles.map(processArticle)
export function getArticleBySlug(slug) {
  return articles.find(a => a.slug === slug)
}
