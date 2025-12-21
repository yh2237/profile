const menuButton = document.getElementById("menuButton");
const sideMenu = document.getElementById("sidebar");
const overlay = document.getElementById("overlay");

menuButton.addEventListener("click", () => {
    sideMenu.classList.toggle("open");
    overlay.classList.toggle("open");
});

overlay.addEventListener("click", () => {
    sideMenu.classList.remove("open");
    overlay.classList.remove("open");
});
