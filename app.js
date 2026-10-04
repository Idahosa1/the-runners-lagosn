/**
 * THE RUNNERS — LAGOS, NIGERIA
 * Interactive Motion & Experience Engine
 * Standards: Emil Kowalski (under 300ms, calibrated easing) & Jakub Krehel
 */

document.addEventListener('DOMContentLoaded', () => {
  initHeaderScroll();
  initMobileMenu();
  initNextRunCountdown();
  initCalendarFilter();
  initFaqAccordion();
  initRsvpModal();
  initRouteDetailModal();
});

/* ═══════════════════════════════════════════════════════════
   1. HEADER SCROLL POLISH
   ═══════════════════════════════════════════════════════════ */
function initHeaderScroll() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 40) {
      header.classList.add('header-scrolled');
    } else {
      header.classList.remove('header-scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

/* ═══════════════════════════════════════════════════════════
   2. MOBILE BURGER NAVIGATION
   ═══════════════════════════════════════════════════════════ */
function initMobileMenu() {
  const burgerBtn = document.getElementById('burgerBtn');
  const mobileOverlay = document.getElementById('mobileNavOverlay');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');
  const closeBtn = document.getElementById('closeMobileNavBtn');
  const mobileRsvpBtn = mobileOverlay ? mobileOverlay.querySelector('[data-open-rsvp]') : null;
  if (!burgerBtn || !mobileOverlay) return;

  let isOpen = false;

  const toggleMenu = (forcedState) => {
    isOpen = typeof forcedState === 'boolean' ? forcedState : !isOpen;
    mobileOverlay.classList.toggle('is-active', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
    burgerBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    
    const lines = burgerBtn.querySelectorAll('.burger-line');
    if (lines.length >= 2) {
      if (isOpen) {
        lines[0].style.transform = 'translateY(3.5px) rotate(45deg)';
        lines[1].style.transform = 'translateY(-3.5px) rotate(-45deg)';
      } else {
        lines[0].style.transform = 'none';
        lines[1].style.transform = 'none';
      }
    }
  };

  burgerBtn.addEventListener('click', () => toggleMenu());

  if (closeBtn) {
    closeBtn.addEventListener('click', () => toggleMenu(false));
  }

  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (isOpen) toggleMenu(false);
    });
  });

  if (mobileRsvpBtn) {
    mobileRsvpBtn.addEventListener('click', () => {
      if (isOpen) toggleMenu(false);
    });
  }

  // Keyboard accessibility: ESC closes mobile menu
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isOpen) {
      toggleMenu(false);
    }
  });
}

/* ═══════════════════════════════════════════════════════════
   3. NEXT RUN COUNTDOWN (SATURDAY 05:30 AM LAGOS TIME)
   ═══════════════════════════════════════════════════════════ */
function initNextRunCountdown() {
  const countdownEl = document.getElementById('nextRunCountdown');
  if (!countdownEl) return;

  function getNextSaturday530AM() {
    const now = new Date();
    const result = new Date(now);
    // Lagos is UTC+1
    const dayOfWeek = now.getDay(); // 0 is Sunday, 6 is Saturday
    let daysUntilSaturday = (6 - dayOfWeek + 7) % 7;
    
    result.setDate(now.getDate() + daysUntilSaturday);
    result.setHours(5, 30, 0, 0);

    // If today is Saturday and it's already past 5:30 AM, jump to next Saturday
    if (daysUntilSaturday === 0 && now.getTime() > result.getTime()) {
      result.setDate(result.getDate() + 7);
    }
    return result;
  }

  const targetDate = getNextSaturday530AM();

  function update() {
    const now = new Date().getTime();
    const diff = targetDate.getTime() - now;

    if (diff <= 0) {
      countdownEl.textContent = "RUN IN PROGRESS • 05:30 AM LAGOS";
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    countdownEl.innerHTML = `
      <span class="tabular-nums">${String(days).padStart(2, '0')}</span>d : 
      <span class="tabular-nums">${String(hours).padStart(2, '0')}</span>h : 
      <span class="tabular-nums">${String(minutes).padStart(2, '0')}</span>m : 
      <span class="tabular-nums">${String(seconds).padStart(2, '0')}</span>s
    `;
  }

  update();
  setInterval(update, 1000);
}

/* ═══════════════════════════════════════════════════════════
   4. CALENDAR FILTERING
   ═══════════════════════════════════════════════════════════ */
function initCalendarFilter() {
  const tabs = document.querySelectorAll('.tab-btn');
  const rows = document.querySelectorAll('.schedule-row');
  if (!tabs.length || !rows.length) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const filter = tab.dataset.filter;
      rows.forEach(row => {
        if (filter === 'all' || row.dataset.category === filter) {
          row.style.display = 'grid';
        } else {
          row.style.display = 'none';
        }
      });
    });
  });
}

