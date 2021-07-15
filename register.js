const registerBtn = document.getElementById("register-btn")

registerBtn.addEventListener("click", function (evt) {
    evt.preventDefault()

    const formData = new FormData(document.querySelector("form"))
    
    axios.post('http://localhost:8080/api/adduser', {
        firstName: formData.get("firstName"),
        lastName: formData.get("lastName"),
        username: formData.get("username"),
        email: formData.get("emailAddress"),
        street: formData.get("street"),
        city: formData.get("city"),
        postalCode: formData.get("postalCode"),
        country: formData.get("country"),
        password: formData.get("password")
    }).then(processResults).catch(function (error) {
        if(error.response.status === 404) {
            alert('username or e-mail address already registered')
        }
    })

})

function processResults({ data }) {
    window.alert(data);
    document.querySelector("form").reset();
}
