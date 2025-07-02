const nEl = document.getElementById('n')
const primeListEl = document.getElementById('prime-list')
const operationsEl = document.getElementById('operations')

function listPrimes(n) {
    let resultList = []
    let primes = new Array(n + 1).fill(true);
    primes[0] = primes[1] = false

    for (let i = 2; i * i <= n; i++)
        if (primes[i])
            for (let j = i * i; j <= n; j += i)
                primes[j] = false

    for (let i = 2; i <= n; i++)
        if (primes[i]) resultList.push(i)

    return resultList
}

function testDivisibilityLaTex(n, divisor) {
    const q = Math.trunc(n / divisor);
    const r = n % divisor;
    const divisivel = r === 0 
        ? `${n}\\text{ é divisível por }${divisor}` 
        : `${n}\\text{ não é divisível por }${divisor}`;
    
    // Atenção: não colocar espaços extras ou caracteres invisíveis aqui
    const latex = `${n}\\div ${divisor} = ${q}\\text{ com resto }${r}\\quad (${divisivel})`;
    return `\\(${latex}\\)`; // conteúdo em LaTeX inline
}

function isPrime(n) {
  if (n <= 1) return false;
  if (n === 2) return true;
  if (n % 2 === 0) return false;

  const raiz = Math.floor(Math.sqrt(n));
  for (let i = 3; i <= raiz; i += 2) {
    if (n % i === 0) return false;
  }

  return true;
}

function testDivisibility(n, divisor) {
    let q = Math.trunc(n / divisor)
    let r = n % divisor
    let divisibilityIcon
    let d

    if (r != 0) {
        d = n + " não é divisível por " + divisor
        divisibilityIcon = '<i class="fi fi-rs-cross no-icon"></i>'
    }
    else {
        d = n + " é divisível por " + divisor
        divisibilityIcon = '<i class="fi fi-rs-check yes-icon"></i>'
    }

    

    return divisibilityIcon + ' ' + n + " : " + divisor + " = " + q + " com resto " + r + " (" + d + ")"
}

function fillInteractiveContent () {
    operationsEl.innerHTML = ''
    primeListEl.innerHTML = ''
    if (nEl.value == '') return

    let n = parseInt(nEl.value)

    let primeList = listPrimes(Math.floor(Math.sqrt(n)))

    if (primeList.length === 0) primeListEl.innerHTML = "Não há números primos entre 1 e " + n
    else primeListEl.innerHTML = primeList.join(' ')

    operationsEl.innerHTML = '';
    primeList.forEach((prime) => {
        let operationEl = document.createElement('p')
        operationEl.innerHTML = testDivisibility(n, prime)
        operationsEl.appendChild(operationEl)
    })

    let isPrimeEl = document.createElement('p')
    isPrimeEl.classList.add('align-center')

    if(isPrime(n)) isPrimeEl.textContent = n + " é primo"
    else isPrimeEl.textContent = n + " não é primo"

    operationsEl.appendChild(isPrimeEl)
}

nEl.addEventListener('input', () => {
    fillInteractiveContent()
});