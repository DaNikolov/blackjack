const updateBtn = document.getElementById("update-btn")
const logoutBtn = document.getElementById("logout-btn")
const depositBtn = document.getElementById("deposit-btn")
const withdrawBtn = document.getElementById("withdraw-btn")
const selectUser = document.getElementById("user")
const depositEl = document.getElementById('deposit-el')
let users = []
let userToBeUpdated = {}

updateBtn.addEventListener("click", function (evt) {
    evt.preventDefault()
    const formData = new FormData(document.querySelector("form"))
    userToBeUpdated.firstName = formData.get("firstName")
    userToBeUpdated.lastName = formData.get("lastName")
    userToBeUpdated.username = formData.get("username")
    userToBeUpdated.email = formData.get("emailAddress")
    userToBeUpdated.street = formData.get("street")
    userToBeUpdated.city = formData.get("city")
    userToBeUpdated.postalCode = formData.get("postalCode")
    userToBeUpdated.country = formData.get("country")
    userToBeUpdated.password = formData.get("password")
    axios.put('http://localhost:8080/api/updateuser', userToBeUpdated).then(processResults)
    .catch(function (error) {
        console.log(error)
        if (error){
            if(error.response.status === 404) {
                alert('username or e-mail address already registered')
            }
        }
    })
})

logoutBtn.addEventListener('click', function(evt) {
    evt.preventDefault()
    const selectedUser = selectUser.options[selectUser.selectedIndex].text
    console.log(selectedUser)
    axios.delete(`http://localhost:8080/api/logindelete/${selectedUser}`).then(processResults)
    .catch(function (error) {
        console.log(error)
        if (error){
            if(error.response.status === 404) {
                alert('username or e-mail address already registered')
            }
        }
    })
})

depositBtn.addEventListener('click', function(evt) {
    evt.preventDefault()
    let playerMoney = parseInt(prompt("How much do you wish to deposit"));
    while (!Number.isInteger(playerMoney)) {
        alert("You must deposit a number. Please try again.")
        playerMoney = parseInt(prompt("How much do you wish to deposit"));
    }
    const formData = new FormData(document.querySelector("form"))
    userToBeUpdated.firstName = formData.get("firstName")
    userToBeUpdated.lastName = formData.get("lastName")
    userToBeUpdated.username = formData.get("username")
    userToBeUpdated.email = formData.get("emailAddress")
    userToBeUpdated.street = formData.get("street")
    userToBeUpdated.city = formData.get("city")
    userToBeUpdated.postalCode = formData.get("postalCode")
    userToBeUpdated.country = formData.get("country")
    userToBeUpdated.password = formData.get("password")
    userToBeUpdated.balance += playerMoney 
    alert(`$${playerMoney} deposited for user ${userToBeUpdated.username}`)
    axios.put('http://localhost:8080/api/updateuser', userToBeUpdated)
    .catch(function (error) {
        console.log(error)
        if (error){
            if(error.response.status === 404) {
                alert('username or e-mail address already registered')
            }
        }
    })
    axios.post('http://localhost:8080/api/transactions', {transactionType: 1,
                                                         transactionAmount: playerMoney,
                                                         playerID: userToBeUpdated.playerID})
    .catch(function (error) {
        console.log(error)
        if (error){
            if(error.response.status === 404) {
                alert('username or e-mail address already registered')
            }
        }
    })
    depositEl.innerText = `Available balance: $${userToBeUpdated.balance}`    
})

withdrawBtn.addEventListener('click', function(evt) {
    evt.preventDefault()
    let playerMoney = parseInt(prompt("How much do you wish to withdraw"));
    while (!Number.isInteger(playerMoney) || playerMoney > userToBeUpdated.balance) {
        alert(`You currently have $${userToBeUpdated.balance} available to withdraw`)
        playerMoney = parseInt(prompt("How much do you wish to withdraw"));
    }
    const formData = new FormData(document.querySelector("form"))
    userToBeUpdated.firstName = formData.get("firstName")
    userToBeUpdated.lastName = formData.get("lastName")
    userToBeUpdated.username = formData.get("username")
    userToBeUpdated.email = formData.get("emailAddress")
    userToBeUpdated.street = formData.get("street")
    userToBeUpdated.city = formData.get("city")
    userToBeUpdated.postalCode = formData.get("postalCode")
    userToBeUpdated.country = formData.get("country")
    userToBeUpdated.password = formData.get("password")
    userToBeUpdated.balance -= playerMoney
    alert(`$${playerMoney} withdrawn for user ${userToBeUpdated.username}`)
    axios.put('http://localhost:8080/api/updateuser', userToBeUpdated)
    .catch(function (error) {
        console.log(error)
        if (error){
            if(error.response.status === 404) {
                alert('username or e-mail address already registered')
            }
        }
    })
    axios.post('http://localhost:8080/api/transactions', {transactionType: 2,
                                                         transactionAmount: playerMoney,
                                                         playerID: userToBeUpdated.playerID})
    .catch(function (error) {
        console.log(error)
        if (error){
            if(error.response.status === 404) {
                alert('username or e-mail address already registered')
            }
        }
    })
    depositEl.innerText = `Available balance: $${userToBeUpdated.balance}`    
})

axios.get('http://localhost:8080/api/userdetails').then(saveData)

function saveData({ data }) {
    for (const user of data) {
        users.push(user)
        selectUser.innerHTML += `<option value="${user.username}">${user.username}</option>`
    }
}

selectUser.addEventListener('change', userSelect)
function userSelect() {
    depositEl.innerText = ''
    const selectedUser = selectUser.options[selectUser.selectedIndex].text
    for(const user of users){
        if(user.username === selectedUser){
            document.getElementsByName("firstName")[0].value = user.firstName;
            document.getElementsByName("lastName")[0].value = user.lastName;
            document.getElementsByName("username")[0].value = user.username;
            document.getElementsByName("emailAddress")[0].value = user.email;
            document.getElementsByName("street")[0].value = user.street;
            document.getElementsByName("city")[0].value = user.city;
            document.getElementsByName("postalCode")[0].value = user.postalCode;
            document.getElementsByName("country")[0].value = user.country;
            document.getElementsByName("password")[0].value = user.password;
            userToBeUpdated = user
            if (user.balance) {
                depositEl.innerText = `Available balance: $${user.balance}`
            }
        }
    }
}

function processResults({ data }) {
    window.alert(data);
    selectUser.innerHTML = '<option value=""></option>'
    document.querySelector("form").reset();
    axios.get('http://localhost:8080/api/userdetails').then(saveData)
}
