const menuIcon = document.getElementById("menu-icon");
const navMenu = document.getElementById("nav-menu");
const closeMenu = document.getElementById("close-btn");

menuIcon.addEventListener("click", (event) => {
  event.stopPropagation();
  navMenu.classList.toggle("active");
  navMenu.classList.toggle("hidden");
});

document.addEventListener("click", (event) => {
  if (!navMenu.contains(event.target) && !menuIcon.contains(event.target)) {
    navMenu.classList.remove("active");
    navMenu.classList.add("hidden");
  }
});

closeMenu.addEventListener("click", (event) => {
  navMenu.classList.remove("active");
  navMenu.classList.add("hidden");
});
