import{getRandomCard, insertCards} from "./cards.js"

export const players = [];

export const documents = [
    {playerSumEl: document.getElementById("player1-sum-el"),
    playerBetEl:  document.getElementById("player1-bet-el"),
    playerCardsEl: document.getElementById("player1-cards-el"),
    playerMoneyEl: document.getElementById("player1-money-el"),
    playerSplitSumEl: document.getElementById("player1-split-sum-el"),
    playerSplitCardsEl: document.getElementById("player1-split-cards-el")
    },
    {playerSumEl: document.getElementById("player2-sum-el"),
    playerBetEl:  document.getElementById("player2-bet-el"),
    playerCardsEl: document.getElementById("player2-cards-el"),
    playerMoneyEl: document.getElementById("player2-money-el"),
    playerSplitSumEl: document.getElementById("player2-split-sum-el"),
    playerSplitCardsEl: document.getElementById("player2-split-cards-el")
    },
    {playerSumEl: document.getElementById("player3-sum-el"),
    playerBetEl:  document.getElementById("player3-bet-el"),
    playerCardsEl: document.getElementById("player3-cards-el"),
    playerMoneyEl: document.getElementById("player3-money-el"),
    playerSplitSumEl: document.getElementById("player3-split-sum-el"),
    playerSplitCardsEl: document.getElementById("player3-split-cards-el")
    },
    {playerSumEl: document.getElementById("player4-sum-el"),
    playerBetEl:  document.getElementById("player4-bet-el"),
    playerCardsEl: document.getElementById("player4-cards-el"),
    playerMoneyEl: document.getElementById("player4-money-el"),
    playerSplitSumEl: document.getElementById("player4-split-sum-el"),
    playerSplitCardsEl: document.getElementById("player4-split-cards-el")
    },
    {playerSumEl: document.getElementById("player5-sum-el"),
    playerBetEl:  document.getElementById("player5-bet-el"),
    playerCardsEl: document.getElementById("player5-cards-el"),
    playerMoneyEl: document.getElementById("player5-money-el"),
    playerSplitSumEl: document.getElementById("player5-split-sum-el"),
    playerSplitCardsEl: document.getElementById("player5-split-cards-el")
    }
]

export const dealer = {
    cards: [],
    sum: 0,
    cardsEl: document.getElementById("dealer-cards-el"),
    sumEl: document.getElementById("dealer-sum-el"),
    dealerCardSum: function() {
        this.sum = 0;
        this.cardsEl.textContent = "Dealer Cards: "
        for(const card of this.cards) {
            this.sum += card.value;
            this.sumEl.textContent = "Dealer Sum: " + this.sum
            this.cardsEl.textContent += `(${card.name})`
        }
    }
}

export function determineCurrentPlayer() {
    for (const player of players) {
        if (player.isAlive) {
            return player
            break;
        }
    }
}

export function determineAces(arr){
    let sum = 0
    for(let card of arr){
        sum += card.value
    }
    if(arr.some(check => check.value === 11) && sum > 22){
        for(let card of arr){
            if(card.value === 11){
                card.value = 1
                break;
            }console.log(card);
        }
    }
}

export function determineWinners() {
    for (let player of players){
        if ((dealer.sum < player.sum && player.sum < 21 ) || (dealer.sum > 21 && player.sum < 21)){
            youWin(players.indexOf(player));
        }
        else if (player.sum === 21){
            youWin(players.indexOf(player));
        }
        else if(dealer.sum === player.sum && player.sum < 21){
            alert(`${player.name} has drawn.`)
            player.chips += player.bet
            player.displayPlayerChips()
            player.isAlive = false
        }
        else {
            alert(`${player.name} has lost.`)
            player.isAlive = false
        }
    }
}

function youWin(player) {
    alert(`You win, ${players[player].name}!`)
    players[player].chips += 2 * players[player].bet
    players[player].displayPlayerChips()
    players[player].isAlive = false;
}

export function startOver(){
    for(const card of dealer.cards){
        insertCards(card)
    }
    dealer.dealerCardSum()
    dealer.cards = [] 
    for (const player in players){
        for (const card of players[player].cards){
            insertCards(card)
        }
        documents[player].playerBetEl.textContent = "";
        documents[player].playerSplitSumEl.textContent = "";
        documents[player].playerSplitCardsEl.textContent = "";
        players[player].bet = 0;
        players[player].cards = [];
        players[player].sum = 0; 
    }
    alert("Game is complete!"); 
}

export function completeDealerCards() {
    while (dealer.sum < 17) { 
        dealer.cards.push(getRandomCard())
        determineAces(dealer.cards)
        dealer.dealerCardSum()
    }
} 