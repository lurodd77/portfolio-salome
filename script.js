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

  const bridalFlipCard = document.getElementById(
    'bridal-flip-card'
  );

  if (bridalFlipCard) {
    bridalFlipCard.addEventListener('click', () => {
      const isFlipped = bridalFlipCard.classList.toggle(
        'is-flipped'
      );

      bridalFlipCard.setAttribute(
        'aria-pressed',
        String(isFlipped)
      );
    });
  }

  const feedOpenButton = document.getElementById('feed-project-open');
  const feedModal = document.getElementById('feed-project-modal');
  const feedCloseButton = document.getElementById('feed-modal-close');
  const feedBackdrop = document.getElementById('feed-modal-backdrop');
  const feedImage = document.getElementById('feed-modal-image');
  const feedNumber = document.getElementById('feed-modal-number');
  const feedCounter = document.getElementById('feed-modal-counter');
  const feedPrevButton = document.getElementById('feed-prev');
  const feedNextButton = document.getElementById('feed-next');

  const feeds = [
    'images/feed1.jpg',
    'images/feed2.jpg',
    'images/feed3.jpg',
    'images/feed4.jpg',
    'images/feed5.jpg'
  ];

  let activeFeed = 0;
  let feedPreviousFocus = null;

  const updateFeed = () => {
    if (!feedImage || !feedNumber || !feedCounter) {
      return;
    }

    const number = String(activeFeed + 1).padStart(2, '0');

    feedImage.src = feeds[activeFeed];

    feedImage.alt = currentLanguage === 'fr'
      ? `Proposition de feed Instagram Cymbeline Forever ${activeFeed + 1} sur 5`
      : `Cymbeline Forever Instagram feed concept ${activeFeed + 1} of 5`;

    feedNumber.textContent = `${number} / 05`;
    feedCounter.textContent = `${number} — 05`;
  };

  const openFeedModal = () => {
    if (!feedModal) {
      return;
    }

    feedPreviousFocus = document.activeElement;

    activeFeed = 0;
    updateFeed();

    feedModal.hidden = false;
    document.body.classList.add('feed-modal-open');

    if (feedCloseButton) {
      feedCloseButton.focus();
    }
  };

  const closeFeedModal = () => {
    if (!feedModal) {
      return;
    }

    feedModal.hidden = true;
    document.body.classList.remove('feed-modal-open');

    if (feedPreviousFocus && typeof feedPreviousFocus.focus === 'function') {
      feedPreviousFocus.focus();
    }
  };

  const changeFeed = direction => {
    activeFeed = (activeFeed + direction + feeds.length) % feeds.length;

    updateFeed();
  };

  if (feedOpenButton && feedModal) {
    feedOpenButton.addEventListener('click', openFeedModal);
  }

  if (feedCloseButton) {
    feedCloseButton.addEventListener('click', closeFeedModal);
  }

  if (feedBackdrop) {
    feedBackdrop.addEventListener('click', closeFeedModal);
  }

  if (feedPrevButton) {
    feedPrevButton.addEventListener('click', () => {
      changeFeed(-1);
    });
  }

  if (feedNextButton) {
    feedNextButton.addEventListener('click', () => {
      changeFeed(1);
    });
  }

  document.addEventListener('keydown', event => {
    if (!feedModal || feedModal.hidden) {
      return;
    }

    if (event.key === 'Escape') {
      event.preventDefault();
      closeFeedModal();
    }

    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      changeFeed(-1);
    }

    if (event.key === 'ArrowRight') {
      event.preventDefault();
      changeFeed(1);
    }

    if (event.key === 'Tab') {
      const focusableElements = Array.from(
        feedModal.querySelectorAll('button:not([disabled])')
      );

      if (focusableElements.length === 0) {
        return;
      }

      const first = focusableElements[0];
      const last = focusableElements[focusableElements.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  });

  const passionPhotos = document.querySelectorAll('.passion-photo');
  const passionLightbox = document.getElementById('passion-lightbox');
  const passionLightboxImage = document.getElementById('passion-lightbox-image');
  const passionLightboxClose = document.getElementById('passion-lightbox-close');

  let lastPassionTrigger = null;

  const closePassionLightbox = () => {
    if (!passionLightbox) {
      return;
    }

    passionLightbox.hidden = true;
    document.body.style.overflow = '';
    passionLightboxImage.src = '';

    if (lastPassionTrigger) {
      lastPassionTrigger.focus();
    }
  };

  passionPhotos.forEach(button => {
    const image = button.querySelector('img');

    if (!image) {
      return;
    }

    image.addEventListener('error', () => {
      button.hidden = true;
    });

    button.addEventListener('click', () => {
      if (!passionLightbox || !passionLightboxImage) {
        return;
      }

      lastPassionTrigger = button;

      passionLightboxImage.src = image.src;
      passionLightboxImage.alt = image.alt;

      passionLightbox.hidden = false;
      document.body.style.overflow = 'hidden';

      passionLightboxClose.focus();
    });
  });

  if (passionLightboxClose) {
    passionLightboxClose.addEventListener('click', closePassionLightbox);
  }

  if (passionLightbox) {
    passionLightbox.addEventListener('click', event => {
      if (event.target === passionLightbox) {
        closePassionLightbox();
      }
    });
  }

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && passionLightbox && !passionLightbox.hidden) {
      closePassionLightbox();
    }
  });

// ==========================================
// GALERIES MOODBOARD — SECTION 06
// ==========================================

