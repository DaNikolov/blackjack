
let playerSum = 0;
let dealerSum = 0;
let playerCards = [];
let dealerCards = [];
let playerMoney = 0; 
let playerBet = 0; 
let hasBlackJack = false;
let isAlive = true;
let message = "";
let messageEl = document.getElementById("message-el");
let playerSumEl = document.getElementById("player-sum-el");
let playerCardsEl = document.getElementById("player-cards-el");
let dealerCardsEl = document.getElementById("dealer-cards-el");
let dealerSumEl = document.getElementById("dealer-sum-el");
let playerMoneyEl = document.getElementById("player-money-el"); 
let playerBetEl = document.getElementById("player-bet-el");


function deposit() {
    playerMoney += parseInt(prompt("How much do you wish to deposit"));
    playerMoneyEl.textContent = "Your money: " + playerMoney;
};



function renderGame() {
    playerCardsEl.textContent = 'Player Cards:'; 
    for(let i = 0; i < playerCards.length; i ++){
        playerCardsEl.textContent += " " + playerCards[i];
    }
    // cardsEl.textContent = "Cards: " + [...cards]; 
    if (playerSum <= 20) {
        message = "Do you want to draw a new card?";
        playerSumEl.textContent = "Player Sum: " + playerSum;
    } else if (playerSum === 21) {
        hasBlackJack = true;
        playerSumEl.textContent = "Player Sum: " + playerSum;
        youWin()
        startOver();
    }else {
        message = "I'm sorry! You have lost"
        isAlive = false
        playerSumEl.textContent = "Player Sum: " + playerSum;
        startOver();
    }
    messageEl.textContent = message;
};

function newCard() {
    if (playerSum === 0) {
        alert("Please start a new game!")
    }
    else {
    let playerAdditionalCard = 2 + Math.floor(Math.random() * 10);
    playerCards.push(playerAdditionalCard); 
    playerSum += playerAdditionalCard;
    renderGame();
    }
};

function startGame() {
    playerCardsEl.textContent = "Player Cards: "
    dealerCardsEl.textContent = "Dealer Cards: "
    playerBet = parseInt(prompt("How much do you wish to bet?"))
    if(playerBet > playerMoney || !Number.isInteger(playerBet)){
        alert("you do not have enough money");
    }
    else {
    let playerFirstCard = 2 + Math.floor(Math.random() * 10);
    let playerSecondCard = 2 + Math.floor(Math.random() * 10);
    let dealerCard = 2 + Math.floor(Math.random() * 10);
    playerSum = playerFirstCard + playerSecondCard;
    playerCards = [playerFirstCard, playerSecondCard];
    dealerCards = [dealerCard]; 
    dealerCardsEl.textContent += " " + dealerCard;
    dealerSum += dealerCard;
    dealerSumEl.textContent = "Dealer Sum: " + dealerSum; 
    playerBetEl.textContent = "Your bet: " + playerBet;
    playerMoney -= playerBet; 
    playerMoneyEl.textContent = "Your money: " + playerMoney;
    renderGame();
    }
};

function stay() {
    while (dealerSum <= playerSum && dealerSum < 17) { 
        let dealerCard = 2 + Math.floor(Math.random() * 10);
        dealerSum += dealerCard;
        dealerCards.push(dealerCard);
        dealerSumEl.textContent = "Dealer Sum: " + dealerSum;
        dealerCardsEl.textContent += " " + dealerCard;
    }
    if (dealerSum < playerSum || dealerSum > 21){
        youWin();
    }
    else {
        message = "You lose"
    }
    messageEl.textContent = message;
    startOver();
};

function startOver(){
    playerSum = 0; 
    playerCards = []; 
    dealerSum = 0;
    dealerCards = []; 
    playerBetEl.textContent = "Your bet: "
}

function double() {
    if (playerCards.length > 2) {
        alert("You cannot double when you have more than 2 cards")
    }
    else {
    playerMoney -= playerBet;
    playerBet *= 2; 
    playerMoneyEl.textContent = "Your money: " + playerMoney
    playerBetEl.textContent = "Your bet: " + playerBet
    newCard();
    stay();
    };
}

function youWin() {
    message = "You win!"
    playerMoney += 2 * playerBet
    playerMoneyEl.textContent = "Your money: " + playerMoney
}