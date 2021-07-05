'use strict'
let gameInProgress = false;
import { getRandomCard, cardsDeck } from "./cards.js"
import * as utilFunctions from './utils.js'

const addPlayerBtn = document.getElementById("add-player-btn")
const startGameBtn = document.getElementById("start-game-btn")
const newCardBtn = document.getElementById("new-card-btn")
const doubleBtn = document.getElementById("double-btn")
const stayBtn = document.getElementById("stay-btn")
const splitBtn = document.getElementById("split-btn")

// using a class in order to create the player objects
class Player {
    constructor(name, chips) {
        this.name = name
        this.chips = chips
        this.isAlive = true
        this.bet = 0
        this.isSplit = false
        this.splitCards = []
    }
    // sum will be determined based on value of the cards
    get sum() {
        let cardSum = 0
        for (const card of this.cards) {
            cardSum += card.value;
        }
        return cardSum
    }
    // sum in case the player decides to split their cards
    get splitSum(){
        let splitCardSum = 0
        for (const card of this.splitCards) {
            splitCardSum += card.value;
        }
        return splitCardSum
    }
    // displaying the cards and sum of the player
    playerCardSum() {
        utilFunctions.documents[utilFunctions.players.indexOf(this)].playerCardsEl.textContent = `Player ${this.name}'s Cards: `
        for (const card of this.cards) {
            utilFunctions.documents[utilFunctions.players.indexOf(this)].playerCardsEl.innerHTML += `<img src="${card.image}" style="width:60px; height:90px"> `
        }
        utilFunctions.documents[utilFunctions.players.indexOf(this)].playerSumEl.textContent = `Player ${this.name}'s cards have a sum of ${this.sum}`
    }
    //displaying the cards and sum when cards have been split
    playerSplitCardSum() {
        utilFunctions.documents[utilFunctions.players.indexOf(this)].playerSplitCardsEl.textContent = `Player ${this.name}'s Cards: `
        for (const card of this.splitCards) {
            utilFunctions.documents[utilFunctions.players.indexOf(this)].playerSplitCardsEl.innerHTML += `<img src="${card.image}" style="width:60px; height:90px"> `
        }
        utilFunctions.documents[utilFunctions.players.indexOf(this)].playerSplitSumEl.textContent = `Player ${this.name}'s cards have a sum of ${this.splitSum}`
    }
    //displaying the bet
    displayPlayerBet() {
        utilFunctions.documents[utilFunctions.players.indexOf(this)].playerBetEl.textContent = `${this.name} has placed a bet worth $${this.bet}`
    }
    //displaying the available chips
    displayPlayerChips() {
        utilFunctions.documents[utilFunctions.players.indexOf(this)].playerMoneyEl.textContent = `${this.name} has $${this.chips} chips available`
    }
    //calculating the winnings
    youWin() {
        alert(`You win, ${this.name}!`)
        this.chips += 2 * this.bet
        this.displayPlayerChips()
    }
}
//generating the cards and the array for displaying the data
utilFunctions.createDocuments()
cardsDeck()
//calling the buttons
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
    //checking whether we have split or not
    let player = utilFunctions.determineCurrentPlayer()
    if(player.isSplit){
        player.isSplit = false
    }
    else if (!player.isSplit){ 
        player.isAlive = false
    }
    stay()
})
splitBtn.addEventListener("click", function () {
    split()
})


function addNewPlayer() {
    if (utilFunctions.players.length === 5) return alert("Maximum number of players has been reached")
    //requesting the player provide their name and the amount of chips they wish to deposit
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
    // creating the player object based on the information provided
    let person = new Player(playerName, playerMoney)
    utilFunctions.players.push(person)
    person.displayPlayerChips();
};

function startGame() {
    if (utilFunctions.players.length === 0) return alert("Please add players to the game")
    if (gameInProgress) return alert("Game has not been completed. Please complete current game before starting again.")
    gameInProgress = true;
    for (const player of utilFunctions.players) {
        //requesting the amount to bet
        player.bet = parseInt(prompt(`How much does player ${player.name} wish to bet?`))
        while (player.bet > player.chips || !Number.isInteger(player.bet)) {
            player.bet = parseInt(prompt(`${player.name} you have $${player.chips} available. Please bet maximum this amount`))
        }
        player.isAlive = true
        player.chips -= player.bet
        player.cards = [getRandomCard(), getRandomCard()]
        //this check is not really needed just provided it to use the confirm option
        if (player.cards[0].value === 11 && player.cards[1].value === 11){
            const check = confirm("You have 2 aces. Do you wish to split them?")
            if(check) {
                split()
            }
        }
        // checking whether we have a blackjack and updating the information on the screen
        utilFunctions.determineAces(player.cards)
        player.playerCardSum()
        player.isAlive = utilFunctions.checkBlackjack(player.sum, player.name)
        if (!player.isAlive) stay()
        player.displayPlayerBet()
        player.displayPlayerChips()
    }
    // generating the dealer information 
    utilFunctions.dealer.cards.push(getRandomCard());
    utilFunctions.dealer.dealerCardSum();
    let person = utilFunctions.determineCurrentPlayer()
    alert(`Player ${person.name} is next`);
};

function newCard() {
    if (!gameInProgress) return alert("Please start a new game!")
    for (const player of utilFunctions.players) {
        // new card in case of a split
        if (player.isSplit){
            player.splitCards.push(getRandomCard());
            utilFunctions.determineAces(player.splitCards)
            player.playerSplitCardSum()
            player.isSplit = utilFunctions.checkBlackjack(player.splitSum, player.name)
            if (!playerisSplit) stay()
            break
        }
        else if (player.isAlive) {
            player.cards.push(getRandomCard());
            utilFunctions.determineAces(player.cards)
            player.playerCardSum()
            player.isAlive = utilFunctions.checkBlackjack(player.sum, player.name)
            if (!player.isAlive) stay()
            break
        }
    }
};
//function to end the player turn
function stay() {
    if (!gameInProgress) return alert("Game has finished, please start a new game");
    //checking whether there are players left to act 
    const check = utilFunctions.players.filter(player => player.isAlive)
    if (check.length >= 1){
        alert(`Player ${utilFunctions.determineCurrentPlayer().name} is next`);
    }
    else{
    // ending the game in case where everyone has acted
    utilFunctions.completeDealerCards()
    for (let player of utilFunctions.players){
    //checking who has won based on their regular and split cards result 
        if (player.splitSum > 0) {
            player.isSplit = false
            utilFunctions.determineWinners(player, player.splitSum)
        }
        player.isAlive = false
        utilFunctions.determineWinners(player, player.sum)
    }
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
    // this can be used instead of the split prompt above
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

