'use strict'
let gameInProgress = false;
import { getRandomCard, cardsDeck, deck } from "./cards.js"
import * as utilFunctions from './utils.js'

const addPlayerBtn = document.getElementById("add-player-btn")
const startGameBtn = document.getElementById("start-game-btn")
const newCardBtn = document.getElementById("new-card-btn")
const doubleBtn = document.getElementById("double-btn")
const stayBtn = document.getElementById("stay-btn")
const splitBtn = document.getElementById("split-btn")


class Player {
    constructor(name, chips) {
        this.name = name
        this.chips = chips
        this.isAlive = true
        this.bet = 0
        this.isSplit = false
        this.splitCards = []
    }
    get sum() {
        let cardSum = 0
        for (const card of this.cards) {
            cardSum += card.value;
        }
        return cardSum
    }
    get splitSum(){
        let splitCardSum = 0
        for (const card of this.splitCards) {
            splitCardSum += card.value;
        }
        return splitCardSum
    }
    playerCardSum() {
        utilFunctions.documents[utilFunctions.players.indexOf(this)].playerCardsEl.textContent = `Player ${this.name}'s Cards: `
        for (const card of this.cards) {
            utilFunctions.documents[utilFunctions.players.indexOf(this)].playerCardsEl.innerHTML += `<img src="${card.image}" style="width:60px; height:90px"> `
        }
        utilFunctions.documents[utilFunctions.players.indexOf(this)].playerSumEl.textContent = `Player ${this.name}'s cards have a sum of ${this.sum}`
        if (this.sum === 21) {
            this.isAlive = false
            alert(`Player ${this.name} has blackjack and has completed the game`)
            stay()
        }
        else if (this.sum > 21) {
            this.isAlive = false
            alert(`Player ${this.name} has exceeded 21 and has completed the game`)
            stay()
        }
    }
    playerSplitCardSum() {
        utilFunctions.documents[utilFunctions.players.indexOf(this)].playerSplitCardsEl.textContent = `Player ${this.name}'s Cards: `
        for (const card of this.splitCards) {
            utilFunctions.documents[utilFunctions.players.indexOf(this)].playerSplitCardsEl.innerHTML += `<img src="${card.image}" style="width:60px; height:90px"> `
        }
        utilFunctions.documents[utilFunctions.players.indexOf(this)].playerSplitSumEl.textContent = `Player ${this.name}'s cards have a sum of ${this.splitSum}`
        if (this.splitSum === 21) {
            alert(`Player ${this.name} has blackjack and has completed one split`)
            stay()
        }
        else if (this.splitSum > 21) {
            alert(`Player ${this.name} has exceeded 21 and has completed one split`)
            stay()
        }
    }
    displayPlayerBet() {
        utilFunctions.documents[utilFunctions.players.indexOf(this)].playerBetEl.textContent = `${this.name} has placed a bet worth $${this.bet}`
    }
    displayPlayerChips() {
        utilFunctions.documents[utilFunctions.players.indexOf(this)].playerMoneyEl.textContent = `${this.name} has $${this.chips} chips available`
    }
    youWin() {
        alert(`You win, ${this.name}!`)
        this.chips += 2 * this.bet
        this.displayPlayerChips()
    }
}
utilFunctions.createDocuments()
cardsDeck()

addPlayerBtn.addEventListener("click", function () {
    console.log(deck)
    addNewPlayer()
})
startGameBtn.addEventListener("click", function () {
    startGame()
})
newCardBtn.addEventListener("click", function () {
    newCard()
})
doubleBtn.addEventListener("click", function () {
    double()
})
stayBtn.addEventListener("click", function () {
    let player = utilFunctions.determineCurrentPlayer()
    if (!player.isSplit){ 
        player.isAlive = false
    }
    stay()
})
splitBtn.addEventListener("click", function () {
    split()
})


