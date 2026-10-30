/* ===================================================================
   LUMORA + CYPHER SWIFT — LANDING PAGE INTERACTIVE SCRIPTS
   =================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Sticky Header Background Blur on Scroll
  const header = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      header.classList.add('shadow-sm', 'bg-white/95');
      header.classList.remove('bg-white/80');
    } else {
      header.classList.remove('shadow-sm', 'bg-white/95');
      header.classList.add('bg-white/80');
    }
  });

  // 2. Mobile Menu Toggle
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const closeMenuBtn = document.getElementById('close-mobile-menu');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileMenu.classList.remove('hidden');
      document.body.style.overflow = 'hidden';
    });

    const closeMenu = () => {
      mobileMenu.classList.add('hidden');
      document.body.style.overflow = 'auto';
    };

    if (closeMenuBtn) closeMenuBtn.addEventListener('click', closeMenu);
    mobileLinks.forEach((link) => link.addEventListener('click', closeMenu));
  }

  // 3. FAQ Accordion Interaction
  const accordionItems = document.querySelectorAll('.accordion-item');
  accordionItems.forEach((item) => {
    const headerBtn = item.querySelector('.accordion-header');
    headerBtn.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close all other accordions for clean single-view accordion
      accordionItems.forEach((other) => {
        other.classList.remove('active');
      });

      if (!isActive) {
        item.classList.add('active');
      }
    });
  });

  // 4. Smooth Anchor Scrolling
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId && targetId !== '#') {
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          e.preventDefault();
          targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      }
    });
  });

  // 5. YouTube Video Customizer / Controller
  // Easily allows replacing the YouTube Video ID or URL on the fly
  const videoIframe = document.getElementById('youtube-video-frame');
  const videoInput = document.getElementById('youtube-url-input');
  const updateVideoBtn = document.getElementById('update-video-btn');

  function extractYouTubeID(url) {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : url.trim();
  }

  if (updateVideoBtn && videoInput && videoIframe) {
    updateVideoBtn.addEventListener('click', () => {
      const rawInput = videoInput.value.trim();
      const videoId = extractYouTubeID(rawInput);
      if (videoId) {
        videoIframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
        showToast('YouTube video updated successfully! 🎬');
      } else {
        showToast('Please enter a valid YouTube Video URL or ID.', true);
      }
    });
  }

  // 6. Application Modal Handler
  const applyModal = document.getElementById('apply-modal');
  const openApplyBtns = document.querySelectorAll('.open-apply-modal');
  const closeApplyBtn = document.getElementById('close-apply-modal');
  const applyForm = document.getElementById('partner-apply-form');

  if (applyModal) {
    openApplyBtns.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        applyModal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
      });
    });

    const closeModal = () => {
      applyModal.classList.add('hidden');
      document.body.style.overflow = 'auto';
    };

    if (closeApplyBtn) closeApplyBtn.addEventListener('click', closeModal);

    applyModal.addEventListener('click', (e) => {
      if (e.target === applyModal) closeModal();
    });

    if (applyForm) {
      applyForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const submitBtn = applyForm.querySelector('button[type="submit"]');
        const origText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<span>Submitting Application...</span>';
        submitBtn.disabled = true;

        setTimeout(() => {
          submitBtn.innerHTML = '<span>Application Received! ✓</span>';
          submitBtn.classList.remove('btn-primary');
          submitBtn.classList.add('bg-emerald-600', 'text-white');

          showToast('Welcome aboard! Your partner profile has been registered. 🎉');

          setTimeout(() => {
            closeModal();
            submitBtn.innerHTML = origText;
            submitBtn.disabled = false;
            submitBtn.classList.add('btn-primary');
            submitBtn.classList.remove('bg-emerald-600', 'text-white');
            applyForm.reset();
          }, 1500);
        }, 1000);
      });
    }
  }

  // 7. Toast Notification Utility
  function showToast(message, isError = false) {
    let toast = document.getElementById('toast-notification');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'toast-notification';
      toast.className = 'fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-xl text-xs font-bold shadow-2xl transition-all duration-300 transform translate-y-10 opacity-0 flex items-center gap-2';
      document.body.appendChild(toast);
    }

    toast.className = `fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-xl text-xs font-bold shadow-2xl transition-all duration-300 transform translate-y-0 opacity-100 flex items-center gap-2 ${
      isError
        ? 'bg-rose-900 text-rose-100 border border-rose-700'
        : 'bg-slate-900 text-white border border-slate-700'
    }`;
    toast.textContent = message;

    setTimeout(() => {
      toast.classList.add('translate-y-10', 'opacity-0');
      toast.classList.remove('translate-y-0', 'opacity-100');
    }, 3500);
  }
});