/* ═══════════════════════════════════════════════════════════
   5. FIRST-TIMER FAQ ACCORDION (Emil Kowalski Smooth Ease)
   ═══════════════════════════════════════════════════════════ */
function initFaqAccordion() {
  const items = document.querySelectorAll('.accordion-item');
  if (!items.length) return;

  items.forEach(item => {
    const trigger = item.querySelector('.accordion-trigger');
    trigger.addEventListener('click', () => {
      const wasOpen = item.classList.contains('is-open');

      // Close all other items
      items.forEach(i => i.classList.remove('is-open'));

      if (!wasOpen) {
        item.classList.add('is-open');
      }
    });
  });
}

/* ═══════════════════════════════════════════════════════════
   6. INTERACTIVE RSVP MODAL & DIGITAL RUNNER PASS
   ═══════════════════════════════════════════════════════════ */
function initRsvpModal() {
  const modal = document.getElementById('rsvpModal');
  const openButtons = document.querySelectorAll('[data-open-rsvp]');
  const closeBtn = document.getElementById('closeRsvpModal');
  const form = document.getElementById('rsvpForm');
  const ticketPass = document.getElementById('ticketPass');
  const formFields = document.getElementById('formFields');
  const downloadIcsBtn = document.getElementById('downloadIcsBtn');

  if (!modal) return;

  const openModal = (routePreselect = '') => {
    modal.classList.add('is-open');
    document.body.style.overflow = 'hidden';

    if (routePreselect) {
      const routeSelect = document.getElementById('rsvpRoute');
      if (routeSelect) routeSelect.value = routePreselect;
    }
  };

  const closeModal = () => {
    modal.classList.remove('is-open');
    document.body.style.overflow = '';
  };

  openButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const route = btn.dataset.route || '';
      openModal(route);
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', closeModal);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('is-open')) {
      closeModal();
    }
  });

  // Handle RSVP submission
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('rsvpName').value.trim();
      const phone = document.getElementById('rsvpPhone').value.trim();
      const email = document.getElementById('rsvpEmail').value.trim();
      const pace = document.getElementById('rsvpPace').value;
      const route = document.getElementById('rsvpRoute').value;

      // Populate Digital Pass
      document.getElementById('passRunnerName').textContent = name || 'Lagos Runner';
      document.getElementById('passPaceCrew').textContent = pace;
      document.getElementById('passRoute').textContent = route;
      const randomBib = 'TR-LOS-' + Math.floor(100 + Math.random() * 900);
      document.getElementById('passBibNumber').textContent = randomBib;

      // Hide inputs, show pass
      formFields.style.display = 'none';
      ticketPass.classList.add('show');

      // Setup Calendar .ics Download
      if (downloadIcsBtn) {
        downloadIcsBtn.onclick = () => {
          generateIcsFile({
            title: `The Runners Lagos: ${route}`,
            description: `Community morning run with The Runners Lagos. Pace: ${pace}. Meet at Lekki-Ikoyi Link Bridge (Admiralty Toll Plaza). Don't forget your hydration!`,
            location: 'Lekki-Ikoyi Link Bridge, Lagos, Nigeria',
            startDate: '20261010T043000Z', // 5:30 AM Lagos (UTC+1)
            endDate: '20261010T063000Z'
          });
        };
      }
    });
  }
}

/**
 * Generate .ICS Calendar File on the fly
 */
