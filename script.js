
const imgs = document.querySelectorAll('.holder img');
console.log(random(imgs.length));


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
