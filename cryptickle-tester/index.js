class cell
{
    constructor(setR, setC)
    {
        this.val = null;
        this.solution = "";
        this.lineID = [];
        this.clickable = false;
        this.r = setR;
        this.c = setC;
    }
}

class puzzle
{
    constructor(words)
    {
        this.words = {...words};
        this.cells = {};
        this.initCells();
        this.hintsUsed = 0;
    }
        
    initCells()
    {
        for (var i = 1; i < 6; i++)
        {
            for (var j = 1; j < 6; j++)
            {
                var cellID = `r${i}c${j}`;
                this.cells[cellID] = new cell(i , j);
            }
        }

        console.log(this.words)

        for (var lineid in this.words)
        {
            var dir = lineid.slice(1);
            if (dir == "a")
            {
                var startingCol = +this.words[lineid].startingCell.slice(3);
                var row = +lineid.slice(0, 1);
                for (var i = 0; i < this.words[lineid].word.length; i++)
                {
                    var cellNum = startingCol + i;
                    var cellID = `r${row}c${cellNum}`;
                    this.cells[cellID].solution = this.words[lineid].word.charAt(i);;
                    this.cells[cellID].clickable = true;
                    this.cells[cellID].lineID.push(lineid);
                }
            }
            else if (dir == "d")
            {
                var startingRow = +this.words[lineid].startingCell.slice(1, 2);
                var col = +lineid.slice(0, 1);
                for (var i = 0; i < this.words[lineid].word.length; i++)
                {
                    var cellNum = startingRow + i;
                    var cellID = `r${cellNum}c${col}`;
                    this.cells[cellID].solution = this.words[lineid].word.charAt(i);;
                    this.cells[cellID].clickable = true;
                    this.cells[cellID].lineID.push(lineid);
                }
            }
        }

        for (var word in this.words)
        {
            this.words[word].hintsUsed = 0;
        }
    }
}

var dirSwitch = false;
var selectedLine = null;
var selectedCell = null;
var time = 0;
var timer;

function getCellsInLine(line)
{
    var dir = line.slice(1);
    var index = line.slice(0, 1);
    var res = [];
    if (dir == "a")
    {
        for (var i = 1; i < 6; i++)
        {
            res.push(`r${index}c${i}`);
        }
    }
    else if (dir == "d")
    {
        for (var i = 1; i < 6; i++)
        {
            res.push(`r${i}c${index}`);
        }
    }
}

function selectCell(cell)
{
    selectedCell = cell;
    calcLine();
    updateHighlight();
    showClue();
}

function calcLine()
{
    if (thisPuzzle.cells[selectedCell].lineID.length < 2)
    {
        selectedLine = thisPuzzle.cells[selectedCell].lineID[0];
    }
    else
    {
        selectedLine = thisPuzzle.cells[selectedCell].lineID[+dirSwitch];
    }

    if (!selectedLine) selectedLine = Object.keys(thisPuzzle.words)[0];
}

function updateHighlight()
{
    Object.keys(thisPuzzle.cells).forEach(cID => {
        document.getElementById(cID).classList.remove("lineSelect");
        document.getElementById(cID).classList.remove("cellSelect");
    })

    Object.keys(thisPuzzle.cells).filter(c => thisPuzzle.cells[c].lineID.includes(selectedLine)).forEach(cID => {
        document.getElementById(cID).classList.add("lineSelect");
    })

    document.getElementById(selectedCell).classList.add("cellSelect");
}

function moveCell(dir)
{
    var row = "" + thisPuzzle.cells[selectedCell].r;
    var col = "" + thisPuzzle.cells[selectedCell].c;
    var newRow = +row;
    var newCol = +col;

    switch(dir)
    {
        case "ArrowLeft":
            newCol--
            break;
        case "ArrowUp":
            newRow--;
            break;
        case "ArrowRight":
            newCol++;
            break;
        case "ArrowDown":
            newRow++;
            break;
    }

    var newCell = `r${newRow}c${newCol}`;

    const cids = Object.keys(thisPuzzle.cells);
    const cellsAhead = (dir == "ArrowLeft" || dir == "ArrowRight")
        ? cids.filter(cID => thisPuzzle.cells[cID].r == row && thisPuzzle.cells[cID].c > col) 
        : cids.filter(cID => thisPuzzle.cells[cID].c == col && thisPuzzle.cells[cID].r > row);
    const emptyCellsAhead = cellsAhead.filter(cID => !thisPuzzle.cells[cID].val);

    if ((dir == "ArrowRight" || dir == "ArrowDown") && !Object.keys(thisPuzzle.cells).includes(newCell))
    {
        if (emptyCellsAhead.length > 0) 
        {
            dirSwitch = !(dir == "ArrowRight" || dir == "ArrowLeft");
            selectCell(emptyCellsAhead[0]);
        }
        else
        {
            clueArrow(1);
        }
    }
    else if (Object.keys(thisPuzzle.cells).includes(newCell) && thisPuzzle.cells[newCell].clickable)
    {
        if (!thisPuzzle.cells[newCell].val)
        {
            dirSwitch = !(dir == "ArrowRight" || dir == "ArrowLeft");
            selectCell(newCell);
        }
        else if ((dir == "ArrowRight" || dir == "ArrowDown") && emptyCellsAhead.length > 0)
        {
            dirSwitch = !(dir == "ArrowRight" || dir == "ArrowLeft");
            selectCell(emptyCellsAhead[0]);
        }
        else
        {
            selectCell(newCell);
        }
    }
}

