import gsap from 'gsap'

class Transition {
    constructor() {
        this.overlay   = document.getElementById('transition-overlay')
        this.preloader = document.getElementById('preloader')
        gsap.set(this.overlay, { opacity: 0, pointerEvents: 'none' })
    }

    //----------------------------------------------
    // PUBLIC:
    //----------------------------------------------

    // Fades the overlay to black. Returns a Promise.
    coverScreen() {
        return gsap.to(this.overlay, {
            opacity: 1,
            duration: 0.4,
            ease: 'power2.in',
            onStart: () => { this.overlay.style.pointerEvents = 'auto' }
        }).then()
    }

    // Fades the overlay back to transparent. Returns a Promise.
    revealScreen() {
        return gsap.to(this.overlay, {
            opacity: 0,
            duration: 0.4,
            ease: 'power2.out',
            onComplete: () => { this.overlay.style.pointerEvents = 'none' }
        }).then()
    }

    // Fades out the preloader once on startup.
    hidePreloader() {
        gsap.to(this.preloader, {
            opacity: 0,
            duration: 0.6,
            delay: 0.3,
            onComplete: () => { this.preloader.style.display = 'none' }
        })
    }
}

export default Transition
