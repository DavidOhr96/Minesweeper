'use strict'
//Variables
var gBoard = []
var gcounter = 0
var cell = {
    isMine: false,
    negMines: 0,
    isrevealed: false,
    isMarked: false,
}
var gLevel = [{
    difficulty: 'easy',
    SIZE: 4,
    MINES: 2,
},
{
    difficulty: 'medium',
    SIZE: 8,
    MINES: 14,
},
{
    difficulty: 'hard',
    SIZE: 12,
    MINES: 32,
},
]
var gGame = {
    isOn: true,
    isWin: true,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0,

}
var gFreeCellCounter = 0
var mines = []
const MINE = '💩'
const COVERED = ''
const CLEAR = ' ✔'
const FLAG = '🌹'
//Functions
function onInit(level) {
    gLevel = [{
        difficulty: 'easy',
        SIZE: 4,
        MINES: 2,
    },
    {
        difficulty: 'medium',
        SIZE: 8,
        MINES: 14,
    },
    {
        difficulty: 'hard',
        SIZE: 12,
        MINES: 32,
    },
    ]
    cell = {
        isMine: false,
        negMines: 0,
        isrevealed: false,
        isMarked: false,
    }
    gGame = {
        isOn: true,
        isWin: true,
        shownCount: 0,
        markedCount: 0,
        secsPassed: 0,

    }
    gLevel = gLevel[level]
    gFreeCellCounter = 0
    gBoard = createBoard(gLevel)
    renderBoard(gBoard)
    setMines()
    document.querySelector('.modal').style.display = 'none'
    document.querySelector('.main-icon').innerText = '😊'




}
function createBoard(gLevel) {
    var rowCount = gLevel.SIZE
    var colCount = gLevel.SIZE
    var board = []
    for (var i = 0; i < rowCount; i++) {
        board[i] = []
        for (var j = 0; j < colCount; j++) {
            board[i][j] = { ...cell }
            gFreeCellCounter++
        }
    }
    return board
}
function renderBoard(mat, selector) {

    var strHTML = '<table ><tbody>'
    for (var i = 0; i < mat.length; i++) {

        strHTML += '<tr>'
        for (var j = 0; j < mat[0].length; j++) {

            const cell = mat[i][j]
            const className = `cell cell-${i}-${j}`
            var icon = ''
            icon = COVERED
            var tdId = `cell-${i}-${j}`

            strHTML += `<td id="${tdId}"   onclick="revealCell(this)" oncontextmenu="setFlag(this)" 
             class="${className}">${icon}</td>`
        }
        strHTML += '</tr>'
    }
    strHTML += '</tbody></table>'

    const elContainer = document.querySelector(".mine-fild")
    elContainer.innerHTML = strHTML
}
function setMines() {
    var locations = []
    for (var i = 0; i < gLevel.MINES; i++)
        locations.push(getEmptyLocation(gBoard))

    for (var idx = 0; idx < locations.length; idx++) {
        console.log('hey')
        var rowIdx = locations[idx].i
        var colIdx = locations[idx].j
        gBoard[rowIdx][colIdx].isMine = true
        gFreeCellCounter--
    }
}

function getMineNegsCount(elCell) {
    var gGamerPos = getCellCoord(elCell.id)
    console.log(gGamerPos)
    var negsCount = 0;
    for (var i = gGamerPos.i - 1; i <= gGamerPos.i + 1; i++) {
        if (i < 0 || i >= gBoard.length) continue;
        for (var j = gGamerPos.j - 1; j <= gGamerPos.j + 1; j++) {
            if (j < 0 || j >= gBoard[i].length) continue;
            if (i === gGamerPos.i && j === gGamerPos.j) continue;
            var currCell = gBoard[i][j]
            if (currCell.isMine === true) negsCount++;
        }

    }
    console.log(gBoard[gGamerPos.i][gGamerPos.j].negMines)
    gBoard[gGamerPos.i][gGamerPos.j].negMines = negsCount
    console.log(gBoard[gGamerPos.i][gGamerPos.j].negMines)
    // var elNgsCount = document.querySelector('div .mine-fild')
    // elNgsCount.innerText = negsCount

}
function getCellCoord(strCellId) {
    var coord = {}
    console.log(strCellId)
    var parts = strCellId.split('-') // ['cell','2','3']
    coord.i = +parts[1]
    coord.j = +parts[2]
    return coord // {i:2,j:3}
}
function revealCell(elCell) {
    if (!gGame.isOn) return
    var location = getCellCoord(elCell.id)
    var cell = gBoard[location.i][location.j]
    if (cell.isMarked) return

    if (cell.isMine) {
        gGame.isWin = false
        gameOver()
    }
    else {
        getMineNegsCount(elCell)
        gGame.shownCount++
        if (gGame.shownCount === gFreeCellCounter) gameOver()
    }
    var value = (cell.isMine) ? MINE : gBoard[location.i][location.j].negMines
    renderCell(location, value)


}
function renderCell(location, value) {
    console.log('hey')
    const elCell = document.querySelector(`.cell-${location.i}-${location.j}`)

    elCell.innerText = value
}
function getEmptyLocation(board) {
    var emptyLocations = []
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            if (!board[i][j].isMine) {
                emptyLocations.push({ i, j })

            }
        }
    }
    if (!emptyLocations.length) return null
    var randIdx = getRandomIntInclusive(0, emptyLocations.length - 1)
    return emptyLocations[randIdx]
}
function getRandomIntInclusive(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min
}
function setFlag(elCell) {

    document.addEventListener('contextmenu', event => event.preventDefault());
    if (!gGame.isOn) return
    var location = getCellCoord(elCell.id)
    var isMarked = gBoard[location.i][location.j].isMarked

    var value = (isMarked) ? COVERED : FLAG
    gBoard[location.i][location.j].isMarked = (isMarked) ? false : true

    renderCell(location, value)
    console.log(elCell)
}
function gameOver() {
    gGame.isOn = false
    var modal = document.querySelector('.modal')
    modal.style.display = 'block'
    var elIcon = document.querySelector('.main-icon')
    if (gGame.isWin) {
        modal.innerText = 'congratulations! you win! paly again on the smily face'
        elIcon.innerText = '😎'
    }
    else {
        modal.innerText = 'You lose restart on smily face'
        elIcon.innerText = '🤯'
    }

    // elIcon.innerText = (gGame.isWin) ? '😎' : '🤯'


}
console.log(gLevel)
//script
// gBoard = createBoard()
// setMines()
// renderBoard(gBoard)

