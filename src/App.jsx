import { useEffect, useState } from 'react'
import './App.css'

const navigationTargets = [
  ['about', '#about'],
  ['contact', '#contact'],
  ['media', '#media'],
]

function MobileDebug() {
  const searchParams = new URLSearchParams(window.location.search)
  const isDebug = searchParams.get('debug') === '1'
  const [heroStyles, setHeroStyles] = useState({ filter: 'loading', overlay: 'loading' })

  useEffect(() => {
    if (!isDebug) return undefined

    const frame = window.requestAnimationFrame(() => {
      const heroImage = document.querySelector('.hero-image')
      const heroOverlay = document.querySelector('.hero-overlay')

      setHeroStyles({
        filter: heroImage ? window.getComputedStyle(heroImage).filter : 'missing',
        overlay: heroOverlay ? window.getComputedStyle(heroOverlay).backgroundImage : 'missing',
      })
    })

    return () => window.cancelAnimationFrame(frame)
  }, [isDebug])

  if (!isDebug) return null

  const root = document.documentElement
  const isRealMobile = root.classList.contains('real-mobile')
  const isCoarsePointer = window.matchMedia('(pointer: coarse)').matches
  const isHoverNone = window.matchMedia('(hover: none)').matches

  const rows = [
    ['BUILD', root.dataset.build || 'unknown'],
    ['class real-mobile', isRealMobile ? 'yes' : 'no'],
    ['data-layout', root.dataset.layout || 'unknown'],
    ['window.innerWidth', window.innerWidth],
    ['document.documentElement.clientWidth', root.clientWidth],
    ['screen.width', window.screen.width],
    ['screen.height', window.screen.height],
    ['devicePixelRatio', window.devicePixelRatio],
    ['pointer coarse', isCoarsePointer ? 'yes' : 'no'],
    ['hover none', isHoverNone ? 'yes' : 'no'],
    ['maxTouchPoints', navigator.maxTouchPoints],
    ['hero image filter', heroStyles.filter],
    ['hero overlay', heroStyles.overlay],
    ['userAgent', navigator.userAgent],
  ]

  return (
    <aside className="mobile-debug" aria-label="Mobile layout debug information">
      {isRealMobile && <strong className="real-mobile-marker">REAL MOBILE ACTIVE</strong>}
      {rows.map(([label, value]) => (
        <div className="mobile-debug-row" key={label}>
          <b>{label}:</b> <span>{String(value)}</span>
        </div>
      ))}
    </aside>
  )
}

