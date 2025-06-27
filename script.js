document.addEventListener('DOMContentLoaded', () => {
    // --- Geração de Estrelas de Fundo ---
    const starsContainer = document.getElementById('stars-container');

    function createStars(count, minSize, maxSize, minDuration, maxDuration, delayMultiplier) {
        for (let i = 0; i < count; i++) {
            const star = document.createElement('div');
            star.classList.add('star');
            const size = Math.random() * (maxSize - minSize) + minSize; // Tamanho aleatório
            star.style.width = `${size}px`;
            star.style.height = `${size}px`;
            star.style.top = `${Math.random() * 100}%`;
            star.style.left = `${Math.random() * 100}%`;
            
            // Randomiza o delay para que as estrelas apareçam em momentos diferentes
            star.style.animationDelay = `${Math.random() * delayMultiplier}s`; 
            // Randomiza a duração do brilho
            star.style.animationDuration = `fadeInStar ${Math.random() * (maxDuration - minDuration) + minDuration}s ease-out forwards, twinkle ${Math.random() * 3 + 2}s infinite alternate ease-in-out`;
            
            starsContainer.appendChild(star);
        }
    }

    // Gerar diferentes camadas de estrelas para profundidade (aumentei a contagem)
    createStars(200, 1, 2, 1.5, 2.5, 1); // Pequenas e rápidas
    createStars(120, 2, 3, 2, 3, 2);   // Médias
    createStars(60, 3, 4, 2.5, 3.5, 3); // Maiores e mais lentas

    // --- Geração de Múltiplas Estrelas Cadentes (TEMPESTADE CÓSMICA INTENSA!) ---
    const shootingStarsContainer = document.getElementById('shooting-stars-container');

    function createShootingStar() {
        const star = document.createElement('div');
        star.classList.add('shooting-star-item');

        // Posição inicial aleatória fora da tela (superior esquerda)
        const startX = Math.random() * (-50 - (-10)) + (-10); // De -10% a -50%
        const startY = Math.random() * (-50 - (-10)) + (-10); // De -10% a -50%

        // Posição final aleatória fora da tela (inferior direita)
        const endX = Math.random() * (150 - 110) + 110; // De 110% a 150%
        const endY = Math.random() * (150 - 110) + 110; // De 110% a 150%

        // Duração e delay aleatórios para cada estrela
        const duration = Math.random() * (1.2 - 0.7) + 0.7; // Duração entre 0.7s e 1.2s (MUITO rápidas)
        const delay = Math.random() * 0.1; // Delay entre 0s e 0.1s (caindo quase que simultaneamente)

        star.style.setProperty('--start-x', `${startX}vw`);
        star.style.setProperty('--start-y', `${startY}vh`);
        star.style.setProperty('--end-x', `${endX}vw`);
        star.style.setProperty('--end-y', `${endY}vh`);
        star.style.animation = `shootingStarAnim ${duration}s ease-in-out ${delay}s forwards`;
        
        shootingStarsContainer.appendChild(star);

        // Remove a estrela após a animação para otimizar
        star.addEventListener('animationend', () => {
            star.remove();
        });
    }

    // Cria uma estrela cadente com MUITA frequência
    setInterval(createShootingStar, 50); // Cria uma estrela cadente a cada 0.05 segundos (Máximo impacto!)

    // --- Animação de Introdução e Revelação do Conteúdo ---
    const galaxyOverlay = document.getElementById('galaxy-intro-overlay');
    const contentWrapper = document.querySelector('.content-wrapper');
    const allVideos = document.querySelectorAll('.video-section video'); // Seleciona todos os vídeos

    // Tempo total da animação de introdução (estrelas + estrela cadente)
    const initialAnimationDelay = 1500; // Tempo para as estrelas e a primeira estrela cadente se destacarem
    const fadeOutDuration = 1500; // Duração do fade out do overlay
    const contentRevealDelay = 500; // Tempo após o overlay sumir para o conteúdo aparecer

    // Faz o overlay sumir após a duração total da animação de introdução
    setTimeout(() => {
        galaxyOverlay.style.opacity = '0';
    }, initialAnimationDelay);

    // Ouve o fim da transição de opacidadedo overlay para remover e mostrar o conteúdo
    galaxyOverlay.addEventListener('transitionend', () => {
        if (galaxyOverlay.style.opacity === '0') {
            galaxyOverlay.remove(); // Remove o overlay do DOM
            contentWrapper.classList.remove('hidden'); // Remove display: none
            setTimeout(() => {
                contentWrapper.classList.add('visible'); // Adiciona a classe para iniciar a animação do conteúdo
                
                // Inicia o contador, o efeito de digitação E OS VÍDEOS APENAS DEPOIS que o conteúdo é revelado
                startCountdownAndTyping();
                playAllVideos(); // Chama a função para reproduzir os vídeos
            }, contentRevealDelay);
        }
    });

    // --- Função para Iniciar Contador e Digitação (chamada após a animação de introdução) ---
    function startCountdownAndTyping() {
        // --- Contador de Tempo ---
        const startDate = new Date('2025-06-09T00:00:00'); // AJUSTE ESTA DATA E HORA EXATA! (Ano-Mês-DiaTHora:Minuto:Segundo)
        const daysSpan = document.getElementById('days');
        const hoursSpan = document.getElementById('hours');
        const minutesSpan = document.getElementById('minutes');
        const secondsSpan = document.getElementById('seconds');

        function updateCountdown() {
            const now = new Date();
            const diff = now.getTime() - startDate.getTime();

            if (diff < 0) { // Se a data de início for no futuro
                daysSpan.textContent = "00";
                hoursSpan.textContent = "00";
                minutesSpan.textContent = "00";
                secondsSpan.textContent = "00";
                return;
            }

            const seconds = Math.floor((diff / 1000) % 60);
            const minutes = Math.floor((diff / (1000 * 60)) % 60);
            const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
            const days = Math.floor(diff / (1000 * 60 * 60 * 24));

            daysSpan.textContent = days.toString().padStart(2, '0');
            hoursSpan.textContent = hours.toString().padStart(2, '0');
            minutesSpan.textContent = minutes.toString().padStart(2, '0');
            secondsSpan.textContent = seconds.toString().padStart(2, '0');
        }

        setInterval(updateCountdown, 1000); // Atualiza a cada segundo
        updateCountdown(); // Chama uma vez para iniciar imediatamente

        // --- Efeito de Digitação na Mensagem ---
        const typingEffectElement = document.getElementById('typing-effect').querySelector('p');
        // Personalize sua mensagem aqui!
        const message = `As vezes eu penso como teria sido se eu não tivesse ido falar com voce naquele dia, eu não teria conhecido a mulher da minha vida, que esta comigo em todos os momentos,me apoia e me motiva a ser uma pessoa melhor, quero aproveitar cada segundo ao seu lado, e fazer você a mulher mais feliz do mundo, te amo muito minha princesa! ❤️`;
        let textIndex = 0;
        const typingSpeed = 15; // Mais rápido: menor valor (e.g., 15ms)

        function typeWriter() {
            if (textIndex < message.length) {
                typingEffectElement.textContent += message.charAt(textIndex);
                textIndex++;
                setTimeout(typeWriter, typingSpeed);
            }
        }

        // Delay para o efeito de digitação começar, após a revelação do conteúdo
        setTimeout(typeWriter, 1000); // Começa 1 segundo após o conteúdo ser revelado
    }

    // --- Reprodução Automática de Vídeos ---
    function playAllVideos() {
        allVideos.forEach(video => {
            // O .play() retorna uma Promise, que pode ser tratada para erros.
            video.play().catch(error => {
                console.error("Erro ao tentar reproduzir vídeo automaticamente:", video.id, error);
                // Pode adicionar um fallback aqui, como um botão de play manual se a auto-reprodução falhar
            });
        });
    }

    // --- Controle da Música de Fundo ---
    const backgroundMusic = document.getElementById('backgroundMusic');
    const playMusicBtn = document.getElementById('playMusicBtn');
    const playIcon = playMusicBtn.querySelector('.fas');

    let isPlaying = false; // Estado inicial da música

    playMusicBtn.addEventListener('click', () => {
        if (isPlaying) {
            backgroundMusic.pause();
            playIcon.classList.remove('fa-pause');
            playIcon.classList.add('fa-play');
            playMusicBtn.innerHTML = '<i class="fas fa-play"></i> Tocar Nossa Música';
        } else {
            backgroundMusic.play().catch(error => {
                console.error("Erro ao tocar música:", error);
                alert("Erro ao tentar tocar a música. Seu navegador pode ter bloqueado a reprodução automática. Tente novamente ou verifique as configurações.");
            });
            playIcon.classList.remove('fa-play');
            playIcon.classList.add('fa-pause');
            playMusicBtn.innerHTML = '<i class="fas fa-pause"></i> Pausar Música';
        }
        isPlaying = !isPlaying; // Inverte o estado
    });

    // Opcional: Atualizar o botão se a música parar por conta própria (ex: fim do loop)
    backgroundMusic.addEventListener('ended', () => {
        isPlaying = false;
        playIcon.classList.remove('fa-pause');
        playIcon.classList.add('fa-play');
        playMusicBtn.innerHTML = '<i class="fas fa-play"></i> Tocar Nossa Música';
    });
});