class Project {
    constructor() {
        // Map of hash strings to Page classes (not instances)
        // e.g. { 'index': IndexPage, 'contact': ContactPage }
        this.pages = {}
        this.defaultHash = 'index'
    }

    //----------------------------------------------
    // PUBLIC:
    //----------------------------------------------

    // Returns a fresh Page instance for the given hash.
    // Falls back to the default page if hash is not registered.
    getPage(hash) {
        const PageClass = this.pages[hash] || this.pages[this.defaultHash]
        return new PageClass()
    }
}

export default Project
