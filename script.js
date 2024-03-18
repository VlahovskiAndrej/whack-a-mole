// Ovaa skripta ne se koristi vishe... 

const startButton = document.getElementById('start-button');
const pointsText = document.getElementById('points');
const maxPointsText = document.getElementById('max-points');
const difficultyText = document.getElementById('difficulty-text');
const timerText = document.getElementById('timer');
const numOfMolesInput = document.getElementById('number-of-moles-input');
const difficultyRadios = document.querySelectorAll('input[name="difficulty"]');
const image = createMoleImage();

let numberOfMoles = numOfMolesInput.value;
let isGameStarted = false;
let points = 0;
let baseTimeoutDuration = 700;
let timeoutDuration = baseTimeoutDuration;
let timeouts = [];
let selectedDifficulty = 'medium';

startButton.addEventListener('click', toggleGame);
image.addEventListener('click', hitMole);

difficultyRadios.forEach(radio => {
    radio.addEventListener('change', function() {
        selectedDifficulty = this.value;
        console.log(this.value)
    });
});

function toggleGame() {
    if (!isGameStarted) {
        startGame();
    } else {
        stopGame();
    }
}

function startGame() {

    numOfMolesInput.style.pointerEvents = 'none';
    numOfMolesInput.style.opacity = '0.6';

    numberOfMoles = numOfMolesInput.value;
    switch (selectedDifficulty) {
        case 'easy':
            timeoutDuration = baseTimeoutDuration * 2;
            break;
        case 'medium':
            timeoutDuration = baseTimeoutDuration;
            break;
        case 'hard':
            timeoutDuration = baseTimeoutDuration / 2; 
            break;
        default:
            break;
    }

    isGameStarted = true;
    updateButtonText('Stop Game', 'red');
    console.log('Game started!');
    resetPoints();

    timerText.innerHTML = numberOfMoles;
    for (let i = 0; i < numberOfMoles; i++) {
        timeouts.push(setTimeout(appendImageAndRemoveAfter3Seconds, i * (timeoutDuration + 100)));
        timeouts.push(setTimeout(lowerCounter, i * (timeoutDuration + 100)));
    }

    timeouts.push(setTimeout(stopGame, (timeoutDuration + 100) * numberOfMoles));
}

function stopGame() {

    numOfMolesInput.style.pointerEvents = 'auto';
    numOfMolesInput.style.opacity = '0.8';

    isGameStarted = false;
    updateButtonText('Start Game', 'green');
    console.log('Game stopped!');
    updateMaxPoints(points);
    timeouts.forEach(t => clearTimeout(t));
    timerText.innerHTML = 0;
}

function createMoleImage() {
    const moleImage = document.createElement('img');
    moleImage.src = '/images/mole.png';
    moleImage.style.width = '100%';
    moleImage.id = 'mole-image';
    return moleImage;
}

function hitMole() {
    points++;
    updatePointsText();
    hideMole();
}

function appendImageAndRemoveAfter3Seconds() {
    image.style.visibility = "visible";
    const num = Math.floor(Math.random() * 9) + 1;
    const cell = document.getElementById('cell' + num);
    const originalPadding = cell.style.padding;
    cell.style.padding = "0px";
    cell.appendChild(image);

    setTimeout(function () {
        cell.removeChild(image);
        cell.style.padding = originalPadding;
    }, timeoutDuration);
}

function hideMole() {
    image.style.visibility = "hidden";
}

function resetPoints() {
    points = 0;
    updatePointsText();
}

function updateButtonText(text, color) {
    startButton.textContent = text;
    startButton.style.backgroundColor = color;
}

function updatePointsText() {
    pointsText.textContent = points;
}

function updateMaxPoints(points){
    if (points > maxPointsText.innerHTML){
        maxPointsText.innerHTML = points;
        difficultyText.innerHTML = '(' + selectedDifficulty + ')';
    }      
}

function lowerCounter(){
    timerText.innerHTML = parseInt(timerText.innerHTML) - 1;
}