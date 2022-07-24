const canvasWidth = 1000;
const canvasHeight = 600;
var canvas = undefined;
var ctx = undefined;

var gameFrames = 0;
var gameSpeed = 1;

var playerKeys = {
    upPressed : true,
    downPressed : false,
}

window.onload = function(){
    startGame();
}

function startGame(){
    canvas = document.getElementById("myCanvas");
    ctx = canvas.getContext("2d");
    document.addEventListener("keydown", keyDownPressed, true);
    gameLoop();
}

function keyDownPressed(e){
    if(e.keyCode == 87){     
            player1.direction = "up";
    }
    if(e.keyCode == 83){
            player1.direction = "down";
    }
    if(e.keyCode == 38){
            player2.direction = "up";
    }
    if(e.keyCode == 40){
            player2.direction = "down";
    }
    player1.move();
    player2.move();
}



//para que no se quede el fondo borroso al actualizar frames 0 = x y = x, coordenadas de esquina inferior derecha y superior derecha
function clearGame(){
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
}

// 200 pixels a la izquierda y abajo, 
function drawGame(){
    player1.draw();
    player2.draw();
    middle.draw();
    ball.draw();
    drawNewText(player1.score, 400, 120);
    drawNewText(player2.score, 600, 120);
}

function updateGame(){
    ball.update();
    if(collisionDetection(player1, ball)|| collisionDetection(player2, ball)){
        ball.vx = ball.vx * -1.05;
        ball.vy = ball.vy * 1.05;
        //Proggresive speed up of ball

    }
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
    winGame();
    updateGame();
    window.requestAnimationFrame(gameLoop);
}

function winGame(score){
    if(player1.score >= 5){
        window.alert("Player 1 wins!")
    } else if(player2.score >= 5){
        window.alert("player 2 wins!")
    }
}

class Net {
    constructor (x, y){
        this.x = x;
        this.y = y;
        this.width = 10;
        this.height = 600;
        this.color = "gray";
    }
    draw(){
        ctx.save();
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.fill();
        ctx.restore();
    }
}

let middle = new Net(canvasWidth/2, 0);

class PlayerMonkey {
    constructor (x, y){
        this.x = x;
        this.y = y;
        this.width = 35;
        this.height = 150;
        this.color = "white";
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
        this.width = 40;
        this.height = 40;
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
    return collisionMonkeyBall(PlayerMonkey, ball) && collisionBallMonkey(PlayerMonkey, ball);
}

function collisionMonkeyBall(PlayerMonkey, ball){
    return PlayerMonkey.x <= ball.x + ball.width && PlayerMonkey.x + PlayerMonkey.width >= ball.x && 
           PlayerMonkey.y + PlayerMonkey.height >= ball.y && PlayerMonkey.y <= ball.y + ball.height;
}

function collisionBallMonkey(PlayerMonkey, ball){
    return ball.x <= PlayerMonkey.x + PlayerMonkey.width && ball.x + ball.width >= PlayerMonkey.x && 
           ball.y + ball.height >= PlayerMonkey.y && ball.y <= PlayerMonkey.y + PlayerMonkey.height;
}

function drawNewText(txt, x, y){
    ctx.font = "70px Bebas Neue";
    ctx.fillText(txt, x, y);
    ctx.fillStyle = "white";
}

function gameBallReset(){
    ball.y = 300;
    ball.x = 500 - 15;
    ball.vx = 5;
    ball.vy = 5;
    ball.vy = ball.vy * -1;
    ball.vx = ball.vx * -1;
}

