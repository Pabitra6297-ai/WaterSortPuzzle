const colors = ["red", "blue", "green", "yellow", "purple", "orange"];
let gamePaused = false;

const sounds = {
    pour: new Audio("sounds/pour.mp3"),
    levelComplete: new Audio("sounds/level_complete.mp3"),
    click: new Audio("sounds/click.mp3"),
};

function playSound(sound) {
    if (sounds[sound]) {
        sounds[sound].currentTime = 0;
        sounds[sound].play();
    }
}

class WaterSortGame {
    constructor(levels = 30) {
        this.levels = levels;
        this.currentLevel = 1;
        this.tubes = [];
        this.loadLevel(this.currentLevel);
    }

    loadLevel(level) {
        this.tubes = [];
        let tubeCount = Math.min(4 + Math.floor(level / 5), 8);
        let colorCount = Math.min(3 + Math.floor(level / 3), 6);

        let colorsToFill = [];
        for (let i = 0; i < colorCount; i++) {
            colorsToFill.push(...Array(4).fill(colors[i]));
        }
        colorsToFill = this.shuffle(colorsToFill);

        for (let i = 0; i < tubeCount - 1; i++) {
            this.tubes.push(colorsToFill.splice(0, 4));
        }
        this.tubes.push([]);

        this.renderGame();
    }

    shuffle(array) {
        return array.sort(() => Math.random() - 0.5);
    }

    renderGame() {
        const gameBoard = document.getElementById("game-board");
        gameBoard.innerHTML = "";

        this.tubes.forEach((tube, index) => {
            const tubeElement = document.createElement("div");
            tubeElement.classList.add("tube");
            tubeElement.onclick = () => this.pourLiquid(index);

            tube.forEach(color => {
                const liquidDiv = document.createElement("div");
                liquidDiv.classList.add("liquid");
                liquidDiv.style.background = color;
                liquidDiv.style.height = "25%";
                tubeElement.appendChild(liquidDiv);
            });

            gameBoard.appendChild(tubeElement);
        });

        if (this.checkWin()) {
            playSound("levelComplete");
            alert("Level Complete! Moving to next level...");
            this.loadNextLevel();
        }
    }

    pourLiquid(index) {
        if (gamePaused) return;

        let selectedTube = this.tubes[index];
        if (!selectedTube.length) return;

        let topColor = selectedTube[selectedTube.length - 1];
        for (let i = 0; i < this.tubes.length; i++) {
            if (i !== index && (this.tubes[i].length === 0 || this.tubes[i][this.tubes[i].length - 1] === topColor) && this.tubes[i].length < 4) {
                this.tubes[i].push(selectedTube.pop());
                playSound("pour");
                this.renderGame();
                return;
            }
        }
    }

    checkWin() {
        return this.tubes.every(tube => tube.length === 0 || new Set(tube).size === 1);
    }

    loadNextLevel() {
        if (this.currentLevel < this.levels) {
            this.currentLevel++;
            this.loadLevel(this.currentLevel);
        } else {
            alert("Congratulations! You completed all levels!");
        }
    }

    pauseGame() {
        gamePaused = true;
        document.getElementById("pause-btn").style.display = "none";
        document.getElementById("resume-btn").style.display = "inline-block";
    }

    resumeGame() {
        gamePaused = false;
        document.getElementById("pause-btn").style.display = "inline-block";
        document.getElementById("resume-btn").style.display = "none";
    }
}

const game = new WaterSortGame();

document.getElementById("pause-btn").addEventListener("click", () => {
    playSound("click");
    game.pauseGame();
});

document.getElementById("resume-btn").addEventListener("click", () => {
    playSound("click");
    game.resumeGame();
});

document.getElementById("next-level-btn").addEventListener("click", () => {
    playSound("click");
    game.loadNextLevel();
});