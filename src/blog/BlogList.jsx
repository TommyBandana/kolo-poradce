import { Link } from 'react-router-dom'
import { articles } from './articles'
import { SEO } from './SEO'

const categoryIcons = {
  'jak-vybrat-kolo': '🚲',
  'jak-vybrat-velikost-kola': '📏',
  'jak-vybrat-horske-kolo': '🏔',
  'jak-vybrat-elektrokolo': '⚡',
  'silnicni-nebo-gravel-kolo': '🔀',
  'kotoucove-nebo-rafkove-brzdy': '✋',
  'jake-kolo-pro-zenu': '👩',
  'co-je-to-gravel-bike': '🌍',
  'gravel-nebo-krosove-kolo': '🤔',
  'horske-kolo-nebo-gravel': '⛰️',
  'priprava-kola-na-sezonu': '🔧',
  'kolik-stoji-dobre-kolo': '💰',
  'kde-jezdit-na-kole-okoli-prahy-brna': '🗺️',
}

export default function BlogList() {
  return (
    <>
      <SEO
        title="Blog – Průvodce výběrem kola"
        description="Články a návody pro výběr správného kola. Horská, silniční, gravel, elektrokola – vše co potřebujete vědět."
      />
      <div style={S.page}>
        <style>{KF}</style>
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />

        <div style={S.inner}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '40px', opacity: 0, animation: 'fadeSlideIn 0.5s ease forwards' }}>
            <Link to="/" style={{ textDecoration: 'none' }}>
              <div style={{ fontSize: '48px', marginBottom: '8px' }}>🚲</div>
            </Link>
            <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: 'clamp(28px, 5vw, 40px)', fontWeight: 900, color: '#1a1a2e', margin: '0 0 8px', letterSpacing: '-0.5px' }}>
              Blog
            </h1>
            <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: '16px', color: '#6b6560', margin: '0 0 12px', maxWidth: '480px', marginLeft: 'auto', marginRight: 'auto', lineHeight: 1.6 }}>
              Články a návody, které vám pomohou vybrat správné kolo
            </p>
            <Link to="/" style={{ fontFamily: "'DM Sans',sans-serif", fontSize: '13px', color: '#C62828', textDecoration: 'none', fontWeight: 600 }}>
              ← Zpět na hlavní stránku
            </Link>
          </div>

          {/* Featured article */}
          <Link to={`/blog/${articles[0].slug}`} style={{ textDecoration: 'none', display: 'block', marginBottom: '24px' }}>
            <div style={{
              background: '#1a1a2e', color: '#faf8f4', borderRadius: '20px', padding: '32px 28px',
              opacity: 0, animation: 'fadeSlideIn 0.5s ease forwards', animationDelay: '0.1s',
              transition: 'transform 0.2s', cursor: 'pointer',
            }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-3px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'none'}>
              <div style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '2px', opacity: 0.6, marginBottom: '10px', fontWeight: 700, fontFamily: "'DM Sans',sans-serif" }}>
                Hlavní článek
              </div>
              <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: '22px', fontWeight: 700, margin: '0 0 10px', lineHeight: 1.3 }}>
                {articles[0].title}
              </h2>
              <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: '14px', opacity: 0.7, margin: 0, lineHeight: 1.55 }}>
                {articles[0].metaDescription}
              </p>
              <span style={{ display: 'inline-block', marginTop: '14px', fontSize: '13px', fontWeight: 600, fontFamily: "'DM Sans',sans-serif", color: '#faf8f4', opacity: 0.8 }}>
                Číst článek →
              </span>
            </div>
          </Link>

          {/* Article grid */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {articles.slice(1).map((article, i) => (
              <Link to={`/blog/${article.slug}`} key={article.slug} style={{ textDecoration: 'none' }}>
                <div style={{
                  display: 'flex', gap: '16px', alignItems: 'center',
                  background: '#faf8f4', borderRadius: '14px', padding: '18px 20px',
                  border: '1px solid #eae7df', transition: 'all 0.2s', cursor: 'pointer',
                  opacity: 0, animation: 'fadeSlideIn 0.4s ease forwards', animationDelay: `${0.15 + i * 0.05}s`,
                }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = '#1a1a2e'; e.currentTarget.style.transform = 'translateX(4px)' }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = '#eae7df'; e.currentTarget.style.transform = 'none' }}>
                  <span style={{ fontSize: '28px', flexShrink: 0 }}>{categoryIcons[article.slug] || '📄'}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h3 style={{ fontFamily: "'DM Sans',sans-serif", fontSize: '15px', fontWeight: 700, color: '#1a1a2e', margin: '0 0 3px', lineHeight: 1.3 }}>
                      {article.title}
                    </h3>
                    <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: '12px', color: '#8a8580', margin: 0, lineHeight: 1.4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {article.metaDescription}
                    </p>
                  </div>
                  <span style={{ color: '#C62828', fontSize: '16px', fontWeight: 700, flexShrink: 0 }}>→</span>
                </div>
              </Link>
            ))}
          </div>

          {/* CTA */}
          <div style={{
            textAlign: 'center', marginTop: '40px', padding: '32px 24px',
            background: '#faf8f4', borderRadius: '16px', border: '1px solid #eae7df',
            opacity: 0, animation: 'fadeSlideIn 0.5s ease forwards', animationDelay: '0.8s',
          }}>
            <div style={{ fontSize: '32px', marginBottom: '8px' }}>🧭</div>
            <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: '20px', fontWeight: 700, color: '#1a1a2e', margin: '0 0 6px' }}>
              Stále si nejste jistí?
            </h3>
            <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: '14px', color: '#6b6560', margin: '0 0 16px' }}>
              Náš kvíz vám doporučí ideální kolo za 2 minuty
            </p>
            <Link to="/" style={{
              display: 'inline-block', padding: '12px 28px', background: '#1a1a2e', color: '#faf8f4',
              borderRadius: '12px', fontSize: '14px', fontWeight: 700, fontFamily: "'DM Sans',sans-serif",
              textDecoration: 'none', transition: 'all 0.2s',
            }}>
              Spustit kvíz →
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}

const KF = `@keyframes fadeSlideIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}`
const S = {
  page: { minHeight: '100vh', background: 'linear-gradient(165deg,#f5f3ed 0%,#ece8df 50%,#e8e4da 100%)', padding: '40px 16px 60px', fontFamily: "'DM Sans',sans-serif" },
  inner: { maxWidth: '640px', margin: '0 auto' },
}
