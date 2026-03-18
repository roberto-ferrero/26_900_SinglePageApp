class Component {
    constructor(options = {}) {
        this.options = options
        this.el = null
    }

    //----------------------------------------------
    // PUBLIC:
    //----------------------------------------------

    // Must be overridden — creates and returns this.el (a DOM node)
    build() {
        return this.el
    }

    // Called by Page after the page node is in the DOM
    init() {}

    // Called by Page before it is removed from the DOM
    destroy() {}

    //----------------------------------------------
    // PRIVATE:
    //----------------------------------------------

    _createElement(tag, className) {
        const el = document.createElement(tag)
        if (className) el.className = className
        return el
    }
}

export default Component
