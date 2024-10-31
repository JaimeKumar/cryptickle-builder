var selectedCell = null;
var lineDir = null;
var solution = null;

var words = {};

var cells = {
    "r1c1" : {sel: false, val: null, conf: false, r: 1, c: 1},
    "r1c2" : {sel: false, val: null, conf: false, r: 1, c: 2},
    "r1c3" : {sel: false, val: null, conf: false, r: 1, c: 3},
    "r1c4" : {sel: false, val: null, conf: false, r: 1, c: 4},
    "r1c5" : {sel: false, val: null, conf: false, r: 1, c: 5},
    "r2c1" : {sel: false, val: null, conf: false, r: 2, c: 1},
    "r2c2" : {sel: false, val: null, conf: false, r: 2, c: 2},
    "r2c3" : {sel: false, val: null, conf: false, r: 2, c: 3},
    "r2c4" : {sel: false, val: null, conf: false, r: 2, c: 4},
    "r2c5" : {sel: false, val: null, conf: false, r: 2, c: 5},
    "r3c1" : {sel: false, val: null, conf: false, r: 3, c: 1},
    "r3c2" : {sel: false, val: null, conf: false, r: 3, c: 2},
    "r3c3" : {sel: false, val: null, conf: false, r: 3, c: 3},
    "r3c4" : {sel: false, val: null, conf: false, r: 3, c: 4},
    "r3c5" : {sel: false, val: null, conf: false, r: 3, c: 5},
    "r4c1" : {sel: false, val: null, conf: false, r: 4, c: 1},
    "r4c2" : {sel: false, val: null, conf: false, r: 4, c: 2},
    "r4c3" : {sel: false, val: null, conf: false, r: 4, c: 3},
    "r4c4" : {sel: false, val: null, conf: false, r: 4, c: 4},
    "r4c5" : {sel: false, val: null, conf: false, r: 4, c: 5},
    "r5c1" : {sel: false, val: null, conf: false, r: 5, c: 1},
    "r5c2" : {sel: false, val: null, conf: false, r: 5, c: 2},
    "r5c3" : {sel: false, val: null, conf: false, r: 5, c: 3},
    "r5c4" : {sel: false, val: null, conf: false, r: 5, c: 4},
    "r5c5" : {sel: false, val: null, conf: false, r: 5, c: 5}
}

function updateCells()
{
    Object.keys(cells).forEach(cID => {
        var ele = document.getElementById(cID);
        if (cells[cID].sel)
        {
            ele.classList.add('selected');
        }
        else
        {
            ele.classList.remove('selected');
        }

        ele.innerHTML = cells[cID].val;
    })

    if (selectedCell) document.getElementById('seleCell').innerHTML = selectedCell;
}

function selectCell(cell)
{
    if (cell == selectedCell) return;
    document.getElementsByName("dir").forEach(radio => {
        radio.checked = false;
    })
    lineDir = null;

    solution = null;
    document.getElementById('solution').value = "";

    clearUnconfirmedCells()

    selectedCell = cell;

    deselectEmptyCells();
    cells[cell].sel = true;
    updateCells();
}

function clearUnconfirmedCells()
{
    Object.keys(cells).forEach(cID => {
        if (cells[cID].conf) return;
        cells[cID].val = null;
    })
}

function possCell(cell)
{
    if (selectedCell) return;
    document.getElementById('seleCell').innerHTML = `<p style="color: #00000044;">${cell}</p>`;
}

function dirChanged()
{
    if (!selectedCell)
    {
        document.getElementsByName("dir").forEach(radio => {
            radio.checked = false;
        })
        return;
    }

    document.getElementsByName("dir").forEach(radio => {
        if (radio.checked) lineDir = radio.id;
    })

    var aCells = Object.keys(cells).filter(cID => cells[cID].r == cells[selectedCell].r && cells[cID].c >= cells[selectedCell].c);
    var dCells = Object.keys(cells).filter(cID => cells[cID].c == cells[selectedCell].c && cells[cID].r >= cells[selectedCell].r);
    if (lineDir == "a")
    {
        var cellsToSelect = aCells;
        dCells.forEach(cID => {
            if (cells[cID].conf) return;
            cells[cID].val = null;
        })
    }
    else if (lineDir == "d")
    {
        var cellsToSelect = dCells;
        aCells.forEach(cID => {
            if (cells[cID].conf) return;
            cells[cID].val = null;
        })
    }

    if (solution) fillSolution();

    deselectEmptyCells();

    cellsToSelect.forEach(cid =>{
        if (cells[cid].val || !solution) cells[cid].sel = true;
    })
    
    updateCells();
}

function deselectEmptyCells()
{
    Object.keys(cells).filter(cid => !cells[cid].val && cid!=selectedCell).forEach(cid =>{
        cells[cid].sel = false;
    })
}

function fillSolution()
{
    var cellsAhead = getCellsInLine();
    for (var i = 0; i < cellsAhead.length; i++)
    {
        cells[cellsAhead[i]].val = i >= solution.length ? null : solution.charAt(i);
    }
}

function solutionChange()
{
    solution = document.getElementById('solution').value;
    fillSolution();
    updateCells();
}

