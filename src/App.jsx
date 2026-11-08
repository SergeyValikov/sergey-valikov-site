import { useCallback, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { copy } from './content.js'
import { languagePaths } from './i18n.js'
import { applyPageMetadata } from './seo.js'
import './App.css'

const GALLERY_SLIDE_SIZE = 6

const MIRACLE_GALLERY_SLIDES = [
  [1, 6, 9, 10, 14, 15],
  [3, 2, 4, 5, 7, 8],
  [11, 12, 13, 16, 17, 18],
  [19, 20, 21, 22, 23, 24],
  [25, 1, 8, 15, 17, 6],
].map((slide) => slide.map((item) => item - 1))

const TELEVISION_GALLERY_PHOTO_IDS = [
  1, 2, 3, 4, 5,
  7, 8, 9, 10, 11, 12,
  14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27,
]

const TELEVISION_GALLERY_SLIDES = [
  [15, 20, 21, 22, 5],
  [14, 16, 23, 24, 27],
  [25, 26, 12, 10, 1],
  [2, 3, 4, 17, 18],
  [19, 7, 8, 9, 11],
]

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
    trailerPoster: '/works/conductor-trailer-preview.png',
    imdbUrl: 'https://www.imdb.com/title/tt39178320/?ref_=fn_t_10',
  },
  {
    title: '13:7',
    poster: '/works/13-7-poster.jpg',
    posterAlt: 'Постер фильма 13:7',
    status: 'coming-soon',
  },
]

function createMiracleGallery() {
  return Array.from({ length: 25 }, (_, index) => {
    const number = String(index + 1).padStart(2, '0')

    return {
      index,
      src: `/works/miracle-anthony/photo-${number}.jpg`,
      thumb: `/works/miracle-anthony/thumb-${number}.jpg`,
    }
  })
}

function createTelevisionGallery() {
  return TELEVISION_GALLERY_PHOTO_IDS.map((photoNumber, index) => {
    const number = String(photoNumber).padStart(2, '0')

    return {
      index,
      number: photoNumber,
      src: `/works/television/photo-${number}.jpg`,
      thumb: `/works/television/thumb-${number}.jpg`,
    }
  })
}

function createGallerySlides(gallery, slideIndexes) {
  if (!gallery?.length) return []

  if (slideIndexes?.length) {
    return slideIndexes.map((slide) => (
      slide
        .map((galleryIndex) => gallery[galleryIndex % gallery.length])
        .filter(Boolean)
    ))
  }

  const slideCount = Math.ceil(gallery.length / GALLERY_SLIDE_SIZE)

  return Array.from({ length: slideCount }, (_, slideIndex) => (
    Array.from({ length: GALLERY_SLIDE_SIZE }, (_, offset) => {
      const galleryIndex = (slideIndex * GALLERY_SLIDE_SIZE + offset) % gallery.length
      return gallery[galleryIndex]
    })
  ))
}

function createTelevisionGallerySlides(gallery, slidePhotoNumbers) {
  return slidePhotoNumbers.map((slide) => (
    slide
      .map((photoNumber) => gallery.find((photo) => photo.number === photoNumber))
      .filter(Boolean)
  ))
}

const televisionGallery = createTelevisionGallery()
const televisionGallerySlides = createTelevisionGallerySlides(televisionGallery, TELEVISION_GALLERY_SLIDES)

const theatreProjects = [
  {
    title: {
      ru: 'СТЕКЛЯННЫЙ ЗВЕРИНЕЦ',
      en: 'THE GLASS MENAGERIE',
    },
    poster: '/works/glass-menagerie-poster.jpg',
    posterAlt: 'Афиша спектакля Стеклянный зверинец',
    trailer: '/works/glass-menagerie-trailer.mp4',
    trailerPoster: '/works/glass-menagerie-trailer-preview.png',
  },
  {
    title: {
      ru: 'ЧУДО СВЯТОГО АНТОНИЯ',
      en: 'THE MIRACLE OF SAINT ANTHONY',
    },
    poster: '/works/miracle-anthony/poster.jpg',
    posterAlt: {
      ru: 'Афиша спектакля Чудо Святого Антония',
      en: 'Poster for The Miracle of Saint Anthony',
    },
    gallery: createMiracleGallery(),
    gallerySlides: MIRACLE_GALLERY_SLIDES,
  },
]

