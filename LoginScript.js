
const showPopupBtn = document.querySelector(".login-btn");
const formPopup = document.querySelector(".form-popup");
const hidePopupBtn = formPopup.querySelector(".login-close-btn");
const signupLoginLink = formPopup.querySelectorAll(".bottom-link a");
const submitbtn = document.querySelector(".submit-btn");
const entereduser = document.querySelector(".in-name");
const enteredpass = document.querySelector(".in-pass");
const enteredmail = document.querySelector(".up-mail");
const entereduppass = document.querySelector(".up-pass");
const signupbtn = document.querySelector(".signup-btn");
const backdrop = document.querySelector(".backdrop");

// Show login popup
showPopupBtn.addEventListener("click", () => {
    if (sessionStorage.getItem('IsLoggedIn') === 'true') {
        if (confirm("Are you sure you want to logout?")) {

            sessionStorage.setItem('IsLoggedIn', 'false');
        
            window.location.href = "Home.html";
        }
        

    }
    else{
            document.body.classList.toggle("show-popup");
         backdrop.classList.toggle("backdropActive");
    }

});

// Hide login popup
hidePopupBtn.addEventListener("click", () => showPopupBtn.click());

// Show or hide signup form
signupLoginLink.forEach(link => {
    link.addEventListener("click", (e) => {
        e.preventDefault();
        
        formPopup.classList[link.id === 'signup-link' ? 'add' : 'remove']("show-signup");
    });
});



submitbtn.addEventListener("click", (event) =>{
       
    event.preventDefault();
     // Check credentials in local storage

     if (checkLocalStorage(entereduser.value, enteredpass.value)) {
        sessionStorage.setItem('IsLoggedIn', 'true');

        window.location.href = "Home.html";
    } else {
        // If not found in local storage, check via API
        checkAPI(entereduser.value, enteredpass.value)
            .then(success => {
                if (success) {
                    sessionStorage.setItem('IsLoggedIn', 'true');
                    window.location.href = "Home.html";
                } else {
                    sessionStorage.setItem('IsLoggedIn', 'false');
                    
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }

function checkLocalStorage(username, password) {
    const storedUsername = localStorage.getItem('username');
    const storedPassword = localStorage.getItem('password');
    return storedUsername === username && storedPassword === password;
}

async function checkAPI(username, password) {
    try {
        const response = await fetch('https://dummyjson.com/user/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: username,
                password: password,
            
            })
        });

        if (response.ok) {
            const result = await response.json();
            return result.token != null; // Assume API returns a token on successful login
        } else {
            return false;
        }
    } catch (error) {
        console.error('API error:', error);
        return false;
    }
}

});

signupbtn.addEventListener('click', function() {
   const username = enteredmail.value;
    const password = entereduppass.value;

    // Save email and password to local storage
    localStorage.setItem('username', username);
    localStorage.setItem('password', password);
    console.log(localStorage);

    alert('Signup successful! Credentials saved to local storage.');
});

document.addEventListener('DOMContentLoaded', function() {
    // Check if user is already logged in
    var login_btn = document.querySelector('.login-btn');
    if (sessionStorage.getItem('IsLoggedIn') === 'true') {
        
        login_btn.innerText = 'Logout';
    }
    else {
       
        login_btn.innerText = 'Login';
    }
});
