// Overall game controller
const gameControlloer = (function () {

    // Make two player objects on load
    let playerCount = 1;
    function Player (name, marker = 'x') {
        if (playerCount > 1) {
            marker = 'o';
        }
        playerCount++;
        return {
            name,
            marker,
        }
    }
    let player1 = Player ('player1');
    let player2 = Player ('player2');
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

    // Play a mark on a gameboard position
    let playMove = (position, mark) => {
        if (!checkMoveValidity(position)) {
            console.log("Invalid move");
            return gameBoard;
        };
        gameBoard[position] = Players[currentIndex].marker;
        checkWins();
        switchMove();
        return gameBoard;
    }

    // Check input if the input is valid
    let checkinput = (userInput) => {
        if (userInput == 'X' || userInput =='x' || userInput == 'O' || userInput == 'o' || userInput == ' ') {
            return true;
        }
        return false;
    }

    // Check if game is won
    const wins = [[0,1,2], [3,4,5], [6,7,8], [0,3,6], [1,4,7], [2,5,8], [0,4,8] , [2,4,6]];
    function checkWins () {
        for (win of wins) {
            let won = win.every((item) => {
                return gameBoard[item] == Players[currentIndex].marker;
            }) 
            if (won) {
                console.log(`Game is over, ${Players[currentIndex]} won`);
            }
        }
    }

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
    }
})();

const DOMControlloer = (()=>  {
    
})();