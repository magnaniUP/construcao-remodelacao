/**
 * Radu Construção & Remodelação - Scripts do Cabeçalho e Navegação
 * Etapa 1: Interatividade, Acessibilidade (A11y) e Comportamento Responsivo
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // Elementos do DOM
  const header = document.querySelector('.site-header');
  const navToggle = document.querySelector('.mobile-menu-toggle');
  const mainNav = document.getElementById('primary-navigation');
  const navLinks = document.querySelectorAll('.nav-link');
  const overlay = document.querySelector('.mobile-overlay');

  /**
   * 1. Controle do Menu Móvel (Acessibilidade + ARIA)
   */
  const openMenu = () => {
    if (!navToggle || !mainNav) return;
    navToggle.setAttribute('aria-expanded', 'true');
    navToggle.setAttribute('aria-label', 'Fechar menu de navegação');
    mainNav.classList.add('is-open');
    if (overlay) overlay.classList.add('is-visible');
    document.body.style.overflow = 'hidden'; // Evita rolagem de fundo

    // Foco no primeiro item do menu para utilizadores de teclado
    const firstLink = mainNav.querySelector('a');
    if (firstLink) {
      setTimeout(() => firstLink.focus(), 150);
    }
  };

  const closeMenu = (restoreFocus = true) => {
    if (!navToggle || !mainNav) return;
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.setAttribute('aria-label', 'Abrir menu de navegação');
    mainNav.classList.remove('is-open');
    if (overlay) overlay.classList.remove('is-visible');
    document.body.style.overflow = ''; // Restaura rolagem

    if (restoreFocus && navToggle) {
      navToggle.focus();
    }
  };

  const toggleMenu = () => {
    const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
    if (isExpanded) {
      closeMenu(false);
    } else {
      openMenu();
    }
  };

  if (navToggle) {
    navToggle.addEventListener('click', toggleMenu);
  }

  // Fechar menu ao clicar na sobreposição escura
  if (overlay) {
    overlay.addEventListener('click', () => closeMenu(true));
  }

  // Fechar menu ao pressionar a tecla Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navToggle && navToggle.getAttribute('aria-expanded') === 'true') {
      closeMenu(true);
    }
  });

  // Fechar menu ao redimensionar para ecrãs maiores (desktop)
  window.addEventListener('resize', () => {
    if (window.innerWidth > 880 && navToggle && navToggle.getAttribute('aria-expanded') === 'true') {
      closeMenu(false);
    }
  });

  /**
   * 2. Gestão de Links e Estado Ativo (.is-active)
   */
  navLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      // Atualizar classe ativa
      navLinks.forEach((l) => {
        l.classList.remove('is-active');
        l.removeAttribute('aria-current');
      });
      link.classList.add('is-active');
      link.setAttribute('aria-current', 'page');

      // Fechar menu móvel caso esteja aberto
      if (navToggle && navToggle.getAttribute('aria-expanded') === 'true') {
        closeMenu(false);
      }
    });
  });

  /**
   * 3. Efeito do Cabeçalho ao Rolar a Página (Sticky Header)
   */
  const handleScroll = () => {
    if (!header) return;
    if (window.scrollY > 15) {
      header.classList.add('is-scrolled');
    } else {
      header.classList.remove('is-scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // Execução inicial

  /**
   * 4. Filtragem Interativa do Portfólio (Etapa 6)
   * - Suporte completo a A11y / WAI-ARIA Tabs
   * - Navegação por teclado (Setas Esquerda/Direita, Home, End)
   * - Transição suave sem quebra de grelha
   */
  const filterButtons = document.querySelectorAll('.portfolio-filter-btn');
  const portfolioItems = document.querySelectorAll('.portfolio-item');
  const portfolioGrid = document.getElementById('portfolio-grid');
  const sliderDotsContainer = document.querySelector('.portfolio-slider-dots');
  const sliderPrevBtn = document.querySelector('.btn-portfolio-slider-nav.prev');
  const sliderNextBtn = document.querySelector('.btn-portfolio-slider-nav.next');

  if (filterButtons.length > 0 && portfolioItems.length > 0) {
    const getVisibleItems = () => {
      return Array.from(portfolioItems).filter((item) => !item.classList.contains('is-hidden'));
    };

    let activeSlideIndex = 0;

    const updateNavButtons = (count) => {
      if (!sliderPrevBtn || !sliderNextBtn) return;
      sliderPrevBtn.disabled = activeSlideIndex <= 0;
      sliderNextBtn.disabled = activeSlideIndex >= count - 1;
    };

    const scrollToSlide = (index) => {
      const visibleItems = getVisibleItems();
      if (index < 0 || index >= visibleItems.length || !portfolioGrid) return;
      activeSlideIndex = index;

      const targetItem = visibleItems[index];
      // Desloca estritamente o portfolioGrid, sem afetar o window ou quebrar a largura do ecrã
      const itemLeft = targetItem.offsetLeft;
      const itemWidth = targetItem.offsetWidth;
      const gridWidth = portfolioGrid.clientWidth;
      const scrollPos = itemLeft - (gridWidth - itemWidth) / 2;

      portfolioGrid.scrollTo({
        left: Math.max(0, scrollPos),
        behavior: 'smooth'
      });

      if (sliderDotsContainer) {
        const dots = sliderDotsContainer.querySelectorAll('.dot');
        dots.forEach((d, i) => {
          d.classList.toggle('is-active', i === activeSlideIndex);
        });
      }
      updateNavButtons(visibleItems.length);
    };

    const renderSliderDots = () => {
      if (!sliderDotsContainer) return;
      sliderDotsContainer.innerHTML = '';
      const visibleItems = getVisibleItems();

      if (visibleItems.length <= 1) {
        if (sliderPrevBtn) sliderPrevBtn.style.display = 'none';
        if (sliderNextBtn) sliderNextBtn.style.display = 'none';
        sliderDotsContainer.style.display = 'none';
        return;
      }

      if (sliderPrevBtn) sliderPrevBtn.style.display = '';
      if (sliderNextBtn) sliderNextBtn.style.display = '';
      sliderDotsContainer.style.display = '';

      visibleItems.forEach((_, idx) => {
        const dot = document.createElement('button');
        dot.type = 'button';
        dot.className = `dot ${idx === activeSlideIndex ? 'is-active' : ''}`;
        dot.setAttribute('role', 'tab');
        dot.setAttribute('aria-label', `Ir para o projeto ${idx + 1} de ${visibleItems.length}`);
        dot.addEventListener('click', () => {
          scrollToSlide(idx);
        });
        sliderDotsContainer.appendChild(dot);
      });

      updateNavButtons(visibleItems.length);
    };

    if (sliderPrevBtn) {
      sliderPrevBtn.addEventListener('click', () => {
        scrollToSlide(activeSlideIndex - 1);
      });
    }

    if (sliderNextBtn) {
      sliderNextBtn.addEventListener('click', () => {
        scrollToSlide(activeSlideIndex + 1);
      });
    }

    // Sincronizar indicador de bolinhas durante swipe no mobile
    let isScrollingTimer;
    if (portfolioGrid) {
      portfolioGrid.addEventListener('scroll', () => {
        clearTimeout(isScrollingTimer);
        isScrollingTimer = setTimeout(() => {
          const visibleItems = getVisibleItems();
          if (visibleItems.length === 0) return;

          const gridRect = portfolioGrid.getBoundingClientRect();
          const gridCenter = gridRect.left + gridRect.width / 2;
          let closestIndex = 0;
          let minDistance = Infinity;

          visibleItems.forEach((item, idx) => {
            const itemRect = item.getBoundingClientRect();
            const itemCenter = itemRect.left + itemRect.width / 2;
            const distance = Math.abs(gridCenter - itemCenter);
            if (distance < minDistance) {
              minDistance = distance;
              closestIndex = idx;
            }
          });

          if (closestIndex !== activeSlideIndex) {
            activeSlideIndex = closestIndex;
            if (sliderDotsContainer) {
              const dots = sliderDotsContainer.querySelectorAll('.dot');
              dots.forEach((d, i) => {
                d.classList.toggle('is-active', i === activeSlideIndex);
              });
            }
            updateNavButtons(visibleItems.length);
          }
        }, 50);
      }, { passive: true });
    }

    const applyFilter = (filterValue, clickedBtn) => {
      // 1. Atualizar estados visuais e ARIA dos botões
      filterButtons.forEach((btn) => {
        btn.classList.remove('is-active');
        btn.setAttribute('aria-selected', 'false');
        btn.setAttribute('tabindex', '-1');
      });

      clickedBtn.classList.add('is-active');
      clickedBtn.setAttribute('aria-selected', 'true');
      clickedBtn.setAttribute('tabindex', '0');

      // 2. Animação de transição suave
      if (portfolioGrid) {
        portfolioGrid.style.opacity = '0.35';
      }

      setTimeout(() => {
        portfolioItems.forEach((item) => {
          const categories = (item.getAttribute('data-category') || '').toLowerCase().split(/\s+/);
          const isMatch = filterValue === 'todos' || categories.includes(filterValue.toLowerCase());

          if (isMatch) {
            item.classList.remove('is-hidden');
          } else {
            item.classList.add('is-hidden');
          }
        });

        if (portfolioGrid) {
          portfolioGrid.style.opacity = '1';
          portfolioGrid.scrollTo({ left: 0, behavior: 'smooth' });
        }

        activeSlideIndex = 0;
        renderSliderDots();
      }, 150);
    };

    filterButtons.forEach((btn, index) => {
      // Evento de clique
      btn.addEventListener('click', () => {
        const filter = btn.getAttribute('data-filter') || 'todos';
        applyFilter(filter, btn);
      });

      // Suporte a navegação por teclado (WAI-ARIA Tabs pattern)
      btn.addEventListener('keydown', (e) => {
        let targetIndex = null;

        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
          e.preventDefault();
          targetIndex = (index + 1) % filterButtons.length;
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
          e.preventDefault();
          targetIndex = (index - 1 + filterButtons.length) % filterButtons.length;
        } else if (e.key === 'Home') {
          e.preventDefault();
          targetIndex = 0;
        } else if (e.key === 'End') {
          e.preventDefault();
          targetIndex = filterButtons.length - 1;
        }

        if (targetIndex !== null) {
          const targetBtn = filterButtons[targetIndex];
          targetBtn.focus();
          const filter = targetBtn.getAttribute('data-filter') || 'todos';
          applyFilter(filter, targetBtn);
        }
      });
    });

    // Inicializar controles do slider mobile
    renderSliderDots();
  }

  /**
   * 5. Carrossel de Testemunhos (Etapa 8)
   */
  const testimonialText = document.querySelector('.testimonial-text');
  const authorName = document.querySelector('.author-name');
  const authorLocation = document.querySelector('.author-location');
  const testimonialDots = document.querySelectorAll('.testimonial-dots .dot');
  const prevBtn = document.querySelectorAll('.btn-testimonial-nav')[0];
  const nextBtn = document.querySelectorAll('.btn-testimonial-nav')[1];

  const testimonialsData = [
    {
      text: "“A Radu superou as nossas expectativas. Trabalho de excelência, equipa sempre disponível e um resultado final incrível. Recomendo sem hesitar!”",
      name: "Sofia Mendes",
      location: "Lisboa"
    },
    {
      text: "“Cumpriram rigorosamente os prazos e o orçamento estabelecido na remodelação total do nosso apartamento em Cascais. Excelente acabamento!”",
      name: "Pedro Alvim",
      location: "Cascais"
    },
    {
      text: "“Profissionalismo, atenção ao detalhe e acompanhamento diário impecável. A nossa moradia ficou moderna, luminosa e muito confortável.”",
      name: "Mariana & Carlos Reis",
      location: "Sintra"
    }
  ];

  let currentTestimonialIndex = 0;

  const showTestimonial = (index) => {
    if (!testimonialText) return;
    currentTestimonialIndex = (index + testimonialsData.length) % testimonialsData.length;
    const data = testimonialsData[currentTestimonialIndex];

    testimonialText.style.opacity = '0';
    setTimeout(() => {
      testimonialText.textContent = data.text;
      if (authorName) authorName.textContent = data.name;
      if (authorLocation) authorLocation.textContent = data.location;
      testimonialDots.forEach((dot, i) => {
        dot.classList.toggle('is-active', i === currentTestimonialIndex);
      });
      testimonialText.style.opacity = '1';
    }, 180);
  };

  if (prevBtn) {
    prevBtn.addEventListener('click', () => showTestimonial(currentTestimonialIndex - 1));
  }
  if (nextBtn) {
    nextBtn.addEventListener('click', () => showTestimonial(currentTestimonialIndex + 1));
  }
  testimonialDots.forEach((dot, i) => {
    dot.addEventListener('click', () => showTestimonial(i));
  });

  /**
   * 6. Feedback Amigável do Formulário de Orçamento (Etapa 9)
   */
  const quoteForm = document.querySelector('.quote-form');
  if (quoteForm) {
    quoteForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = quoteForm.querySelector('.btn-submit');
      if (submitBtn) {
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = `<span>Obrigado! Pedido enviado com sucesso.</span>`;
        submitBtn.style.backgroundColor = '#2E7D32';
        setTimeout(() => {
          submitBtn.innerHTML = originalText;
          submitBtn.style.backgroundColor = '';
          quoteForm.reset();
        }, 4000);
      }
    });
  }
});



