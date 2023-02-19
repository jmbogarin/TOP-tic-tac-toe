"use strict";

(function() {
    const UIElements = (() => {
        const resetBtn = document.querySelector("#reset-btn");
        const board = document.querySelector(".board");
        const cells = board.children;
        return {
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
        return {
            addMark,
            renderBoard    
        }
    })();

    const gameHandler = (() => {
        const _player1 = Player('Juan', 'X');
        const _player2 = Player('Manuel', 'O');
        let currentPlayer = _player1;

        let gameOn = true;
    
        const changePlayer = () => currentPlayer = currentPlayer === _player2 ? _player1 : _player2;
        
        const getCurrentPlayer = () => currentPlayer

        const newGame = () => {
            gameboard.resetBoard();
            gameOn = true;
            displayController.renderBoard();
        }

        const makeMove = (e) => {
            if (e.target.className !== "cell" || !gameOn) return

            const cellNum = Array.from(e.target.parentNode.children).indexOf(e.target);
            const mark = getCurrentPlayer().getMark();
    
            if (gameboard.setMark(cellNum, mark)) {
                displayController.addMark(cellNum, mark);
                const w = checkWinner();
                if (w){
                    console.log('Winer is: ' + w)
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
            getCurrentPlayer,
            changePlayer,
            makeMove, 
            newGame
        }
    })();

    (function () {
        UIElements.resetBtn.addEventListener('click', gameHandler.newGame);
        UIElements.board.addEventListener('click', gameHandler.makeMove);
        gameHandler.newGame()
    })();
})();