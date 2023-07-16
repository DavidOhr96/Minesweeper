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
var gLevel = []
var gGame = {
    isOn: true,
    isWin: true,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0,
}
var gFreeCellCounter = 0
var mines = []
var gLives = []
const LIFE = '❤'
const MINE = '💩'
const COVERED = ''
const CLEAR = ' ✔'
const FLAG = '🌹'

//Functions
//utils
function onInit(level) {
    gLives = []
    getLives()
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
    document.querySelector('.modal').style.display = 'none'
    document.querySelector('.main-icon').innerText = '😊'
    setMines()
    defineNegMines()
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
function revealCell(elCell) {
    if (!gGame.isOn) return
    var location = getCellCoord(elCell.id)
    var cell = gBoard[location.i][location.j]
    if (cell.isMarked) return
    if (cell.isMine) {
        loseLife()
    }
    else {
        gGame.shownCount++
        getMineNegsCount(elCell)
        if (gGame.shownCount === gFreeCellCounter) gameOver()
    }
    var value = (cell.isMine) ? MINE : gBoard[location.i][location.j].negMines
    renderCell(location, value)
}
function getCellCoord(strCellId) {
    var coord = {}
    console.log(strCellId)
    var parts = strCellId.split('-')
    coord.i = +parts[1]
    coord.j = +parts[2]
    return coord
}
function renderCell(location, value) {
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

//lives
function getLives() {
    for (var i = 0; i < 3; i++) {
        gLives.push(LIFE)
        renderLives()
    }
}
function renderLives() {
    var lives = document.querySelector('.Lives')
    lives.innerText = `Lives: ${gLives}`
}
function loseLife() {
    gLives.pop()
    renderLives()
    if (gLives.length === 0) {
        gGame.isWin = false
        gameOver()
    }
}

//Mines
function revealNegs(cellCoord) {
    var negsCount = 0;
    for (var i = cellCoord.i - 1; i <= cellCoord.i + 1; i++) {
        negsCount = 0;
        if (i < 0 || i >= gBoard.length) continue;
        for (var j = cellCoord.j - 1; j <= cellCoord.j + 1; j++) {
            if (j < 0 || j >= gBoard[i].length) continue;
            if (i === cellCoord.i && j === cellCoord.j) continue;
            var currCell = gBoard[i][j]
            if (currCell.isMine === true) negsCount++;
            // gBoard[i][j].negMines = negsCount
            renderCell({ 'i': i, 'j': j }, gBoard[i][j].negMines)
            gGame.shownCount++
            console.log(gGame.shownCount)

            // if (!negsCount)revealNegs({'i':i,'j':j})



        }
    }
}
function setMines() {
    var locations = []
    for (var i = 0; i < gLevel.MINES; i++)
        locations.push(getEmptyLocation(gBoard))
    console.log(locations)
    for (var idx = 0; idx < locations.length; idx++) {
        var rowIdx = locations[idx].i
        var colIdx = locations[idx].j
        gBoard[rowIdx][colIdx].isMine = true
        gFreeCellCounter--
    }
}
function getMineNegsCount(elCell) {
    var cellCoord = getCellCoord(elCell.id)
    console.log(cellCoord)
    var negsCount = 0;
    for (var i = cellCoord.i - 1; i <= cellCoord.i + 1; i++) {
        if (i < 0 || i >= gBoard.length) continue;
        for (var j = cellCoord.j - 1; j <= cellCoord.j + 1; j++) {
            if (j < 0 || j >= gBoard[i].length) continue;
            if (i === cellCoord.i && j === cellCoord.j) continue;
            var currCell = gBoard[i][j]
            if (currCell.isMine === true) negsCount++;
        }
    }
    if (!negsCount) revealNegs(cellCoord)
    gBoard[cellCoord.i][cellCoord.j].negMines = negsCount
}
function countNegMines(rowIdx, colIdx) {
    var negsCount = 0;
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i >= gBoard.length) continue;
        for (var j = colIdx - 1; j <= rowIdx + 1; j++) {
            if (j < 0 || j >= gBoard[i].length) continue;
            if (i === rowIdx && j === rowIdx) continue;
            var currCell = gBoard[i][j]
            if (currCell.isMine === true) negsCount++;
        }
    }
    gBoard[rowIdx][colIdx].negMines = negsCount
}
function defineNegMines() {
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[i].length; j++) {
            countNegMines(i, j)
        }
    }
}
