'use strict'
let numberOfPlayers = 0;
let players = [];
let gameInProgress = false;
let message = "";
const messageEl = document.getElementById("message-el");
const documents = [
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
const dealer = {
    cards: [],
    sum: 0,
    cardsEl: document.getElementById("dealer-cards-el"),
    sumEl: document.getElementById("dealer-sum-el"),
    dealerCardSum: function() {
        this.sum = 0;
        for(const card of this.cards) {
            this.sum += card;
            this.sumEl.textContent = "Dealer Sum: " + this.sum
        }
        this.cardsEl.textContent = "Dealer Cards: " + [...this.cards]
    }
}


function addNewPlayer() {
    if (numberOfPlayers === 5) {
        alert("Maximum number of players has been reached")
    }
    else{
        let playerName = prompt("What is your name?")
        while (playerName === ""){
            alert("Name cannot be empty. Please try again.")
            playerName = prompt("What is your name?")
        }
        let playerMoney = parseInt(prompt("How much do you wish to deposit"));
        while(!Number.isInteger(playerMoney)){
            alert("You must deposit a number. Please try again.")
            playerMoney = parseInt(prompt("How much do you wish to deposit"));
        }

        players.push({
            name: playerName,
            chips: playerMoney,
            isAlive: true,
            sum: 0,
            cards: [],
            playerCardSum: function() {
                this.sum = 0;
                for(const card of this.cards) {
                    this.sum += card;
                }
                if(this.sum === 21){
                    this.isAlive = false
                }
                documents[players.indexOf(this)].playerSumEl.textContent = `Player ${this.name}'s cards have a sum of ${this.sum}`
                documents[players.indexOf(this)].playerCardsEl.textContent = `Player ${this.name}'s Cards: ${this.cards}`
            },
            displayPlayerBet: function(){
                documents[players.indexOf(this)].playerBetEl.textContent = `${this.name} has placed a bet worth $${this.bet}`;
                },
            displayPlayerChips: function(){
                documents[players.indexOf(this)].playerMoneyEl.textContent = `${this.name} has $${this.chips} chips available`
            }
        })
        players[numberOfPlayers].displayPlayerChips();
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
        for (const element of players) {
            element.bet = parseInt(prompt(`How much does player ${element.name} wish to bet?`))
            while(element.bet > element.chips || !Number.isInteger(element.bet)){
                element.bet = parseInt(prompt(`${element.name} you have $${element.chips} available. Please bet maximum this amount`))          
            }
            element.isAlive = true
            element.chips -= element.bet
            element.cards = [getRandomCard(), getRandomCard()]
            determineAces(element.cards)
            element.playerCardSum()
            element.displayPlayerBet()
            element.displayPlayerChips()
        }
        dealer.cards.push(getRandomCard());
        dealer.dealerCardSum();
        let person = determineCurrentPlayer()
        alert(`Player ${person.name} is next`);
        gameInProgress = true;
    }  
};

function newCard() {
    if (!gameInProgress) {
        alert("Please start a new game!")
    }
    else { 
        for (const player of players) {
            if (player.isAlive) {
                player.cards.push(getRandomCard());
                determineAces(player.cards)
                player.playerCardSum()
                renderGame(players.indexOf(player));
                break;
            }
        }
    }
};

function renderGame(playerNumber) {
    gameInProgress = true
    if (players[playerNumber].sum <= 20) {
        message = `Player ${players[playerNumber].name} select a new card or stay`
    } 
    else{
        stay()
    }
}





function stay() {
    if (!gameInProgress) {
        alert("Game has finished, please start a new game");
    }
    else{ 
        const check = players.filter(player => player.isAlive)
        if (check.length > 1){
            determineCurrentPlayer().isAlive = false
            alert(`Player ${determineCurrentPlayer().name} is next`);
        }
        else {
            completeDealerCards()
            determineWinners()
            startOver()
        }
    }
};

function getRandomCard() {
    const randomNumber =  1 + Math.floor(Math.random() * 13);
    if (randomNumber > 10) {
        return 10
    } else if(randomNumber === 1){ 
        return 11
    }
    else{
        return randomNumber;
    }
}


function double() {
    const player = determineCurrentPlayer()
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
        stay()
    }
}


function findMaxPlayerSum() {
    const filteredPlayers = players.filter(check => check.sum < 22)
    let max = filteredPlayers[0].sum
    for (let player of filteredPlayers) {
        if ( max < player.sum) {
            max = player.sum;
        }
    }
    return max
} 



function startOver(){
    dealer.dealerCardSum()
    dealer.cards = [] 
    for (const player in players){
        //documents[i].playerSumEl.textContent = "";
        documents[player].playerBetEl.textContent = "";
        //documents[i].playerCardsEl.textContent = "";
        documents[player].playerSplitSumEl.textContent = "";
        documents[player].playerSplitCardsEl.textContent = "";
        players[player].bet = 0;
        players[player].cards = [];
        players[player].sum = 0; 
    }
    alert("Game is complete!");
    gameInProgress = false; 
}



function youWin(player) {
    alert(`You win, ${players[player].name}!`)
    players[player].chips += 2 * players[player].bet
    players[player].displayPlayerChips()
    players[player].isAlive = false;
}

function split() {
    if(playerCards.length !== 2 || playerCards[0] !== playerCards[1]){
        alert("You cannot split currently"); 
    }
    else{
        let playerSplitCard = playerCards.pop()
        playerSplitCardsEl.textContent = "Player Split Cards: " + playerSplitCard;
        playerCardsEl.textContent = "Player Cards: " + playerSplitCard;
        playerSplitCards.push(playerSplitCard);
        playerSum /= 2;
        playerSplitSum = playerSum;
        playerSplitSumEl.textContent = "Player Split Sum: " + playerSum;
        playerSumEl.textContent = "Player Sum: " + playerSum;
    }
}



function determineCurrentPlayer() {
    for (const player of players) {
        if (player.isAlive) {
            return player
            break;
        }
    }
}

function determineAces(arr){
    let sum = 0
    for(let card of arr){
        sum += card
    }
    if(arr.some(check => check === 11) && sum > 22){
        for(let card of arr){
            if(card === 11){
                arr[arr.indexOf(card)] = 1
                break;
            }
        }
    }
}

function completeDealerCards() {
    while (dealer.sum < 17) { 
        dealer.cards.push(getRandomCard())
        determineAces(dealer.cards)
        dealer.dealerCardSum()
    }
} 

function determineWinners() {
    for (let player of players){
        if ((dealer.sum < player.sum && player.sum < 21 ) || (dealer.sum > 21 && player.sum < 21)){
            youWin(players.indexOf(player));
        }
        else if (player.sum === 21){
            youWin(players.indexOf(player));
        }
        else if(dealer.sum === player.sum && player.sum !== 21){
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
