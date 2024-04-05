const submitLoginForm = async event => {
    event.preventDefault() // Prevent the default form submission behavior
    console.log("Submit Login Form")
    var form = document.getElementById("loginForm");

    const email = form.querySelector('input[name="email"]').value
    const password = form.querySelector('input[name="pass"]').value

    console.log(email)
    console.log(password)
    
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
            alert("Login successful");
            window.location.href = "/";
        } else {
            alert("Invalid email or password");
        }
    }catch(err){
        console.log(err)
    }
}

// Attach the submitLoginForm function to the form's submit event
document.getElementById("loginForm").addEventListener("submit", submitLoginForm);