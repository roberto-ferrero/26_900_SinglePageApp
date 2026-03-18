class Page {
    constructor(components = []) {
        this.components = components
        this.container = null
    }

    //----------------------------------------------
    // PUBLIC:
    //----------------------------------------------

    // Subclasses must override — returns the hash key for this page
    get name() { return '' }

    // Builds the page DOM tree and returns the root node
    build() {
        this.container = document.createElement('div')
        this.container.className = 'page'
        this.container.id = `page-${this.name}`
        this.components.forEach(c => this.container.appendChild(c.build()))
        return this.container
    }

    // Called after the page node is in the DOM
    init() {
        this.components.forEach(c => c.init())
    }

    // Removes the page from the DOM and cleans up all components
    destroy() {
        this.components.forEach(c => c.destroy())
        this.container?.remove()
    }
}

export default Page
