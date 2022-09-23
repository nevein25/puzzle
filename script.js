// The file-path of the executing code
const script = document.getElementsByTagName('script')[0];
const src = script.src.split('script')[0];

// Path of the empty img
let emptySquare = `${src}Pics/empty.jpg`;

let draggedImg;
let dorpTarget;
const holders = document.getElementsByClassName('holder');
const board = document.querySelector('.board');

let userName;
let score = 0;
let oldHeighScore;
let timeSpentInSec = 0;
let timeIsUp = false;


// Getting data from the user and setting game enviroment
document.querySelector('.submit').addEventListener('click', (e) => {
    const allPuzzles = ['silance', 'pearl', 'monalisa'];
    e.preventDefault();

    // Getting username
    userName = document.querySelector('#user-name').value;
    if (!userName) {
        userName = 'unknow';
    }

    oldHeighScore = parseInt(localStorage.getItem(userName));
    // If there is no score (user's first time), set it to 0
    if (!oldHeighScore) {
        oldHeighScore = 0;
        localStorage.setItem(userName, 0);
    }

    // Getting the puzzle

    const choosenPuzzle = document.querySelector('#puzzle').value;
    // Getting the level
    let level = document.querySelector('#level').value;

    // Setting the puzzle
    placeImagesRandom(allPuzzles[choosenPuzzle]);

    // Setting userName
    document.querySelector('.user-name-enterd').innerText = userName;

    // Setting difficulty of the game based on time, level will act as minutes
    timer(level);


    // Deleting the form 
    const startGame = document.querySelector('.start-game');
    startGame.remove();

    checkForEndGame();
});

// Functionalities of the game, dragging images and placing it
[...holders, board].forEach(container => {

    container.addEventListener('dragstart', (e) => {
        draggedImg = e.target;
    });
    container.addEventListener('dragover', (e) => {
        // The default behaviour does not allow to drop the items
        dorpTarget = e.target;
        e.preventDefault();
    });
    container.addEventListener('drop', (e) => {

        // Putting the img in the empty square
        if (dorpTarget.src === emptySquare) {
            dorpTarget.src = draggedImg.src;
            draggedImg.src = emptySquare;
        }

    });
});


// Making array with random unrepeated values
function random(length) {
    let randomIndexs = [];
    let randomNumber = Math.trunc(Math.random() * length);
    randomIndexs.push(randomNumber);

    while (randomIndexs.length != length) {
        for (let i = 0; i < randomIndexs.length; i++) {
            // If the random value already exists in the array, break
            if (randomNumber === randomIndexs[i]) {
                exist = true;
                break;
            }
        }
        // If the random value does not exist, add it to the array
        if (!exist) {
            randomIndexs.push(randomNumber);
        }
        exist = false;
        randomNumber = Math.trunc(Math.random() * 16);
    }
    return randomIndexs;

}

// Placing the images in random places
function placeImagesRandom(puzzleFolder) {
    const imgs = document.querySelectorAll('.holder img');
    const randomArray = random(imgs.length);
    let i = 0;
    imgs.forEach(img => {
        img.src = `${src}Pics/${puzzleFolder}/${randomArray[i] + 1}.jpg`;
        i++;
    });
}

// Timer based on level
function timer(level) {
    let seconds = 59;
    let minutes = parseInt(level);

    const minutesElement = document.querySelector('.minutes');
    const secondsElement = document.querySelector('.seconds');

    let intervalId = setInterval(() => {
        if (minutes === 0 && seconds === 0) {
            clearInterval(intervalId);
            timeIsUp = true;
        }
        else if (seconds === 0 && minutes !== 0) {
            seconds = 59;
            minutes--;
        }
        else {
            seconds--;
            minutesElement.innerText = minutes < 10 ? `0${minutes}` : minutes;
            secondsElement.innerText = seconds < 10 ? `0${seconds}` : seconds;
        }
        timeSpentInSec++;
    }, 1000);
}


function checkForEndGame() {
    let check = setInterval(() => {
        const allImgs = document.querySelectorAll('.board img');
        const ImgsPlace = []
        let empty = false;

        // Check if there are no emptys squares
        for (let i = 0; i < allImgs.length; i++) {
            // extract img name from img src
            let ImgPlace = allImgs[i].src.split('Pics/')[1].split('.jpg')[0].split('/')[1];
            ImgsPlace[i] = parseInt(ImgPlace);

            // if there are empty squares, break
            if (isNaN(ImgsPlace[i])) {
                empty = true;
            }
        }

        // if there are no empty square (so maybe user completed) compute imgs in place
        let inRightPlace = 0;
        if (!empty) {
            console.log('inside new');
            for (let i = 0; i < ImgsPlace.length; i++) {
                if (ImgsPlace[i] === (i + 1)) {
                    inRightPlace++
                }

            }
        }

        // Stop the game if user won or time is up
        if (timeIsUp || inRightPlace === 16) {

            // Calculate Score if user finshed before 00:00, otherwise score = 0
            if (!timeIsUp) {
                calculateScore();
            }
            calculateScore();
            clearInterval(check);
            endGameSetUp();
        }

    }, 2000);
}
/**
 The reference for the formula I used to calculate the score
 https://math.stackexchange.com/questions/4476575/calculate-score-in-a-game-based-on-time-passed
 */
function calculateScore() {
    score = Math.round(1000 / (Math.pow(1000, (timeSpentInSec / 600))));
    if (oldHeighScore < score) {
        localStorage.setItem(userName, score);
    }
}

function endGameSetUp() {
    const scripTag = document.getElementsByTagName('script')[0];

    const parentDiv = document.createElement('div');
    parentDiv.classList.add('end-game');

    const childDiv = document.createElement('div');
    childDiv.classList.add('message')

    parentDiv.appendChild(childDiv);
    document.body.insertBefore(parentDiv, scripTag);

    const p1 = document.createElement('p');
    p1.classList.add('cur-score');
    p1.innerText = `Your Score In This Game: ${score}`;

    const p2 = document.createElement('p');
    p2.classList.add('heigh-score');
    p2.innerText = `Your Highest Score Is: ${localStorage.getItem(userName)}`;

    const btnPlayAgain = document.createElement('button');
    btnPlayAgain.setAttribute('id', 'play-again');
    btnPlayAgain.innerText = 'Play Again?';

    const messageEle = document.querySelector('.message');
    messageEle.appendChild(p1);
    messageEle.appendChild(p2);
    messageEle.appendChild(btnPlayAgain);

    btnPlayAgain.addEventListener('click', () => location.reload());
}