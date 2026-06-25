import { useEffect, useState } from 'react'
import './App.css'

const navigationTargets = [
  ['about', '#about'],
  ['media', '#media'],
]

const cinemaProjects = [
  {
    title: 'CONDUCTOR',
    banner: '/works/conductor-banner.jpg',
    bannerAlt: 'Баннер фильма CONDUCTOR',
    trailer: '/works/conductor-trailer.mp4',
    trailerPoster: '/works/conductor-trailer-poster.jpg',
    imdbUrl: 'https://www.imdb.com/title/tt39178320/?ref_=fn_t_10',
  },
  {
    title: '13:7',
    poster: '/works/13-7-poster.jpg',
    posterAlt: 'Постер фильма 13:7',
    status: 'coming-soon',
  },
]

const theatreProjects = [
  {
    title: {
      ru: 'СТЕКЛЯННЫЙ ЗВЕРИНЕЦ',
      en: 'THE GLASS MENAGERIE',
    },
    poster: '/works/glass-menagerie-poster.jpg',
    posterAlt: 'Афиша спектакля Стеклянный зверинец',
    trailer: '/works/glass-menagerie-trailer.mp4',
    trailerPoster: '/works/glass-menagerie-trailer-poster.jpg',
  },
]

function getLocalizedText(value, language) {
  if (typeof value === 'string') return value
  return value[language] ?? value.ru ?? ''
}

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
    openProjectImdb: 'Открыть проект в IMDb',
    trailerLabel: 'Трейлер',
    comingSoon: 'Скоро',
    aboutEyebrow: '02 / О режиссёре',
    aboutParagraphs: [
      'Сергей Сергеевич Валиков — режиссёр драмы, выпускник режиссёрского факультета Театрального института имени Бориса Щукина при Государственном академическом театре имени Евгения Вахтангова.',
      'Работает в области театра, кино и телевидения.',
      'В начале профессионального пути служил артистом драматического театра. Позже много путешествовал как по России, так и за рубежом, искал новые средства выражения своих творческих идей и в итоге пришёл к режиссуре.',
      'В своих спектаклях самостоятельно создаёт сценографию, художественное и музыкальное оформление, а также пишет сценарии и инсценировки для собственных работ.',
    ],
    aboutTeachersTitle: 'Главные учителя на пути к профессии:',
    aboutTeachers: [
      {
        name: 'Валерий Октябринович Журавлёв',
        description: 'заслуженный артист РФ.',
      },
      {
        name: 'Султан Назирович Абдиев',
        description: 'заслуженный деятель искусств РФ.',
      },
      {
        name: 'Александр Александрович Водопьянов',
        description: 'заслуженный артист РФ.',
      },
      {
        name: 'Михаил Петрович Семаков',
        description: 'заслуженный артист РФ, профессор кафедры мастерства актёра, кандидат педагогических наук.',
      },
      {
        name: 'Елена Александровна Дунаева',
        description: 'доктор искусствоведения, профессор, заведующая кафедрой искусствоведения Театрального института имени Бориса Щукина.',
      },
      {
        name: 'Алексей Витальевич Курганов',
        description: 'актёр театра и кино, театральный режиссёр, педагог, кандидат филологических наук.',
      },
      {
        name: 'Юрий Николаевич Погребничко',
        description: 'народный артист РФ, заслуженный деятель искусств РФ, лауреат Государственной премии РФ и премии «Золотая маска»; режиссёр, педагог, художественный руководитель театра «Около дома Станиславского» — театра, отмеченного тремя премиями «Золотая маска».',
      },
    ],
    mediaEyebrow: '03 / СМИ',
    mediaTitle: 'Публикации и разговоры',
    mediaCopy: 'Материалы скоро появятся.',
    contactEyebrow: '04 / Контакты',
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
    openProjectImdb: 'Open project on IMDb',
    trailerLabel: 'Trailer',
    comingSoon: 'Soon',
    aboutEyebrow: '02 / About',
    aboutParagraphs: [
      'Sergey Sergeevich Valikov is a drama director and a graduate of the directing department of the Boris Shchukin Theatre Institute at the Evgeny Vakhtangov State Academic Theatre.',
      'He works in theatre, film, and television.',
      'At the beginning of his professional path, he served as an actor in a drama theatre. Later, he travelled extensively across Russia and abroad, searching for new means of expressing his creative ideas, and eventually came to directing.',
      'In his productions, he independently creates the scenography, artistic and musical design, and also writes scripts and stage adaptations for his own works.',
    ],
    aboutTeachersTitle: 'Key teachers on the path to the profession:',
    aboutTeachers: [
      {
        name: 'Valery Oktyabrinovich Zhuravlyov',
        description: 'Honored Artist of the Russian Federation.',
      },
      {
        name: 'Sultan Nazirovich Abdiev',
        description: 'Honored Art Worker of the Russian Federation.',
      },
      {
        name: 'Alexander Alexandrovich Vodopyanov',
        description: 'Honored Artist of the Russian Federation.',
      },
      {
        name: 'Mikhail Petrovich Semakov',
        description: 'Honored Artist of the Russian Federation, professor of the Department of Acting, Candidate of Pedagogical Sciences.',
      },
      {
        name: 'Elena Alexandrovna Dunaeva',
        description: 'Doctor of Art History, professor, head of the Department of Art History at the Boris Shchukin Theatre Institute.',
      },
      {
        name: 'Alexey Vitalievich Kurganov',
        description: 'Theatre and film actor, theatre director, teacher, Candidate of Philological Sciences.',
      },
      {
        name: 'Yury Nikolaevich Pogrebnichko',
        description: 'People’s Artist of the Russian Federation, Honored Art Worker of the Russian Federation, laureate of the State Prize of the Russian Federation and the Golden Mask Award; director, teacher, and artistic director of the Okolo Theatre near the Stanislavsky House — a theatre awarded three Golden Mask prizes.',
      },
    ],
    mediaEyebrow: '03 / Press',
    mediaTitle: 'Publications and conversations',
    mediaCopy: 'Materials coming soon.',
    contactEyebrow: '04 / Contact',
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

