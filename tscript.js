var startButton = document.getElementById('start-button');
var pointsText = document.getElementById('points');
var maxPointsText = document.getElementById('max-points');
var difficultyText = document.getElementById('difficulty-text');
var timerText = document.getElementById('timer');
var numOfMolesInput = document.getElementById('number-of-moles-input');
var image = createMoleImage();
var numberOfMoles = parseInt(numOfMolesInput.value);
var isGameStarted = false;
var points = 0;
var baseTimeoutDuration = 700;
var timeoutDuration = baseTimeoutDuration;
var timeouts = [];
var difficultyRadios = document.querySelectorAll('input[name="difficulty"]');
var selectedDifficulty = 'medium';
difficultyRadios.forEach(function (radio) {
    radio.addEventListener('change', function () {
        selectedDifficulty = this.value;
        console.log(this.value);
    });
});
function toggleGame() {
    if (!isGameStarted) {
        startGame();
    }
    else {
        stopGame();
    }
}
function startGame() {
    numOfMolesInput.style.pointerEvents = 'none';
    numOfMolesInput.style.opacity = '0.6';
    numberOfMoles = parseInt(numOfMolesInput.value);
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
    timerText.innerHTML = numberOfMoles.toString();
    for (var i = 0; i < numberOfMoles; i++) {
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
    timeouts.forEach(function (t) { return clearTimeout(t); });
    timerText.innerHTML = '0';
}
function createMoleImage() {
    var moleImage = document.createElement('img');
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
    var num = Math.floor(Math.random() * 9) + 1;
    var cell = document.getElementById('cell' + num);
    var originalPadding = cell.style.padding;
    if (originalPadding)
        cell.style.padding = "0px";
    cell.appendChild(image);
    setTimeout(function () {
        cell.removeChild(image);
        if (originalPadding)
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
    pointsText.textContent = points.toString();
}
function updateMaxPoints(points) {
    if (points > parseInt(maxPointsText.innerHTML)) {
        maxPointsText.innerHTML = points.toString();
        difficultyText.innerHTML = '(' + selectedDifficulty + ')';
    }
}
function lowerCounter() {
    timerText.innerHTML = (parseInt(timerText.innerHTML) - 1).toString();
}