function getCellsInLine()
{
    var r = cells[selectedCell].r;
    var c = cells[selectedCell].c;
    return lineDir == "a" ? Object.keys(cells).filter(cID => cells[cID].r == r && cells[cID].c >= c) : Object.keys(cells).filter(cID => cells[cID].c == c && cells[cID].r >= r);
}

function finishInput()
{
    var r = cells[selectedCell].r;
    var c = cells[selectedCell].c;
    var cellsAhead = getCellsInLine();
    
    if (cellsAhead.length > solution.length)
    {
        for (var i = solution.length; i < cellsAhead.length; i++)
        {
            cells[cellsAhead[i]].sel = false;
        }
        updateCells();
    }
}

function submitWord()
{
    for (var i = 0; i < solution.length; i++)
    {
        if (lineDir == "a")
        {
            var thisCol = cells[selectedCell].c + i;
            var cellID = `r${cells[selectedCell].r}c${thisCol}`
            cells[cellID].conf = true;
        }
        else if (lineDir == "d")
            {
            var thisRow = cells[selectedCell].r + i;
            var cellID = `r${thisRow}c${cells[selectedCell].c}`
            cells[cellID].conf = true;
        }
    }

    var lineID = (lineDir == "a") ? cells[selectedCell].r + "a" : cells[selectedCell].c + "d";
    words[lineID] = {word: solution, clue: document.getElementById('clue').value, startingCell: selectedCell};

    solution = null;
    lineDir = null;
    selectedCell = null;
    document.getElementById('seleCell').innerHTML = 'none';
    document.getElementsByName("dir").forEach(radio => {
        radio.checked = false;
    })
    document.getElementById('solution').value = "";
    document.getElementById('clue').value = "";
}

function sortClues(clues) {
    const entries = Object.entries(clues);

    entries.sort(([keyA], [keyB]) => {
        const [numA, typeA] = [parseInt(keyA), keyA.slice(-1)];
        const [numB, typeB] = [parseInt(keyB), keyB.slice(-1)];
        
        if (typeA !== typeB) {
            return typeA === 'a' ? -1 : 1;
        } else {
            return numA - numB;
        }
    });

    return Object.fromEntries(entries);
}

function generateJSON()
{
    if (solution) submitWord();
    var sorted = sortClues(words);
    document.getElementById('deliver').value = JSON.stringify(sorted, null, 2);
    document.querySelector('.deliveryWindow').classList.add('displayDelivery');
}

function newPuzzle()
{
    document.getElementsByName("dir").forEach(radio => {
        radio.checked = false;
    })
    lineDir = null;

    solution = null;
    document.getElementById('solution').value = "";
    document.getElementById('seleCell').innerHTML = "none";

    cells = {
        "r1c1" : {sel: false, val: null, conf: false, r: 1, c: 1},
        "r1c2" : {sel: false, val: null, conf: false, r: 1, c: 2},
        "r1c3" : {sel: false, val: null, conf: false, r: 1, c: 3},
        "r1c4" : {sel: false, val: null, conf: false, r: 1, c: 4},
        "r1c5" : {sel: false, val: null, conf: false, r: 1, c: 5},
        "r2c1" : {sel: false, val: null, conf: false, r: 2, c: 1},
        "r2c2" : {sel: false, val: null, conf: false, r: 2, c: 2},
        "r2c3" : {sel: false, val: null, conf: false, r: 2, c: 3},
        "r2c4" : {sel: false, val: null, conf: false, r: 2, c: 4},
        "r2c5" : {sel: false, val: null, conf: false, r: 2, c: 5},
        "r3c1" : {sel: false, val: null, conf: false, r: 3, c: 1},
        "r3c2" : {sel: false, val: null, conf: false, r: 3, c: 2},
        "r3c3" : {sel: false, val: null, conf: false, r: 3, c: 3},
        "r3c4" : {sel: false, val: null, conf: false, r: 3, c: 4},
        "r3c5" : {sel: false, val: null, conf: false, r: 3, c: 5},
        "r4c1" : {sel: false, val: null, conf: false, r: 4, c: 1},
        "r4c2" : {sel: false, val: null, conf: false, r: 4, c: 2},
        "r4c3" : {sel: false, val: null, conf: false, r: 4, c: 3},
        "r4c4" : {sel: false, val: null, conf: false, r: 4, c: 4},
        "r4c5" : {sel: false, val: null, conf: false, r: 4, c: 5},
        "r5c1" : {sel: false, val: null, conf: false, r: 5, c: 1},
        "r5c2" : {sel: false, val: null, conf: false, r: 5, c: 2},
        "r5c3" : {sel: false, val: null, conf: false, r: 5, c: 3},
        "r5c4" : {sel: false, val: null, conf: false, r: 5, c: 4},
        "r5c5" : {sel: false, val: null, conf: false, r: 5, c: 5}
    }

    selectedCell = null;

    updateCells();

    document.querySelector('.deliveryWindow').classList.remove('displayDelivery');
}

document.querySelectorAll('.cell').forEach(ele => {
    ele.addEventListener('click', e => {
        selectCell(e.target.id)
    })

    ele.addEventListener('mouseover', e => {
        possCell(e.target.id)
    })
})

