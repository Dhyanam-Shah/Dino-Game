class DinoGame {
    constructor() {
        this.dino = document.getElementById('dino');
        this.gameContainer = document.querySelector('.game-container');
        this.scoreElement = document.getElementById('score');
        this.gameOverElement = document.getElementById('game-over');
        
        this.isJumping = false;
        this.gravity = 0.9;
        this.dinoBottom = 0;
        this.dinoVelocity = 0;
        this.score = 0;
        this.gameSpeed = 5;
        this.isGameOver = false;
        this.obstacles = [];
        
        this.init();
    }

    init() {
        document.addEventListener('keydown', (e) => this.handleKeyPress(e));
        this.gameLoop();
        this.generateObstacles();
    }

    handleKeyPress(event) {
        if (event.key === 'ArrowUp' && !this.isJumping) {
            this.jump();
        }
        if (event.key === 'Enter' && this.isGameOver) {
            this.restartGame();
        }
    }

    jump() {
        if (this.isJumping) return;
        
        this.isJumping = true;
        this.dinoVelocity = 15;
        
        const jumpAnimation = this.dino.animate([
            { bottom: '0px' },
            { bottom: '150px' },
            { bottom: '0px' }
        ], {
            duration: 600,
            easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
        });
        
        jumpAnimation.onfinish = () => {
            this.isJumping = false;
            this.dinoBottom = 0;
            this.dinoVelocity = 0;
        };
    }

    generateObstacles() {
        if (this.isGameOver) return;
        
        const obstacle = document.createElement('div');
        obstacle.classList.add('obstacle');
        this.gameContainer.appendChild(obstacle);
        this.obstacles.push(obstacle);
        
        const minGap = 1000;
        const maxGap = 2000;
        const gap = Math.floor(Math.random() * (maxGap - minGap + 1) + minGap);
        
        setTimeout(() => this.generateObstacles(), gap);
    }

    moveObstacles() {
        this.obstacles.forEach((obstacle, index) => {
            const obstacleLeft = parseInt(window.getComputedStyle(obstacle).getPropertyValue('right'));
            if (obstacleLeft > 800) {
                obstacle.remove();
                this.obstacles.splice(index, 1);
                this.score++;
                this.scoreElement.textContent = `Score: ${this.score}`;
            } else {
                obstacle.style.right = (obstacleLeft + this.gameSpeed) + 'px';
            }
        });
    }

    checkCollision() {
        const dinoRect = this.dino.getBoundingClientRect();
        
        this.obstacles.forEach(obstacle => {
            const obstacleRect = obstacle.getBoundingClientRect();
            
            if (
                dinoRect.right > obstacleRect.left &&
                dinoRect.left < obstacleRect.right &&
                dinoRect.bottom > obstacleRect.top
            ) {
                this.gameOver();
            }
        });
    }

    gameOver() {
        this.isGameOver = true;
        this.gameOverElement.classList.remove('hidden');
        this.gameSpeed = 0;
    }

    restartGame() {
        this.isGameOver = false;
        this.score = 0;
        this.gameSpeed = 5;
        this.scoreElement.textContent = 'Score: 0';
        this.gameOverElement.classList.add('hidden');
        
        this.obstacles.forEach(obstacle => obstacle.remove());
        this.obstacles = [];
        
        this.generateObstacles();
    }

    gameLoop() {
        if (!this.isGameOver) {
            this.moveObstacles();
            this.checkCollision();
        }
        requestAnimationFrame(() => this.gameLoop());
    }
}

// Start the game when the page loads
window.addEventListener('load', () => {
    new DinoGame();
});