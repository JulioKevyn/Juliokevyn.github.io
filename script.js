document.addEventListener('DOMContentLoaded', () => {
    // --- Variáveis Globais e Seletores ---
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-menu a');

    // Carrossel
    const carouselTrack = document.querySelector('.carousel-track');
    const carouselSlides = Array.from(document.querySelectorAll('.project-card'));
    const prevButton = document.querySelector('.carousel-nav.prev');
    const nextButton = document.querySelector('.carousel-nav.next');
    const carouselDotsContainer = document.querySelector('.carousel-dots');

    let currentSlideIndex = 0;
    let slidesPerPage; // Definido na função de redimensionamento
    let slideWidthWithMargin; // Definido na função de redimensionamento

    // Modais
    const viewDetailsButtons = document.querySelectorAll('.view-details-btn');
    const projectModals = document.querySelectorAll('.project-modal');
    const closeButtons = document.querySelectorAll('.project-modal .close-button');

    // Formulário de Contato
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');
    const formspreeEndpoint = 'https://formspree.io/f/mrbkqgnp'; // SEU ENDPOINT DO FORMSPREE

    // Função auxiliar para obter variável CSS (usado no formStatus)
    const getCssVar = (name) => getComputedStyle(document.documentElement).getPropertyValue(name).trim();

    // --- Funções de Ajuda ---

    // Calcula quantos slides devem ser mostrados por página no carrossel
    function calculateSlidesPerPage() {
        if (window.innerWidth <= 480) return 1;
        if (window.innerWidth <= 992) return 2;
        return 3;
    }

    // Calcula a largura de um slide, incluindo suas margens
    function calculateSlideWidthWithMargin() {
        if (carouselSlides.length === 0) return 0;
        const firstSlide = carouselSlides[0];
        const slideRect = firstSlide.getBoundingClientRect();
        const computedStyle = getComputedStyle(firstSlide);
        const marginLeft = parseFloat(computedStyle.marginLeft);
        const marginRight = parseFloat(computedStyle.marginRight);
        return slideRect.width + marginLeft + marginRight;
    }

    // Ajusta o carrossel na mudança de tamanho da tela
    function adjustCarouselOnResize() {
        slidesPerPage = calculateSlidesPerPage();
        slideWidthWithMargin = calculateSlideWidthWithMargin();

        // Garante que o índice não exceda o número total de páginas visíveis
        const maxPossibleIndex = carouselSlides.length - slidesPerPage;
        currentSlideIndex = Math.min(currentSlideIndex, Math.max(0, maxPossibleIndex)); // Garante que não seja negativo

        updateCarouselPosition();
        createCarouselDots();
    }

    // Move o carrossel para um slide específico
    function moveToSlide(track, targetSlideIndex) {
        currentSlideIndex = targetSlideIndex;
        updateCarouselPosition();
        updateCarouselDots();
    }

    // Atualiza a posição do carrossel com base no currentSlideIndex
    function updateCarouselPosition() {
        if (carouselSlides.length === 0) return;
        const offset = slideWidthWithMargin * currentSlideIndex;
        carouselTrack.style.transform = `translateX(-${offset}px)`;
    }

    // Cria os pontos de navegação do carrossel
    function createCarouselDots() {
        carouselDotsContainer.innerHTML = '';
        // Calcula o número total de "páginas" de slides
        const totalPages = Math.ceil(carouselSlides.length / slidesPerPage);

        for (let i = 0; i < totalPages; i++) {
            const dot = document.createElement('span');
            dot.classList.add('dot');
            dot.dataset.pageIndex = i; // Armazena o índice da página
            if (i === Math.floor(currentSlideIndex / slidesPerPage)) {
                dot.classList.add('active');
            }
            dot.addEventListener('click', () => {
                const pageIndex = parseInt(dot.dataset.pageIndex);
                // Mover para o primeiro slide da página clicada
                const targetSlideIndex = pageIndex * slidesPerPage;
                moveToSlide(carouselTrack, targetSlideIndex);
            });
            carouselDotsContainer.appendChild(dot);
        }
    }

    // Atualiza o estado ativo dos pontos do carrossel
    function updateCarouselDots() {
        const dots = Array.from(carouselDotsContainer.children);
        const currentPage = Math.floor(currentSlideIndex / slidesPerPage);
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentPage);
        });
    }

    // Abre um modal de projeto
    function openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('open');
            document.body.style.overflow = 'hidden'; // Bloqueia a rolagem do body
            modal.focus();
            // Adiciona um pequeno atraso para a animação do conteúdo do modal
            setTimeout(() => {
                const modalContent = modal.querySelector('.modal-content');
                if (modalContent) {
                    modalContent.style.opacity = '1';
                    modalContent.style.transform = 'translateY(0) scale(1)';
                }
            }, 50);
        }
    }

    // Fecha um modal de projeto
    function closeModal(modalElement) {
        const modalContent = modalElement.querySelector('.modal-content');
        if (modalContent) {
            modalContent.style.opacity = '0';
            modalContent.style.transform = 'translateY(-80px) scale(0.95)';
        }
        setTimeout(() => {
            modalElement.classList.remove('open');
            document.body.style.overflow = ''; // Restaura a rolagem do body
        }, 400); // Tempo para a animação de saída
    }

    // --- Event Listeners ---

    // Navegação Responsiva (Hamburger Menu)
    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('open');
        navToggle.classList.toggle('open');
    });

    // Fechar menu ao clicar em um link (mobile)
    navMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu.classList.contains('open')) {
                navMenu.classList.remove('open');
                navToggle.classList.remove('open'); // Garante que o ícone do hambúrguer volte ao normal
            }
        });
    });

    // Carrossel - Navegação Anterior/Próxima
    prevButton.addEventListener('click', () => {
        const newIndex = Math.max(0, currentSlideIndex - slidesPerPage);
        moveToSlide(carouselTrack, newIndex);
    });

    nextButton.addEventListener('click', () => {
        const maxIndex = carouselSlides.length - slidesPerPage;
        const newIndex = Math.min(maxIndex, currentSlideIndex + slidesPerPage);
        moveToSlide(carouselTrack, newIndex);
    });

    // Carrossel - Detecção de Redimensionamento para Ajuste
    window.addEventListener('resize', adjustCarouselOnResize);

    // Modais - Abrir Modal
    viewDetailsButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            event.preventDefault(); // Impede o comportamento padrão do link
            const modalId = button.dataset.modalTarget;
            openModal(modalId);
        });
    });

    // Modais - Fechar Modal (botão de fechar)
    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            closeModal(button.closest('.project-modal'));
        });
    });

    // Modais - Fechar Modal (clique fora do conteúdo ou ESC)
    projectModals.forEach(modal => {
        modal.addEventListener('click', (event) => {
            // Verifica se o clique foi no fundo do modal (fora do modal-content)
            if (event.target === modal) {
                closeModal(modal);
            }
        });
        // Fechar com tecla ESC
        modal.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') {
                closeModal(modal);
            }
        });
    });

    // Formulário de Contato (usando Formspree)
    contactForm.addEventListener('submit', async (event) => {
        event.preventDefault(); // Previne o envio padrão do formulário

        formStatus.textContent = 'Enviando transmissão...';
        formStatus.style.color = getCssVar('--primary-color');

        const formData = new FormData(contactForm);

        try {
            const response = await fetch(formspreeEndpoint, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json' // Importante para o Formspree retornar JSON
                },
                body: formData // Envia o FormData diretamente
            });

            if (response.ok) {
                formStatus.textContent = 'Transmissão enviada com sucesso! Aguarde meu retorno.';
                formStatus.style.color = getCssVar('--primary-color'); // Cor verde de sucesso
                contactForm.reset(); // Limpa o formulário após o sucesso
            } else {
                const errorData = await response.json();
                console.error('Erro ao enviar formulário Formspree:', errorData); // Para debug
                formStatus.textContent = `Falha na transmissão: ${errorData.errors ? errorData.errors[0].message : 'Tente novamente.'}`;
                formStatus.style.color = getCssVar('--accent-color'); // Cor de erro
            }
        } catch (error) {
            console.error('Erro de rede Formspree:', error); // Para debug
            formStatus.textContent = 'Erro de conexão. Verifique sua rede e tente novamente.';
            formStatus.style.color = getCssVar('--accent-color'); // Cor de erro
        }
    });

    // --- Observer para Animações de Entrada de Seções (Fade-in) ---
    const sectionObserverOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.2 // 20% do elemento visível
    };

    const sectionObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible'); // Adiciona classe para animação
                observer.unobserve(entry.target);
            }
        });
    }, sectionObserverOptions);

    sections.forEach(section => {
        section.classList.add('fade-in-section'); // Classe base para transição
        sectionObserver.observe(section);
    });

    // Adiciona classe 'active' ao link de navegação da seção atual
    const sectionsToObserve = [
        { id: 'hero', element: document.getElementById('hero') },
        { id: 'projects', element: document.getElementById('projects') },
        { id: 'about', element: document.getElementById('about') },
        { id: 'contact', element: document.getElementById('contact') }
    ];

    const sectionLinkObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    // Verifica se o href existe e se a seção é a correspondente
                    if (link.getAttribute('href') && link.getAttribute('href').includes(entry.target.id)) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, {
        root: null,
        rootMargin: '-30% 0px -70% 0px', // Ajuste para ativar quando a seção está no topo
        threshold: 0
    });

    sectionsToObserve.forEach(section => {
        if (section.element) {
            sectionLinkObserver.observe(section.element);
        }
    });

    // --- Inicialização ---
    adjustCarouselOnResize(); // Inicializa o carrossel na carga
    // Garante que a rolagem esteja liberada no início (override de qualquer CSS padrão)
    document.body.style.overflow = '';
});