document.addEventListener('DOMContentLoaded', () => {

  // AJOUTER LES FUTURES PHOTOS ICI
  const moodboardGalleries = {
    voyages: [
      'images/voyage1.jpg',
      'images/voyage2.jpg',
      'images/voyage3.jpg',
      'images/voyage4.jpg',
      'images/voyage5.jpg'
    ],

    mode: [
      'images/mode1.jpg',
      'images/mode2.jpg',
      'images/mode3.jpg',
      'images/mode4.jpg',
      'images/mode5.jpg'
    ],

    inspirations: [
      'images/inspiration1.jpg',
      'images/inspiration2.jpg',
      'images/inspiration3.jpg',
      'images/inspiration4.jpg',
      'images/inspiration5.jpg'
    ]
  };

  const modal = document.getElementById('moodboard-modal');
  const modalImage = document.getElementById('moodboard-modal-image');
  const modalTitle = document.getElementById('moodboard-modal-title');
  const modalCounter = document.getElementById('moodboard-counter');
  const modalEmpty = document.getElementById('moodboard-empty');
  const closeButton = document.getElementById('moodboard-modal-close');
  const backdrop = document.getElementById('moodboard-modal-backdrop');
  const prevButton = document.getElementById('moodboard-prev');
  const nextButton = document.getElementById('moodboard-next');

  if (!modal || !modalImage) return;

  let currentPhotos = [];
  let currentIndex = 0;
  let lastFocusedElement = null;
  let galleryRequest = 0;

  const titles = {
    voyages: { fr: 'Voyages', en: 'Travel' },
    mode: { fr: 'Mode', en: 'Fashion' },
    inspirations: {
      fr: 'Inspirations',
      en: 'Inspirations'
    }
  };

  const getLanguage = () =>
    document.documentElement.lang === 'en' ? 'en' : 'fr';

  // Vérifie si une photo existe vraiment
  const checkImage = src => {
    return new Promise(resolve => {
      const img = new Image();

      img.onload = () => resolve(src);
      img.onerror = () => resolve(null);

      img.src = src;
    });
  };

  // Affiche la photo sélectionnée
  const updateMoodboardPhoto = () => {
    const total = currentPhotos.length;
    const hasPhotos = total > 0;

    modalImage.hidden = !hasPhotos;
    modalEmpty.hidden = hasPhotos;

    prevButton.disabled = total < 2;
    nextButton.disabled = total < 2;

    if (!hasPhotos) {
      modalImage.removeAttribute('src');
      modalCounter.textContent = '00 / 00';

      modalEmpty.textContent = getLanguage() === 'fr'
        ? 'Les photos arrivent bientôt ✳'
        : 'Photos coming soon ✳';

      return;
    }

    modalImage.src = currentPhotos[currentIndex];

    modalImage.alt = getLanguage() === 'fr'
      ? `Photo ${currentIndex + 1} sur ${total}`
      : `Photo ${currentIndex + 1} of ${total}`;

    const current = String(currentIndex + 1).padStart(2, '0');
    const count = String(total).padStart(2, '0');

    modalCounter.textContent = `${current} / ${count}`;
  };

  // Ouvre la galerie choisie
  const openMoodboardGallery = async category => {
    if (!moodboardGalleries[category]) return;

    const requestId = ++galleryRequest;

    lastFocusedElement = document.activeElement;
    currentPhotos = [];
    currentIndex = 0;

    modalTitle.textContent = titles[category][getLanguage()];

    modal.hidden = false;
    document.body.style.overflow = 'hidden';

    updateMoodboardPhoto();

    modalEmpty.textContent = getLanguage() === 'fr'
      ? 'Chargement des photos...'
      : 'Loading photos...';

    closeButton.focus();

    // Ne garde que les fichiers réellement présents
    const checkedPhotos = await Promise.all(
      moodboardGalleries[category].map(checkImage)
    );

    if (modal.hidden || requestId !== galleryRequest) return;

    currentPhotos = checkedPhotos.filter(Boolean);
    currentIndex = 0;

    updateMoodboardPhoto();
  };

  // Ferme la galerie
  const closeMoodboardGallery = () => {
    galleryRequest++;
    modal.hidden = true;

    modalImage.removeAttribute('src');
    modalImage.hidden = true;

    document.body.style.overflow = '';

    if (lastFocusedElement) {
      lastFocusedElement.focus();
    }
  };

  // Passe à la photo suivante ou précédente
  const changeMoodboardPhoto = direction => {
    if (currentPhotos.length < 2) return;

    currentIndex =
      (currentIndex + direction + currentPhotos.length)
      % currentPhotos.length;

    updateMoodboardPhoto();
  };

  // Boutons des catégories
  document.querySelectorAll('.moodboard-category').forEach(button => {
    button.addEventListener('click', () => {
      openMoodboardGallery(button.dataset.gallery);
    });
  });

  closeButton.addEventListener('click', closeMoodboardGallery);
  backdrop.addEventListener('click', closeMoodboardGallery);

  prevButton.addEventListener('click', () => {
    changeMoodboardPhoto(-1);
  });

  nextButton.addEventListener('click', () => {
    changeMoodboardPhoto(1);
  });

  // Navigation au clavier
  document.addEventListener('keydown', event => {
    if (modal.hidden) return;

    if (event.key === 'Escape') {
      closeMoodboardGallery();
    }

    if (event.key === 'ArrowLeft') {
      changeMoodboardPhoto(-1);
    }

    if (event.key === 'ArrowRight') {
      changeMoodboardPhoto(1);
    }

    if (event.key === 'Tab') {
      const focusable = [
        closeButton,
        prevButton,
        nextButton
      ].filter(button => !button.disabled);

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (
        !event.shiftKey &&
        document.activeElement === last
      ) {
        event.preventDefault();
        first.focus();
      }
    }
  });

});

});