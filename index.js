'use strict'
let numberOfPlayers = 0;
let gameInProgress = false;
let message = ""
import { getRandomCard } from "./cards.js"
import * as imports from './utils.js'

const addPlayerBtn = document.getElementById("add-player-btn")
const startGameBtn = document.getElementById("start-game-btn")
const newCardBtn = document.getElementById("new-card-btn")
const doubleBtn = document.getElementById("double-btn")
const stayBtn = document.getElementById("stay-btn")


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
    imports.determineCurrentPlayer().isAlive = false
    stay()
})

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

        imports.players.push({
            name: playerName,
            chips: playerMoney,
            isAlive: true,
            sum: 0,
            playerCardSum: function () {
                this.sum = 0;
                imports.documents[imports.players.indexOf(this)].playerCardsEl.textContent = `Player ${this.name}'s Cards: `
                for (const card of this.cards) {
                    this.sum += card.value;
                    imports.documents[imports.players.indexOf(this)].playerCardsEl.textContent += `(${card.name})`
                }
                imports.documents[imports.players.indexOf(this)].playerSumEl.textContent = `Player ${this.name}'s cards have a sum of ${this.sum}`
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
            },
            displayPlayerBet: function () {
                imports.documents[imports.players.indexOf(this)].playerBetEl.textContent = `${this.name} has placed a bet worth $${this.bet}`;
            },
            displayPlayerChips: function () {
                imports.documents[imports.players.indexOf(this)].playerMoneyEl.textContent = `${this.name} has $${this.chips} chips available`
            }
        })
        imports.players[numberOfPlayers].displayPlayerChips();
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
        for (const element of imports.players) {
            element.bet = parseInt(prompt(`How much does player ${element.name} wish to bet?`))
            while (element.bet > element.chips || !Number.isInteger(element.bet)) {
                element.bet = parseInt(prompt(`${element.name} you have $${element.chips} available. Please bet maximum this amount`))
            }
            element.chips -= element.bet
            element.cards = [getRandomCard(), getRandomCard()]
            imports.determineAces(element.cards)
            element.playerCardSum()
            element.displayPlayerBet()
            element.displayPlayerChips()
        }
        imports.dealer.cards.push(getRandomCard());
        imports.dealer.dealerCardSum();
        let person = imports.determineCurrentPlayer()
        alert(`Player ${person.name} is next`);
    }
};

function newCard() {
    if (!gameInProgress) {
        alert("Please start a new game!")
    }
    else {
        for (const player of imports.players) {
            if (player.isAlive) {
                player.cards.push(getRandomCard());
                imports.determineAces(player.cards)
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
        const check = imports.players.filter(player => player.isAlive)
        if (check.length >= 1) {
            alert(`Player ${imports.determineCurrentPlayer().name} is next`);
        }
        else {
            imports.completeDealerCards()
            imports.determineWinners()
            imports.startOver()
            gameInProgress = false
        }
    }
};

function double() {
    const player = imports.determineCurrentPlayer()
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