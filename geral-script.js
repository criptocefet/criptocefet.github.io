const containers = document.querySelectorAll(".container");

let tema = window.matchMedia('(prefers-color-scheme: dark)').matches
  ? "tema-escuro"
  : "tema-claro";

containers.forEach(container => {
  container.classList.add(tema);
});