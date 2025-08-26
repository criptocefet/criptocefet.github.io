const textMatrixEl = document.getElementById('text-message-1')
const textMatrix2El = document.getElementById('text-message-2')

const numericMatrixEl = document.getElementById('numeric-message-1')

const plainTextInputEl = document.getElementById('plainText')

const keyMatrixEl = document.getElementById('key-matrix-1')

const determinantExpressionEl = document.getElementById('determinant-expression')

const numericEncryptedMatrix1El = document.getElementById('numeric-encrypted-1')
const numericEncryptedMatrix2El = document.getElementById('numeric-encrypted-2')

const textEncryptedMatrix1El = document.getElementById('text-encrypted-1')

const invKeyMatrixEl = document.getElementById('inv-key-matrix')

const encryptingProcessEl = document.getElementById('encrypting-process')
const decryptingProcessEl = document.getElementById('decrypting-process')

const conversionProcess1El = document.getElementById('conversion-process-1')
const conversionText1El = document.createElement('p')
conversionText1El.innerHTML = 'As colunas resultantes são então usadas para montar a matriz numérica cifrada, que é convertida de volta para texto. Está é a mensagem cifrada:'
conversionText1El.id = 'conversion-text-1'

const conversionProcess2El = document.getElementById('conversion-process-2')
const conversionText2El = document.createElement('p')
conversionText2El.innerHTML = 'Ao juntar as colunas resultantes, obtemos a matriz decifrada. Ao convertê-la para texto novamente, recuperamos a mensagem original.'
conversionText2El.id = 'conversion-text-2'

const inputs = document.querySelectorAll('input')

const alphabetMap = new Map()
// Letras de a a z
for (let i = 0; i < 26; i++) {
    const letter = String.fromCharCode(97 + i) // 'a' a 'z'
    alphabetMap.set(letter, i)       // a = 0, b = 1, ..., z = 25
    alphabetMap.set(i, letter)
}
alphabetMap.set(' ', 26)
alphabetMap.set(26, ' ')
alphabetMap.set('.', 27)
alphabetMap.set(27, '.')

const mod = 28 // Tamanho do alfabeto (a-z, espaço, ponto)

function createElementMatrix() {
    let matrixEl = document.createElement('div')
    matrixEl.className = 'matrix'
    return matrixEl
}

function textToLetterMatrix(text) {
    let textMatrix = [[], []]

    // Garante que o texto tenha número par de caracteres
    if (text.length % 2 === 1)
        text += ' '

    for (let i = 0; i < text.length / 2; i++) {
        textMatrix[0][i] = text[i]
        textMatrix[1][i] = text[i + (text.length / 2)]
    }

    return textMatrix
}

function textMatrixToNumericMatrix(letterMatrix) {
    let numericMatrix = [[], []]

    for (let i = 0; i < 2; i++)
        for (let j = 0; j < letterMatrix[0].length; j++)
            numericMatrix[i][j] = alphabetMap.get(letterMatrix[i][j])

    return numericMatrix
}

function numericMatrixToTextMatrix(numericMatrix) {
    let letterMatrix = [[], []];

    for (let i = 0; i < 2; i++)
        for (let j = 0; j < numericMatrix[0].length; j++)
            letterMatrix[i][j] = alphabetMap.get(numericMatrix[i][j]);

    return letterMatrix;
}

function assembleHillEncryption(column, keyMatrix, result) {
    let containerEl = document.createElement('div')
    containerEl.className = 'rel'

    let columnEl = document.createElement('div')
    columnEl.className = 'matrix'
    fillMatrix(columnEl, column)

    let keyEl = document.createElement('div')
    keyEl.className = 'matrix'
    fillMatrix(keyEl, keyMatrix)

    let resultEl = document.createElement('div')
    resultEl.className = 'matrix'
    fillMatrix(resultEl, result)

    let timesSignEl = document.createElement('img')
    timesSignEl.src = '../imgs/cross-small.png'
    timesSignEl.className = 'icon-png'

    let equalSignEl = document.createElement('img')
    equalSignEl.src = '../imgs/equals.png'
    equalSignEl.className = 'icon-png'

    containerEl.appendChild(columnEl)
    containerEl.appendChild(timesSignEl)
    containerEl.appendChild(keyEl)
    containerEl.appendChild(equalSignEl)
    containerEl.appendChild(resultEl)

    return containerEl
}

