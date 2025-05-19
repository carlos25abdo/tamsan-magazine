document.addEventListener('DOMContentLoaded', function() {
  const menuToggle = document.getElementById('menu-toggle');
  const navbar = document.querySelector('.navbar');
  const body = document.body;
  let isMenuOpen = false;
  let touchStartX = 0;
  let touchEndX = 0;

  // إضافة طبقة شفافة عند فتح القائمة
  const overlay = document.createElement('div');
  overlay.className = 'menu-overlay';
  overlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
    z-index: 999;
    backdrop-filter: blur(2px);
  `;
  body.appendChild(overlay);

  function isMobile() {
    return window.innerWidth <= 768;
  }

  function openMenu() {
    isMenuOpen = true;
    navbar.classList.add('active');
    menuToggle.textContent = '✕';
    menuToggle.setAttribute('aria-label', 'إغلاق القائمة');
    overlay.style.visibility = 'visible';
    overlay.style.opacity = '1';
    body.style.overflow = 'hidden';
    navbar.style.transform = 'translateX(0)';
  }

  function closeMenu() {
    isMenuOpen = false;
    navbar.classList.remove('active');
    menuToggle.textContent = '☰ القائمة';
    menuToggle.setAttribute('aria-label', 'فتح القائمة');
    overlay.style.visibility = 'hidden';
    overlay.style.opacity = '0';
    body.style.overflow = '';
    navbar.style.transform = 'translateX(100%)';
  }

  function toggleMenu() {
    if (!isMobile()) return;
    if (isMenuOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  }

  menuToggle.addEventListener('click', toggleMenu);
  overlay.addEventListener('click', function() { if (isMenuOpen) closeMenu(); });

  navbar.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      if (isMenuOpen && isMobile()) {
        closeMenu();
      }
    });
  });

  window.addEventListener('resize', function() {
    if (!isMobile()) {
      // عند تكبير الشاشة، تأكد أن القائمة ظاهرة دائماً
      navbar.classList.remove('active');
      navbar.style.transform = '';
      overlay.style.visibility = 'hidden';
      overlay.style.opacity = '0';
      body.style.overflow = '';
      isMenuOpen = false;
    } else {
      navbar.style.transform = isMenuOpen ? 'translateX(0)' : 'translateX(100%)';
    }
  });

  // تأثيرات الروابط
  navbar.querySelectorAll('a').forEach(link => {
    link.addEventListener('mouseenter', function() {
      this.style.transform = 'translateX(-5px)';
    });
    link.addEventListener('mouseleave', function() {
      this.style.transform = 'translateX(0)';
    });
    link.addEventListener('touchstart', function() {
      this.style.transform = 'scale(0.98)';
    });
    link.addEventListener('touchend', function() {
      this.style.transform = 'scale(1)';
    });
  });

  // تحسين تجربة التمرير
  let lastScrollTop = 0;
  window.addEventListener('scroll', function() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    if (scrollTop > lastScrollTop && isMenuOpen && isMobile()) {
      closeMenu();
    }
    lastScrollTop = scrollTop;
  });

  // دعم السحب لإغلاق القائمة
  navbar.addEventListener('touchstart', function(e) {
    if (!isMobile()) return;
    touchStartX = e.changedTouches[0].screenX;
  });
  navbar.addEventListener('touchend', function(e) {
    if (!isMobile()) return;
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  });
  function handleSwipe() {
    const swipeThreshold = 50;
    const swipeDistance = touchEndX - touchStartX;
    if (swipeDistance > swipeThreshold && isMenuOpen) {
      closeMenu();
    }
  }

  // دعم إغلاق القائمة بزر Escape
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && isMenuOpen && isMobile()) {
      closeMenu();
    }
  });

  // إعداد الوضع الافتراضي عند التحميل
  if (!isMobile()) {
    navbar.classList.remove('active');
    navbar.style.transform = '';
    overlay.style.visibility = 'hidden';
    overlay.style.opacity = '0';
    body.style.overflow = '';
    isMenuOpen = false;
  } else {
    navbar.style.transform = 'translateX(100%)';
  }
});
