const cards = [
    {name: "A", value: 11},
    {name: "2", value: 2},
    {name: "3", value: 3},
    {name: "4", value: 4},
    {name: "5", value: 5},
    {name: "6", value: 6},
    {name: "7", value: 7},
    {name: "8", value: 8},
    {name: "9", value: 9},
    {name: "10", value: 10},
    {name: "J", value: 10},
    {name: "Q", value: 10},
    {name: "K", value: 10}
]
const suits = ["C", "D", "H", "S"]

const deck = []

export function cardsDeck(){
    for(let card of cards){
        for(let suit of suits){
            deck.push(
                {name: `${card.name}${suit}`,
                value: card.value,
                image: `./PNG/${card.name}${suit}.png`
            })
        }
    }
}



export function getRandomCard() {
    let index = Math.floor(Math.random()*deck.length)
    let card = deck.splice(index, 1)
    return card[0]
}

export function insertCards(card) {
    deck.push(card)
}

