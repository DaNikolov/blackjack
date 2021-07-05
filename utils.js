import{getRandomCard, insertCards} from "./cards.js"

export const players = [];

export const documents = []

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

export function determineWinners() {
    for (let player of players){
        player.isAlive = false
        if ((dealer.sum < player.sum  || dealer.sum > 21) && player.sum < 21){
            player.youWin();
        }
        else if (player.sum === 21) {
            player.youWin()
        }
        else if(dealer.sum === player.sum && player.sum < 21){
            alert(`${player.name} has drawn.`)
            player.chips += player.bet
            player.displayPlayerChips()
        }
        else {
            alert(`${player.name} has lost.`)
        }
    }
}

export function determineSplitWinners() {
    for (let player of players) {
        if (player.splitSum > 0) {
            player.isSplit = false
            if ((dealer.sum < player.splitSum || dealer.sum > 21) && player.splitSum < 21) {
                player.youWin();
            }
            else if (player.splitSum === 21) {
                player.youWin()
            }
            else if (dealer.sum === player.splitSum && player.splitSum < 21) {
                alert(`${player.name} has drawn.`)
                player.chips += player.splitBet
                player.displayPlayerChips()
            }
            else {
                alert(`${player.name} has lost.`)
            }
        }

    }
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