function showClue()
{
    var thisClue = thisPuzzle.words[selectedLine];
    document.getElementById("clue").innerHTML = thisClue.clue + ` (${thisClue.word.length})`;

    document.getElementById('hintNum').innerHTML = `0 / ${thisPuzzle.words[selectedLine].hints.length} revealed`;
    document.getElementById('hintLine').innerHTML = `Hints for ${selectedLine}`;
    document.getElementById('hiddenReveal').classList.remove('hideHiddenReveal')
}

function keyPress(letter)
{
    if (!thisPuzzle.cells[selectedCell].clickable) return;
    document.getElementById(selectedCell).innerHTML = letter;
    thisPuzzle.cells[selectedCell].val = letter;
    var dir = selectedLine.slice(1);
    if (dir == "a") moveCell("ArrowRight");
        else if (dir == "d") moveCell("ArrowDown");
    
    if (checkFin()) checkSolution();
}

function backspace()
{
    if (!thisPuzzle.cells[selectedCell].clickable) return;
    if (document.getElementById(selectedCell).innerHTML == "")
    {
        var dir = selectedLine.slice(1);
    if (dir == "a") moveCell("ArrowLeft");
        else if (dir == "d") moveCell("ArrowUp")
    }
    else
    {
        thisPuzzle.cells[selectedCell].val = null;
        document.getElementById(selectedCell).innerHTML = null;
    }
}

function clueArrow(dir, override = false)
{
    var currentWord = Object.keys(thisPuzzle.words).indexOf(selectedLine);
    var nWords = Object.keys(thisPuzzle.words).length;
    var newIndex = (nWords + currentWord + dir) % nWords;
    var newSelectedLine = Object.keys(thisPuzzle.words)[newIndex];

    if (checkFin() && !override) return;

    selectedLine = newSelectedLine;
    var startCell = thisPuzzle.words[selectedLine].startingCell;
    var dir = "" + selectedLine.slice(1);

    var emptyCellsOfNewLine = dir == "a" ? 
    Object.keys(thisPuzzle.cells).filter(cID => thisPuzzle.cells[cID].r == thisPuzzle.cells[startCell].r && thisPuzzle.cells[cID].c >= thisPuzzle.cells[startCell].c && !thisPuzzle.cells[cID].val) :
    Object.keys(thisPuzzle.cells).filter(cID => thisPuzzle.cells[cID].c == thisPuzzle.cells[startCell].c && thisPuzzle.cells[cID].r >= thisPuzzle.cells[startCell].r && !thisPuzzle.cells[cID].val);

    if (emptyCellsOfNewLine.length < 1) 
    {
        selectedCell = thisPuzzle.words[selectedLine].startingCell;
    }
    else
    {
        selectedCell = emptyCellsOfNewLine[0];
    }
    
    updateHighlight();
    showClue();
}

function checkFin()
{
    var clickables = Object.values(thisPuzzle.cells).filter(c => c.clickable);
    var filled = clickables.filter(c => c.val).length;
    if (filled >= clickables.length) return true;
        else return false;
}

function checkSolution()
{
    var clickables = Object.values(thisPuzzle.cells).filter(c => c.clickable);
    var correct = clickables.filter(c => c.val && c.val.toUpperCase() == c.solution.toUpperCase()).length;
    if (correct >= clickables.length) 
    {
        clearInterval(timer);
        var mins = Math.floor(time / 60);
        var secs = time % 60;
        document.getElementById("solveTime").innerHTML = `${mins}:${String(secs).padStart(2, '0')}`
        document.getElementById("hintsUsedWin").innerHTML = `Using ${thisPuzzle.hintsUsed} hints.`
        document.getElementById('overScreen').classList.add("showOverScreen");
        document.getElementById('winWindow').classList.add("winned");
    }
}

function help()
{
    document.getElementById('helpOverScreen').classList.add("showOverScreen");
    document.getElementById('helpWindow').classList.add("helpShow");
}

function closeHelp()
{
    document.getElementById('helpOverScreen').classList.remove("showOverScreen");
    document.getElementById('helpWindow').classList.remove("helpShow");
}

function closeWin()
{
    document.getElementById('overScreen').classList.remove("showOverScreen");
    document.getElementById('winWindow').classList.remove("winned");
}

