const containers = document.querySelectorAll(".container");
/*
let tema = window.matchMedia('(prefers-color-scheme: dark)').matches
  ? "tema-escuro"
  : "tema-claro";
*/
let tema = 'tema-claro'
containers.forEach(container => {
  container.classList.add(tema);
});

const dropdown = document.querySelectorAll(".dropdown-btn");

dropdown.forEach((btn) => {
  btn.addEventListener("click", () => {
    const content = btn.nextElementSibling;
    content.classList.toggle("show");

    btn.lastElementChild.classList.toggle("flipped");
  });
});
