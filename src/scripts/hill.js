const charMatrix1El = document.getElementById('mc1')
const numberMatrix1El = document.getElementById('mn1')
const plainTextInputEl = document.getElementById('plainText')
const keyMatrixEl = document.getElementById('key-matrix')

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
    let charMatrix = [[], []]

    if (text.length % 2 == 1)
        text += ' '

    for(let i = 0; i < text.length / 2; i++) {
        charMatrix[0][i] = text[i]
        charMatrix[1][i] = text[i+(text.length/2)]
    }

    return charMatrix
}

function letterMatrixToNumberMatrix(letterMatrix) {
    let numberMatrix = [[], []]

    for (let i = 0; i < 2; i++)
        for (let j = 0; j < letterMatrix[0].length; j++)
            numberMatrix[i][j] = alphabetMap.get(letterMatrix[i][j])
    
    return numberMatrix
}

function encrypt(numberMatrix, keyMatrix) {
    let cipherMatrix = math.multiply(numberMatrix, keyMatrix).toArray()
    
    for (let i = 0; i < cipherMatrix.length; i++)
        for (let j = 0; j < cipherMatrix[0].length; j++)
            cipherMatrix[i][j] = math.mod(cipherMatrix[i][j], 28)
    return cipherMatrix
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

function fillInteractiveContent() {
    let plainText = plainTextInputEl.value
    let charMatrix = textToLetterMatrix(plainText)

    let numberMatrix = letterMatrixToNumberMatrix(charMatrix)

    fillMatrix(charMatrix1El, charMatrix)
    fillMatrix(numberMatrix1El, numberMatrix)

    //second step
    completeKey(keyMatrixEl)
}

fillInteractiveContent()