const copy = {
  ru: {
    pageTitle: 'Сергей Валиков — режиссёр',
    homeLabel: 'Сергей Валиков — на главную',
    navLabel: 'Основная навигация',
    languageLabel: 'Переключить сайт на английский язык',
    nav: { about: 'О режиссёре', contact: 'Контакты', media: 'СМИ' },
    role: 'режиссёр',
    firstName: 'Сергей',
    lastName: 'Валиков',
    portraitAlt: 'Портрет режиссёра Сергея Валикова',
    heroLabel: 'Сергей Валиков — режиссёр',
    worksButton: 'Работы',
    contactButton: 'Связаться',
    authorView: 'Авторский взгляд',
    next: 'далее',
    nextLabel: 'Перейти к работам',
    worksEyebrow: '01 / Работы',
    worksTitle: 'Работы',
    worksTabs: { cinema: 'Кино', theatre: 'Театр', television: 'Телевидение' },
    worksPanelSuffix: { cinema: 'проекты', theatre: 'постановки', television: 'фото со съёмок' },
    worksVisualLabel: { cinema: 'Плакат кинопроекта', theatre: 'Плакат спектакля', television: 'Фото со съёмок' },
    worksPreviewLabel: { cinema: 'Кадры или трейлер кинопроекта', theatre: 'Фото или видеозапись спектакля' },
    aboutEyebrow: '04 / О режиссёре',
    aboutQuote: '«Меня интересует момент, когда привычный порядок даёт трещину — и в ней становится виден человек».',
    aboutCopy: 'Сергей Валиков — режиссёр. Его художественный язык строится на точности наблюдения, внутреннем ритме и внимании к тому, что обычно остаётся за пределами света.',
    mediaEyebrow: '05 / СМИ',
    mediaTitle: 'Публикации и разговоры',
    mediaCopy: 'Материалы скоро появятся.',
    contactEyebrow: '06 / Контакты',
    contactTitle: 'Начать разговор',
    contactCopy: 'Контактные данные скоро появятся',
    footerName: 'Сергей Валиков',
    footerRole: 'Режиссёр',
    backToTop: 'Наверх ↑',
  },
  en: {
    pageTitle: 'Sergey Valikov — Director',
    homeLabel: 'Sergey Valikov — home',
    navLabel: 'Main navigation',
    languageLabel: 'Switch the website to Russian',
    nav: { about: 'About', contact: 'Contact', media: 'Press' },
    role: 'director',
    firstName: 'Sergey',
    lastName: 'Valikov',
    portraitAlt: 'Portrait of director Sergey Valikov',
    heroLabel: 'Sergey Valikov — Director',
    worksButton: 'Works',
    contactButton: 'Contact',
    authorView: "Author's view",
    next: 'next',
    nextLabel: 'Go to works',
    worksEyebrow: '01 / Works',
    worksTitle: 'Works',
    worksTabs: { cinema: 'Film', theatre: 'Theatre', television: 'Television' },
    worksPanelSuffix: { cinema: 'projects', theatre: 'productions', television: 'behind-the-scenes photos' },
    worksVisualLabel: { cinema: 'Film project poster', theatre: 'Theatre poster', television: 'Behind-the-scenes photo' },
    worksPreviewLabel: { cinema: 'Film stills or trailer', theatre: 'Production photos or video' },
    aboutEyebrow: '04 / About',
    aboutQuote: '“I am interested in the moment when the familiar order cracks — and a person becomes visible within it.”',
    aboutCopy: 'Sergey Valikov is a director. His artistic language is built on precise observation, inner rhythm, and attention to what usually remains beyond the light.',
    mediaEyebrow: '05 / Press',
    mediaTitle: 'Publications and conversations',
    mediaCopy: 'Materials coming soon.',
    contactEyebrow: '06 / Contact',
    contactTitle: 'Start a conversation',
    contactCopy: 'Contact details coming soon',
    footerName: 'Sergey Valikov',
    footerRole: 'Director',
    backToTop: 'Back to top ↑',
  },
}

function Header({ language, onLanguageChange, t }) {
  return (
    <header className="site-header">
      <button
        className="language-switch"
        type="button"
        onClick={onLanguageChange}
        aria-label={t.languageLabel}
      >
        {language === 'ru' ? 'ENG' : 'RUS'}
      </button>

      <nav className="site-nav" aria-label={t.navLabel}>
        {navigationTargets.map(([key, href]) => (
          <a key={href} href={href}>{t.nav[key]}</a>
        ))}
      </nav>
    </header>
  )
}

function CTAButtons({ t }) {
  return (
    <div className="hero-actions">
      <a className="button button-primary" href="#works">
        {t.worksButton}
        <svg className="button-arrow" viewBox="0 0 16 16" aria-hidden="true">
          <path d="M4 4 12 12M7 12H12V7" />
        </svg>
      </a>
      <a className="button button-secondary" href="#contact">{t.contactButton}</a>
    </div>
  )
}

function HeroContent({ t }) {
  return (
    <div className="hero-content">
      <div className="signature-mark" aria-hidden="true">
        <img src="/signature.png" alt="" />
      </div>
      <p className="hero-role" data-text={t.role}>{t.role}</p>
      <h1><span>{t.firstName}</span><span>{t.lastName}</span></h1>
      <CTAButtons t={t} />
    </div>
  )
}

function HeroOverlay() {
  return <div className="hero-overlay" aria-hidden="true" />
}

function Hero({ language, onLanguageChange, t }) {
  return (
    <section className="hero" id="top" aria-label={t.heroLabel}>
      <img className="hero-image" src="/portraits/sergey-valikov-hero.jpg" alt={t.portraitAlt} />
      <HeroOverlay />
      <Header language={language} onLanguageChange={onLanguageChange} t={t} />
      <HeroContent t={t} />
      <div className="hero-caption" aria-hidden="true"><span>{t.authorView}</span><span>01</span></div>
      <a className="scroll-cue" href="#works" aria-label={t.nextLabel}><span />{t.next}</a>
    </section>
  )
}