function generateIcsFile({ title, description, location, startDate, endDate }) {
  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//The Runners Lagos//Community Run//EN',
    'BEGIN:VEVENT',
    `SUMMARY:${title}`,
    `DESCRIPTION:${description}`,
    `LOCATION:${location}`,
    `DTSTART:${startDate}`,
    `DTEND:${endDate}`,
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.setAttribute('download', 'The-Runners-Lagos-Sunrise-Run.ics');
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

/* ═══════════════════════════════════════════════════════════
   7. ROUTE DETAIL MODAL PREVIEW
   ═══════════════════════════════════════════════════════════ */
function initRouteDetailModal() {
  const detailModal = document.getElementById('routeDetailModal');
  const cards = document.querySelectorAll('.route-card');
  const closeBtn = document.getElementById('closeRouteDetailModal');
  if (!detailModal || !cards.length) return;

  const routeData = {
    'bridge': {
      title: 'Lekki-Ikoyi Link Bridge Sunrise Loop',
      distance: '6.50 KM / 10.00 KM',
      elevation: '+48m Elevation Gain',
      surface: 'Asphalt & Bridge Boardwalk',
      startLocation: 'Admiralty Way Toll Plaza, Lekki Phase 1',
      startTime: '05:30 AM (Rollout at 05:45 AM)',
      highlights: 'Iconic cable-stayed bridge crossing, sweeping sunrise over Five Cowries Creek, cool early morning maritime breeze, flat recovery tarmac on Kingsway Road.',
      paceGroups: 'Cheetahs (5:00/km) • Cadence (6:00/km) • Social (7:15/km)'
    },
    'marina': {
      title: 'Victoria Island Marina & Coastal Breeze',
      distance: '7.80 KM',
      elevation: '+18m Flat Coastal',
      surface: 'Smooth Highway Asphalt',
      startLocation: 'Ahmadu Bello Way (Opposite Silverbird Galleria)',
      startTime: '05:30 AM Warmup',
      highlights: 'Wide oceanside boulevard, Eko Atlantic modern horizon, sea spray mist from the Atlantic, unobstructed morning sky.',
      paceGroups: 'Cheetahs (5:15/km) • Cadence (6:15/km) • Social (7:30/km)'
    },
    'ikoyi': {
      title: 'Old Ikoyi & Parkview Tree Canopy',
      distance: '8.20 KM',
      elevation: '+32m Gentle Undulations',
      surface: 'Paved Residential Avenues',
      startLocation: 'Glover Road Roundabout, Ikoyi',
      startTime: '05:45 AM Warmup',
      highlights: 'Lush colonial tree tunnels, tranquil shaded corridors, quiet morning birdsong, smooth paved roads with zero traffic at dawn.',
      paceGroups: 'All paces welcome • Focus on rhythmic aerobic cadence'
    },
    'falomo': {
      title: 'Falomo & Five Cowries Waterfront',
      distance: '5.20 KM (Recovery & Beginner Social)',
      elevation: '+12m Completely Flat',
      surface: 'Paved Pedestrian Path & Asphalt',
      startLocation: 'Falomo Bridge Underpass, Ikoyi',
      startTime: '06:00 AM Sunrise Social',
      highlights: 'Super beginner-friendly recovery run. Beautiful lagoon views, group conversational pace, post-run fresh coconut stand right at the finish.',
      paceGroups: 'Party Pace & Walk/Jog Intervals (7:30 – 8:45/km)'
    }
  };

  cards.forEach(card => {
    card.addEventListener('click', () => {
      const routeKey = card.dataset.routeKey;
      const data = routeData[routeKey];
      if (!data) return;

      document.getElementById('modalRouteTitle').textContent = data.title;
      document.getElementById('modalRouteDistance').textContent = data.distance;
      document.getElementById('modalRouteElevation').textContent = data.elevation;
      document.getElementById('modalRouteSurface').textContent = data.surface;
      document.getElementById('modalRouteStart').textContent = data.startLocation;
      document.getElementById('modalRouteTime').textContent = data.startTime;
      document.getElementById('modalRouteHighlights').textContent = data.highlights;
      document.getElementById('modalRoutePaces').textContent = data.paceGroups;

      // Connect RSVP button in detail modal
      const detailRsvpBtn = document.getElementById('detailRsvpActionBtn');
      if (detailRsvpBtn) {
        detailRsvpBtn.onclick = () => {
          detailModal.classList.remove('is-open');
          const rsvpModal = document.getElementById('rsvpModal');
          if (rsvpModal) {
            rsvpModal.classList.add('is-open');
            const routeSelect = document.getElementById('rsvpRoute');
            if (routeSelect) routeSelect.value = data.title;
          }
        };
      }

      detailModal.classList.add('is-open');
      document.body.style.overflow = 'hidden';
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      detailModal.classList.remove('is-open');
      document.body.style.overflow = '';
    });
  }

  detailModal.addEventListener('click', (e) => {
    if (e.target === detailModal) {
      detailModal.classList.remove('is-open');
      document.body.style.overflow = '';
    }
  });
}

