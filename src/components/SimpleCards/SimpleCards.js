import './SimpleCards.css'
import Component from '../../core/Component'
import gsap from 'gsap'

const DEFAULT_CARDS = [
    { title: 'Card One',   body: 'Sample description for the first card.' },
    { title: 'Card Two',   body: 'Sample description for the second card.' },
    { title: 'Card Three', body: 'Sample description for the third card.' }
]

class SimpleCards extends Component {
    constructor(options = {}) {
        super(options)
        this.cards = options.cards || DEFAULT_CARDS
    }

    //----------------------------------------------
    // PUBLIC:
    //----------------------------------------------

    build() {
        this.el = this._createElement('section', 'simple-cards')
        this.el.innerHTML = `
            <div class="simple-cards__grid">
                ${this.cards.map(c => `
                    <div class="simple-cards__item">
                        <h3>${c.title}</h3>
                        <p>${c.body}</p>
                    </div>
                `).join('')}
            </div>
        `
        return this.el
    }

    init() {
        gsap.from(this.el.querySelectorAll('.simple-cards__item'), {
            y: 30,
            opacity: 0,
            duration: 0.6,
            stagger: 0.15,
            ease: 'power2.out'
        })
    }

    destroy() {
        gsap.killTweensOf(this.el.querySelectorAll('*'))
    }
}

export default SimpleCards
