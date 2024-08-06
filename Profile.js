document.addEventListener('DOMContentLoaded', function() {

    if (sessionStorage.getItem('IsLoggedIn') === 'true') {
        
       
    }
    else {
        document.body.classList.toggle("show-popup");
        backdrop.classList.toggle("backdropActive");
        const hidePopupBtn = formPopup.querySelector(".login-close-btn");
        hidePopupBtn.style.display = "none";
        const showPopupBtn = document.querySelector(".login-btn");
        showPopupBtn.disabled=true;
        // window.location.href = "Home.html";
    }
});