function applyHillCipher(numericMatrix, keyMatrix) {
    keyMatrix = math.matrix(keyMatrix)
    let outputMatrix = [[], []]

    for (let col = 0; col < numericMatrix[0].length; col++) {
        let column = [
            [numericMatrix[0][col]],
            [numericMatrix[1][col]]
        ]

        let outputColumn = math.multiply(keyMatrix, column).toArray()

        for (let i = 0; i < 2; i++)
            outputColumn[i][0] = math.mod(outputColumn[i][0], 28);

        outputMatrix[0].push(...outputColumn[0]);
        outputMatrix[1].push(...outputColumn[1]);
    }
    return outputMatrix
}

function encrypt(message, keyMatrix) {
    return applyHillCipher(message, keyMatrix)
}

function decrypt(message, inverseKeyMatrix) {
    return applyHillCipher(message, inverseKeyMatrix);
}

function fillMatrix(matrixEl, matrix) {
    matrixEl.innerHTML = '';

    matrix[0].forEach(element => {
        let newCell = document.createElement('input')
        newCell.type = 'text'
        newCell.className = 'cell'
        newCell.style.gridRow = '1'
        newCell.disabled = true
        newCell.value = element

        matrixEl.appendChild(newCell)
    });

    matrix[1].forEach(element => {
        let newCell = document.createElement('input')
        newCell.type = 'text'
        newCell.className = 'cell'
        newCell.disabled = true
        newCell.style.gridRow = '2'
        newCell.value = element

        matrixEl.appendChild(newCell)
    });
}

function getMatrixFromElement(matrixEl) {
    let matrix = [[], []];
    for (let i = 0; i < 2; i++)
        for (let j = 0; j < 2; j++)
            matrix[i][j] = matrixEl.children[i * 2 + j].value
    return matrix;
}

function clearMatrix(matrixEl) {
    matrixEl.innerHTML = '';
}

function checkCoprimeNumbers(a, b) {
    while (b !== 0) {
        rest = a % b;
        a = b;
        b = rest;
    }
    return a === 1
}

function findMissingKeyElement(a, b, c) {
    let aInv = math.invmod(a, mod)
    let d = math.mod((b * c + 1) * aInv, mod)
    return d
}

function completeKey(keyMatrixEl, d) {
    // key = [a b]
    //       [c d]
    let a = keyMatrixEl.children[0].value
    let b = keyMatrixEl.children[1].value
    let c = keyMatrixEl.children[2].value

    d = findMissingKeyElement(a, b, c)

    keyMatrixEl.children[3].value = d
}

function assembleDeterminantExpressionLatex(matrix) {
    let a = matrix[0][0]
    let b = matrix[0][1]
    let c = matrix[1][0]
    let d = matrix[1][1]

    let determinant = math.det(matrix)

    return `Cálculo do determinante: \\[(${a} \\times ${d}) - (${b} \\times ${c}) = ${determinant}\\]`
}

function clearAllMatrixes() {
    clearMatrix(textMatrixEl)
    clearMatrix(numericMatrixEl)
    clearMatrix(plainTextInputEl)
    clearMatrix(invKeyMatrixEl)
}

function cleanAllProcesses() {
    // clearing previous content
    encryptingProcessEl.innerHTML = ''
    conversionProcess1El.innerHTML = ''
    decryptingProcessEl.innerHTML = ''
    conversionProcess2El.innerHTML = ''
    clearAllMatrixes()

    // checking if any of the key matrix inputs are empty, in which case the function returns and does not proceed with the encryption/decryption process
    for (let i = 0; i < 3; i++)
        if (keyMatrixEl.children[i].value === '') {
            keyMatrixEl.children[3].value = ''
            return
        }

    // removing previous conversion texts, which are situated outside the interactive content divs that contain conversionProcess1El and conversionProcess2El
    let pEl
    pEl = document.getElementById('conversion-text-1')
    if (pEl) pEl.remove()
    pEl = document.getElementById('conversion-text-2')
    if (pEl) pEl.remove()
}

