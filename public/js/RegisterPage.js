const submitRegisterForm = async event => {
    event.preventDefault()
    console.log("Submit Register Form");

    const email = document.getElementById('email').value;
    const username = document.getElementById('uname').value;
    const firstname = document.getElementById('firstname').value;
    const lastname = document.getElementById('lastname').value;
    const password = document.getElementById('pass').value;
    const confirmPass = document.getElementById('confirmPass').value;

    console.log(email);
    console.log(username);
    console.log(firstname)
    console.log(lastname)
    console.log(password);
    console.log(confirmPass);

    if (!checkPassword(password, confirmPass)) {
        console.log("Passwords do not match.")
        return false;
    }

    try {
        const response = await fetch('/user', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, username, firstname, lastname, password }),
        });
        const result = await response.json();

        // Check if the status code is 200 (OK)
        if (response.ok) {
            alert("Register successful");
            try {
                const response = await fetch('/user/login', {
                    method: 'POST',
                    headers: {
                    'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email, password })
                });
        
                if (response.status === 200) { // Check if the status code is 200 (OK)
                    const result = await response.json();
                    console.log(result);
                    window.location.href = "/";
                } else {
                    alert("Error");
                }
            }catch(err){
                console.log(err)
            }
        } else {
            alert(result.message);
        }
    } catch (err) {
        console.log(err);
    }
};

function checkPassword(password, confirmPassword) {
    return password === confirmPassword;
}

// Attach the submitRegisterForm function to the form's submit event
document.addEventListener('DOMContentLoaded', function(){
    document.getElementById("submit").addEventListener("click", submitRegisterForm);
})