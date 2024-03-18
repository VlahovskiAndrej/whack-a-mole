const startButton: HTMLElement = document.getElementById('start-button')!;
const pointsText: HTMLElement = document.getElementById('points')!;
const maxPointsText: HTMLElement = document.getElementById('max-points')!;
const difficultyText: HTMLElement = document.getElementById('difficulty-text')!;
const timerText: HTMLElement = document.getElementById('timer')!;
const numOfMolesInput: HTMLInputElement = document.getElementById('number-of-moles-input') as HTMLInputElement;
const image: HTMLImageElement = createMoleImage();

let numberOfMoles: number = parseInt(numOfMolesInput.value);
let isGameStarted: boolean = false;
let points: number = 0;
let baseTimeoutDuration: number = 700;
let timeoutDuration: number = baseTimeoutDuration;
let timeouts: NodeJS.Timeout[] = [];
const difficultyRadios: NodeListOf<HTMLInputElement> = document.querySelectorAll('input[name="difficulty"]');
let selectedDifficulty: string = 'medium';

difficultyRadios.forEach(radio => {
    radio.addEventListener('change', function() {
        selectedDifficulty = this.value;
        console.log(this.value)
    });
});

function toggleGame(): void {
    if (!isGameStarted) {
        startGame();
    } else {
        stopGame();
    }
}

function startGame(): void {

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
    for (let i = 0; i < numberOfMoles; i++) {
        timeouts.push(setTimeout(appendImageAndRemoveAfter3Seconds, i * (timeoutDuration + 100)));
        timeouts.push(setTimeout(lowerCounter, i * (timeoutDuration + 100)));
    }

    timeouts.push(setTimeout(stopGame, (timeoutDuration + 100) * numberOfMoles));
}

function stopGame(): void {

    numOfMolesInput.style.pointerEvents = 'auto';
    numOfMolesInput.style.opacity = '0.8';

    isGameStarted = false;
    updateButtonText('Start Game', 'green');
    console.log('Game stopped!');
    updateMaxPoints(points);
    timeouts.forEach(t => clearTimeout(t));
    timerText.innerHTML = '0';
}

function createMoleImage(): HTMLImageElement {
    const moleImage: HTMLImageElement = document.createElement('img');
    moleImage.src = '/images/mole.png';
    moleImage.style.width = '100%';
    moleImage.id = 'mole-image';
    return moleImage;
}

function hitMole(): void {
    points++;
    updatePointsText();
    hideMole();
}

function appendImageAndRemoveAfter3Seconds(): void {
    image.style.visibility = "visible";
    const num: number = Math.floor(Math.random() * 9) + 1;
    const cell: HTMLElement = document.getElementById('cell' + num)!;
    const originalPadding: string | null = cell.style.padding;
    if (originalPadding) cell.style.padding = "0px";
    cell.appendChild(image);

    setTimeout(function () {
        cell.removeChild(image);
        if (originalPadding) cell.style.padding = originalPadding;
    }, timeoutDuration);
}

function hideMole(): void {
    image.style.visibility = "hidden";
}

function resetPoints(): void {
    points = 0;
    updatePointsText();
}

function updateButtonText(text: string, color: string): void {
    startButton.textContent = text;
    startButton.style.backgroundColor = color;
}

function updatePointsText(): void {
    pointsText.textContent = points.toString();
}

function updateMaxPoints(points: number): void {
    if (points > parseInt(maxPointsText.innerHTML)) {
        maxPointsText.innerHTML = points.toString();
        difficultyText.innerHTML = '(' + selectedDifficulty + ')';
    }
}

function lowerCounter(): void {
    timerText.innerHTML = (parseInt(timerText.innerHTML) - 1).toString();
}

