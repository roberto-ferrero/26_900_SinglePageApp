import './ImprovedHero.css'
import Component from '../../core/Component'

const DEFAULT_SLIDES = [
    {
        img: 'https://placehold.co/1600x900/111111/d4006e?text=Slide+1',
        alt: 'Slide 1',
        eyebrow: 'Welcome',
        title: 'Move.<br>Feel.<br><span>Be&nbsp;you.</span>',
        subtitle: 'A space dedicated to movement. Small groups and personalised attention.',
        ctas: [
            { text: 'Explore',    href: '#index',   variant: 'btn--primary' },
            { text: 'Contact us', href: '#contact', variant: 'btn--outline-white' }
        ]
    },
    {
        img: 'https://placehold.co/1600x900/1a1a2e/ff4da6?text=Slide+2',
        alt: 'Slide 2',
        eyebrow: 'Our Services',
        title: 'Discover<br>What We<br><span>Offer.</span>',
        subtitle: 'From Pilates to Yoga — find the practice that fits your lifestyle.',
        ctas: [
            { text: 'Learn More', href: '#index', variant: 'btn--primary' }
        ]
    },
    {
        img: 'https://placehold.co/1600x900/0a0a1a/d4006e?text=Slide+3',
        alt: 'Slide 3',
        eyebrow: 'Get Started',
        title: 'Your Journey<br><span>Starts Here.</span>',
        subtitle: 'Join our community and start your wellness journey today.',
        ctas: [
            { text: 'Get in Touch', href: '#contact', variant: 'btn--primary' },
            { text: 'Free Trial',   href: '#contact', variant: 'btn--outline-white' }
        ]
    }
]

const AUTOPLAY_INTERVAL = 5500

class ImprovedHero extends Component {
    constructor(options = {}) {
        super(options)
        this.slides        = options.slides || DEFAULT_SLIDES
        this._current      = 0
        this._timer        = null
        this._dots         = []
        this._slideEls     = []
        this._touchStartX  = 0
    }

    //----------------------------------------------
    // PUBLIC:
    //----------------------------------------------

    build() {
        this.el = this._createElement('section', 'hero')
        this.el.setAttribute('aria-label', 'Hero carousel')

        this.el.innerHTML = `
            <div class="hero__slides" aria-live="polite" aria-atomic="false">
                ${this.slides.map((s, i) => `
                    <div class="hero__slide${i === 0 ? ' is-active' : ''}" aria-label="Slide ${i + 1} of ${this.slides.length}">
                        <img
                            src="${s.img}"
                            alt="${s.alt}"
                            class="hero__slide-img"
                            loading="${i === 0 ? 'eager' : 'lazy'}"
                            width="1600" height="900"
                        />
                    </div>
                `).join('')}
            </div>

            <div class="hero__content">
                <div class="container">
                    <div class="hero__inner animate-fade-in-up">
                        <span class="hero__eyebrow">${this.slides[0].eyebrow}</span>
                        <h1 class="hero__title">${this.slides[0].title}</h1>
                        <p class="hero__subtitle">${this.slides[0].subtitle}</p>
                        <div class="hero__actions">
                            ${this.slides[0].ctas.map(c =>
                                `<a href="${c.href}" class="btn ${c.variant} btn--lg">${c.text}</a>`
                            ).join('')}
                        </div>
                    </div>
                </div>
            </div>

            <div class="hero__controls" role="tablist" aria-label="Carousel controls"></div>
            <button class="hero__arrow hero__arrow--prev" aria-label="Previous slide">&#8592;</button>
            <button class="hero__arrow hero__arrow--next" aria-label="Next slide">&#8594;</button>
        `

        return this.el
    }

    init() {
        this._slideEls = Array.from(this.el.querySelectorAll('.hero__slide'))
        this._inner    = this.el.querySelector('.hero__inner')
        this._controls = this.el.querySelector('.hero__controls')

        this._buildDots()
        this._bindArrows()
        this._bindTouch()
        this._startAutoplay()
    }

    destroy() {
        this._stopAutoplay()
        this.el.querySelector('.hero__arrow--prev')?.removeEventListener('click', this._onPrev)
        this.el.querySelector('.hero__arrow--next')?.removeEventListener('click', this._onNext)
        this.el.removeEventListener('touchstart', this._onTouchStart)
        this.el.removeEventListener('touchend',   this._onTouchEnd)
    }

    //----------------------------------------------
    // PRIVATE:
    //----------------------------------------------

    _buildDots() {
        this._dots = this.slides.map((_, i) => {
            const dot = document.createElement('button')
            dot.className = `hero__dot${i === 0 ? ' is-active' : ''}`
            dot.setAttribute('role', 'tab')
            dot.setAttribute('aria-label', `Go to slide ${i + 1}`)
            dot.addEventListener('click', () => this._goTo(i))
            this._controls.appendChild(dot)
            return dot
        })
    }

    _bindArrows() {
        this._onPrev = () => this._goTo((this._current - 1 + this.slides.length) % this.slides.length)
        this._onNext = () => this._goTo((this._current + 1) % this.slides.length)
        this.el.querySelector('.hero__arrow--prev').addEventListener('click', this._onPrev)
        this.el.querySelector('.hero__arrow--next').addEventListener('click', this._onNext)
    }

    _bindTouch() {
        this._onTouchStart = e => { this._touchStartX = e.touches[0].clientX }
        this._onTouchEnd   = e => {
            const delta = e.changedTouches[0].clientX - this._touchStartX
            if (Math.abs(delta) < 40) return
            delta < 0
                ? this._goTo((this._current + 1) % this.slides.length)
                : this._goTo((this._current - 1 + this.slides.length) % this.slides.length)
        }
        this.el.addEventListener('touchstart', this._onTouchStart, { passive: true })
        this.el.addEventListener('touchend',   this._onTouchEnd,   { passive: true })
    }

    _goTo(index) {
        if (index === this._current) return

        // Slides
        this._slideEls[this._current].classList.remove('is-active')
        this._slideEls[index].classList.add('is-active')

        // Dots
        this._dots[this._current].classList.remove('is-active')
        this._dots[index].classList.add('is-active')

        // Content
        const s = this.slides[index]
        this._inner.querySelector('.hero__eyebrow').textContent  = s.eyebrow
        this._inner.querySelector('.hero__title').innerHTML      = s.title
        this._inner.querySelector('.hero__subtitle').textContent = s.subtitle
        this._inner.querySelector('.hero__actions').innerHTML    = s.ctas.map(c =>
            `<a href="${c.href}" class="btn ${c.variant} btn--lg">${c.text}</a>`
        ).join('')

        // Re-trigger animation
        this._inner.classList.remove('animate-fade-in-up')
        void this._inner.offsetWidth // reflow
        this._inner.classList.add('animate-fade-in-up')

        this._current = index
        this._restartAutoplay()
    }

    _startAutoplay() {
        this._timer = setInterval(() => {
            this._goTo((this._current + 1) % this.slides.length)
        }, AUTOPLAY_INTERVAL)
    }

    _stopAutoplay() {
        clearInterval(this._timer)
        this._timer = null
    }

    _restartAutoplay() {
        this._stopAutoplay()
        this._startAutoplay()
    }
}

export default ImprovedHero