function formatCountRange(count) {
  return `01—${String(count).padStart(2, '0')}`
}

function CinemaProjects({ t }) {
  return (
    <div className="cinema-projects">
      {cinemaProjects.map((project, index) => (
        <article
          className={`film-project${project.status === 'coming-soon' ? ' film-project--coming' : ''}`}
          key={project.title}
        >
          <div className="project-heading">
            <span>{String(index + 1).padStart(2, '0')}</span>
            <h4>{project.title}</h4>
          </div>

          {project.status === 'coming-soon' ? (
            <div className="project-coming">
              <div className="project-poster">
                <img src={project.poster} alt={project.posterAlt} loading="lazy" />
              </div>
              <div className="project-soon" aria-label={`${project.title} — ${t.comingSoon}`}>
                <span>{t.comingSoon}</span>
              </div>
            </div>
          ) : (
            <>
              <div className="project-banner">
                <img src={project.banner} alt={project.bannerAlt} loading="lazy" />
              </div>

              <div className="project-links">
                <p>{project.title} / IMDb</p>
                <a className="imdb-link" href={project.imdbUrl} target="_blank" rel="noreferrer">
                  <img src="/works/imdb-logo.webp" alt="" />
                  <span>{t.openProjectImdb}</span>
                </a>
              </div>

              <div className="project-trailer">
                <div className="project-video-frame">
                  <video
                    src={project.trailer}
                    poster={project.trailerPoster}
                    preload="metadata"
                    controls
                    playsInline
                    aria-label={`${project.title} — ${t.trailerLabel}`}
                  />
                </div>
                <div className="project-trailer-label">
                  <p>{t.trailerLabel}</p>
                </div>
              </div>
            </>
          )}
        </article>
      ))}
    </div>
  )
}

function TheatreProjects({ language, t }) {
  return (
    <div className="theatre-projects">
      {theatreProjects.map((project, index) => {
        const projectTitle = getLocalizedText(project.title, language)

        return (
          <article className="theatre-project" key={project.title.ru}>
            <div className="project-heading">
              <span>{String(index + 1).padStart(2, '0')}</span>
              <h4>{projectTitle}</h4>
            </div>

            <div className="theatre-project-body">
              <div className="project-poster">
                <img src={project.poster} alt={project.posterAlt} loading="lazy" />
              </div>

              <div className="project-trailer theatre-trailer">
                <div className="project-video-frame">
                  <video
                    src={project.trailer}
                    poster={project.trailerPoster}
                    preload="metadata"
                    controls
                    playsInline
                    aria-label={`${projectTitle} — ${t.trailerLabel}`}
                  />
                </div>
                <div className="project-trailer-label">
                  <p>{t.trailerLabel}</p>
                </div>
              </div>
            </div>
          </article>
        )
      })}
    </div>
  )
}

function PlaceholderWorks({ activeCategory, t }) {
  return (
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
  )
}

function Works({ language, t }) {
  const categories = ['cinema', 'theatre', 'television']
  const [activeCategory, setActiveCategory] = useState('cinema')
  const activeCount = activeCategory === 'cinema'
    ? cinemaProjects.length
    : activeCategory === 'theatre'
      ? theatreProjects.length
      : 3

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
          <span>{formatCountRange(activeCount)}</span>
        </div>

        {activeCategory === 'cinema' && <CinemaProjects t={t} />}
        {activeCategory === 'theatre' && <TheatreProjects language={language} t={t} />}
        {activeCategory === 'television' && <PlaceholderWorks activeCategory={activeCategory} t={t} />}
      </div>
    </section>
  )
}

function About({ t }) {
  return (
    <section className="about-section" id="about">
      <div className="about-inner">
        <p className="eyebrow">{t.aboutEyebrow}</p>
        <div className="about-content">
          <div className="about-text">
            {t.aboutParagraphs.map((paragraph, index) => (
              <p className={index === 0 ? 'about-lead' : undefined} key={paragraph}>{paragraph}</p>
            ))}
          </div>

          <div className="about-teachers">
            <h3>{t.aboutTeachersTitle}</h3>
            <ul>
              {t.aboutTeachers.map((teacher) => (
                <li key={teacher.name}>
                  <strong>{teacher.name}</strong>
                  <span>{teacher.description}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
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
        <Works language={language} t={t} />
        <About t={t} />
        <Media t={t} />
        <Contact t={t} />
      </main>
      <MobileDebug />
    </>
  )
}

export default App
