const textMatrix1El = document.getElementById('text-message-1')
const textMatrix2El = document.getElementById('text-message-2')

const numericMatrix1El = document.getElementById('numeric-message-1')
const numericMatrix2El = document.getElementById('numeric-message-2')
const numericMatrix3El = document.getElementById('numeric-message-3')

const plainTextInputEl = document.getElementById('plainText')

const keyMatrix1El = document.getElementById('key-matrix-1')
const keyMatrix2El = document.getElementById('key-matrix-2')

const numericEncryptedMatrix1El = document.getElementById('numeric-encrypted-1')
const numericEncryptedMatrix2El = document.getElementById('numeric-encrypted-2')

const textEncryptedMatrix1El = document.getElementById('text-encrypted-1')

const invKeyMatrix1El = document.getElementById('inv-key-matrix-1')
const invKeyMatrix2El = document.getElementById('inv-key-matrix-2')

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


function applyHillCipher(numericMatrix, keyMatrix) {
    keyMatrix = math.matrix(keyMatrix)
    let outputMatrix = [[], []]

    for (let col = 0; col < numericMatrix[0].length; col++) {
        let block = [
            [numericMatrix[0][col]],
            [numericMatrix[1][col]]
        ]

        let outputBlock = math.multiply(keyMatrix, block).toArray()

        for (let i = 0; i < 2; i++)
                outputBlock[i][0] = math.mod(outputBlock[i][0], 28);
        
        outputMatrix[0].push(...outputBlock[0]);
        outputMatrix[1].push(...outputBlock[1]);
    }
    console.log(outputMatrix)
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

function clearMatrix(matrixEl) {
    matrixEl.innerHTML = '';
}

function completeKey(keyMatrixEl) {
    // key = [a b]
    //       [c d]
    let a = keyMatrixEl.children[0].value
    let b = keyMatrixEl.children[1].value
    let c = keyMatrixEl.children[2].value

    let mod = 28

    let aInv = math.invmod(a, mod)

    d = math.mod((b * c + 1) * aInv, mod)

    keyMatrixEl.children[3].value = d
}

function getKeyMatrix(keyMatrixEl) {
    let matrix = [[], []]; // 2x2 matrix
    for (let i = 0; i < 2; i++) {
        for (let j = 0; j < 2; j++) {
            const index = i * 2 + j
            const element = parseFloat(keyMatrixEl.children[index].value)
            matrix[i][j] = isNaN(element) ? 0 : element
        }
    }
    return matrix;
}

function clearAllMatrixes() {
    clearMatrix(document.getElementById('text-message-1'))
    clearMatrix(document.getElementById('text-message-2'))

    clearMatrix(document.getElementById('numeric-message-1'))
    clearMatrix(document.getElementById('numeric-message-2'))
    clearMatrix(document.getElementById('numeric-message-3'))

    clearMatrix(document.getElementById('plainText'))

    clearMatrix(document.getElementById('key-matrix-2'))

    clearMatrix(document.getElementById('numeric-encrypted-1'))
    clearMatrix(document.getElementById('numeric-encrypted-2'))

    clearMatrix(document.getElementById('text-encrypted-1'))

    clearMatrix(document.getElementById('inv-key-matrix-1'))
    clearMatrix(document.getElementById('inv-key-matrix-2'))
}

function fillInteractiveContent() {
    clearAllMatrixes()

    for (let i = 0; i < 3; i++)
        if (keyMatrix1El.children[i].value === '') {
            keyMatrix1El.children[3].value = ''
            return
        }

    // first step - ecrypting
    completeKey(keyMatrix1El)

    if (plainTextInputEl.value == '') return

    let plainText = plainTextInputEl.value
    plainText = plainText.toLowerCase()
    let textMatrix = textToLetterMatrix(plainText)

    // second step - ecrypting
    let numericMatrix = textMatrixToNumericMatrix(textMatrix)

    fillMatrix(textMatrix1El, textMatrix)
    fillMatrix(numericMatrix1El, numericMatrix)

    // third step - ecrypting
    let keyMatrix = getKeyMatrix(keyMatrix1El)
    fillMatrix(numericMatrix2El, numericMatrix)
    fillMatrix(keyMatrix2El, keyMatrix)
    let numericEncryptedMatrix = encrypt(numericMatrix, keyMatrix)
    fillMatrix(numericEncryptedMatrix1El, numericEncryptedMatrix)
    let textEncryptedMatrix = numericMatrixToTextMatrix(numericEncryptedMatrix)
    fillMatrix(textEncryptedMatrix1El, textEncryptedMatrix)

    //first step - decrypting
    let invKeyMatrix = math.inv(keyMatrix)
    fillMatrix(invKeyMatrix1El, invKeyMatrix)

    //second step - decrypting
    let numericDecryptedMatrix = decrypt(numericEncryptedMatrix, invKeyMatrix)
    fillMatrix(numericEncryptedMatrix2El, numericEncryptedMatrix)
    fillMatrix(invKeyMatrix2El, invKeyMatrix)
    fillMatrix(numericMatrix3El, numericDecryptedMatrix)
    fillMatrix(textMatrix2El, numericMatrixToTextMatrix(numericDecryptedMatrix))
}

inputs.forEach(input => {
  input.addEventListener('input', () => {
    fillInteractiveContent()
  });
});