function fillInteractiveContent() {
    cleanAllProcesses()
    // first step - ecrypting
    if (!checkCoprimeNumbers(keyMatrixEl.children[0].value, mod))
        return

    completeKey(keyMatrixEl)
    if (plainTextInputEl.value == '') return

    determinantExpressionEl.innerHTML = assembleDeterminantExpressionLatex(getMatrixFromElement(keyMatrixEl))
    MathJax.typesetPromise([determinantExpressionEl]);

    let plainText = plainTextInputEl.value
    plainText = plainText.toLowerCase()
    let textMatrix = textToLetterMatrix(plainText)

    // second step - ecrypting
    let numericMatrix = textMatrixToNumericMatrix(textMatrix)

    fillMatrix(textMatrixEl, textMatrix)
    fillMatrix(numericMatrixEl, numericMatrix)

    // third step - ecrypting
    let keyMatrix = getMatrixFromElement(keyMatrixEl)

    for (let i = 0; i < numericMatrix[0].length; i++) {
        let column = [
            [numericMatrix[0][i]],
            [numericMatrix[1][i]]
        ]
        let result = applyHillCipher(column, keyMatrix)
        encryptingProcessEl.appendChild(assembleHillEncryption(column, keyMatrix, result))
    }

    // filler line
    encryptingProcessEl.appendChild(document.createElement('br'))

    // converting the result to text
    let encryptedNumericMatrix = applyHillCipher(numericMatrix, keyMatrix)
    let encryptedTextMatrix = numericMatrixToTextMatrix(encryptedNumericMatrix)

    let encryptedNumericMatrixEl = createElementMatrix()
    fillMatrix(encryptedNumericMatrixEl, encryptedNumericMatrix)
    let encryptedTextMatrixEl = createElementMatrix()
    fillMatrix(encryptedTextMatrixEl, encryptedTextMatrix)

    let arrowSignEl = document.createElement('img')
    arrowSignEl.src = '../imgs/arrow-right.png'
    arrowSignEl.className = 'icon-png'

    conversionProcess1El.appendChild(encryptedNumericMatrixEl)
    conversionProcess1El.appendChild(arrowSignEl)
    conversionProcess1El.appendChild(encryptedTextMatrixEl)

    conversionProcess1El.parentNode.insertBefore(conversionText1El, conversionProcess1El)

    let textEncryptedMatrix = numericMatrixToTextMatrix(encryptedNumericMatrix)

    //first step - decrypting - calculating inverse key matrix
    let invKeyMatrix = math.inv(keyMatrix)
    fillMatrix(invKeyMatrixEl, invKeyMatrix)

    //second step - decrypting - decrypting the message
    for (let i = 0; i < encryptedNumericMatrix[0].length; i++) {
        let column = [
            [encryptedNumericMatrix[0][i]],
            [encryptedNumericMatrix[1][i]]
        ]
        let result = applyHillCipher(column, invKeyMatrix)
        decryptingProcessEl.appendChild(assembleHillEncryption(column, invKeyMatrix, result))
    }

    // converting the result to text
    let numericDecryptedMatrix = decrypt(encryptedNumericMatrix, invKeyMatrix)
    let numericDecryptedMatrixEl = createElementMatrix()
    fillMatrix(numericDecryptedMatrixEl, numericDecryptedMatrix)

    conversionProcess2El.parentNode.insertBefore(conversionText2El, conversionProcess2El)
    conversionProcess2El.appendChild(numericDecryptedMatrixEl)
    conversionProcess2El.appendChild(arrowSignEl.cloneNode())
    conversionProcess2El.appendChild(textMatrixEl.cloneNode(true))
}

inputs.forEach(input => {
    input.addEventListener('input', () => {
        fillInteractiveContent()
    });
});

fillInteractiveContent()