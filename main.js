const canvasWidth = 1000;
const canvasHeight = 600;
var canvas = undefined;
var ctx = undefined;

var gameFrames = 0;
var gameSpeed = 1;

var playerKeys = {
    upPressed : false,
    downPressed : false,
}

window.onload = function(){
    startGame();
}

function startGame(){
    canvas = document.getElementById("myCanvas");
    ctx = canvas.getContext("2d");
    document.addEventListener("keydown", keyDownPressedPlayer1, false);
    document.addEventListener("keyup", keyUpPressedPlayer1, false);
    // document.addEventListener("keyright", keyRightPressed, false);
    // document.addEventListener("keyleft", keyLeftPressed, false);
    gameLoop();
}

function keyDownPressedPlayer1(e){
    if(e.keyCode == 87){
        if(player1.y > 0){
            player1.y -= player1.speed;
        }
    }
    if(e.keyCode == 83){
        if(player1.y < canvasHeight - player1.height){
            player1.y += player1.speed;
        }
    }
}

function keyUpPressedPlayer1(e){

}

//para que no se quede el fondo borroso al actualizar frames 0 = x y = x, coordenadas de esquina inferior derecha y superior derecha
function clearGame(){
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
}

// 200 pixeles a la izquierda y abajo, 
function drawGame(){
    player1.draw();
    player2.draw();
    ball.draw();
    drawNewText(player1.score, 250, 120);
    drawNewText(player2.score, 750, 120);
}

function updateGame(){
    ball.update();
    if(collisionDetection(player1, ball)|| collisionDetection(player2, ball)){
        ball.vx = ball.vx * -1;
        ball.vy = ball.vy * 1;
    }
    player2.y = ball.y; - player2/2;
    if(ball.x < -40){
        player2.score = player2.score + 1;
        gameBallReset();
    }
    else if(ball.x > canvasWidth){
        player1.score = player1.score + 1;
        gameBallReset();
    }
}

function gameLoop(timeStamp){
    clearGame();
    drawGame();
    updateGame();
    window.requestAnimationFrame(gameLoop);
}

class PlayerMonkey {
    constructor (x, y){
        this.x = x;
        this.y = y;
        this.width = 35;
        this.height = 150;
        this.color = "white";
        this.speed = 15;
        this.score = 0;
    }

    draw(){
        ctx.save();
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.fill();
        ctx.restore();
    }
}

let player1 = new PlayerMonkey(5, canvasHeight/2 - 75);
let player2 = new PlayerMonkey(canvasWidth - 40, canvasHeight/2 - 75);

class ballObject {
    constructor (x, y){
        this.x = x;
        this.y = y;
        this.width = 30;
        this.height = 30;
        this.color = "blue";
        this.speed = 5;
        this.score = 0;
        this.vx = 5;
        this.vy = 5;
    }

    draw(){
        ctx.save();
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.fill();
        ctx.restore();
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

function collisionDetection(PlayerMonkey, ball){
    if(PlayerMonkey.x < ball.x + ball.width && PlayerMonkey.x + PlayerMonkey.width > ball.x && PlayerMonkey.y + PlayerMonkey.height > ball.y && PlayerMonkey.y < ball.y + ball.height){
        return true;
    } else {
        return false;
    }
}

function drawNewText(txt, x, y){
    ctx.font = "120px Bebas Neue";
    ctx.fillText(txt, x, y);
    ctx.fillStyle = "white";
}

function gameBallReset(){
    ball.y = 300;
    ball.x = 500 - 15;
    ball.vy = ball.vy * -1;
    ball.vx = ball.vx * -1;
}