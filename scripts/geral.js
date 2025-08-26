// Aplica temas dinamicamente, adicionando classes às divs com a classe "container"
const containers = document.querySelectorAll(".container");
/* O tema é definido com base na preferência do usuário
let tema = window.matchMedia('(prefers-color-scheme: dark)').matches
  ? "tema-escuro"
  : "tema-claro";
*/
let tema = 'tema-claro'
containers.forEach(container => {
  container.classList.add(tema);
});

// Botões de dropdown
// Adiciona a classe "show" ao conteúdo do dropdown quando o botão é clicado
// Também inverte a seta do botão ao alterar a classe flipped
const dropdown = document.querySelectorAll(".dropdown-btn");

dropdown.forEach((btn) => {
  btn.addEventListener("click", () => {
    const content = btn.nextElementSibling;
    content.classList.toggle("show");

    btn.lastElementChild.classList.toggle("flipped");
  });
});

// Botão de download para baixar o conteúdo da página como pdf
const downloadButton = document.getElementById("download-button");
if (downloadButton) {
  downloadButton.addEventListener("click", () => {
    window.print()
  }
)}