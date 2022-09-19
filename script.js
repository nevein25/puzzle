let puzzleFolder;
const allPuzzles = ['silance', 'pearl', 'monalisa'];

// The file-path of the executing code
const script = document.querySelector("script");
const src = script.src.split('script')[0];
let foundScore;
let level;
let timeSpentInSec = 0;
let score = 0;
let timeIsUp = false;
let ImgsPlace = [];

let draggedImg;
let dorpTarget;
let emptySquare = `${src}Pics/empty.jpg`;

let userName;

const holders = document.getElementsByClassName('holder');
const board = document.querySelector('.board');

function saveData(name) {
    // localStorage.setItem(name,'nev');
}
//  localStorage.setItem('nev',20);
//  localStorage.setItem('neveen',500);

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


function endGameSetUp() {
    const scripTag = document.getElementsByTagName('script')[0];

    const parentDiv = document.createElement('div');
    parentDiv.classList.add('end-game');

    const childDiv = document.createElement('div');
    childDiv.classList.add('message')

    parentDiv.appendChild(childDiv);
    document.body.insertBefore(parentDiv, scripTag);
    /*
            <div class="message">
            <p class="cur-score">Your Score In This Game: 15</p>
            <p class="heigh-score">Your highest Score Is: 15</p>
            <button id="play-again">Play Again?</button>
        </div>
    */
    const p1 = document.createElement('p');
    p1.classList.add('cur-score');
    p1.innerText = `Your Score In This Game: ${score}`;

    const p2 = document.createElement('p');
    p2.classList.add('heigh-score');
    p2.innerText = `Your highest Score Is: ${localStorage.getItem(userName)}`;

    const btnPlayAgain = document.createElement('button');
    btnPlayAgain.setAttribute('id', 'play-again');
    btnPlayAgain.innerText = 'Play Again?';

    const messageEle = document.querySelector('.message');
    messageEle.appendChild(p1);
    messageEle.appendChild(p2);
    messageEle.appendChild(btnPlayAgain);

    btnPlayAgain.addEventListener('click',() =>location.reload());
}
// var testObject = { 'score': score = [1,2,3] };
// localStorage.setItem('neveen', 210);

// Retrieve the object from storage
// var retrievedObject = localStorage.getItem('testObject');

// console.log('retrievedObject: ', JSON.parse(retrievedObject));
// let start = performance.now();
// console.log(random(imgs.length));
// let end = performance.now();
// console.log(`${end - start} milliseconds`);

console.log(localStorage.getItem(userName));
// Getting data from the user and setting game enviroment
const submitBtn = document.querySelector('.submit');

submitBtn.addEventListener('click', (e) => {
    e.preventDefault();

    // Getting username
    userName = document.querySelector('#user-name').value;

    // if(localStorage.getItem(userName) === userName){
    //     alert('user already exsist');
    // }
    foundScore = parseInt(localStorage.getItem(userName));
    if (foundScore) {
        localStorage.setItem(userName, foundScore);
    }
    else {
        localStorage.setItem(userName, 0);
    }
    // Getting the puzzle
    const choosenPuzzle = document.querySelector('#puzzle').value;
    // Getting the level
    level = document.querySelector('#level').value;

    // Setting the puzzle
    puzzleFolder = allPuzzles[choosenPuzzle];
    placeImagesRandom();

    // Setting userName
    document.querySelector('.user-name-enterd').innerText = userName;

    // Setting difficulty of the game based on time, level will act as minutes
    timer(level);

    saveData(userName);
    // Deleting the form 
    const startGame = document.querySelector('.start-game');
    startGame.remove();

    calculateScore();
});

function calculateScore() {
    let check = setInterval(() => {
        const allImgs = document.querySelectorAll('.board img');
        const ImgsPlace = []
        let empty = false;


        for (let i = 0; i < allImgs.length; i++) {

            // extract img name from img src
            let ImgPlace = allImgs[i].src.split('Pics/')[1].split('.jpg')[0].split('/')[1];
            ImgsPlace[i] = parseInt(ImgPlace);

            // if there are empty squares, break
            if (isNaN(ImgsPlace[i])) {
                empty = true;
            }
        }

        // if there are no empty square (so maybe user completed) or time is up, compute imgs in place
        let inRightPlace = 0;
        if (!empty || timeIsUp) {
            console.log('inside new');
            for (let i = 0; i < ImgsPlace.length; i++) {
                if (ImgsPlace[i] === (i + 1)) {
                    inRightPlace++
                }

            }
        }

        // stop the game if user won or time is up
        if (timeIsUp || inRightPlace === 16) {
            //calculatesore
            if (!timeIsUp) {
                let levelTimeInSec = parseInt(level) === 0 ? 60 : parseInt(level) * 60;
                score = (levelTimeInSec - timeSpentInSec) * 5;

                let foundScore = parseInt(localStorage.getItem(userName));
                console.log(foundScore);
                if (foundScore < score) {
                    localStorage.setItem(userName, score);
                }

            }

            clearInterval(check);
            endGameSetUp();
        }

    }, 2000);
}

// Timer based on level
function timer(level) {
    let seconds = 59;
    let minutes = parseInt(level);

    const minutesElement = document.querySelector('.minutes');
    const secondsElement = document.querySelector('.seconds');

    let intervalId = setInterval(() => {
        if (minutes === 0 && seconds === 0) {
            // TODO: if user won clear the interval
            clearInterval(intervalId);
            timeIsUp = true;

            console.log('end game');

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



// Placing the images in random places
function placeImagesRandom() {
    const imgs = document.querySelectorAll('.holder img');
    const randomArray = random(imgs.length);
    let i = 0;
    imgs.forEach(img => {

        img.src = `${src}Pics/${puzzleFolder}/${randomArray[i] + 1}.jpg`;
        i++;

    });
}

// Making array with random unrepeated values
function random(length) {
    let randomIndexs = [];
    let randomNumber = Math.trunc(Math.random() * length);
    randomIndexs.push(randomNumber);

    while (randomIndexs.length != length) {
        for (let i = 0; i < randomIndexs.length; i++) {
            // if the random value already exsists in the array, break
            if (randomNumber === randomIndexs[i]) {
                exsist = true;
                break;
            }
        }
        // if the random value does not exsist add it to the array
        if (!exsist) {
            randomIndexs.push(randomNumber);
        }
        exsist = false;
        randomNumber = Math.trunc(Math.random() * 16);
    }
    return randomIndexs;

}
