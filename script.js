const board = document.getElementById("game-board");
const instrectionText = document.getElementById("instraction-text");
const logo = document.getElementById("logo");
const score = document.getElementById("score");
const highScoreText = document.getElementById("highScore");
let gridSize = 30;
let snake = [{ x: 10, y: 10 }];
let food = generateFood();
let direction = "right";
let isGameStarted = false;
let gameSpeedDeley = 200;
let highScore = 0;
let gameIntervalId;



function draw() {
    board.innerHTML = ""
    drawSnake();
    drawFood();
    snakeScore();
}

function drawSnake() {
    snake.forEach((segment) => {
        const snakeElement = creatElement("div", "snake");
        setPosition(snakeElement, segment);
        board.appendChild(snakeElement);
    });

}

function creatElement(tag, className) {
    const element = document.createElement(tag);
    element.className = className;
    return element;
}


function setPosition(element, position) {
    element.style.gridColumn = position.x;
    element.style.gridRow = position.y;

}

// draw();

function drawFood() {
    let foodElement = creatElement("div", "food");
    setPosition(foodElement, food);
    board.appendChild(foodElement);
}

function generateFood() {
    let x = Math.floor(Math.random() * gridSize) + 1;
    let y = Math.floor(Math.random() * gridSize) + 1;

    return { x, y }

}



function move() {
    let head = { ...snake[0] };

    switch (direction) {
        case "up":
            head.y--;
            break;
        case "down":
            head.y++;
            break;
        case "left":
            head.x--;
            break;
        case "right":
            head.x++;
            break;
    }
    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
        food = generateFood();
        SnakeSpeed();
        clearInterval(gameIntervalId);
        gameIntervalId = setInterval(() => {
            move();
            checkCollision();
            draw()
        }, gameSpeedDeley);

    } else {
        snake.pop();
    }
}

function startGame() {
    isGameStarted = true;
    instrectionText.style.display = "none";
    logo.style.display = "none";

    gameIntervalId = setInterval(() => {
        move();
        checkCollision()
        draw()
    }, gameSpeedDeley);
}

function hendleKeyPress(e) {

    if ((!isGameStarted && e.code === "Space") ||
        (!isGameStarted && e.key === " ")) {
        startGame();
        autoplay(true);
    } else {
        switch (e.key) {
            case "ArrowUp":
                direction = "up"
                break;
            case "ArrowDown":
                direction = "down";
                break;
            case "ArrowLeft":
                direction = "left";
                break;
            case "ArrowRight":
                direction = "right";
                break;
        }
    }
}

function checkCollision() {
    let head = { ...snake[0] };
    if (head.x < 1 || head.x > gridSize ||
        head.y < 1 || head.y > gridSize) {
        resetGame();
        
    }


    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            resetGame();
        }

    }


}

function resetGame() {
    stopGame();
    updateHighScore();
    snake = [{ x: 10, y: 10 }];
    food = generateFood();
    direction = "right";

    snakeScore();
}

function stopGame() {
    autoplay(false);
    
    clearInterval(gameIntervalId);
    isGameStarted = false;
    logo.style.display = "block";
    instrectionText.style.display = "block"
}

function snakeScore(){
    let currentScore = snake.length -1;
    score.textContent = currentScore.toString().padStart(3,"0")
}

function updateHighScore(){

    let curentScore  = snake.length - 1;
    if(curentScore > highScore){
         highScore = curentScore;
    }

    highScoreText.textContent = highScore.toString().padStart(3, "0");
    highScoreText.style.display = "block";
}
function SnakeSpeed() {
    let curentScore = snake.length - 1;
    if (curentScore % 5 == 0) {
        gameSpeedDeley -= 50;
        clearInterval(gameIntervalId);
        gameIntervalId = setInterval(() => {
            move();
            checkCollision();
            draw()
        }, gameSpeedDeley);
    }
}
var audioPlayer = document.createElement("AUDIO");
audioPlayer.setAttribute("id", "myAudio");
audioPlayer.setAttribute("controls", "controls");

var audioSource2 = document.createElement("SOURCE");
audioSource2.setAttribute("src", "snake.mp3");
audioSource2.setAttribute("type", "audio/mpeg");
audioPlayer.appendChild(audioSource2);
audioPlayer.style.display = "none";

function autoplay(p) {
    if(p == false){
        audioPlayer.pause();
    }else{
        audioPlayer.play();
        audioPlayer.loop = true;
    }
    document.body.appendChild(audioPlayer);
  }


document.addEventListener("keydown", hendleKeyPress)

