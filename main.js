const canvasWidth = 1000;
const canvasHeight = 600;
var canvas = undefined;
var ctx = undefined;

var gameFrames = 0;
var gameSpeed = 1;

const music = new Audio('music/Donkey_Kong.mp3');
music.volume = 0.3;
const musicPlayer = new Audio('music/Colision-Player-1.mp3');
musicPlayer.volume = 0.5;
const musicPoint = new Audio('music/Goal-Sound.mp3');
musicPoint.volume = 0.3;

keysState = {
    87: false,
    83: false,
    38: false,
    40: false
  }
  
  function startGame() {
    player1.score = 0;
    player2.score = 0;
    gameBallReset();
    canvas = document.getElementById("myCanvas");
    ctx = canvas.getContext("2d");
    document.addEventListener("keydown", keyEvent);
    document.addEventListener("keyup", keyEvent);
    gameLoop();
  }
  
  function keyEvent(e) {
    if (keysState[e.keyCode] !== undefined) {
      keysState[e.keyCode] = e.type === 'keydown';
    }
  }
  
  function changeKeyState() {
    if (keysState[87]) {
      player1.direction = "up";
      player1.move();
    }
    if (keysState[83]) {
      player1.direction = "down";
      player1.move();
    }
    if (keysState[38]) {
      player2.direction = "up";
      player2.move();
    }
    if (keysState[40]) {
      player2.direction = "down";
      player2.move();
    }
  }  

//para que no se quede el fondo borroso al actualizar frames 0 = x y = x, coordenadas de esquina inferior derecha y superior derecha
function clearGame(){
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
}

function drawGame(){
    player1.draw();
    player2.draw();
    middle.draw();
    ball.draw();
    drawNewText(player1.score, 400, 120);
    drawNewText(player2.score, 600, 120);
    player1.name = "PLAYER 1";
    player2.name = "PLAYER 2";
    drawNewName(player1.name, 130, 50);
    drawNewName(player2.name, 800, 50);
    music.play();
}

var enableCollisionDetection = true;

function updateGame(){
    ball.update();
    if(enableCollisionDetection){
    if(collisionMonkeyBall(player1, ball)|| collisionMonkeyBall(player2, ball)){
        musicPlayer.play();
        ball.vx = ball.vx * -1.05;
        ball.vy = ball.vy * 1.05;
        //Proggresive speed up of ball
        enableCollisionDetection = false;
        setTimeout(() => {
            enableCollisionDetection = true;
        }, 1000);
    }
}
    if(ball.x < -40){
        player2.score = player2.score + 1;
        musicPoint.play();
        gameBallReset();
    }
    else if(ball.x > canvasWidth){
        player1.score = player1.score + 1;
        musicPoint.play();
        gameBallReset();
    }
}
var animation; 

function gameLoop(){
    clearGame();
    changeKeyState();
    drawGame();
    updateGame();
    if(winGame()) return;
    animation = requestAnimationFrame(gameLoop);
}

function winGame(score){
    if(player1.score >= 5){
        cancelAnimationFrame(animation);
        pl1Screen();
        clearGame();
        music.pause();
        musicPlayer.pause();
        musicPoint.pause();
        restartButton.style.display = "inline";
        return true;
    } else if(player2.score >= 5){
        cancelAnimationFrame(animation);
        pl2Screen();
        clearGame();
        music.pause();
        musicPlayer.pause();
        musicPoint.pause();
        restartButton.style.display = "inline";
        return true;
    }
}

class Net {
    constructor (x, y){
        this.x = x;
        this.y = y;
        this.width = 40;
        this.height = 600;
    }
    draw(){
        var image = new Image();
        image.src = 'images/net.png';
        ctx.drawImage(image, canvasWidth/2, 0)
    }
}

let middle = new Net(canvasWidth/2, 0);

class PlayerMonkey {
    constructor (x, y, image){
        this.x = x;
        this.y = y;
        this.image = image;
        this.name = 0;
        this.width = 120;
        this.height = 150;
        this.speed = 15;
        this.score = 0;
        this.time = 0;
        this.direction = 0;
    }

    moveUp(){
        if(this.y > 0){
            this.y -= this.speed;
        }
    }

    moveDown(){
        if(this.y < canvasHeight - this.height){
            this.y += this.speed;
        }
    }

    move(){
        if(this.direction === "up"){
            this.moveUp();
        }

        if(this.direction === "down") {
            this.moveDown();
        }
    }

    draw(){
        var image3 = new Image();
        image3.src = this.image;
        ctx.drawImage(image3, this.x , this.y,this.width, this.height);
    }
}

let player1 = new PlayerMonkey(5, canvasHeight/2 - 75, 'images/monkey1.png');
let player2 = new PlayerMonkey(canvasWidth - 120, canvasHeight/2 - 75, 'images/monkey2.png');

class ballObject {
    constructor (x, y){
        this.x = x;
        this.y = y;
        this.width = 50;
        this.height = 50;
        this.vx = 5;
        this.vy = 5;
    }

    draw(){
        var image2 = new Image();
        image2.src = 'images/ball.gif';
        ctx.drawImage(image2, this.x, this.y, this.width, this.height)
    }

    update(){
        if(this.y < 0 || this.y > canvasHeight - this.height){
            this.vy = this.vy * -1;
        }
        this.x -= this.vx;
        this.y -= this.vy;
    }
}

let ball = new ballObject(canvasWidth/2 -15, canvasHeight/2 -15);

function collisionMonkeyBall(PlayerMonkey, ball){
    return PlayerMonkey.x <= ball.x + ball.width && PlayerMonkey.x + PlayerMonkey.width >= ball.x && 
           PlayerMonkey.y + PlayerMonkey.height >= ball.y && PlayerMonkey.y <= ball.y + ball.height;
}

function drawNewText(txt, x, y){
    ctx.font = "70px Bebas Neue";
    ctx.fillText(txt, x, y);
    ctx.fillStyle = "black";
}

function drawNewName(txt, x, y){
    ctx.font = "20px Bebas Neue";
    ctx.fillText(txt, x, y);
    ctx.fillStyle = "black";
}

function gameBallReset(){
    ball.y = 300;
    ball.x = 500 - 15;
    ball.vx = 5;
    ball.vy = 5;
}

var startButton = document.getElementById("start-game");
var startScreen = document.getElementById("start-screen");
var altScreen1 = document.getElementById("player-1-wins");
var altScreen2 = document.getElementById("player-2-wins");
var restartButton = document.getElementById("restart");
var box = document.getElementById("button-container");

function pl1Screen(){
    altScreen1.style.display = "inline";
}

function pl2Screen(){
    altScreen2.style.display = "inline";
}

startButton.addEventListener("click", function(){
    startScreen.style.display = "none";
    startButton.style.display = "none";
    startGame();
});

restartButton.addEventListener("click", function(){
    altScreen1.style.display = "none";
    altScreen2.style.display = "none";
    restartButton.style.display = "none";
    startGame();
});
