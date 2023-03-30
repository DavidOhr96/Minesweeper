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
var gLevel = {
    SIZE: 4,
    MINES: 2,
}
var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0,
}
var mines = []
const MINE = '💩'
const COVERED = '❓'
const CLEAR = ' '
//Functions
function createBoard() {
    var rowCount = 4
    var colCount = 4
    var board = []
    for (var i = 0; i < rowCount; i++) {
        board[i] = []
        for (var j = 0; j < colCount; j++) {
            board[i][j] = { ...cell }
        }
    }
    return board
}
function renderBoard(mat, selector) {

    var strHTML = '<table border="0"><tbody>'
    for (var i = 0; i < mat.length; i++) {

        strHTML += '<tr>'
        for (var j = 0; j < mat[0].length; j++) {

            const cell = mat[i][j]
            const className = `cell cell-${i}-${j}`
            var icon = ''
            icon = COVERED
            var tdId = `cell-${i}-${j}`

            strHTML += `<td id="${tdId}"   onclick="revealCell(this)" class="${className}">${icon}</td>`
        }
        strHTML += '</tr>'
    }
    strHTML += '</tbody></table>'

    const elContainer = document.querySelector(".mine-fild")
    elContainer.innerHTML = strHTML
}
function setMines() {
    var locations =[]
    locations.push(getEmptyLocation(gBoard)) 
    console.log(locations)
    for (var idx = 0; idx < locations.length; idx++) {
        console.log('hey')
        var i = locations[idx].i
        var j = locations[idx].j
        gBoard[i][j].isMine = true
        console.log(gBoard)
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
    getMineNegsCount(elCell)
     var location
    location = getCellCoord(elCell.id)
    console.log(gBoard[location.i][location.j].negMines)
    var value = (gBoard[location.i][location.j].isMine) ? MINE : gBoard[location.i][location.j].negMines
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
//script
gBoard = createBoard()
setMines()
renderBoard(gBoard)

