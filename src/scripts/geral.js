const containers = document.querySelectorAll(".container");

let tema = window.matchMedia('(prefers-color-scheme: dark)').matches
  ? "tema-escuro"
  : "tema-claro";

containers.forEach(container => {
  container.classList.add(tema);
});

const dropdown = document.querySelectorAll(".dropdown-btn");

dropdown.forEach((btn) => {
  btn.addEventListener("click", () => {
    const content = btn.nextElementSibling;
    if (content.style.display === "block") {
      content.style.display = "none";
    } else {
      content.style.display = "block";
    }
    btn.children[0].classList.toggle('flipped');
  });
});