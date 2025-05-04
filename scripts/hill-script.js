const charMatrix1El = document.getElementById('mc1')
const numberMatrix1El = document.getElementById('mn1')
const plainTextInputEl = document.getElementById('plainText')

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

function texttoLetterMatrix(text) {
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
            cipherMatrix[i][j] = math.mod(cipherMatrix[i][j], 27)
    return cipherMatrix
}

function fillMatrix(matrixEl, matrix) {
    matrixEl.innerHTML = ''

    if(matrix[0].length === 0) {
        matrixEl.innerHTML = ''
        return
    }

    let row1 = ''
    let row2 = ''

    for(let j = 0; j < (matrix[0].length - 1); j++) {
        row1 += matrix[0][j]
        row2 += matrix[1][j]
        row1 += ', '
        row2 += ', '
    }
    row1 += matrix[0][(matrix[0].length - 1)]
    row2 += matrix[1][(matrix[0].length - 1)]
    matrixEl.innerHTML = row1 + '<br>' + row2
}

const A = [
    [4, 2],
    [3, 4]
];
const Key = math.matrix([
    [4, 5],
    [7, 9]
  ]);  

const resultado = encrypt(A, Key);
console.log(resultado);

function fillInteractiveContent() {
    
    fillMatrix(charMatrix1El, charMatrix)
    fillMatrix(numberMatrix1El, numberMatrix)
} 