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
            icon = (mat[i][j].isMine) ? MINE : COVERED


            strHTML += `<td  onclick="getMineNegsCount(this)" class="${className}">${icon}</td>`
        }
        strHTML += '</tr>'
    }
    strHTML += '</tbody></table>'

    const elContainer = document.querySelector(".mine-fild")
    elContainer.innerHTML = strHTML
}
function setMines() {
    var locations = [{ row: 1, col: 0 }, { row: 2, col: 3 }]
    for (var idx = 0; idx < locations.length; idx++) {
        var i = locations[idx].row
        var j = locations[idx].col
        gBoard[i][j].isMine = true
        console.log(gBoard)
    }
}

function getMineNegsCount(elCell) {
    console.log(elCell.class)
   var gGamerPos=getCellCoord(elCell.id)
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
    var elNgsCount = document.querySelector('div .mine-fild')
    elNgsCount.innerText = negsCount

}
function getCellCoord(strCellId) {
    console.log(strCellId)
    var coord = {}
    var parts = strCellId.split('-') // ['cell','2','3']
    coord.i = +parts[1]
    coord.j = +parts[2]
    return coord // {i:2,j:3}
}
//script
gBoard = createBoard()
setMines()
renderBoard(gBoard)