function addNewPlayer() {
    if (utilFunctions.players.length === 5) return alert("Maximum number of players has been reached")
    let playerName = prompt("What is your name?")
    while (!playerName) {
        alert("Name cannot be empty. Please try again.")
        playerName = prompt("What is your name?")
    }
    let playerMoney = parseInt(prompt("How much do you wish to deposit"));
    while (!Number.isInteger(playerMoney)) {
        alert("You must deposit a number. Please try again.")
        playerMoney = parseInt(prompt("How much do you wish to deposit"));
    }
    let person = new Player(playerName, playerMoney)
    utilFunctions.players.push(person)
    person.displayPlayerChips();
};

function startGame() {
    if (utilFunctions.players.length === 0) return alert("Please add players to the game")
    if (gameInProgress) return alert("Game has not been completed. Please complete current game before starting again.")
    gameInProgress = true;
    for (const player of utilFunctions.players) {
        player.bet = parseInt(prompt(`How much does player ${player.name} wish to bet?`))
        while (player.bet > player.chips || !Number.isInteger(player.bet)) {
            player.bet = parseInt(prompt(`${player.name} you have $${player.chips} available. Please bet maximum this amount`))
        }
        player.isAlive = true
        player.chips -= player.bet
        player.cards = [getRandomCard(), getRandomCard()]
        console.log (player.cards[0].value === 11 && player.cards[1].value === 11)
        if (player.cards[0].value === 11 && player.cards[1].value === 11){
            const check = confirm("You have 2 aces. Do you wish to split them?")
            if(check) {
                split()
            }
        }
        utilFunctions.determineAces(player.cards)
        player.playerCardSum()
        player.displayPlayerBet()
        player.displayPlayerChips()
    }
    utilFunctions.dealer.cards.push(getRandomCard());
    utilFunctions.dealer.dealerCardSum();
    let person = utilFunctions.determineCurrentPlayer()
    alert(`Player ${person.name} is next`);
};

function newCard() {
    if (!gameInProgress) return alert("Please start a new game!")
    for (const player of utilFunctions.players) {
        if (player.isSplit){
            player.splitCards.push(getRandomCard());
            utilFunctions.determineAces(player.splitCards)
            player.playerSplitCardSum()
            break;
        }
        else if (player.isAlive) {
            player.cards.push(getRandomCard());
            utilFunctions.determineAces(player.cards)
            player.playerCardSum()
            break;
        }
    }
};

function stay() {
    if (!gameInProgress) return alert("Game has finished, please start a new game");
    const check = utilFunctions.players.filter(player => player.isAlive)
    if (check.length >= 1){
        if(utilFunctions.determineCurrentPlayer().isSplit) return utilFunctions.determineCurrentPlayer().isSplit = false
        alert(`Player ${utilFunctions.determineCurrentPlayer().name} is next`);
    }
    else{
    utilFunctions.completeDealerCards()
    utilFunctions.determineSplitWinners()
    utilFunctions.determineWinners()
    utilFunctions.startOver()
    gameInProgress = false
    }
};

function double() {
    if (!gameInProgress) return alert("Please start a new game!")
    const player = utilFunctions.determineCurrentPlayer()
    if (player.cards.length !== 2) return alert("You cannot double when you have more than 2 cards")
    if (player.splitCards.length !== 0) return alert ("You have already chosen to split and cannot double")
    if (!gameInProgress) return alert("Please start a new game")
    player.chips -= player.bet;
    player.bet *= 2;
    player.displayPlayerChips()
    player.displayPlayerBet()
    newCard();
    player.isAlive = false
    stay()
}

function split() {
    if (!gameInProgress) return alert("Please start a new game!")
    const player = utilFunctions.determineCurrentPlayer()
    if(player.cards.length > 2) return alert('You can only split when you have 2 cards')
    if(player.cards[0].name.charAt(0) !== player.cards[1].name.charAt(0)) return alert('You need two same cards to split')
    if(player.cards[0].value === 1) player.cards[0].value = 11 
    player.splitCards.push(player.cards.pop())
    console.log(player.splitCards)
    player.chips -= player.bet
    player.splitBet = player.bet
    player.isSplit = true
    player.displayPlayerBet()
    player.displayPlayerChips()
    player.playerCardSum()
    player.playerSplitCardSum()
}