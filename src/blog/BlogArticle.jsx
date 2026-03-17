import { useParams, Link, useNavigate } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { getArticleBySlug, articles } from './articles'
import { SEO } from './SEO'

export default function BlogArticle() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const article = getArticleBySlug(slug)

  if (!article) {
    return (
      <div style={S.page}>
        <div style={S.inner}>
          <h1 style={{ fontFamily: "'Playfair Display',serif", color: '#1a1a2e' }}>Článek nenalezen</h1>
          <Link to="/blog" style={{ color: '#C62828' }}>← Zpět na blog</Link>
        </div>
      </div>
    )
  }

  // Get related articles (exclude current)
  const related = articles.filter(a => a.slug !== slug).slice(0, 3)

  // Custom link renderer to handle internal links
  const LinkRenderer = ({ href, children }) => {
    if (href && href.startsWith('/')) {
      // Map internal article links to /blog/slug
      const cleanSlug = href.replace(/^\//, '')
      const isArticle = articles.some(a => a.slug === cleanSlug)
      if (isArticle) {
        return <Link to={`/blog/${cleanSlug}`} style={{ color: '#C62828', fontWeight: 600 }}>{children}</Link>
      }
      // Link to homepage (quiz)
      if (href === '/') {
        return <Link to="/" style={{ color: '#C62828', fontWeight: 600 }}>{children}</Link>
      }
      return <Link to={href} style={{ color: '#C62828', fontWeight: 600 }}>{children}</Link>
    }
    return <a href={href} target="_blank" rel="noopener noreferrer" style={{ color: '#C62828' }}>{children}</a>
  }

  return (
    <>
      <SEO
        title={article.title}
        description={article.metaDescription}
        canonical={article.canonical}
        ogType="article"
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Koloporadce", "item": "https://www.koloporadce.cz/" },
          { "@type": "ListItem", "position": 2, "name": "Blog", "item": "https://www.koloporadce.cz/blog" },
          { "@type": "ListItem", "position": 3, "name": article.title }
        ]
      }) }} />
      <div style={S.page}>
        <style>{KF}</style>
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />

        <div style={S.inner}>
          {/* Nav */}
          <nav style={{ marginBottom: '32px', opacity: 0, animation: 'fadeSlideIn 0.4s ease forwards' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
              <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '24px' }}>🚲</span>
                <span style={{ fontFamily: "'Playfair Display',serif", fontWeight: 700, color: '#1a1a2e', fontSize: '15px' }}>Kolí Poradce</span>
              </Link>
              <Link to="/blog" style={{ fontFamily: "'DM Sans',sans-serif", fontSize: '13px', color: '#C62828', textDecoration: 'none', fontWeight: 600 }}>
                ← Všechny články
              </Link>
            </div>
          </nav>

          {/* Article */}
          <article style={{ opacity: 0, animation: 'fadeSlideIn 0.5s ease forwards', animationDelay: '0.1s' }}>
            <div style={S.content}>
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  a: LinkRenderer,
                  h1: ({ children }) => (
                    <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: 'clamp(26px, 5vw, 36px)', fontWeight: 900, color: '#1a1a2e', margin: '0 0 16px', lineHeight: 1.2, letterSpacing: '-0.5px' }}>
                      {children}
                    </h1>
                  ),
                  h2: ({ children }) => (
                    <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: '22px', fontWeight: 700, color: '#1a1a2e', margin: '32px 0 12px', lineHeight: 1.3 }}>
                      {children}
                    </h2>
                  ),
                  h3: ({ children }) => (
                    <h3 style={{ fontFamily: "'DM Sans',sans-serif", fontSize: '17px', fontWeight: 700, color: '#1a1a2e', margin: '24px 0 8px' }}>
                      {children}
                    </h3>
                  ),
                  p: ({ children }) => (
                    <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: '15px', lineHeight: 1.75, color: '#3a3530', margin: '0 0 16px' }}>
                      {children}
                    </p>
                  ),
                  ul: ({ children }) => (
                    <ul style={{ fontFamily: "'DM Sans',sans-serif", fontSize: '15px', lineHeight: 1.75, color: '#3a3530', margin: '0 0 16px', paddingLeft: '24px' }}>
                      {children}
                    </ul>
                  ),
                  ol: ({ children }) => (
                    <ol style={{ fontFamily: "'DM Sans',sans-serif", fontSize: '15px', lineHeight: 1.75, color: '#3a3530', margin: '0 0 16px', paddingLeft: '24px' }}>
                      {children}
                    </ol>
                  ),
                  li: ({ children }) => (
                    <li style={{ marginBottom: '6px' }}>{children}</li>
                  ),
                  blockquote: ({ children }) => (
                    <blockquote style={{ borderLeft: '3px solid #C62828', margin: '16px 0', padding: '8px 16px', background: '#faf8f4', borderRadius: '0 8px 8px 0' }}>
                      {children}
                    </blockquote>
                  ),
                  hr: () => <hr style={{ border: 'none', borderTop: '1px solid #e0ddd5', margin: '28px 0' }} />,
                  strong: ({ children }) => <strong style={{ fontWeight: 700, color: '#1a1a2e' }}>{children}</strong>,
                  table: ({ children }) => (
                    <div style={{ overflowX: 'auto', margin: '16px 0' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: "'DM Sans',sans-serif", fontSize: '13px' }}>
                        {children}
                      </table>
                    </div>
                  ),
                  th: ({ children }) => (
                    <th style={{ background: '#1a1a2e', color: '#faf8f4', padding: '10px 14px', textAlign: 'left', fontWeight: 700, fontSize: '12px' }}>
                      {children}
                    </th>
                  ),
                  td: ({ children }) => (
                    <td style={{ padding: '10px 14px', borderBottom: '1px solid #eae7df', color: '#3a3530' }}>
                      {children}
                    </td>
                  ),
                }}
              >
                {article.content}
              </ReactMarkdown>
            </div>
          </article>

          {/* Quiz CTA */}
          <div style={{
            background: '#1a1a2e', color: '#faf8f4', borderRadius: '16px', padding: '28px 24px',
            textAlign: 'center', margin: '40px 0 32px',
            opacity: 0, animation: 'fadeSlideIn 0.4s ease forwards', animationDelay: '0.2s',
          }}>
            <div style={{ fontSize: '32px', marginBottom: '8px' }}>🧭</div>
            <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: '20px', fontWeight: 700, margin: '0 0 6px' }}>
              Zkuste náš kvíz
            </h3>
            <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: '14px', opacity: 0.7, margin: '0 0 16px' }}>
              Do 2 minut zjistíte, jaké kolo je pro vás ideální
            </p>
            <Link to="/" style={{
              display: 'inline-block', padding: '12px 28px',
              background: '#faf8f4', color: '#1a1a2e', borderRadius: '12px',
              fontSize: '14px', fontWeight: 700, fontFamily: "'DM Sans',sans-serif",
              textDecoration: 'none',
            }}>
              Spustit kvíz →
            </Link>
          </div>

          {/* Related articles */}
          <div style={{ opacity: 0, animation: 'fadeSlideIn 0.4s ease forwards', animationDelay: '0.3s' }}>
            <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: '20px', fontWeight: 700, color: '#1a1a2e', margin: '0 0 16px' }}>
              Další články
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {related.map(a => (
                <Link to={`/blog/${a.slug}`} key={a.slug} style={{ textDecoration: 'none' }}>
                  <div style={{
                    background: '#faf8f4', borderRadius: '12px', padding: '16px 18px',
                    border: '1px solid #eae7df', transition: 'all 0.2s',
                  }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = '#1a1a2e'; e.currentTarget.style.transform = 'translateX(4px)' }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = '#eae7df'; e.currentTarget.style.transform = 'none' }}>
                    <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: '14px', fontWeight: 700, color: '#1a1a2e', marginBottom: '2px' }}>
                      {a.title}
                    </div>
                    <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: '12px', color: '#8a8580' }}>
                      {a.metaDescription.slice(0, 100)}…
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Footer nav */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginTop: '32px', paddingBottom: '20px' }}>
            <Link to="/blog" style={{ ...S.btn, background: 'transparent', border: '1px solid #c8c4bb', color: '#1a1a2e' }}>← Všechny články</Link>
            <Link to="/" style={S.btn}>Kvíz</Link>
          </div>
        </div>
      </div>
    </>
  )
}

const KF = `@keyframes fadeSlideIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}`
const S = {
  page: { minHeight: '100vh', background: 'linear-gradient(165deg,#f5f3ed 0%,#ece8df 50%,#e8e4da 100%)', padding: '24px 16px 40px', fontFamily: "'DM Sans',sans-serif" },
  inner: { maxWidth: '680px', margin: '0 auto' },
  content: { background: '#fff', borderRadius: '18px', padding: 'clamp(20px, 4vw, 36px)', border: '1px solid #eae7df', boxShadow: '0 2px 20px rgba(0,0,0,0.04)' },
  btn: { display: 'inline-block', padding: '10px 20px', background: '#1a1a2e', color: '#faf8f4', borderRadius: '10px', fontSize: '13px', fontWeight: 600, fontFamily: "'DM Sans',sans-serif", textDecoration: 'none', transition: 'all 0.2s' },
}
