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
        playerName = prompt("What is your name?")
        playerMoney = parseInt(prompt("How much do you wish to deposit"));
        players.push({
            name: playerName,
            chips: playerMoney
        })
        documents[numberOfPlayers].playerMoneyEl.textContent = `${playerName} has $${playerMoney} chips available`;
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
        for (let element of players) {
            let playerBet = parseInt(prompt(`How much does player ${element.name} wish to bet?`))
            while(playerBet > element.chips || !Number.isInteger(playerBet)){
                playerBet = parseInt(prompt(`${element.name} you have $${element.chips} available. Please bet maximum this amount`))          
            }
            element.isAlive = true
            element.bet = playerBet
            element.chips -= element.bet
            element.cards = [getRandomCard(), getRandomCard()]
            determineAces(element.cards)
            sumGenerator(element)
            renderGame(players.indexOf(element));
            placingBet(players.indexOf(element));
        }
        dealer.cards.push(getRandomCard());
        dealer.dealerCardSum();
        person = determineCurrentPlayer()
        alert(`Player ${person.name} is next`);
        gameInProgress = true;
    }  
};

function newCard() {
    if (!gameInProgress) {
        alert("Please start a new game!")
    }
    else { 
        for (let player of players) {
            if (player.isAlive) {
                player.cards.push(getRandomCard());
                determineAces(player.cards)
                sumGenerator(player);
                renderGame(players.indexOf(player));
                break;
            }
        }
    }
};

function renderGame(playerNumber) {
    documents[playerNumber].playerCardsEl.textContent = `Player ${players[playerNumber].name}'s Cards: ${players[playerNumber].cards}`
    documents[playerNumber].playerSumEl.textContent = `Player ${players[playerNumber].name}'s cards have a sum of ${players[playerNumber].sum}`
    if (players[playerNumber].sum <= 20) {
        message = `Player ${players[playerNumber].name} select a new card or stay`
    } else if (players[playerNumber].sum === 21) {
        youWin(playerNumber) 
    }else {
        alert(`I'm sorry, ${players[playerNumber].name}! You have lost`)
        players[playerNumber].isAlive = false
    }
    if(!determineCurrentPlayer()){
        completeDealerCards()
        determineWinners
        startOver()
    }
}



function stay() {
    if (!gameInProgress) {
        alert("Game has finished, please start a new game");
    }
    else{ 
        const check = players.filter(player => player.isAlive)
        if (check.length > 1){
            players[players.indexOf(determineCurrentPlayer())].isAlive = false
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
    let randomNumber =  1 + Math.floor(Math.random() * 13);
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
    let player = determineCurrentPlayer()
    if (player.cards.length !== 2) {
        alert("You cannot double when you have more than 2 cards")
    }
    else if (!gameInProgress) {
        alert("Please start a new game")
    } 
    else {
        player.chips -= player.bet; 
        player.bet *= 2; 
        placingBet(players.indexOf(player))
        newCard();
        stay()
    }
}


function findMaxPlayerSum() {
    let filteredPlayers = players.filter(check => check.sum < 22)
    let max = filteredPlayers[0].sum
    for (let player of filteredPlayers) {
        if ( max < player.sum) {
            max = player.sum;
        }
    }
    return max
} 

function placingBet(player) {
    documents[player].playerBetEl.textContent = `${players[player].name} has placed a bet worth $${players[player].bet}`;
    documents[player].playerMoneyEl.textContent = `${players[player].name} has $${players[player].chips} chips available`
}


function startOver(){
     
    
    dealer.sum = 0
    dealer.dealerCardSum()
    dealer.cards = [] 
    for (let i = 0; i < numberOfPlayers; i++){
        //documents[i].playerSumEl.textContent = "";
        documents[i].playerBetEl.textContent = "";
        //documents[i].playerCardsEl.textContent = "";
        documents[i].playerSplitSumEl.textContent = "";
        documents[i].playerSplitCardsEl.textContent = "";
        players[i].bet = 0;
        players[i].cards = [];
        players[i].sum = 0; 
    }
    alert("Game is complete!");
    gameInProgress = false; 
}



function youWin(player) {
    alert(`You win, ${players[player].name}!`)
    players[player].chips += 2 * players[player].bet
    documents[player].playerMoneyEl.textContent = `${players[player].name} has $${players[player].chips} chips available`
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


function sumGenerator(element) {
    let sum = 0;
    for (let card of element.cards){
        sum += card
    }
    element.sum = sum
    element.isAlive = true 
}


function determineCurrentPlayer() {
    for (let player of players) {
        if (player.isAlive) {
            return player
            break;
        }
    }
}

function determineAces(arr){
    let sum = 0
    for(card of arr){
        sum += card
    }
    if(arr.some(check => check === 11) && sum > 22){
        for(card of arr){
            if(card === 11){
                card = 1
                break;
            }
        }
    }
}

function completeDealerCards() {
    while (dealer.sum < 17) { 
        dealer.cards.push(getRandomCard())
        determineAces(dealer.cards)
        dealer.sum = 0
        dealer.dealerCardSum()
    }
} 

function determineWinners() {
    for (let player of players){
        if ((dealer.sum < player.sum && player.sum < 21 ) || (dealer.sum > 21 && player.sum < 21)){
            youWin(players.indexOf(player));
        }
        else if(dealer.sum === player.sum){
            alert(`${player.name} has drawn.`)
            player.chips += player.bet
            documents[players.indexOf(player)].playerMoneyEl.textContent = `${player.name} has $${player.chips} chips available`
            player.isAlive = false
        }
        else {
            alert(`${player.name} has lost.`)
            player.isAlive = false
        }
    }
}