const mediaVideos = [
  {
    title: {
      ru: 'Разговор о фильме «CONDUCTOR»',
      en: 'Conversation about the film CONDUCTOR',
    },
    src: 'https://kinescope.io/embed/oNuy7did7YyufAggZfqx7w',
    cover: '/media/conductor-interview-cover.png',
  },
  {
    title: {
      ru: 'Интервью о спектакле «Стеклянный зверинец»',
      en: 'Interview about The Glass Menagerie',
    },
    src: 'https://kinescope.io/embed/wPzAwySSuUWSxGjvEuajwr',
    cover: '/media/glass-menagerie-interview-cover.png',
  },
  {
    title: {
      ru: 'Диалог на "Правда Радио", г. Гомель, Белоруссия. Режиссёрская лаборатория, СТД РФ',
      en: 'Dialogue on Pravda Radio, Gomel, Belarus. Directors Laboratory, Theatre Union of Russia',
    },
    src: 'https://kinescope.io/embed/vSjnMeZtLbpaR5Y5tCiCDZ',
    cover: '/media/directors-lab-cover.png',
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

function ClientDebug() {
  const [showDebug, setShowDebug] = useState(false)

  useEffect(() => {
    if (new URLSearchParams(window.location.search).get('debug') !== '1') return undefined

    const frame = window.requestAnimationFrame(() => setShowDebug(true))
    return () => window.cancelAnimationFrame(frame)
  }, [])

  return showDebug ? <MobileDebug /> : null
}

function Header({ language, onLanguageChange, t }) {
  const handleNavigationClick = (event, href) => {
    const target = document.querySelector(href)
    if (!target) return

    event.preventDefault()
    window.history.pushState(null, '', href)
    target.scrollIntoView({ block: 'start', behavior: 'smooth' })
  }

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
          <a key={href} href={href} onClick={(event) => handleNavigationClick(event, href)}>{t.nav[key]}</a>
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
      <div className="hero-caption" aria-hidden="true"><span>{t.authorView}</span><span>:</span></div>
      <a className="scroll-cue" href="#works" aria-label={t.nextLabel}><span />{t.next}</a>
    </section>
  )
}

function CinemaProjects({ t, isActive }) {
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
                    preload={isActive ? 'metadata' : 'none'}
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

function TheatreProjects({ language, t, isActive }) {
  const [lightbox, setLightbox] = useState(null)
  const [gallerySlideByProject, setGallerySlideByProject] = useState({})
  const lightboxProject = lightbox ? theatreProjects[lightbox.projectIndex] : null
  const lightboxPhotos = lightboxProject?.gallery ?? []
  const lightboxPhoto = lightboxPhotos[lightbox?.photoIndex ?? 0]
  const lightboxTitle = lightboxProject ? getLocalizedText(lightboxProject.title, language) : ''

  const showLightboxPhoto = useCallback((direction) => {
    setLightbox((current) => {
      if (!current) return current

      const galleryLength = theatreProjects[current.projectIndex]?.gallery?.length ?? 0
      if (!galleryLength) return current

      return {
        ...current,
        photoIndex: (current.photoIndex + direction + galleryLength) % galleryLength,
      }
    })
  }, [])

  useEffect(() => {
    if (!isActive || lightbox) return undefined

    const timer = window.setInterval(() => {
      setGallerySlideByProject((current) => {
        const next = { ...current }

        theatreProjects.forEach((project, projectIndex) => {
          if (!project.gallery) return

          const slideCount = createGallerySlides(project.gallery, project.gallerySlides).length
          if (!slideCount) return

          next[projectIndex] = ((next[projectIndex] ?? 0) + 1) % slideCount
        })

        return next
      })
    }, 3000)

    return () => window.clearInterval(timer)
  }, [isActive, lightbox])

  useEffect(() => {
    if (!lightbox) return undefined

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') setLightbox(null)
      if (event.key === 'ArrowLeft') showLightboxPhoto(-1)
      if (event.key === 'ArrowRight') showLightboxPhoto(1)
    }

    document.body.classList.add('is-lightbox-open')
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.classList.remove('is-lightbox-open')
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [lightbox, showLightboxPhoto])

  return (
    <div className="theatre-projects">
      {theatreProjects.map((project, index) => {
        const projectTitle = getLocalizedText(project.title, language)
        const posterAlt = getLocalizedText(project.posterAlt, language)
        const gallerySlides = project.gallery ? createGallerySlides(project.gallery, project.gallerySlides) : []
        const activeGallerySlide = gallerySlideByProject[index] ?? 0
        const visibleGalleryPhotos = gallerySlides[activeGallerySlide] ?? []

        return (
          <article
            className={`theatre-project${project.gallery ? ' theatre-project--gallery' : ''}`}
            key={project.title.ru}
          >
            <div className="project-heading">
              <span>{String(index + 1).padStart(2, '0')}</span>
              <h4>{projectTitle}</h4>
            </div>

            <div className="theatre-project-body">
              <div className="project-poster">
                <img src={project.poster} alt={posterAlt} loading="lazy" />
              </div>

              {project.gallery ? (
                <div className="project-gallery-card theatre-gallery-card">
                  <div
                    className={`theatre-gallery theatre-gallery--slide-${activeGallerySlide + 1}`}
                    key={`${project.title.ru}-${activeGallerySlide}`}
                    aria-label={`${projectTitle} — ${t.galleryLabel}`}
                  >
                    {visibleGalleryPhotos.map((photo) => (
                      <button
                        className={`gallery-tile gallery-tile--${photo.index + 1}`}
                        key={photo.src}
                        type="button"
                        onClick={() => setLightbox({ projectIndex: index, photoIndex: photo.index })}
                        aria-label={`${t.openPhotoLabel} ${photo.index + 1}: ${projectTitle}`}
                      >
                        <img src={photo.thumb} alt="" loading="lazy" />
                      </button>
                    ))}
                  </div>
                  <div className="project-trailer-label gallery-label">
                    <p>
                      <span>
                        {t.theatreGalleryLabel}
                        <span className="gallery-label-hint"> - {t.theatreGalleryHint}</span>
                      </span>
                      <span>{String(activeGallerySlide + 1).padStart(2, '0')} / {String(gallerySlides.length).padStart(2, '0')}</span>
                    </p>
                  </div>
                </div>
              ) : (
                <div className="project-trailer theatre-trailer">
                  <div className="project-video-frame">
                    <video
                      src={project.trailer}
                      poster={project.trailerPoster}
                      preload={isActive ? 'metadata' : 'none'}
                      controls
                      playsInline
                      aria-label={`${projectTitle} — ${t.trailerLabel}`}
                    />
                  </div>
                  <div className="project-trailer-label">
                    <p>{t.trailerLabel}</p>
                  </div>
                </div>
              )}
            </div>
          </article>
        )
      })}

      {lightboxPhoto && createPortal((
        <div className="gallery-lightbox" role="dialog" aria-modal="true" aria-label={`${lightboxTitle} — ${t.galleryLabel}`}>
          <button
            className="lightbox-close"
            type="button"
            onClick={() => setLightbox(null)}
            aria-label={t.closeGalleryLabel}
          >
            ×
          </button>

          <button
            className="lightbox-nav lightbox-nav--prev"
            type="button"
            onClick={() => showLightboxPhoto(-1)}
            aria-label={t.previousPhotoLabel}
          >
            ←
          </button>

          <figure className="lightbox-figure">
            <img src={lightboxPhoto.src} alt={`${lightboxTitle} — ${t.photoCounter} ${lightbox.photoIndex + 1}`} />
            <figcaption>
              {String(lightbox.photoIndex + 1).padStart(2, '0')} / {String(lightboxPhotos.length).padStart(2, '0')}
            </figcaption>
          </figure>

          <button
            className="lightbox-nav lightbox-nav--next"
            type="button"
            onClick={() => showLightboxPhoto(1)}
            aria-label={t.nextPhotoLabel}
          >
            →
          </button>
        </div>
      ), document.body)}
    </div>
  )
}

function TelevisionProjects({ t, isActive }) {
  const [activeGallerySlide, setActiveGallerySlide] = useState(0)
  const [lightbox, setLightbox] = useState(null)
  const lightboxPhoto = lightbox ? televisionGallery[lightbox.photoIndex] : null
  const visibleGalleryPhotos = televisionGallerySlides[activeGallerySlide] ?? []

  const showLightboxPhoto = useCallback((direction) => {
    setLightbox((current) => {
      if (!current) return current

      return {
        photoIndex: (current.photoIndex + direction + televisionGallery.length) % televisionGallery.length,
      }
    })
  }, [])

  useEffect(() => {
    if (!isActive || lightbox || televisionGallerySlides.length < 2) return undefined

    const timer = window.setInterval(() => {
      setActiveGallerySlide((current) => (current + 1) % televisionGallerySlides.length)
    }, 4000)

    return () => window.clearInterval(timer)
  }, [isActive, lightbox])

  useEffect(() => {
    if (!lightbox) return undefined

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') setLightbox(null)
      if (event.key === 'ArrowLeft') showLightboxPhoto(-1)
      if (event.key === 'ArrowRight') showLightboxPhoto(1)
    }

    document.body.classList.add('is-lightbox-open')
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.classList.remove('is-lightbox-open')
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [lightbox, showLightboxPhoto])

  return (
    <div className="television-projects">
      <article className="television-project">
        <div className="project-heading television-heading">
          <span>01</span>
          <h4>{t.televisionGalleryLabel}</h4>
        </div>

        <div className="project-gallery-card television-gallery-card">
          <div
            className="television-gallery"
            key={`television-${activeGallerySlide}`}
            aria-label={`${t.worksTabs.television} — ${t.televisionGalleryLabel}`}
          >
            {visibleGalleryPhotos.map((photo) => (
              <button
                className={`gallery-tile television-gallery-tile television-gallery-tile--${photo.number}`}
                key={photo.src}
                type="button"
                onClick={() => setLightbox({ photoIndex: photo.index })}
                aria-label={`${t.openPhotoLabel} ${photo.index + 1}: ${t.worksTabs.television}`}
              >
                <img src={photo.thumb} alt="" loading="lazy" />
              </button>
            ))}
          </div>

          <div className="project-trailer-label gallery-label">
            <p>
              <span className="gallery-label-hint">{t.televisionGalleryHint}</span>
              <span>{String(activeGallerySlide + 1).padStart(2, '0')} / {String(televisionGallerySlides.length).padStart(2, '0')}</span>
            </p>
          </div>
        </div>
      </article>

      {lightboxPhoto && createPortal((
        <div className="gallery-lightbox" role="dialog" aria-modal="true" aria-label={`${t.worksTabs.television} — ${t.televisionGalleryLabel}`}>
          <button
            className="lightbox-close"
            type="button"
            onClick={() => setLightbox(null)}
            aria-label={t.closeGalleryLabel}
          >
            ×
          </button>

          <button
            className="lightbox-nav lightbox-nav--prev"
            type="button"
            onClick={() => showLightboxPhoto(-1)}
            aria-label={t.previousPhotoLabel}
          >
            ←
          </button>

          <figure className="lightbox-figure">
            <img src={lightboxPhoto.src} alt={`${t.worksTabs.television} — ${t.photoCounter} ${lightbox.photoIndex + 1}`} />
            <figcaption>
              {String(lightbox.photoIndex + 1).padStart(2, '0')} / {String(televisionGallery.length).padStart(2, '0')}
            </figcaption>
          </figure>

          <button
            className="lightbox-nav lightbox-nav--next"
            type="button"
            onClick={() => showLightboxPhoto(1)}
            aria-label={t.nextPhotoLabel}
          >
            →
          </button>
        </div>
      ), document.body)}
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
            aria-controls={`works-panel-${category}`}
            aria-selected={activeCategory === category}
            onClick={() => setActiveCategory(category)}
          >
            <span>{t.worksTabs[category]}</span>
            <i>{String(index + 1).padStart(2, '0')}</i>
          </button>
        ))}
      </div>

      {categories.map((category) => {
        const isActive = activeCategory === category

        return (
          <div
            className={`works-panel works-panel--${category}`}
            id={`works-panel-${category}`}
            role="tabpanel"
            aria-labelledby={`works-tab-${category}`}
            hidden={!isActive}
            key={`${activeCategory}-${category}`}
          >
            <div className="works-panel-heading">
              <h3>{t.worksTabs[category]} / {t.worksPanelSuffix[category]}</h3>
            </div>

            {category === 'cinema' && <CinemaProjects t={t} isActive={isActive} />}
            {category === 'theatre' && <TheatreProjects language={language} t={t} isActive={isActive} />}
            {category === 'television' && <TelevisionProjects t={t} isActive={isActive} />}
          </div>
        )
      })}
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

function Media({ language, t }) {
  const [activeVideo, setActiveVideo] = useState(null)

  return (
    <section className="media-section" id="media">
      <p className="eyebrow">{t.mediaEyebrow}</p>
      <div className="media-main">
        <h2>{t.mediaTitle}</h2>

        <div className="media-video-grid">
          {mediaVideos.map((video, index) => {
            const videoTitle = getLocalizedText(video.title, language)
            const isActive = activeVideo?.src === video.src
            const videoSrc = `${video.src}?autoplay=1&playsinline=1&start=0&t=0&reset=${activeVideo?.reset ?? ''}`

            return (
              <article className="media-video-card" key={video.src}>
                <h3>{videoTitle}</h3>
                <div className="media-video-frame">
                  {isActive ? (
                    <iframe
                      src={videoSrc}
                      title={videoTitle}
                      allow="autoplay; fullscreen; picture-in-picture; encrypted-media; gyroscope; accelerometer; clipboard-write; screen-wake-lock"
                      allowFullScreen
                      loading="lazy"
                    />
                  ) : (
                    <button
                      className="media-video-cover"
                      type="button"
                      onClick={() => setActiveVideo({ src: video.src, reset: Date.now() })}
                      aria-label={`${t.mediaVideoOpenLabel} ${index + 1}: ${videoTitle}`}
                    >
                      <img src={video.cover} alt="" loading="lazy" />
                      <span aria-hidden="true" />
                    </button>
                  )}
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}

function Contact({ t }) {
  return (
    <footer className="contact-section" id="contact">
      <p className="eyebrow">{t.contactEyebrow}</p>
      <div className="contact-main">
        <h2>{t.contactTitle}</h2>
        <p className="contact-placeholder">
          <a href="mailto:valikovdirector@gmail.com"><span className="contact-icon contact-icon--mail" aria-hidden="true">✉</span><span>valikovdirector@gmail.com</span></a>
          <a href="https://t.me/sergeyvalikov" target="_blank" rel="noreferrer"><img className="contact-icon contact-icon--telegram" src="/icons/telegram.svg" alt="" aria-hidden="true" /> sergeyvalikov</a>
        </p>
      </div>
      <div className="footer-line"><span>{t.footerName}</span><span>{t.footerRole}</span><a href="#top">{t.backToTop}</a></div>
    </footer>
  )
}

function App({ language = 'ru' }) {
  const t = copy[language]

  useEffect(() => {
    try {
      window.localStorage.setItem('site-language', language)
    } catch {
      // The URL remains authoritative when browser storage is unavailable.
    }
    applyPageMetadata(language)
  }, [language])

  const navigateLanguage = () => {
    window.location.assign(languagePaths[language === 'ru' ? 'en' : 'ru'])
  }

  return (
    <>
      <main>
        <Hero language={language} onLanguageChange={navigateLanguage} t={t} />
        <Works language={language} t={t} />
        <About t={t} />
        <Media language={language} t={t} />
        <Contact t={t} />
      </main>
      <ClientDebug />
    </>
  )
}

export default App
