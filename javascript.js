// Overall game controller
const gameControlloer = (function () {

    // Make two player objects on load
    let playerCount = 1;
    function Player (name, marker = 'x', color) {
        color = 'blue';
        if (playerCount > 1) {
            marker = 'o';
            color = 'red';
        }
        playerCount++;
        return {
            name,
            marker,
            color,
        }
    }
    let player1 = Player ('Player1');
    let player2 = Player ('Player2');
    let Players = [player1, player2];

    // Make gameboard with an array
    let gameBoard = (() => {
        let myArray = [];
        for (let i = 0; i < 9; i++) {
            myArray.push(' ');
        }
        return myArray;
    })();

    // Current move and switch moves logic
    let currentIndex = 0;
    function switchMove () {
        currentIndex++;
        if (currentIndex == 2) {
            currentIndex = 0;
        }
    }

    // Check if the move is valid
    function checkMoveValidity (position) {
        if (gameBoard[position] == ' ') {
            return true;
        }
        return false;
    }

    // Extra game context message
    let extraMessage = '';

    // check if all squares are marked
    function checkAllMarked () {
        let allMakred = gameBoard.every((square) => {
            if (square != ' ') {
                return true;
            }
            return false;
        })
        return allMakred;
    }

    // Play a mark on a gameboard position
    let playMove = (position, mark) => {

        // check if game won
        if (freezeAll) {
            return gameBoard;
        }

        // check if move is valid
        if (!checkMoveValidity(position)) {
            extraMessage = ("Invalid move");
            return gameBoard;
        }
        else {
            extraMessage = "";
        }
       
        // mark the square
        gameBoard[position] = Players[currentIndex].marker;

         // check if all squares are marked
        if (checkAllMarked()) {
            extraMessage = `No one won`;
            freezeAll = true;
        }

        // check if won
        if (checkWins()) {
            extraMessage = `Game Over`;
            freezeAll = true;
            return gameBoard;
        };

        switchMove();
        return gameBoard;
    }

    // Check if game is won
    const wins = [[0,1,2], [3,4,5], [6,7,8], [0,3,6], [1,4,7], [2,5,8], [0,4,8] , [2,4,6]];
    function checkWins () {
        for (win of wins) {
            let won = win.every((item) => {
                return gameBoard[item] == Players[currentIndex].marker;
            }) 
            if (won) {
               return true;
            }
        }
        return false;
    }

    // get game context and extramessages
    function getContext () {
        return (`${Players[currentIndex].name}, ${Players[currentIndex].color}, ${extraMessage}`);
    }

    // freeze once game over
    let freezeAll = false;

    // Factory fucntion return
    return {

        // Get and set gameboard but disable user from setting any error values 
        get gameBoard () {
            return gameBoard;
        }, 
        set gameBoard (userArr) {
            if (Array.isArray(userArr)) {
                let valid = userArr.every((item) => checkinput(item));
                if (valid) {
                    gameBoard = userArr;
                    return gameBoard;
                }
            }
            console.log("Invalid set value for board\n");
            return gameBoard;
        },

        // Play a move
        playMove,
        getContext,
    }
})();

const DOMControlloer = (()=>  {

    // make grid on load
    let grid = document.querySelector('.grid');
    render();

    function render () {
        grid.innerHTML = ``;
        for (let i = 0; i < 9; i++) {
            let square = document.createElement('div');
            square.dataset.squareIndex = i;
            square.classList.add('square');
            let mark = gameControlloer.gameBoard[i];
            let markImg = document.createElement('div')

            if (mark == 'x') {
                markImg.classList.add('cross')
            }
            else if (mark == 'o') {
                markImg.classList.add('circle')
            }
            
            square.appendChild(markImg);
            grid.appendChild(square);
        }

        let squares = document.querySelectorAll('.square');
        for (square of squares) {
            square.addEventListener("click", (e) => {
                let squareIndex = e.target.dataset.squareIndex
                gameControlloer.playMove(squareIndex);
                updateContext();
                render();
            })
        }
    }

    let gameContext = document.querySelector('.gameContext');
    function updateContext () {
        let contexts = gameControlloer.getContext().split(', ');
        if (contexts == undefined) {
            gameContext.textContent = contexts; 
        }
        else {
            let text = contexts[0];
            let color = contexts[1];
            let extraMessage = contexts[2];

            if (extraMessage == 'Game Over') {
                gameContext.textContent = `${extraMessage} !! ${text} won !!`;
            }
            else if (extraMessage == 'No one won') {
                gameContext.textContent = `${extraMessage} !!`;  
            }
            else {
                gameContext.textContent = `${extraMessage} ${text}'s turn to play!`;
                gameContext.style.color = `${color}`;
            }
        }
    }

})();

