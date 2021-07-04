'use strict'
let numberOfPlayers = 0;
let gameInProgress = false;
import { getRandomCard, cardsDeck } from "./cards.js"
import * as utilFunctions from './utils.js'

const addPlayerBtn = document.getElementById("add-player-btn")
const startGameBtn = document.getElementById("start-game-btn")
const newCardBtn = document.getElementById("new-card-btn")
const doubleBtn = document.getElementById("double-btn")
const stayBtn = document.getElementById("stay-btn")
const splitBtn = document.getElementById("split-btn")


class Player {
    constructor(name, chips){
        this.name = name
        this.chips = chips
        this.isAlive = true
        this.bet = 0
    }
    get sum(){
        let cardSum = 0
        for (const card of this.cards) {
            cardSum += card.value;
        }
        return cardSum
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
        this.isAlive = false;
    }
}

addPlayerBtn.addEventListener("click", function () {
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
    utilFunctions.determineCurrentPlayer().isAlive = false
    stay()
})
splitBtn.addEventListener("click", function() {
    cardsDeck()
})

cardsDeck()

function addNewPlayer() {
    if (numberOfPlayers === 5) {
        alert("Maximum number of players has been reached")
    }
    else {
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
        let person = new Player(playerName,playerMoney)
        utilFunctions.players.push(person)
        utilFunctions.players[numberOfPlayers].displayPlayerChips();
        numberOfPlayers++;
    }
};

function startGame() {
    if (numberOfPlayers === 0) {
        alert("Please add players to the game")
    }
    else if (gameInProgress) {
        alert("Game has not been completed. Please complete current game before starting again.")
    }
    else {
        gameInProgress = true;
        for (const player of utilFunctions.players) {
            player.bet = parseInt(prompt(`How much does player ${player.name} wish to bet?`))
            while (player.bet > player.chips || !Number.isInteger(player.bet)) {
                player.bet = parseInt(prompt(`${player.name} you have $${player.chips} available. Please bet maximum this amount`))
            }
            player.chips -= player.bet
            player.cards = [getRandomCard(), getRandomCard()]
            utilFunctions.determineAces(player.cards)
            player.playerCardSum()
            player.displayPlayerBet()
            player.displayPlayerChips()
        }
        utilFunctions.dealer.cards.push(getRandomCard());
        utilFunctions.dealer.dealerCardSum();
        let person = utilFunctions.determineCurrentPlayer()
        alert(`Player ${person.name} is next`);
    }
};

function newCard() {
    if (!gameInProgress) {
        alert("Please start a new game!")
    }
    else {
        for (const player of utilFunctions.players) {
            if (player.isAlive) {
                player.cards.push(getRandomCard());
                utilFunctions.determineAces(player.cards)
                player.playerCardSum()
                break;
            }
        }
    }
};

function stay() {
    if (!gameInProgress) {
        alert("Game has finished, please start a new game");
    }
    else {
        const check = utilFunctions.players.filter(player => player.isAlive)
        if (check.length >= 1) {
            alert(`Player ${utilFunctions.determineCurrentPlayer().name} is next`);
        }
        else {
            utilFunctions.completeDealerCards()
            utilFunctions.determineWinners()
            utilFunctions.startOver()
            gameInProgress = false
        }
    }
};

function double() {
    const player = utilFunctions.determineCurrentPlayer()
    if (player.cards.length !== 2) {
        alert("You cannot double when you have more than 2 cards")
    }
    else if (!gameInProgress) {
        alert("Please start a new game")
    }
    else {
        player.chips -= player.bet;
        player.bet *= 2;
        player.displayPlayerChips()
        player.displayPlayerBet()
        newCard();
        player.isAlive = false
    }
}

function split(btn) {
    console.log(btn.toString())
    btn.style.background = "Red"
}