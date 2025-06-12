// js/background-animation.js
document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('background-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let W, H;
    let particles = [];

    // --- AJUSTES PARA OTIMIZAÇÃO EM MOBILE ---
    let defaultParticleCount = 100; // Padrão para desktop
    let mobileParticleCount = 30;   // Reduzido para mobile

    let defaultBaseSpeed = 0.5; // Padrão para desktop
    let mobileBaseSpeed = 0.3;   // Reduzido para mobile

    const minLineLength = 5;
    const maxLineLength = 20;
    // --- FIM DOS AJUSTES ---

    const color = 'rgba(0, 230, 118, 0.7)';
    const fadeColor = 'rgba(0, 0, 0, 0.05)';

    const chars = '0123456789ABCDEFabcdef!@#$%^&*()_+-=[]{}|;:,.<>?/~';

    // Função para redimensionar o canvas
    function resizeCanvas() {
        W = window.innerWidth;
        H = window.innerHeight;
        canvas.width = W;
        canvas.height = H;

        // Limpa e reinicializa partículas com a nova contagem/velocidade
        particles = [];
        initParticles();
    }

    // Objeto Partícula (uma linha de código)
    function Particle() {
        this.x = Math.random() * W;
        this.y = Math.random() * H;
        // Usa a baseSpeed atual (que é definida dinamicamente)
        this.speedX = (Math.random() - 0.5) * 2 * (window.innerWidth <= 768 ? mobileBaseSpeed : defaultBaseSpeed);
        this.speedY = (Math.random() - 0.5) * 2 * (window.innerWidth <= 768 ? mobileBaseSpeed : defaultBaseSpeed);
        this.length = Math.floor(Math.random() * (maxLineLength - minLineLength + 1)) + minLineLength;
        this.chars = [];
        for (let i = 0; i < this.length; i++) {
            this.chars.push(chars[Math.floor(Math.random() * chars.length)]);
        }
        this.alpha = 1;
        this.life = 0;
        this.maxLife = Math.random() * 200 + 100;
    }

    Particle.prototype.draw = function() {
        ctx.fillStyle = color;
        ctx.font = '10px Space Mono';
        ctx.globalAlpha = this.alpha;

        for (let i = 0; i < this.length; i++) {
            ctx.fillText(this.chars[i], this.x, this.y + i * 12);
        }
    };

    Particle.prototype.update = function() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.life++;

        this.alpha = 1 - (this.life / this.maxLife);

        // Recria a partícula se sair da tela ou se a vida acabar
        // Condição ajustada para a largura real das linhas de código
        if (this.x < -maxLineLength * 12 || this.x > W + maxLineLength * 12 || this.y < -maxLineLength * 12 || this.y > H + maxLineLength * 12 || this.life > this.maxLife) {
            // Reinicia a partícula em uma nova posição
            this.x = Math.random() * W;
            this.y = Math.random() * H;
            this.speedX = (Math.random() - 0.5) * 2 * (window.innerWidth <= 768 ? mobileBaseSpeed : defaultBaseSpeed);
            this.speedY = (Math.random() - 0.5) * 2 * (window.innerWidth <= 768 ? mobileBaseSpeed : defaultBaseSpeed);
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

    // Função para inicializar as partículas (chamada em init e resize)
    function initParticles() {
        // Define o número de partículas baseado no tamanho atual da tela
        const currentParticleCount = (window.innerWidth <= 768) ? mobileParticleCount : defaultParticleCount;
        for (let i = 0; i < currentParticleCount; i++) {
            particles.push(new Particle());
        }
    }

    // Loop de animação
    function animate() {
        requestAnimationFrame(animate);

        ctx.fillStyle = fadeColor;
        ctx.fillRect(0, 0, W, H);

        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();
        }
    }

    // Event listeners
    window.addEventListener('resize', resizeCanvas);

    // Inicia a animação: primeiro redimensiona, depois inicializa as partículas e começa o loop
    resizeCanvas(); // Garante o tamanho correto no início
    animate();
});
