// Declaração da constante do Elemento Canvas
const canvasEl = document.querySelector("canvas"),
// Declaração da constante que da contexto ao Elemento Canvas
canvasCtx = canvasEl.getContext("2d"), 
gapX = 10

const mouse = { x: 0, y: 0 }

// Objeto campo
const field = {
    w: window.innerWidth,
    h: window.innerHeight,
    draw: function () {
        // Desenhando o campo
        canvasCtx.fillStyle = "#FF6060"
        canvasCtx.fillRect(0, 0, this.w, this.h)
    }
}

// Objeto linha
const line = {
    w: 15,
    h: field.h,
    draw: function () {
        // Desenhando a linha que divide o campo
        canvasCtx.fillStyle = "#fff"
        canvasCtx.fillRect((field.w / 2) - (this.w / 2), 0, this.w, this.h)  
    }
}

// Objeto raquete esquerda
const leftPaddle = {
    x: gapX,
    y: 0,
    w: line.w,
    h: 200,
    _move: function() {
        this.y = mouse.y - this.h / 2
    },
    draw: function() {
        // Desenhando a raquete esquerda
        canvasCtx.fillStyle = "#fff"
        canvasCtx.fillRect(this.x, this.y, this.w, this.h)

        this._move()
    }
}

// Objeto raquete direita
const rightPaddle = {
    x: (field.w - line.w - gapX),
    y: 0,
    w: line.w,
    h: 200,
    speed: 2.5,
    _move: function () {
        if(this.y + this.h / 2 < ball.y + ball.r){
            this.y += this.speed
        } else {
            this.y -= this.speed
        }
    },
    speedUp: function() {
        this.speed += 2.25
    },
    draw: function() {
        // Desenhando a raquete direita
        canvasCtx.fillStyle = "#fff"
        canvasCtx.fillRect(this.x, this.y, line.w, 200)

        this._move()
    }
}

// Objeto placar
const score = {
    human: 0,
    computer: 0,
    increaseHuman: function () {
        this.human++
    },
    increaseComputer: function () {
        this.computer++
    },
    draw: function() {
        // Desenhando o placar
        canvasCtx.font = "bold 72px Arial"
        canvasCtx.textAlign = "center"
        canvasCtx.textBaseline = "top"
        canvasCtx.fillStyle = "#B20000"
        canvasCtx.fillText(this.human, field.w / 4, 50)
        canvasCtx.fillText(this.computer, field.w / 4 + field.w / 2, 50)
    }
}

// Objeto bola
const ball = {
    x: field.w / 2,
    y: field.h / 2,
    r: 20,
    speed: 5,
    directionX: 1,
    directionY: 1,
    _calcPosition: function () {
        // Verifica se o jogador 1 fez um ponto (x > largura do campo)
        if(this.x > field.w - this.r - rightPaddle.w - gapX) {
            // Verifica se a raquete direita está na posição y da bola
            if(
                this.y + this.r > rightPaddle.y && 
                this.y - this.r < rightPaddle.y + rightPaddle.h
            ){
                // Rebate a bola invertendo o sinal do eixo x
                this._reverseX()
            } else {
                // Pontuar o jogador 1
                score.increaseHuman()
                this._pointUp()
            }
        }

        // Verifica se o jogador 2 fez um ponto (x < largura do campo)
        if(this.x < this.r + leftPaddle.w + gapX) {
            // Verifica se a raquete esquerda está na posição y da bola
            if(
                this.y + this.r > leftPaddle.y && 
                this.y - this.r < leftPaddle.y + leftPaddle.h
            ){
                // Rebate a bola invertendo o sinal do eixo x
                this._reverseX()
            } else {
                // Pontuar o jogador 2
                score.increaseComputer()
                this._pointUp()
            }
        }

        // Alerta caso um dos jogadores faça 3 pontos 
        if (score.human == 3) {
            alert("Jogador 1 ganhou.");
            score.human = 0;
            score.computer = 0;
            this.speed = 5;
            rightPaddle.speed = 2;

        } 
        if (score.computer == 3) {
            alert("Computador ganhou. Tente novamente!");
            score.human = 0;
            score.computer = 0;
            this.speed = 5;
            rightPaddle.speed = 2;
        }

        // Verifica as laterais superior e inferios do campo
        if (
            (this.y - this.r < 0 && this.directionY < 0 ) ||
            (this.y > field.h - this.r && this.directionY > 0)    
            ) {
            // Rebate a bola invertendo o sinal do eixo Y
            this._reverseY()
        }
    },
    _reverseX: function() {
        this.directionX = this.directionX * -1
    },
    _reverseY: function() {
        this.directionY = this.directionY * -1
    },
    _speedUp: function() {
        this.speed += 1.5
    },
    _pointUp: function() {
        this._speedUp()
        rightPaddle.speedUp()

        this.x = field.w / 2
        this.y = field.h /2
    },
    _move: function(){
        this.x += this.directionX * this.speed
        this.y += this.directionY * this.speed
    },
    draw: function() {
        // Desenhando a bola
        canvasCtx.fillStyle = "#fff"
        canvasCtx.beginPath()
        canvasCtx.arc(this.x, this.y, this.r, 0, 2 * Math.PI, false)
        canvasCtx.fill()

        this._calcPosition()
        this._move()
    }
}

// Função que define as propriedades de altura e de largura
function setup() {
    canvasEl.width = canvasCtx.width = field.w
    canvasEl.height = canvasCtx.height = field.h
}

// Função de desenho, onde definimos as cores e os tamanhos chamando cada objeto
function draw() {
    field.draw()
    line.draw()

    leftPaddle.draw()
    rightPaddle.draw()

    score.draw()

    ball.draw()
}

window.animateFrame = (function () {
    return (
        window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function (callback) {
            return window.setTimeout(callback, 1000 / 60)
        }
    )
})()

function main() {
    animateFrame(main)
    draw()
}

// Chamando as funções
setup()
main()

canvasEl.addEventListener('mousemove', function(e){
    mouse.x = e.pageX
    mouse.y = e.pageY
})