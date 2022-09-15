const allPuzzles = ['silance', 'pearl', 'monalisa'];
let puzzleFolder;
// The file-path of the executing code
const scripts = document.getElementsByTagName("script");
const src = scripts[scripts.length - 1].src.split('script')[0];

const imgs = document.querySelectorAll('.holder img');
let draggedImg;
let dorpTarget;
let emptySquare = `${src}Pics/empty.jpg`;


const holders = document.getElementsByClassName('holder');
const board = document.querySelector('.board');

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
        // if (draggedImg.src !== emptySquare) {

        //     let temp;
        //     emptyPlace = e.target;
        //     temp = dorpTarget.src
        //     dorpTarget.src = draggedImg.src;
        //     draggedImg.src = temp;
        // }

        if (dorpTarget.src === emptySquare) {
            dorpTarget.src = draggedImg.src;
            draggedImg.src = emptySquare;
        }
    });
});

// let start = performance.now();
// console.log(random(imgs.length));
// let end = performance.now();
// console.log(`${end - start} milliseconds`);

const submitBtn = document.querySelector('.submit');

submitBtn.addEventListener('click', (e) => {
    // Getting username
    const userName = document.querySelector('#user-name').value;

    // Getting the puzzle
    const choosenPuzzle = document.querySelector('select').value;
    puzzleFolder = allPuzzles[choosenPuzzle];


    // Deleting the form 
    const startGame = document.querySelector('.start-game');
    startGame.remove();

    placeImagesRandom();
    e.preventDefault();

});




// Placing the images in random places
function placeImagesRandom() {

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
