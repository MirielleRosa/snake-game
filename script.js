const playBoard = document.querySelector('.play-board');
const scoreElement = document.querySelector('.score');
const highScoreElement = document.querySelector('.high-score');
const controls = document.querySelectorAll('.controls');

let gameOver = false;
let foodX, foodY; //Posição inicial da comida
let snakeX = 5, snakeY = 5; //Posição inicial da cobra
let snakeBody = []; //Corpo da cobra
let velocityX = 0, velocityY = 0; //Velocidade da cobra
let setIntervalId;
let score = 0;

let highScore = localStorage.getItem("high-score") || 0; //Pegando o high score do local storage
highScoreElement.innerText = `High Score: ${highScore}`; //Mostrando o high score na tela

const changeFoodPosition = () => {
    //Passando número aleatório entre 1 a 30
    foodX = Math.floor(Math.random() * 30) + 1; 
    foodY = Math.floor(Math.random() * 30) + 1;
    console.log(foodX, foodY);
}

const handleGameOver = () => {
    clearInterval(setIntervalId);
    alert("Game Over");
    location.reload();
}

const changeDirection = (e) => {
    //console.log(e); Verificando o código da tecla pressionada no console 
    
    //Verificando se a tecla pressionada é uma das setas
    if(e.key === "ArrowUp" && velocityY !== 1){
        velocityX = 0;
        velocityY = -1;
    }else if(e.key === "ArrowDown" && velocityY !== -1){
        velocityX = 0;
        velocityY = 1;
    }else if(e.key === "ArrowLeft"  && velocityX !== 1){
        velocityX = -1;
        velocityY = 0;
    }else if(e.key === "ArrowRight" && velocityX !== -1){
        velocityX = 1;
        velocityY = 0;
    }else{
        console.log("Tecla inválida");
    }
    initGame();
}

controls.forEach(key => {
    //Adicionando um evento de click para cada tecla
    key.addEventListener('click', () => changeDirection({key: key.dataset.key}));
});

const initGame = () => {

    if(gameOver){
        return handleGameOver();
    }
    //Chamando a função para mudar a posição da comida
    let htmlMarkup = `<div class="food" style="grid-area: ${foodY} / ${foodX}"></div>`
    
    if(snakeX === foodX && snakeY === foodY){
        changeFoodPosition();
        snakeBody.push([foodX, foodY]); //Adicionando a posição da comida no corpo da cobra
        score++; //Incrementando o score a cada comida 

        highScore = score >= highScore ? score : highScore; //Verificando se o score atual é maior que o high score
        localStorage.setItem('high-score', highScore); //Salvando o high score no local storage
        scoreElement.innerText = `Score: ${score}`;
        highScoreElement.innerText = `High Score: ${highScore}`;
    }

    for(let i = snakeBody.length - 1; i > 0; i--){ //Percorrendo o corpo da cobra de trás para frente
        //configurando a posição do corpo da cobra
        snakeBody[i] = snakeBody[i - 1];
    }
    //configurando o primeiro elemento do corpo da cobra para a posição atual da cobra
    snakeBody[0] = [snakeX, snakeY]; 

    //atualizando a posição dos snaks com base na velocidade atual
    snakeX += velocityX;
    snakeY += velocityY;

    if(snakeX <= 0 || snakeX > 30 || snakeY <= 0 || snakeY > 30){
        gameOver = true;
    }

    for(let i = 0; i < snakeBody.length; i++){
        //Adicionando a posição do corpo da cobra no tabuleiro 
        htmlMarkup += `<div class="head" style="grid-area: ${snakeBody[i][1]} / ${snakeBody[i][0]}"></div>`
        //Verificando se a cobra bateu nela mesma
        if (i !== 0 && snakeBody[0][1] === snakeBody[i][1] && snakeBody[0][0] === snakeBody[i][0]) {
            gameOver = true;
        }
    }

    playBoard.innerHTML = htmlMarkup;
}

changeFoodPosition();
setIntervalId = setInterval(initGame, 140);
//Chamando a função para mudar a direção da cobra
document.addEventListener('keydown', changeDirection); 