function Works({ t }) {
  const categories = ['cinema', 'theatre', 'television']
  const [activeCategory, setActiveCategory] = useState('cinema')

  return (
    <section className="works-section" id="works">
      <div className="works-heading">
        <p className="eyebrow">{t.worksEyebrow}</p>
        <h2>{t.worksTitle}</h2>
      </div>

      <div className="works-tabs" role="tablist" aria-label={t.worksTitle}>
        {categories.map((category, index) => (
          <button
            className={`works-tab${activeCategory === category ? ' is-active' : ''}`}
            id={`works-tab-${category}`}
            key={category}
            type="button"
            role="tab"
            aria-controls="works-panel"
            aria-selected={activeCategory === category}
            onClick={() => setActiveCategory(category)}
          >
            <span>{t.worksTabs[category]}</span>
            <i>{String(index + 1).padStart(2, '0')}</i>
          </button>
        ))}
      </div>

      <div
        className={`works-panel works-panel--${activeCategory}`}
        id="works-panel"
        role="tabpanel"
        aria-labelledby={`works-tab-${activeCategory}`}
        key={activeCategory}
      >
        <div className="works-panel-heading">
          <h3>{t.worksTabs[activeCategory]} / {t.worksPanelSuffix[activeCategory]}</h3>
          <span>01—03</span>
        </div>

        <div className={`works-grid works-grid--${activeCategory === 'television' ? 'gallery' : 'paired'}`}>
          {[1, 2, 3].map((item) => (
            <article
              className={`work-item${activeCategory === 'television' ? '' : ' work-item--paired'}`}
              key={`${activeCategory}-${item}`}
            >
              <div
                className={`work-visual work-visual--${activeCategory}-${item}`}
                role="img"
                aria-label={`${t.worksVisualLabel[activeCategory]} ${item}`}
              >
                <span aria-hidden="true">{String(item).padStart(2, '0')}</span>
              </div>
              {activeCategory !== 'television' && (
                <div
                  className={`work-preview work-preview--${activeCategory}-${item}`}
                  role="img"
                  aria-label={`${t.worksPreviewLabel[activeCategory]} ${item}`}
                >
                  {item === 1 && (
                    <span className="work-play" aria-hidden="true">
                      <svg viewBox="0 0 24 24"><path d="M9 6.5 17 12l-8 5.5z" /></svg>
                    </span>
                  )}
                </div>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

function About({ t }) {
  return (
    <section className="about-section" id="about">
      <div className="about-inner">
        <p className="eyebrow">{t.aboutEyebrow}</p>
        <blockquote>{t.aboutQuote}</blockquote>
        <p className="about-copy">{t.aboutCopy}</p>
      </div>
    </section>
  )
}

function Media({ t }) {
  return (
    <section className="media-section" id="media">
      <p className="eyebrow">{t.mediaEyebrow}</p>
      <div className="media-main">
        <h2>{t.mediaTitle}</h2>
        <p>{t.mediaCopy}</p>
      </div>
    </section>
  )
}

function Contact({ t }) {
  return (
    <footer className="contact-section" id="contact">
      <p className="eyebrow">{t.contactEyebrow}</p>
      <div className="contact-main"><h2>{t.contactTitle}</h2><p className="contact-placeholder">{t.contactCopy}</p></div>
      <div className="footer-line"><span>{t.footerName}</span><span>{t.footerRole}</span><a href="#top">{t.backToTop}</a></div>
    </footer>
  )
}

function App() {
  const [language, setLanguage] = useState(() => {
    const requestedLanguage = new URLSearchParams(window.location.search).get('lang')
    if (requestedLanguage === 'en' || requestedLanguage === 'ru') return requestedLanguage
    return window.localStorage.getItem('site-language') === 'en' ? 'en' : 'ru'
  })
  const t = copy[language]

  useEffect(() => {
    window.localStorage.setItem('site-language', language)
    document.documentElement.lang = language
    document.title = t.pageTitle
  }, [language, t.pageTitle])

  const toggleLanguage = () => setLanguage((current) => current === 'ru' ? 'en' : 'ru')

  return (
    <>
      <main>
        <Hero language={language} onLanguageChange={toggleLanguage} t={t} />
        <Works t={t} />
        <About t={t} />
        <Media t={t} />
        <Contact t={t} />
      </main>
      <MobileDebug />
    </>
  )
}

export default App
