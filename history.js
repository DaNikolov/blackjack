const users = []
const Hands = []
const selectUser = document.getElementById("user")
const displayHandHistoryTbl = document.getElementById("display-hand-history-tbl")

axios.get('http://localhost:8080/api/userdetails').then(saveData)

function saveData({ data }) {
    for (const user of data) {
        users.push(user)
        selectUser.innerHTML += `<option value="${user.username}">${user.username}</option>`
    }
}

selectUser.addEventListener('change', userSelect)

function userSelect() {
    Hands.splice(0, Hands.length)
    displayHandHistoryTbl.innerHTML = `<tr>
<th>Hand No</th>
<th>Dealer Cards</th>
<th>Player Cards</th>
<th>Player Bet</th>
<th>Outcome</th>
<th>Total Amount</th>
<th>Date/Time</th>
</tr>`
    const selectedUser = selectUser.options[selectUser.selectedIndex].text
    for (const user of users) {
        if (user.username === selectedUser) {
            axios.get(`http://localhost:8080/api/handhistory/${user.playerID}`).then(displayHandHistory).then(completeCardsTable)
        }
    }
}

function displayHandHistory({ data }) {
    const checkID = []
    for (const hand of data) {
        if (hand.isSplit === 1) {
            hand.handID += ' Split'
        }
        if (!checkID.includes(hand.handID)) {
            checkID.push(hand.handID)
        }
    }
    for (const id of checkID) {
        Hands.push({
            handID: id,
            dealerCards: [],
            playerCards: []
        })
    }
    for (let databaseHand of data) {
        for (let hand of Hands) {
            if (databaseHand.handID === hand.handID) {
                if (!hand.dealerCards.includes(databaseHand.DealerCard)) {
                    hand.dealerCards.push(databaseHand.DealerCard)
                }
                if (!hand.playerCards.includes(databaseHand.PlayerCard)) {
                    hand.playerCards.push(databaseHand.PlayerCard)
                }
                hand.bet = databaseHand.betAmount
                hand.outcome = databaseHand.outcome
                hand.total = databaseHand.totalAmountAvailableAtHandFinish
                hand.date = databaseHand.handTime
            }
        }
    }
}

function completeCardsTable() {
    let template = ''
    for (const hand of Hands) {
        template += `<tr>
                    <td>${hand.handID}</td>
                    <td>`
        for (const card of hand.dealerCards) {

            template += `<img src="./PNG/${card}.png" style="width:40px; height:60px">`
        }
        template += `</td>
                    <td>`
        for (const card of hand.playerCards) {
            template += `<img src="./PNG/${card}.png" style="width:40px; height:60px">`

        }
        template += `</td>
                    <td>$${hand.bet}</td>
                    <td>${hand.outcome}</td>
                    <td>$${hand.total}</td>
                    <td>${hand.date}</td>
</tr>`
    }
    displayHandHistoryTbl.innerHTML += template
}