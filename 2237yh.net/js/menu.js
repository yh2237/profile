const menuButton = document.getElementById("menuButton");
const sideMenu = document.getElementById("sidebar");
const overlay = document.getElementById("overlay");

menuButton.addEventListener("click", () => {
    sideMenu.classList.toggle("open");
    overlay.classList.toggle("open");
    document.body.classList.toggle("menu-open");
});

overlay.addEventListener("click", () => {
    sideMenu.classList.remove("open");
    overlay.classList.remove("open");
    document.body.classList.remove("menu-open");
});