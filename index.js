'use strict'
let numberOfPlayers = 0;
let gameInProgress = false;
const addPlayerBtn = document.getElementById("add-player-btn")
const startGameBtn = document.getElementById("start-game-btn")
const newCardBtn = document.getElementById("new-card-btn")
const doubleBtn = document.getElementById("double-btn")
const stayBtn = document.getElementById("stay-btn")
import{getRandomCard} from "./cards.js"
import * as templates from './utils.js'

addPlayerBtn.addEventListener("click", function() {
    addNewPlayer()
})
startGameBtn.addEventListener("click", function(){
    startGame()
})
newCardBtn.addEventListener("click", function(){
    newCard()
})
doubleBtn.addEventListener("click", function() {
    double()
})
stayBtn.addEventListener("click", function(){
    stay()
})

function addNewPlayer() {
    if (numberOfPlayers === 5) {
        alert("Maximum number of players has been reached")
    }
    else{
        let playerName = prompt("What is your name?")
        while (!playerName){
            alert("Name cannot be empty. Please try again.")
            playerName = prompt("What is your name?")
        }
        let playerMoney = parseInt(prompt("How much do you wish to deposit"));
        while(!Number.isInteger(playerMoney)){
            alert("You must deposit a number. Please try again.")
            playerMoney = parseInt(prompt("How much do you wish to deposit"));
        }

        templates.players.push({
            name: playerName,
            chips: playerMoney,
            isAlive: true,
            sum: 0,
            cards: [],
            playerCardSum: function() {
                this.sum = 0;
                templates.documents[templates.players.indexOf(this)].playerCardsEl.textContent = `Player ${this.name}'s Cards: `
                for(const card of this.cards) {
                    this.sum += card.value;
                    templates.documents[templates.players.indexOf(this)].playerCardsEl.textContent += `(${card.name})` 
                }
                if(this.sum === 21){
                    this.isAlive = false
                    alert(`Player ${this.name} has blackjack and has completed the game`)
                }
                templates.documents[templates.players.indexOf(this)].playerSumEl.textContent = `Player ${this.name}'s cards have a sum of ${this.sum}`
            },
            displayPlayerBet: function(){
                templates.documents[templates.players.indexOf(this)].playerBetEl.textContent = `${this.name} has placed a bet worth $${this.bet}`;
                },
            displayPlayerChips: function(){
                templates.documents[templates.players.indexOf(this)].playerMoneyEl.textContent = `${this.name} has $${this.chips} chips available`
            }
        })
        templates.players[numberOfPlayers].displayPlayerChips();
        numberOfPlayers ++;
    }
};

function startGame() {
    if (numberOfPlayers === 0){
        alert("Please add players to the game")
    }
    else if (gameInProgress){
        alert("Game has not been completed. Please complete current game before starting again.")
    }
    else{
        for (const element of templates.players) {
            element.bet = parseInt(prompt(`How much does player ${element.name} wish to bet?`))
            while(element.bet > element.chips || !Number.isInteger(element.bet)){
                element.bet = parseInt(prompt(`${element.name} you have $${element.chips} available. Please bet maximum this amount`))          
            }
            element.isAlive = true
            element.chips -= element.bet
            element.cards = [getRandomCard(), getRandomCard()]
            templates.determineAces(element.cards)
            element.playerCardSum()
            element.displayPlayerBet()
            element.displayPlayerChips()
        }
        templates.dealer.cards.push(getRandomCard());
        templates.dealer.dealerCardSum();
        let person = templates.determineCurrentPlayer()
        alert(`Player ${person.name} is next`);
        gameInProgress = true;
    }  
};

function newCard() {
    if (!gameInProgress) {
        alert("Please start a new game!")
    }
    else { 
        for (const player of templates.players) {
            if (player.isAlive) {
                player.cards.push(getRandomCard());
                templates.determineAces(player.cards)
                player.playerCardSum()
                renderGame(templates.players.indexOf(player));
                break;
            }
        }
    }
};

function stay() {
    if (!gameInProgress) {
        alert("Game has finished, please start a new game");
    }
    else{ 
        const check = templates.players.filter(player => player.isAlive)
        if (check.length > 1){
            templates.determineCurrentPlayer().isAlive = false
            alert(`Player ${templates.determineCurrentPlayer().name} is next`);
        }
        else {
            templates.completeDealerCards()
            templates.determineWinners()
            templates.startOver()
            gameInProgress = false
        }
    }
};

function double() {
    const player = templates.determineCurrentPlayer()
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

function renderGame(playerNumber) {
    gameInProgress = true
    templates.players[playerNumber].isAlive = true
    if (templates.players[playerNumber].sum < 21) {
        message = `Player ${templates.players[playerNumber].name} select a new card or stay`
    } 
    else{
        stay()
    }
}