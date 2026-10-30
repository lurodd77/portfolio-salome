
document.addEventListener('DOMContentLoaded', () => {
  const intro = document.getElementById('intro-screen');
  const progress = document.getElementById('scroll-progress');
  const cover = document.getElementById('cover-frame');
  const menuToggle = document.getElementById('menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  const languageButtons = document.querySelectorAll('.lang-btn');
  const skillToggles = document.querySelectorAll('.skill-toggle');
  const bridalGalleryToggle = document.getElementById('bridal-gallery-toggle');
  const bridalGallery = document.getElementById('cymbeline-gallery');

  const reduceMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;

  let currentLanguage = 'fr';

  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }

  if (!window.location.hash) {
    window.scrollTo(0, 0);
  }

  if (!reduceMotion) {
    window.setTimeout(() => {
      if (intro) {
        intro.classList.add('is-leaving');
      }

      document.body.classList.add('is-ready');
    }, 1550);

    window.setTimeout(() => {
      if (intro) {
        intro.remove();
      }
    }, 2600);
  } else {
    if (intro) {
      intro.remove();
    }

    document.body.classList.add('is-ready');
  }

  const updateProgress = () => {
    const available =
      document.documentElement.scrollHeight - window.innerHeight;

    const percentage = available > 0
      ? (window.scrollY / available) * 100
      : 0;

    if (progress) {
      progress.style.width = `${percentage}%`;
    }
  };

  window.addEventListener('scroll', updateProgress, {
    passive: true
  });

  window.addEventListener('resize', updateProgress);

  updateProgress();

  const revealItems = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window && !reduceMotion) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -35px 0px'
    });

    revealItems.forEach(item => {
      observer.observe(item);
    });
  } else {
    revealItems.forEach(item => {
      item.classList.add('visible');
    });
  }

  if (
    cover &&
    !reduceMotion &&
    window.matchMedia(
      '(hover: hover) and (pointer: fine)'
    ).matches
  ) {
    cover.addEventListener('pointermove', event => {
      const rect = cover.getBoundingClientRect();

      const x =
        (event.clientX - rect.left) / rect.width - 0.5;

      const y =
        (event.clientY - rect.top) / rect.height - 0.5;

      cover.style.transform =
        `perspective(900px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg) rotateZ(-4deg)`;
    });

    cover.addEventListener('pointerleave', () => {
      cover.style.transform = 'rotate(-4deg)';
    });
  }

  const updateMenuLabel = () => {
    if (!menuToggle || !mobileMenu) {
      return;
    }

    const open = mobileMenu.classList.contains('open');

    const label = currentLanguage === 'fr'
      ? (open ? 'Fermer le menu' : 'Ouvrir le menu')
      : (open ? 'Close menu' : 'Open menu');

    menuToggle.setAttribute('aria-label', label);
  };

  const closeMenu = () => {
    if (!mobileMenu || !menuToggle) {
      return;
    }

    mobileMenu.classList.remove('open');

    menuToggle.setAttribute('aria-expanded', 'false');

    menuToggle.textContent = '☰';

    document.body.classList.remove('menu-open');

    updateMenuLabel();
  };

  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', () => {
      const open = !mobileMenu.classList.contains('open');

      mobileMenu.classList.toggle('open', open);

      menuToggle.setAttribute(
        'aria-expanded',
        String(open)
      );

      menuToggle.textContent = open ? '✕' : '☰';

      document.body.classList.toggle(
        'menu-open',
        open
      );

      updateMenuLabel();
    });

    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', closeMenu);
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth > 800) {
        closeMenu();
      }
    });

    document.addEventListener('keydown', event => {
      if (event.key === 'Escape') {
        closeMenu();
      }
    });
  }

  const setLanguage = language => {
    if (language !== 'fr' && language !== 'en') {
      return;
    }

    currentLanguage = language;

    document.documentElement.lang = language;

    document.querySelectorAll('[data-fr][data-en]').forEach(element => {
      const translation = element.getAttribute(
        `data-${language}`
      );

      if (translation !== null) {
        element.textContent = translation;
      }
    });

    document.querySelectorAll('[data-aria-fr][data-aria-en]').forEach(element => {
      const translation = element.getAttribute(
        `data-aria-${language}`
      );

      if (translation !== null) {
        element.setAttribute(
          'aria-label',
          translation
        );
      }
    });

    languageButtons.forEach(button => {
      const active = button.dataset.lang === language;

      button.classList.toggle('active', active);

      button.setAttribute(
        'aria-pressed',
        String(active)
      );
    });

    document.title = language === 'fr'
      ? 'Salomé Cros — Portfolio Créatif'
      : 'Salomé Cros — Creative Portfolio';

    updateMenuLabel();

    try {
      localStorage.setItem(
        'salome-portfolio-language',
        language
      );
    } catch (error) {
    }
  };

  languageButtons.forEach(button => {
    button.addEventListener('click', () => {
      setLanguage(button.dataset.lang);
    });
  });

  let savedLanguage = 'fr';

  try {
    const stored = localStorage.getItem(
      'salome-portfolio-language'
    );

    if (stored === 'fr' || stored === 'en') {
      savedLanguage = stored;
    }
  } catch (error) {
  }

  setLanguage(savedLanguage);

  skillToggles.forEach(button => {
    button.addEventListener('click', () => {
      const detailId = button.getAttribute('aria-controls');

      const detail = document.getElementById(detailId);

      if (!detail) {
        return;
      }

      const willOpen =
        button.getAttribute('aria-expanded') !== 'true';

      skillToggles.forEach(otherButton => {
        const otherDetailId =
          otherButton.getAttribute('aria-controls');

        const otherDetail =
          document.getElementById(otherDetailId);

        otherButton.setAttribute(
          'aria-expanded',
          'false'
        );

        if (otherDetail) {
          otherDetail.hidden = true;
        }
      });

      button.setAttribute(
        'aria-expanded',
        String(willOpen)
      );

      detail.hidden = !willOpen;
    });
  });

  if (bridalGalleryToggle && bridalGallery) {
    bridalGallery.hidden = true;

    bridalGalleryToggle.setAttribute(
      'aria-expanded',
      'false'
    );

    const updateBridalGalleryLabel = isOpen => {
      const label = bridalGalleryToggle.querySelector(
        '[data-fr][data-en]'
      );

      if (!label) {
        return;
      }

      const translations = {
        fr: isOpen
          ? 'FERMER LES COULISSES'
          : 'DÉCOUVRIR LES COULISSES',
        en: isOpen
          ? 'CLOSE BEHIND THE SCENES'
          : 'EXPLORE BEHIND THE SCENES'
      };

      label.setAttribute('data-fr', translations.fr);
      label.setAttribute('data-en', translations.en);
      label.textContent = translations[currentLanguage];
    };

    bridalGalleryToggle.addEventListener('click', () => {
      const isOpen =
        bridalGalleryToggle.getAttribute('aria-expanded') === 'true';

      const shouldOpen = !isOpen;

      bridalGalleryToggle.setAttribute(
        'aria-expanded',
        String(shouldOpen)
      );

      bridalGallery.hidden = !shouldOpen;

      bridalGallery.classList.toggle(
        'is-open',
        shouldOpen
      );

      updateBridalGalleryLabel(shouldOpen);

      if (shouldOpen) {
        bridalGallery.querySelectorAll('.reveal').forEach(item => {
          item.classList.add('visible');
        });

        updateProgress();

        requestAnimationFrame(() => {
          bridalGallery.scrollIntoView({
            behavior: reduceMotion ? 'auto' : 'smooth',
            block: 'start'
          });
        });
      } else {
        updateProgress();
      }
    });
  }
});
