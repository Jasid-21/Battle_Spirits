class Card {
    constructor(id, url, seted = false, rested = false) {
        this.id = id;
        this.url = url;
        this.seted = seted;
        this.rested = rested;
    }

    restUnrest() {
        this.rested = !this.rested;
    }

    setReveal() {
        this.seted = !this.seted;
    }
}


function createCard(id, url, seted = false, rested = false) {
    return new Card(id, url, seted, rested);
}

export default createCard;