function hintDesktop()
{
    document.getElementById('hiddenReveal').classList.add('hideHiddenReveal');
    var used = thisPuzzle.words[selectedLine].hintsUsed % thisPuzzle.words[selectedLine].hints.length;

    if (thisPuzzle.words[selectedLine].hintsUsed < thisPuzzle.words[selectedLine].hints.length) thisPuzzle.hintsUsed++;
    thisPuzzle.words[selectedLine].hintsUsed++;
    document.getElementById('hintDisplay').innerHTML = thisPuzzle.words[selectedLine].hints[used];
    document.getElementById('hintNum').innerHTML = `${Math.min(thisPuzzle.words[selectedLine].hintsUsed, thisPuzzle.words[selectedLine].hints.length)} / ${thisPuzzle.words[selectedLine].hints.length} revealed`;
}

function hint()
{
    var used = thisPuzzle.words[selectedLine].hintsUsed % thisPuzzle.words[selectedLine].hints.length;
    document.getElementById('hintClue').innerHTML = `for clue ${selectedLine} &nbsp;&nbsp; | &nbsp;&nbsp;   hint ${(used + 1)} / ${thisPuzzle.words[selectedLine].hints.length}`;
    if (thisPuzzle.words[selectedLine].hintsUsed < thisPuzzle.words[selectedLine].hints.length) thisPuzzle.hintsUsed++;
    thisPuzzle.words[selectedLine].hintsUsed++;
    document.getElementById('hintsCont').innerHTML = thisPuzzle.words[selectedLine].hints[used];
    document.getElementById('hintOverscreen').classList.add('showOverScreen')
    document.getElementById('hintWindow').classList.add('winned')
}

function closeHints()
{
    document.getElementById('hintOverscreen').classList.remove('showOverScreen')
    document.getElementById('hintWindow').classList.remove('winned')
}

document.querySelectorAll('.overScreen').forEach(cellElement => {
    cellElement.addEventListener('click', e => {
        if (e.target.id == "overScreen") closeWin();
        if (e.target.id == "helpOverScreen") closeHelp();
        if (e.target.id == "hintOverscreen") closeHints();
        document.getElementById('pseudo').focus();
    })
})

document.querySelectorAll('.cell').forEach(cellElement => {
    cellElement.addEventListener('click', e => {
        if (Object.keys(thisPuzzle.cells).includes(e.target.id) && thisPuzzle.cells[e.target.id].clickable)
        {
            if (selectedCell == e.target.id) dirSwitch = !dirSwitch;
            selectCell("" + e.target.id);
            document.getElementById('pseudo').focus();
        }
    })
})

document.querySelectorAll('.kbKey').forEach(kbkey => {
    kbkey.addEventListener('click', e => {
        if (e.target.id == "bkspc")
        {
            backspace();
            return;
        }
        else if (e.target.id == "hint")
        {
            hint();
            return;
        }
        keyPress(e.target.id);
    });
});

document.getElementById('gameCont').addEventListener('click', e => {
    document.getElementById('pseudo').focus();
})

document.getElementById('pseudo').addEventListener('keydown', e => {
    if ((e.key.match(/[A-Z]/i) && e.key.length < 2) || e.key == "Backspace" || e.key == "Tab" || e.key.match(/Arrow/))
    {
        e.preventDefault();
    }

    if (e.key.match(/[A-Z]/i) && e.key.length < 2 && selectedCell)
    {
        keyPress(e.key);
    }
    else if (e.key == "Backspace" && selectedCell)
    {
        backspace();
    }
    else if (e.key == "Tab")
    {
        e.preventDefault();
        var dir = e.shiftKey ? -1 : 1;
        clueArrow(dir);
    }
    else if (e.key.match(/Arrow/))
    {
        moveCell(e.key);
    }
})

function initPuzzle()
{
    dirSwitch = false;
    selectedLine = null;
    selectedCell = null;
    archivesPos = 0;
    archiveYear = null;
    archiveMonth = null;

    for (var cellID in thisPuzzle.cells)
    {
        if (!thisPuzzle.cells[cellID].clickable) 
        {
            document.getElementById(cellID).classList.add("cellBlocked");
        }
        else
        {
            document.getElementById(cellID).classList.remove("cellBlocked");
        }
        
        document.getElementById(cellID).innerHTML = "";
    }
    
    clearInterval(timer);
    time = 0;
    document.getElementById("time").innerHTML = "0:00";
    timer = setInterval(() => {
        time++;
        var mins = Math.floor(time / 60);
        var secs = time % 60;
        document.getElementById("time").innerHTML = `${mins}:${String(secs).padStart(2, '0')}`
    }, 1000)
    
    selectCell(Object.keys(thisPuzzle.cells).filter(cID => thisPuzzle.cells[cID].clickable)[0]);
    document.getElementById('pseudo').focus();
}

function submitPuzzle()
{
    thisPuzzle = new puzzle(JSON.parse(document.getElementById('puzzleInput').value));
    document.getElementById('inputPuzzle').style.display = 'none';
    initPuzzle();
}
