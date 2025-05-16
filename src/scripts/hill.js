const textMatrix1El = document.getElementById('text-message-1')
const numericMatrix1El = document.getElementById('numeric-message-1')
const numericMatrix2El = document.getElementById('numeric-message-2')
const plainTextInputEl = document.getElementById('plainText')
const keyMatrix1El = document.getElementById('key-matrix-1')
const keyMatrix2El = document.getElementById('key-matrix-2')
const numericEncryptedMatrixEl = document.getElementById('numeric-encrypted-1')

const alphabetMap = new Map()
// Letras de a a z
for (let i = 0; i < 26; i++) {
    const letter = String.fromCharCode(97 + i) // 'a' a 'z'
    const number = i + 1
    alphabetMap.set(letter, number)
    alphabetMap.set(number, letter)
}
// Espaço
alphabetMap.set(' ', 27)
alphabetMap.set(27, ' ')
// Ponto final
alphabetMap.set('.', 28)
alphabetMap.set(28, '.')

function textToLetterMatrix(text) {
    let textMatrix = [[], []]

    // Garante que o texto tenha número par de caracteres
    if (text.length % 2 === 1)
        text += ' '

    if ((text.length / 2) % 2 === 1) {
        text += '  '
    }

    for (let i = 0; i < text.length / 2; i++) {
        textMatrix[0][i] = text[i]
        textMatrix[1][i] = text[i + (text.length / 2)]
    }

    return textMatrix
}

function letterMatrixTonumericMatrix(letterMatrix) {
    let numericMatrix = [[], []]

    for (let i = 0; i < 2; i++)
        for (let j = 0; j < letterMatrix[0].length; j++)
            numericMatrix[i][j] = alphabetMap.get(letterMatrix[i][j])

    return numericMatrix
}

function encrypt(numericMatrix, keyMatrix) {
    keyMatrix = math.matrix(keyMatrix)
    let encryptedMatrix = [[], []]

    for (let col = 0; col < numericMatrix[0].length; col += 2) {
        let block = [
            [numericMatrix[0][col], numericMatrix[0][col + 1]],
            [numericMatrix[1][col], numericMatrix[1][col + 1]]
        ]

        let encryptedBlock = math.multiply(keyMatrix, block).toArray()

        for (let i = 0; i < 2; i++)
            for (let j = 0; j < 2; j++)
                encryptedBlock[i][j] = math.mod(encryptedBlock[i][j], 28);
        
        encryptedMatrix[0].push(...encryptedBlock[0]);
        encryptedMatrix[1].push(...encryptedBlock[1]);
    }
    console.log(encryptedMatrix)
    return encryptedMatrix
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
            const index = i * 2 + j;
            const element = parseFloat(keyMatrixEl.children[index].value);
            matrix[i][j] = isNaN(element) ? 0 : element;
        }
    }
    return matrix;
}

function fillInteractiveContent() {
    let plainText = plainTextInputEl.value
    let textMatrix = textToLetterMatrix(plainText)

    // second step
    let numericMatrix = letterMatrixTonumericMatrix(textMatrix)

    fillMatrix(textMatrix1El, textMatrix)
    fillMatrix(numericMatrix1El, numericMatrix)

    // first step
    completeKey(keyMatrix1El, numericMatrix)


    // third step
    let keyMatrix = getKeyMatrix(keyMatrix1El)
    fillMatrix(numericMatrix2El, numericMatrix)
    fillMatrix(keyMatrix2El, keyMatrix)
    let numericEncryptedMatrix = encrypt(numericMatrix, keyMatrix)
    fillMatrix(numericEncryptedMatrixEl, numericEncryptedMatrix)
}

fillInteractiveContent()