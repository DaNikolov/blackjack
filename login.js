// const { default: axios } = require("axios")

const loginBtn = document.getElementById("login-btn")
loginBtn.addEventListener("click", function (evt) {
    userLogged = false
    evt.preventDefault()
    axios.get('http://localhost:8080/api/logindetails').then(login)
})

let userLogged = false


function login({ data }) {

    const formData = new FormData(document.querySelector("form"))

    const login = {
        username: formData.get('username'),
        password: formData.get('password')
    }
    for (const user of data) {
        if (login.username === user.username && login.password === user.password) {
            alert(`User ${login.username} has logged in successfully`)
            userLogged = true
            axios.post('http://localhost:8080/api/login', {username: login.username,
                                                            playerID: user.playerID})
            break
        }      
    }
    if(!userLogged) alert('Password or username incorrect')
}
