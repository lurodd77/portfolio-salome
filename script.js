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

  // ==========================================
  // PASSIONS : ALBUM PHOTO INTÉGRÉ À LA PAGE
  // ==========================================




const journalSelections = {
  voyages: [7, 2, 10, 5, 14, 19],
  mode: [1, 4, 7, 3, 10, 13],
  concerts: [0, 1, 2, 3, 4, 6]
};


const journalCopy = {
  voyages: {
    fr: [
      "Carnet de départs et d’échappées.",
      "Partir, observer, photographier. Les paysages changent, les souvenirs restent.",
      "« Collectionner les horizons. »"
    ],
    en: [
      "Notes from elsewhere.",
      "Leaving, observing, photographing. Landscapes change, memories stay.",
      "“Collecting horizons.”"
    ]
  },
  mode: {
    fr: [
      "Silhouettes, matières et inspirations.",
      "Une matière, une silhouette, un détail : autant de façons de raconter une histoire sans un mot.",
      "« Le style est un langage. »"
    ],
    en: [
      "Silhouettes, textures and inspiration.",
      "A fabric, a silhouette, a detail: countless ways to tell a story without words.",
      "“Style is a language.”"
    ]
  },
  concerts: {
    fr: [
      "La musique à l’état brut.",
      "Des scènes, de la lumière et des émotions saisies sur le vif.",
      "« Ces instants qui vibrent. »"
    ],
    en: [
      "Music, unfiltered.",
      "Stages, lights and emotions captured live.",
      "“Moments that resonate.”"
    ]
  }
};


  // On conserve exactement les chemins de tes fichiers d'origine.
  const albumCollections = {
    voyages: {
      number: '01',
      title: { fr: 'Voyages', en: 'Travel' },
      description: {
        fr: "Mes souvenirs d'ailleurs.",
        en: 'Memories from elsewhere.'
      },
      photos: Array.from(
        { length: 20 },
        (_, index) => `images/voyages/voyage (${index + 1}).jpeg`
      )
    },
    mode: {
      number: '02',
      title: { fr: 'Mode', en: 'Fashion' },
      description: {
        fr: "Les détails qui m'inspirent.",
        en: 'Details that inspire me.'
      },
      photos: Array.from(
        { length: 14 },
        (_, index) => index === 0
          ? 'images/mode/mode1.jpg'
          : `images/mode/mode${index + 1}.jpeg`
      )
    },
    concerts: {
      number: '03',
      title: { fr: 'Concerts', en: 'Concerts' },
      description: {
        fr: 'Les instants que je veux garder.',
        en: 'Moments I want to remember.'
      },
      photos: Array.from(
        { length: 7 },
        (_, index) => `images/concert/concert (${index + 1}).jpeg`
      )
    }
  };

  const passionsAlbum = document.getElementById('passions-album');
  const passionsAlbumGrid = document.getElementById('passions-album-grid');
  const passionsAlbumTitle = document.getElementById('passions-album-title');
  const passionsAlbumDescription = document.getElementById('passions-album-description');
  const passionsAlbumKicker = document.getElementById('passions-album-kicker');
  const passionsAlbumEdition = document.getElementById('passions-album-edition');
  const passionsAlbumCount = document.getElementById('passions-album-count');
  const passionsAlbumClose = document.getElementById('passions-album-close');
  const passionsAlbumCloseLabel = document.getElementById('passions-album-close-label');
  const passionsCovers = document.querySelectorAll('#passions .moodboard-category[data-gallery]');
  const passionsTabs = document.querySelectorAll('#passions .passions-album-tab[data-album]');

  if (passionsAlbum && passionsAlbumGrid && passionsAlbumClose) {
    let activeAlbum = null;
    let lastAlbumOpener = null;

    const albumLanguage = () =>
      document.documentElement.lang === 'en' ? 'en' : 'fr';

    const updateAlbumCount = () => {
      const total = passionsAlbumGrid.querySelectorAll('.passions-album-photo').length;
      const label = albumLanguage() === 'en' ? 'PHOTOS' : 'PHOTOS';
      passionsAlbumCount.textContent =
        `${String(total).padStart(2, '0')} ${label}`;
    };

    const updateAlbumLabels = () => {
      if (!activeAlbum) return;

      const language = albumLanguage();
      const collection = albumCollections[activeAlbum];

      // textContent évite de modifier les attributs et de créer du HTML inutile.
      passionsAlbumTitle.textContent = `${collection.title[language]}.`;
      passionsAlbumDescription.textContent = collection.description[language];
      passionsAlbumKicker.textContent = language === 'en'
        ? 'A LITTLE PIECE OF MY WORLD ✳'
        : 'UN PETIT MORCEAU DE MON UNIVERS ✳';
      passionsAlbumEdition.textContent = language === 'en'
        ? `ISSUE ${collection.number} / 03`
        : `ÉDITION ${collection.number} / 03`;
      passionsAlbumCloseLabel.textContent = language === 'en' ? 'CLOSE' : 'FERMER';
      passionsAlbumClose.setAttribute('aria-label',
        language === 'en' ? 'Close the photo album' : "Fermer l'album photo");

      passionsTabs.forEach(tab => {
        const name = albumCollections[tab.dataset.album];
        const selected = tab.dataset.album === activeAlbum;
        tab.textContent = name.title[language];
        tab.classList.toggle('active', selected);
        tab.setAttribute('aria-pressed', String(selected));
      });

      passionsAlbumGrid.setAttribute('aria-label',
        language === 'en'
          ? `${collection.title.en} photo collection`
          : `Collection de photos : ${collection.title.fr}`);



      updateAlbumCount();
    };

    const closeAlbum = () => {
      passionsAlbum.hidden = true;
      passionsAlbum.removeAttribute('data-category');
      activeAlbum = null;
      passionsAlbumGrid.replaceChildren();
      passionsCovers.forEach(coverButton => {
        coverButton.setAttribute('aria-expanded', 'false');
      });
      updateProgress();
      if (lastAlbumOpener?.isConnected) {
        lastAlbumOpener.focus({ preventScroll: true });
        lastAlbumOpener.scrollIntoView({
          behavior: reduceMotion ? 'auto' : 'smooth',
          block: 'center'
        });
      }
    };

    const openAlbum = (category, shouldScroll = true) => {
      const collection = albumCollections[category];
      if (!collection) return;

      activeAlbum = category;
      passionsAlbum.dataset.category = category;

      const fragment = document.createDocumentFragment();

      
journalSelections[category].forEach((index) => {
  const source = collection.photos[index];

        const figure = document.createElement('figure');
        figure.className = 'passions-album-photo';

        const image = document.createElement('img');
        image.src = source;
        image.alt = albumLanguage() === 'en'
          ? `${collection.title.en}, photo ${index + 1}`
          : `${collection.title.fr}, photo ${index + 1}`;
        image.loading = 'eager';
        image.decoding = 'async';

        image.addEventListener('error', () => {
          // On ne garde pas de case vide si une image manque.
          if (!figure.isConnected) return;
          figure.remove();
          updateAlbumCount();
        }, { once: true });

        const number = document.createElement('figcaption');
        number.textContent = String(index + 1).padStart(2, '0');

        figure.append(image, number);
        fragment.appendChild(figure);
      });

      
passionsAlbumGrid.replaceChildren(fragment);

// On garde seulement 6 photos.
// On les répartit dans 3 colonnes.
const boardPhotos = Array.from(
  passionsAlbumGrid.querySelectorAll('.passions-album-photo')
).slice(0, 6);

const boardColumns = Array.from({ length: 3 }, () => {
  const column = document.createElement('div');
  column.className = 'editorial-board-column';
  return column;
});


// Deux photos à gauche
boardColumns[0].append(
  boardPhotos[1],
  boardPhotos[3]
);

// Grande photo centrale + photo secondaire
boardColumns[1].append(
  boardPhotos[0],
  boardPhotos[5]
);

// Deux photos à droite
boardColumns[2].append(
  boardPhotos[2],
  boardPhotos[4]
);

passionsAlbumGrid.replaceChildren(...boardColumns);


      passionsAlbum.hidden = false;
      updateAlbumLabels();

      passionsCovers.forEach(coverButton => {
        coverButton.setAttribute('aria-expanded',
          String(coverButton.dataset.gallery === category));
      });

      updateProgress();

      if (shouldScroll) {
        window.requestAnimationFrame(() => {
          passionsAlbum.scrollIntoView({
            behavior: reduceMotion ? 'auto' : 'smooth',
            block: 'start'
          });
        });
      }
    };

    passionsCovers.forEach(coverButton => {
      coverButton.addEventListener('click', () => {
        lastAlbumOpener = coverButton;

        if (!passionsAlbum.hidden && activeAlbum === coverButton.dataset.gallery) {
          closeAlbum();
        } else {
          openAlbum(coverButton.dataset.gallery);
        }
      });
    });

    passionsTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        openAlbum(tab.dataset.album, false);
      });
    });

    passionsAlbumClose.addEventListener('click', closeAlbum);

    // Les boutons de langue existants changent aussi le texte de l'album.
    languageButtons.forEach(languageButton => {
      languageButton.addEventListener('click', updateAlbumLabels);
    });
  }

});