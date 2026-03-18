class Router {
    constructor(onChange) {
        this.onChange = onChange
        this._handler = this._onHashChange.bind(this)
    }

    //----------------------------------------------
    // PUBLIC:
    //----------------------------------------------

    start() {
        window.addEventListener('hashchange', this._handler)
        this._onHashChange()
    }

    getHash() {
        return window.location.hash.replace('#', '') || this._defaultHash()
    }

    navigate(hash) {
        window.location.hash = hash
    }

    destroy() {
        window.removeEventListener('hashchange', this._handler)
    }

    //----------------------------------------------
    // PRIVATE:
    //----------------------------------------------

    _defaultHash() {
        return 'index'
    }

    _onHashChange() {
        this.onChange(this.getHash())
    }
}

export default Router
