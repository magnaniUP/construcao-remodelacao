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
});

