// js/background-animation.js
document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('background-canvas');
    // Verifica se o canvas existe antes de tentar desenhar
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let W, H;
    let particles = [];
    const particleCount = 100; // Número de "linhas de código"
    const maxLines = 10; // Máximo de linhas por partícula
    const minLineLength = 5; // Comprimento mínimo da linha
    const maxLineLength = 20; // Comprimento máximo da linha
    const baseSpeed = 0.5; // Velocidade base de movimento
    const color = 'rgba(0, 230, 118, 0.7)'; // Cor principal das linhas (primary-color)
    const fadeColor = 'rgba(0, 0, 0, 0.05)'; // Cor para o rastro, mais escuro para o background

    const chars = '0123456789ABCDEFabcdef!@#$%^&*()_+-=[]{}|;:,.<>?/~'; // Caracteres para as linhas de código

    // Função para redimensionar o canvas
    function resizeCanvas() {
        W = window.innerWidth;
        H = window.innerHeight;
        canvas.width = W;
        canvas.height = H;
    }

    // Objeto Partícula (uma linha de código)
    function Particle() {
        this.x = Math.random() * W;
        this.y = Math.random() * H;
        this.speedX = (Math.random() - 0.5) * 2 * baseSpeed; // Movimento horizontal
        this.speedY = (Math.random() - 0.5) * 2 * baseSpeed; // Movimento vertical
        this.length = Math.floor(Math.random() * (maxLineLength - minLineLength + 1)) + minLineLength;
        this.chars = [];
        for (let i = 0; i < this.length; i++) {
            this.chars.push(chars[Math.floor(Math.random() * chars.length)]);
        }
        this.alpha = 1; // Transparência inicial
        this.life = 0; // Para controlar o fade-out
        this.maxLife = Math.random() * 200 + 100; // Duração da partícula
    }

    Particle.prototype.draw = function() {
        ctx.fillStyle = color;
        ctx.font = '10px Space Mono'; // Fonte monoespaçada para os caracteres
        ctx.globalAlpha = this.alpha;

        for (let i = 0; i < this.length; i++) {
            ctx.fillText(this.chars[i], this.x, this.y + i * 12); // Desenha cada caractere da linha
        }
    };

    Particle.prototype.update = function() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.life++;

        // Fade out
        this.alpha = 1 - (this.life / this.maxLife);

        // Recria a partícula se sair da tela ou se a vida acabar
        if (this.x < -20 || this.x > W + 20 || this.y < -20 || this.y > H + 20 || this.life > this.maxLife) {
            this.x = Math.random() * W;
            this.y = Math.random() * H;
            this.speedX = (Math.random() - 0.5) * 2 * baseSpeed;
            this.speedY = (Math.random() - 0.5) * 2 * baseSpeed;
            this.length = Math.floor(Math.random() * (maxLineLength - minLineLength + 1)) + minLineLength;
            this.chars = [];
            for (let i = 0; i < this.length; i++) {
                this.chars.push(chars[Math.floor(Math.random() * chars.length)]);
            }
            this.alpha = 1;
            this.life = 0;
            this.maxLife = Math.random() * 200 + 100;
        }
    };

    // Inicializa as partículas
    function init() {
        resizeCanvas();
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }
    }

    // Loop de animação
    function animate() {
        requestAnimationFrame(animate);

        // Cria um rastro (fade-out)
        ctx.fillStyle = fadeColor;
        ctx.fillRect(0, 0, W, H);

        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();
        }
    }

    // Event listeners
    window.addEventListener('resize', resizeCanvas);

    // Inicia a animação
    init();
    animate();
});