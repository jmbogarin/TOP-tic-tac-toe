"use strict";

(function() {
    const UIElements = (() => {
        const display = document.querySelector('#display');
        const resetBtn = document.querySelector("#reset-btn");
        const board = document.querySelector(".board");
        const cells = board.children;
        return {
            display,
            resetBtn,
            board,
            cells
        }
    })();

    const Player = (name, mark) => {
        const getName = () => name;
        const getMark = () => mark;
        return {
            getName,
            getMark
        }
    }

    const gameboard = (() => {
        let _board = ["", "", "", "", "", "", "", "", ""];
        const getBoard = () => _board.slice()
        const setMark = (pos, mark) => {
            if (_board[pos] === "") {
                _board[pos] = mark;
                return true
            } 
        }
        const resetBoard = () => {
            _board = ["", "", "", "", "", "", "", "", ""];
        }
        return {
            resetBoard,
            getBoard,
            setMark
        }
    })();
    
    const displayController = (() => {
        const addMark = (pos, mark) => UIElements.cells[pos].textContent = mark
        const renderBoard = () => {
            const marks = gameboard.getBoard();
            for (const mark in marks) {
                UIElements.cells[mark].textContent = marks[mark]
            }
        }  
        const displayMsg = (msg) => {
            if (msg === "turn") {
                const player = gameHandler.getCurrentPlayer();
                UIElements.display.textContent = `It's ${player.getName()}'s turn (${player.getMark()})`;
            } else if (msg === "winer") {
                const winer = gameHandler.getWiner();
                UIElements.display.textContent = `${winer} wins!`;
            } else {
                UIElements.display.textContent = msg;
            }
        }
        return {
            addMark,
            renderBoard,
            displayMsg 
        }
    })();

    const gameHandler = (() => {
        const _player1 = Player('Juan', 'X');
        const _player2 = Player('Manuel', 'O');
        let currentPlayer = _player1;
        let winer;
        let gameOn = true;

        const getWiner = () => winer;
        const getCurrentPlayer = () => currentPlayer;
    
        const changePlayer = () => {
            currentPlayer = (currentPlayer === _player2) ? _player1 : _player2;
            displayController.displayMsg("turn");
        }
        
        const newGame = () => {
            gameboard.resetBoard();
            gameOn = true;
            displayController.displayMsg("turn");
            displayController.renderBoard();
        }

        const makeMove = (e) => {
            if (e.target.className !== "cell" || !gameOn) return

            const cellNum = Array.from(e.target.parentNode.children).indexOf(e.target);
            const mark = currentPlayer.getMark();
    
            if (gameboard.setMark(cellNum, mark)) {
                displayController.addMark(cellNum, mark);
                winer = checkWinner();
                if (winer){
                    displayController.displayMsg("winer")
                    gameOn = false;
                } else if(gameboard.getBoard().indexOf("")===-1) {
                    displayController.displayMsg("Tie!")
                    gameOn = false;
                } else {
                    changePlayer();
                }
            } else {
                return
            }
        }

        const checkWinner = () => {
            const b = gameboard.getBoard();
            const lines = [[0, 1, 2],[3, 4, 5],[6, 7, 8],[0, 3, 6],[1, 4, 7],[2, 5, 8],[0, 4, 8],[2, 4, 6]];
            for (let i = 0; i < lines.length; i++) {
              const [x, y, z] = lines[i];
              if (b[x] && b[x] === b[y] && b[x] === b[z]) {
                return b[x];
              }
            }
          }

        return {
            changePlayer,
            makeMove, 
            newGame,
            getCurrentPlayer,
            getWiner
        }
    })();

    (function () {
        UIElements.resetBtn.addEventListener('click', gameHandler.newGame);
        UIElements.board.addEventListener('click', gameHandler.makeMove);
        gameHandler.newGame()
    })();
})();