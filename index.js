let numberOfPlayers = 0;
let playerGamesCompleted = 0;
let dealerSum = 0;
let players = [];
let dealerCards = [];
let gameInProgress = false;
let isLastPlayer = false;
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
const dealerCardsEl = document.getElementById("dealer-cards-el");
const dealerSumEl = document.getElementById("dealer-sum-el");


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



function renderGame(playerNumber) {
    displayCards(playerNumber)
    if (players[playerNumber].sum <= 20) {
        message = "Do you want to draw a new card?";
    } else if (players[playerNumber].sum === 21) {
        youWin(playerNumber) 
        gamesCompletedCheck();
    }else {
        message = `I'm sorry, ${players[playerNumber].name}! You have lost`
        gamesCompletedCheck();
    }
    messageEl.textContent = message;
    console.log(message);
};

function newCard() {
    if (!gameInProgress) {
        alert("Please start a new game!")
    }
    else if(players[playerGamesCompleted].sum === 21){
        renderGame(playerGamesCompleted);
    }
    else {
        let playerAdditionalCard = getRandomCard("player");
        players[playerGamesCompleted].cards.push(playerAdditionalCard); 
        players[playerGamesCompleted].sum += playerAdditionalCard;
        renderGame(playerGamesCompleted);
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
        for (let i = 0; i < numberOfPlayers; i++){
            let playerBet = parseInt(prompt(`How much does player ${players[i].name} wish to bet?`))
            while(playerBet > players[i].chips || !Number.isInteger(playerBet)){
                playerBet = parseInt(prompt(`${players[i].name} you have $${players[i].chips} available. Please bet maximum this amount`))          
            }
            players[i].bet = playerBet
            let playerFirstCard = getRandomCard("player");
            let playerSecondCard = getRandomCard("player")
            players[i].cards = [playerFirstCard, playerSecondCard];
            players[i].sum = playerFirstCard + playerSecondCard;
            players[i].chips -= playerBet; 
            placingBet(i);
            displayCards(i);
        }
        let dealerCard = getRandomCard("dealer")
        addDealerCard(dealerCard);
        dealerCardsEl.textContent = "Dealer Cards: " + dealerCard;
    }
    gameInProgress = true;
};

function stay() {
    if (!gameInProgress) {
        alert("Game has finished, please start a new game");
    };
    if (numberOfPlayers === playerGamesCompleted + 1 || isLastPlayer){
        while (dealerSum <= findMaxPlayerSum() && dealerSum < 17) { 
            let dealerCard = getRandomCard("dealer");
            let check = dealerCard + dealerSum
            if (dealerCard === 11 && check  > 21){
                dealerCard = 1;
            };
            addDealerCard(dealerCard);
        }
        for (let i = 0; i < numberOfPlayers; i++){
            if ((dealerSum < players[i].sum && players[i].sum < 21 ) || (dealerSum > 21 && players[i].sum < 21)){
                youWin(i);
            }
            else {
                message = `${players[i].name} has lost. `
            }
        }
        messageEl.textContent = message;
        startOver();
    }
    else{
        gamesCompletedCheck();
    }
};

function startOver(){
     
    dealerSum = 0;
    dealerCards = []; 
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
    playerGamesCompleted = 0;
    gameInProgress = false; 
    isLastPlayer = false;
}

function double() {
    const currentPlayer = playerGamesCompleted
    console.log(currentPlayer)
    if (players[playerGamesCompleted].cards.length !== 2) {
        alert("You cannot double when you have more than 2 cards")
    }
    else if (!gameInProgress) {
        alert("Please start a new game")
    } 
    else if (numberOfPlayers === currentPlayer + 1){
        isLastPlayer = true
        players[playerGamesCompleted].chips -= players[playerGamesCompleted].bet; 
        players[playerGamesCompleted].bet *= 2; 
        placingBet(playerGamesCompleted)
        newCard();
        stay()
    }
    else {
        players[playerGamesCompleted].chips -= players[playerGamesCompleted].bet; 
        players[playerGamesCompleted].bet *= 2; 
        placingBet(playerGamesCompleted)
        newCard();
        if (currentPlayer === playerGamesCompleted){
            stay();
        }
    };
}

function youWin(player) {
    message = `You win, ${players[player].name}! `
    players[player].chips += 2 * players[player].bet
    documents[player].playerMoneyEl.textContent = `${players[player].name} has $${players[player].chips} chips available`
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

function getRandomCard(person) {
    let randomNumber =  1 + Math.floor(Math.random() * 13);
    if (randomNumber > 10) {
        return 10
    } else if(randomNumber === 1){ 
        if (person === "player"){
            randomNumber = parseInt(prompt("You have an ace do you wish to use it as 1 or 11?"));
            while (randomNumber !== 1 && randomNumber !== 11 ){
                randomNumber = parseInt(prompt("Incorrect number please select 1 or 11 as value"));
            }
        }
        else {
            randomNumber = 11; 
        }
        return randomNumber;
    }
    else{
        return randomNumber;
    }
}

function addDealerCard(dealerCard){
    dealerSum += dealerCard;
    dealerCards.push(dealerCard);
    dealerSumEl.textContent = "Dealer Sum: " + dealerSum;
    dealerCardsEl.textContent += " " + dealerCard;
}

function gamesCompletedCheck() {
    if(playerGamesCompleted + 1 === numberOfPlayers) {
        stay();
    }
    else {
        playerGamesCompleted ++;
        alert (`Player ${players[playerGamesCompleted].name} is next`)
    }
}

function findMaxPlayerSum() {
    let max = players[0].sum
    for (let i = 0; i < numberOfPlayers; i++) {
        if ( max < players[i].sum && players[i].sum < 22) {
            max = players[i].sum;
        }
    }
    return max
} 

function placingBet(player) {
    documents[player].playerBetEl.textContent = `${players[player].name} has placed a bet worth $${players[player].bet}`;
    documents[player].playerMoneyEl.textContent = `${players[player].name} has $${players[player].chips} chips available`
}
function displayCards(playerNumber) {
    documents[playerNumber].playerCardsEl.textContent = `Player ${players[playerNumber].name}'s Cards: ${players[playerNumber].cards}`; 
    documents[playerNumber].playerSumEl.textContent = `Player ${players[playerNumber].name}'s cards have a sum of ${players[playerNumber].sum}`;
}
