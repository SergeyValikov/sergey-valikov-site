import './App.css'

const navigation = [
  ['О режиссёре', '#about'],
  ['Контакты', '#contact'],
  ['СМИ', '#media'],
]

function Header() {
  return (
    <header className="site-header">
      <a className="monogram" href="#top" aria-label="Сергей Валиков — на главную">
        <span>S</span>
        <span>V</span>
      </a>

      <nav className="site-nav" aria-label="Основная навигация">
        {navigation.map(([label, href]) => (
          <a key={href} href={href}>{label}</a>
        ))}
      </nav>
    </header>
  )
}

function CTAButtons() {
  return (
    <div className="hero-actions">
      <a className="button button-primary" href="#works">
        Работы <span aria-hidden="true">↘</span>
      </a>
      <a className="button button-secondary" href="#contact">Связаться</a>
    </div>
  )
}

function HeroContent() {
  return (
    <div className="hero-content">
      <p className="hero-role" data-text="режиссёр">режиссёр</p>
      <h1><span>Сергей</span><span>Валиков</span></h1>
      <CTAButtons />
    </div>
  )
}

function HeroOverlay() {
  return <div className="hero-overlay" aria-hidden="true" />
}

function Hero() {
  return (
    <section className="hero" id="top" aria-label="Сергей Валиков — режиссёр">
      <img className="hero-image" src="/portraits/sergey-valikov-hero.jpg" alt="Портрет режиссёра Сергея Валикова" />
      <HeroOverlay />
      <Header />
      <HeroContent />
      <div className="hero-caption" aria-hidden="true"><span>Авторский взгляд</span><span>01</span></div>
      <a className="scroll-cue" href="#works" aria-label="Перейти к избранным работам"><span />далее</a>
    </section>
  )
}

function Works() {
  return (
    <section className="works-section section-shell" id="works">
      <div className="section-number">01</div>
      <div className="section-heading">
        <p className="eyebrow">Избранные работы</p>
        <h2>Истории, в которых тишина говорит точнее слов.</h2>
      </div>
      <p className="section-note">Театр · Кино · Сценическое пространство</p>
    </section>
  )
}

function DirectionSections() {
  return (
    <div className="directions">
      <section className="direction" id="theatre">
        <p className="eyebrow">02 / Театр</p>
        <div><h2>Живое напряжение сцены</h2><p>Человек перед системой. Актёр перед тишиной. Зритель перед самим собой.</p></div>
        <span className="direction-mark" aria-hidden="true">Т</span>
      </section>
      <section className="direction" id="cinema">
        <p className="eyebrow">03 / Кино</p>
        <div><h2>Взгляд, оставшийся в кадре</h2><p>Кино как память, наблюдение и пространство для невозможного.</p></div>
        <span className="direction-mark" aria-hidden="true">К</span>
      </section>
    </div>
  )
}

function About() {
  return (
    <section className="about-section" id="about">
      <div className="about-inner">
        <p className="eyebrow">04 / О режиссёре</p>
        <blockquote>«Меня интересует момент, когда привычный порядок даёт трещину — и в ней становится виден человек».</blockquote>
        <p className="about-copy">Сергей Валиков — режиссёр. Его художественный язык строится на точности наблюдения, внутреннем ритме и внимании к тому, что обычно остаётся за пределами света.</p>
      </div>
    </section>
  )
}

function Media() {
  return (
    <section className="media-section" id="media">
      <p className="eyebrow">05 / СМИ</p>
      <div className="media-main">
        <h2>Публикации и разговоры</h2>
        <p>Материалы скоро появятся.</p>
      </div>
    </section>
  )
}

function Contact() {
  return (
    <footer className="contact-section" id="contact">
      <p className="eyebrow">06 / Контакты</p>
      <div className="contact-main"><h2>Начать разговор</h2><p className="contact-placeholder">Контактные данные скоро появятся</p></div>
      <div className="footer-line"><span>Сергей Валиков</span><span>Режиссёр</span><a href="#top">Наверх ↑</a></div>
    </footer>
  )
}

function App() {
  return <main><Hero /><Works /><DirectionSections /><About /><Media /><Contact /></main>
}

export default App
