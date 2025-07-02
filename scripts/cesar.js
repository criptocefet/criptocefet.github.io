const chaveEl = document.getElementById('chave')
const alfabetoEl = document.getElementById('alfabeto')
const alfabetoCifradoEl = document.getElementById('alfabeto-cifrado')
const inputs = document.querySelectorAll('input')
const modoEl = document.getElementById('modo')
const mensagemEl = document.getElementById('mensagem')
const textoCifradoEl = document.getElementById('texto-cifrado')

function preencherConjuntoLetras(elementoEl, primeiraLetra) {
  elementoEl.innerHTML = ''

  let c = primeiraLetra.charCodeAt(0)

  for (let i = 0; i < 26; i++) {
    let cell = document.createElement('input')
    cell.type = 'text'
    cell.disabled = true
    cell.classList.add('cell')
    cell.value = String.fromCharCode((c + i - 65) % 26 + 65)
    elementoEl.appendChild(cell)
  }
}

function encrypt(key, textoOriginal) {
  if (key == 0 || isNaN(key)) return textoOriginal
  let textoCifrado = ""
  for (let i = 0; i < textoOriginal.length; i++) {
    let c = textoOriginal[i]
    if (c >= 'a' && c <= 'z') {
      c = String.fromCharCode((c.charCodeAt(0) - 97 + key) % 26 + 97)
    } else if (c >= 'A' && c <= 'Z') {
      c = String.fromCharCode((c.charCodeAt(0) - 65 + key) % 26 + 65)
    }
    textoCifrado += c
  }
  return textoCifrado
}

function decryptC(key, textoCifrado) {
  if (key == 0 || isNaN(key)) return textoCifrado
  let textoDecodificado = ""
  for (let i = 0; i < textoCifrado.length; i++) {
    let c = textoCifrado[i]
    if (c >= 'a' && c <= 'z') {
      c = String.fromCharCode((c.charCodeAt(0) - 97 - key + 26) % 26 + 97)
    } else if (c >= 'A' && c <= 'Z') {
      c = String.fromCharCode((c.charCodeAt(0) - 65 - key + 26) % 26 + 65)
    }
    textoDecodificado += c
  }
  return textoDecodificado
}

function trocarModo() {
  if (modoEl.checked) {
    // Modo: Decifrar
    mensagemEl.disabled = true;
    mensagemEl.placeholder = 'Texto decodificado';
    
    textoCifradoEl.disabled = false;
    textoCifradoEl.placeholder = 'Digite aqui o texto cifrado';
  } else {
    // Modo: Cifrar
    mensagemEl.disabled = false;
    mensagemEl.placeholder = 'Digite sua mensagem';

    textoCifradoEl.disabled = true;
    textoCifradoEl.placeholder = 'Texto cifrado';
  }
}

function atualizarConteudoInterativo() {
  if (chaveEl.value != '') chaveEl.nextElementSibling.classList.add('show')
  if (chaveEl.value === '') chaveEl.nextElementSibling.classList.remove('show')

  let chave = chaveEl.value

  let c = encrypt(chave, 'A') // c é a primeira letra do alfabeto cifrado

  preencherConjuntoLetras(alfabetoCifradoEl, c)

  if (modoEl.checked)
      mensagemEl.value = decryptC(chave, textoCifradoEl.value)
  else 
      textoCifradoEl.value = encrypt(chave, mensagemEl.value)
}

modoEl.addEventListener('change', () => {
  trocarModo()
})

inputs.forEach(input => {
  input.addEventListener('input', () => {
    atualizarConteudoInterativo()
  });
});

preencherConjuntoLetras(alfabetoEl, "A")