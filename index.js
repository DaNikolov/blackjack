
let playerSum = 0;
let playerSplitSum = 0;
let dealerSum = 0;
let playerCards = [];
let dealerCards = [];
let playerSplitCards = []; 
let playerMoney = 0; 
let playerBet = 0; 
let playerSplitBet = 0;
let hasBlackJack = false;
let isAlive = true;
let message = "";
let messageEl = document.getElementById("message-el");
let playerSumEl = document.getElementById("player-sum-el");
let playerSplitSumEl = document.getElementById("player-split-sum-el")
let playerCardsEl = document.getElementById("player-cards-el");
let playerSplitCardsEl = document.getElementById("player-split-cards-el");
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
    let playerAdditionalCard = getRandomCard("player");
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
    let playerFirstCard = getRandomCard("player");
    let playerSecondCard = getRandomCard("player")
    let dealerCard = getRandomCard("dealer")
    playerSum = playerFirstCard + playerSecondCard;
    playerCards = [playerFirstCard, playerSecondCard];
    addDealerCard(dealerCard);
    playerBetEl.textContent = "Your bet: " + playerBet;
    playerMoney -= playerBet; 
    playerMoneyEl.textContent = "Your money: " + playerMoney;
    renderGame();
    }
};

function stay() {
    if (dealerSum === 0) {
        alert("Game has finished, please start a new game");
    }
    else {
        while (dealerSum <= playerSum && dealerSum < 17) { 
            let dealerCard = getRandomCard("dealer");
            let check = dealerCard + dealerSum
            if (dealerCard === 11 && check  > 21){
                dealerCard = 1;
            };
            addDealerCard(dealerCard);
        }
        if (dealerSum < playerSum || dealerSum > 21){
            youWin();
        }
        //else if (dealerSum > 21){
        //    youWin();
        //}
        else {
            message = "You lose"
        }
        messageEl.textContent = message;
        startOver();
    }
};

function startOver(){
    playerSum = 0; 
    playerCards = []; 
    dealerSum = 0;
    dealerCards = []; 
    playerBetEl.textContent = "Your bet: "
}

function double() {
    if (playerCards.length !== 2) {
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