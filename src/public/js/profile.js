const profileButton = document.getElementById("profile_button");
const profileContainer = document.getElementById("profile_container");
const profileBackground = document.getElementById("profile_background");
const closeProfile = document.getElementById("close_profile");
const cartButton = document.getElementById("cart_button");

profileButton.addEventListener('click', () => {
    profileContainer.classList.toggle("active");
    profileBackground.classList.toggle("active");
});

profileBackground.addEventListener('click', () => {
    profileContainer.classList.remove("active");
    profileBackground.classList.remove("active");
});

profileContainer.addEventListener('click', (event) => {
    event.stopPropagation();
});

cartButton.addEventListener('click', () => {
    window.location='../../cart';
})

