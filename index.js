var selectedCell = null;
var lineDir = null;
var currentLine = null;
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

function refreshGrid()
{
    document.querySelectorAll('.cell').forEach((cell, i) => {
        cell.classList.remove('selected');
        cell.classList.remove('suggested');
        cell.classList.add('empty');
        cell.innerHTML = "";
    })

    for (var lineID in words)
    {
        const increment = lineID.slice(1) == "a" ? 
            (j) => {return words[lineID].startingCell.slice(0, 3) + (+words[lineID].startingCell.slice(3) + j)}:
            (j) => {return words[lineID].startingCell.slice(0, 1) + (+words[lineID].startingCell.slice(1, 2) + j) + words[lineID].startingCell.slice(2)};

        for (var i = 0; i < words[lineID].word.length; i++)
        {
            var cell = increment(i);
            document.getElementById(cell).innerHTML = words[lineID].word.charAt(i);
            document.getElementById(cell).classList.add('selected');
        }
    }
}

function selectCell(cell)
{
    for (var lineID in words)
    {
        if (words[lineID].word.length < 2) delete words[lineID];
    }

    if (cell == selectedCell) return;

    var canBeAcrross = true;
    var canBeDown = true;
    var lineToSelect = null;
    for (var line in words)
    {
        var cellsInLine = getCellsInLine(line);
        if (cellsInLine.includes(cell))
        {
            if (line.slice(1) == "a") canBeAcrross = false;
            else if (line.slice(1) == "d") canBeDown = false;
            lineToSelect = line;
        }
    }

    if (!canBeAcrross && !canBeDown)
    {
        loadWord(lineToSelect);
        return;
    }

    if (canBeAcrross) 
    {
        currentLine = cell.slice(1, 2) + "a";
        document.getElementById("a").checked = true;
        document.getElementById("d").checked = false;
    }
    else if (canBeDown)
    {
        currentLine = cell.slice(3) + "d";
        document.getElementById("a").checked = false;
        document.getElementById("d").checked = true;
    }

    words[currentLine] = {word: `⠀`, startingCell: cell, clue: "", hints: []};

    selectedCell = cell;
    lineDir = null;
    solution = null;

    document.getElementById('seleCell').style.color = '#000';
    document.getElementById('seleCell').value = cell;
    document.getElementById('solution').value = "";
    document.getElementById('clue').value = "";
    document.querySelectorAll('.hintInput').forEach(ele => ele.value = "");
    
    refreshGrid();
}

function possCell(cell)
{
    if (selectedCell) return;
    document.getElementById('seleCell').style.color = '#00000044';
    document.getElementById('seleCell').value = cell;
}

function changeSeleCell(e)
{
    if (e.value.length < 4) return;
    var r = e.value.slice(1, 2);
    var c = e.value.slice(3)
    if (r > 0 && r < 6 && c > 0 && c < 6)
    {
        selectedCell = e.value;
        words[currentLine].startingCell = e.value;
        refreshGrid();
    }
    else
    {
        e.value = selectedCell;
    }
}

function getCellsInLine(lineID)
{
    var res = [];
    const increment = lineID.slice(1) == "a" ? 
        (j) => {return words[lineID].startingCell.slice(0, 3) + (+words[lineID].startingCell.slice(3) + j)}:
        (j) => {return words[lineID].startingCell.slice(0, 1) + (+words[lineID].startingCell.slice(1, 2) + j) + words[lineID].startingCell.slice(2)};

    for (var i = 0; i < words[lineID].word.length; i++)
    {
        var cell = increment(i);
        res.push(cell);
    }
    return res;
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

    var tempLine = lineDir == "a" ? `${selectedCell.slice(1, 2)}a` : `${selectedCell.slice(3)}d`;

    words[tempLine] = {...words[currentLine]};
    delete words[currentLine];
    currentLine = tempLine;
    refreshGrid();
}

function solutionChange()
{
    console.log(currentLine, words[currentLine])
    solution = document.getElementById('solution').value;
    words[currentLine].word = solution;
    refreshGrid();
    refreshWordsDisplay();
}

function clueChange(e)
{
    words[currentLine].clue = e.value;
}

function hintChange(which)
{
    words[currentLine].hints[which-1] = document.getElementById(`hint${which}`).value;
}

function refreshWordsDisplay()
{
    document.getElementById('cluesDisplay').innerHTML = "";
    for (var lineID in words)
    {
        document.getElementById('cluesDisplay').innerHTML += `<div class="cluesDisplayNode" onclick="loadWord('${lineID}')"><b>${lineID}:</b> ${words[lineID].word}</div>`;
    }
}

function loadWord(lineID)
{
    for (var line in words)
    {
        if (words[line].word.length < 2) delete words[line];
    }

    solution = words[lineID].word;
    lineDir = lineID.slice(1);
    selectedCell = words[lineID].startingCell;

    currentLine = lineID;

    document.getElementById('seleCell').value = selectedCell;
    document.getElementById(lineDir).checked = true;
    document.getElementById('solution').value = solution;
    document.getElementById('clue').value = words[lineID].clue;
    if ("hints" in words[lineID])
    {
        document.querySelectorAll('.hintInput').forEach((ele, i) => {
            if (i < words[lineID].hints.length)
            {
                ele.value = words[lineID].hints[i];
            }
        })
    }

    refreshGrid();
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
    var sorted = sortClues(words);
    document.getElementById('deliver').value = JSON.stringify(sorted, null, 2);
    document.getElementById('deliveryWindow').classList.add('displayDelivery');
}

function loadPuzzle()
{
    document.getElementById('loadWindow').classList.add('displayDelivery');
}

function submitLoad()
{
    words = JSON.parse(document.getElementById('loadTA').value);
    refreshGrid();
    refreshWordsDisplay();
    document.getElementById('loadWindow').classList.remove('displayDelivery');
}

function newPuzzle()
{
    document.getElementsByName("dir").forEach(radio => {
        radio.checked = false;
    })
    lineDir = null;

    solution = null;
    document.getElementById('solution').value = "";
    document.getElementById('seleCell').value = "none";

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

    words = {};

    selectedCell = null;

    updateCells();

    document.querySelector('.deliveryWindow').classList.remove('displayDelivery');
}

function closeDeliver()
{
    document.getElementById('deliveryWindow').classList.remove('displayDelivery');
}

function test()
{
    window.open('/cryptickle-builder/cryptickle-tester/', '_blank');
}

function shuffle()
{
    
}

document.querySelectorAll('.cell').forEach(ele => {
    ele.addEventListener('click', e => {
        selectCell(e.target.id)
    })

    ele.addEventListener('mouseover', e => {
        possCell(e.target.id)
    })
})

