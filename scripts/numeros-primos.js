const nEl = document.getElementById('n')
const primeListEl = document.getElementById('prime-list')
const operationsEl = document.getElementById('operations')
const isPrimeEl = document.getElementById('is-prime')

// Maior número que exibe todos os testes
const range1 = 1053
// Maior número n que exibe a lista de primos até raiz de n
const range2 = 999999
// JS erra por 1
const range3 = 10000000000000000

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

function isEven(n) {
    if (n % 2 == 0)
        return true 
}

function isPrime(n) {
    if (n <= 1) return false
    if (n === 2) return true
    if (n % 2 === 0) return false

    const raiz = Math.floor(Math.sqrt(n))
    for (let i = 3; i <= raiz; i += 2) {
        if (n % i === 0) return false
    }

    return true
}

function completeDivisibilityTest(n, divisor) {
    let q = Math.trunc(n / divisor)
    let r = n % divisor
    let divisibilityIcon
    let d

    if (r != 0) {
        d = n + " não é divisível por " + divisor
        divisibilityIcon = '<i class="fi fi-rs-cross no-icon"></i>'
        return divisibilityIcon + ' ' + n + " : " + divisor + " = " + q + " com resto " + r + " (" + d + ")"
    }
    else {
        d = n + " é divisível por " + divisor
        divisibilityIcon = '<i class="fi fi-rs-check yes-icon"></i>'
    }

    return divisibilityIcon + ' ' + n + " : " + divisor + " = " + q + " com resto " + r + " (" + d + ")"
}

function minorDivisibilityTest(n, divisor) {
    let q = Math.trunc(n / divisor)
    let r = n % divisor
    let divisibilityIcon
    let d

    if (r != 0) {
        return ""
    }
    else {
        d = n + " é divisível por " + divisor
        divisibilityIcon = '<i class="fi fi-rs-check yes-icon"></i>'
    }

    return divisibilityIcon + ' ' + n + " : " + divisor + " = " + q + " com resto " + r + " (" + d + ")"
}

function fillInteractiveContent() {
    operationsEl.innerHTML = ''
    primeListEl.innerHTML = ''
    isPrimeEl.innerHTML = ''
    if (nEl.value == '') return

    let n = parseInt(nEl.value)
    if (n >= range3) {
        isPrimeEl.innerHTML = 'Insira um número menor que \\(10^{16}\\)'
        MathJax.typesetPromise([isPrimeEl]);
        return
    }

    if (isEven(n) && n > 2) {
        isPrimeEl.textContent = n + " não é primo, pois é par"
        return
    }

    let primeList = listPrimes(Math.floor(Math.sqrt(n)))

    if (primeList.length > 0 && n < range2)
        primeListEl.innerHTML = "Lista de divisores que vamos testar: " + primeList.join(', ')

    operationsEl.innerHTML = ''
    if (n < range1) {
        primeList.forEach((prime) => {
            let operationEl = document.createElement('p')
            operationEl.innerHTML = completeDivisibilityTest(n, prime)
            if (operationEl.innerHTML != "")
                operationsEl.appendChild(operationEl)
        })
    } else if (n < range2) {
        primeList.forEach((prime) => {
            let operationEl = document.createElement('p')
            operationEl.innerHTML = minorDivisibilityTest(n, prime)
            if (operationEl.innerHTML != "")
                operationsEl.appendChild(operationEl)
        })
    }

    if (isPrime(n)) isPrimeEl.textContent = n + " é primo"
    else isPrimeEl.textContent = n + " não é primo"
}

nEl.addEventListener('input', () => {
    fillInteractiveContent()
});