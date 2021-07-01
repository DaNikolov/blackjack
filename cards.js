export const deck = [
    {
        name: "Ace of Spades",
        value: 11
    },
    {
        name: "Ace of Diamonds",
        value: 11
    },
    {
        name: "Ace of Hearts",
        value: 11
    },
    {
        name: "Ace of Clubs",
        value: 11
    },
    {
        name: "Two of Spades",
        value: 2
    },
    {
        name: "Two of Diamonds",
        value: 2
    },
    {
        name: "Two of Hearts",
        value: 2
    },
    {
        name: "Two of Clubs",
        value: 2
    },
    {
        name: "Three of Spades",
        value: 3
    },
    {
        name: "Three of Diamonds",
        value: 3
    },
    {
        name: "Three of Hearts",
        value: 3
    },
    {
        name: "Three of Clubs",
        value: 3
    },
    {
        name: "Four of Spades",
        value: 4
    },
    {
        name: "Four of Diamonds",
        value: 4
    },
    {
        name: "Four of Hearts",
        value: 4
    },
    {
        name: "Four of Clubs",
        value: 4
    },
    {
        name: "Five of Spades",
        value: 5
    },
    {
        name: "Five of Diamonds",
        value: 5
    },
    {
        name: "Five of Hearts",
        value: 5
    },
    {
        name: "Five of Clubs",
        value: 5
    },
    {
        name: "Six of Spades",
        value: 6
    },
    {
        name: "Six of Diamonds",
        value: 6
    },
    {
        name: "Six of Hearts",
        value: 6
    },
    {
        name: "Six of Clubs",
        value: 6
    },
    {
        name: "Seven of Spades",
        value: 7
    },
    {
        name: "Seven of Diamonds",
        value: 7
    },
    {
        name: "Seven of Hearts",
        value: 7
    },
    {
        name: "Seven of Clubs",
        value: 7
    },
    {
        name: "Eight of Spades",
        value: 8
    },
    {
        name: "Eight of Diamonds",
        value: 8
    },
    {
        name: "Eight of Hearts",
        value: 8
    },
    {
        name: "Eight of Clubs",
        value: 8
    },
    {
        name: "Nine of Spades",
        value: 9
    },
    {
        name: "Nine of Diamonds",
        value: 9
    },
    {
        name: "Nine of Hearts",
        value: 9
    },
    {
        name: "Nine of Clubs",
        value: 9
    },
    {
        name: "Ten of Spades",
        value: 10
    },
    {
        name: "Ten of Diamonds",
        value: 10
    },
    {
        name: "Ten of Hearts",
        value: 10
    },
    {
        name: "Ten of Clubs",
        value: 10
    },
    {
        name: "Jack of Spades",
        value: 10
    },
    {
        name: "Jack of Diamonds",
        value: 10
    },
    {
        name: "Jack of Hearts",
        value: 10
    },
    {
        name: "Jack of Clubs",
        value: 10
    },
    {
        name: "Queen of Spades",
        value: 10
    },
    {
        name: "Queen of Diamonds",
        value: 10
    },
    {
        name: "Queen of Hearts",
        value: 10
    },
    {
        name: "Queen of Clubs",
        value: 10
    },
    {
        name: "King of Spades",
        value: 10 
    },
    {
        name: "King of Diamonds",
        value: 10
    },
    {
        name: "King of Hearts",
        value: 10
    },
    {
        name: "King of Clubs",
        value: 10
    }
]

let cardCount = 52

export function getRandomCard() {
    let index = Math.floor(Math.random()*cardCount)
    let card = deck.splice(index, 1)
    cardCount --
    return card[0]
}

export function insertCards(card) {
    deck.push(card)
    console.log(deck)
    cardCount = 52
};

