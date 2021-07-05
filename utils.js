import{getRandomCard, insertCards} from "./cards.js"

export const players = [];

export const documents = []
//creating the array for displaying the information
export function createDocuments() {
    for(let i = 1; i < 6; i++){
        documents.push({
            playerSumEl: document.getElementById(`player${i}-sum-el`),
            playerBetEl:  document.getElementById(`player${i}-bet-el`),
            playerCardsEl: document.getElementById(`player${i}-cards-el`),
            playerMoneyEl: document.getElementById(`player${i}-money-el`),
            playerSplitSumEl: document.getElementById(`player${i}-split-sum-el`),
            playerSplitCardsEl: document.getElementById(`player${i}-split-cards-el`) 
        })
    }
}

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
            this.cardsEl.innerHTML += `<img src="${card.image}" style="width:60px; height:90px"> `
        }
    }
}

export function determineCurrentPlayer() {
    for (const player of players) {
        if (player.isAlive) return player
    }
}
//disaplying the first ace in the cards array with value 1 in case the sum goes above 21
export function determineAces(arr){
    let sumCheck = 0
    for(let card of arr){
        sumCheck += card.value
    }
    if(arr.some(check => check.value === 11) && sumCheck > 21){
        for(let card of arr){
            if(card.value === 11){
                card.value = 1
                break;
            }
        }
    }
}
// check the results 
export function determineWinners(player, sum) {
    if ((dealer.sum < sum || dealer.sum > 21) && sum < 21) {
        player.youWin();
    }
    else if (sum === 21) {
        player.youWin()
    }
    else if (dealer.sum === sum && sum < 21) {
        alert(`${player.name} has drawn.`)
        player.chips += player.bet
        player.displayPlayerChips()
    }
    else {
        alert(`${player.name} has lost.`)
    }

}
// setup everything in order to start again
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
        players[player].splitBet = 0;
        players[player].splitCards = []
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
//check whether a player has a blackjack after drawing a card
export function checkBlackjack(sum, name){
    let aliveOrSplit = true
    if (sum === 21) {
        console.log(aliveOrSplit)
        aliveOrSplit = false
        console.log(aliveOrSplit)
        alert(`Player ${name} has blackjack and has completed the game`)
    }
    else if (sum > 21) {
        console.log(aliveOrSplit)
        aliveOrSplit = false
        console.log(aliveOrSplit)
        alert(`Player ${name} has exceeded 21 and has completed the game`)
    }
    return aliveOrSplit
}