/**
 * CYBORG — The Future of Humanity
 * Interactive Cybernetic Frontend Application Engine
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  /* --------------------------------------------------------------------------
     1. Web Audio API Cyber Synthesizer
     -------------------------------------------------------------------------- */
  const AudioEngine = (() => {
    let audioCtx = null;
    let isMuted = true;

    function initAudio() {
      if (!audioCtx) {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        if (AudioContextClass) {
          audioCtx = new AudioContextClass();
        }
      }
      if (audioCtx && audioCtx.state === 'suspended') {
        audioCtx.resume();
      }
    }

    function toggleAudio() {
      initAudio();
      isMuted = !isMuted;
      return !isMuted;
    }

    function playTone(freq, type = 'sine', duration = 0.08, vol = 0.05) {
      if (isMuted || !audioCtx) return;
      try {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

        gain.gain.setValueAtTime(vol, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);

        osc.connect(gain);
        gain.connect(audioCtx.destination);

        osc.start();
        osc.stop(audioCtx.currentTime + duration);
      } catch (e) {
        // Audio policy or context error caught gracefully
      }
    }

    function playHover() {
      playTone(1200, 'sine', 0.04, 0.02);
    }

    function playClick() {
      if (isMuted || !audioCtx) return;
      try {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(400, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(950, audioCtx.currentTime + 0.09);

        gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.09);

        osc.connect(gain);
        gain.connect(audioCtx.destination);

        osc.start();
        osc.stop(audioCtx.currentTime + 0.09);
      } catch (e) { }
    }

    function playSuccess() {
      if (isMuted || !audioCtx) return;
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C E G C
      notes.forEach((freq, idx) => {
        setTimeout(() => {
          playTone(freq, 'triangle', 0.25, 0.04);
        }, idx * 70);
      });
    }

    function playDiagnostic() {
      if (isMuted || !audioCtx) return;
      const freqs = [350, 700, 1100, 1400, 900];
      freqs.forEach((freq, idx) => {
        setTimeout(() => {
          playTone(freq, 'sine', 0.06, 0.03);
        }, idx * 50);
      });
    }

    return {
      toggleAudio,
      playHover,
      playClick,
      playSuccess,
      playDiagnostic,
      isMuted: () => isMuted
    };
  })();

  // Audio Toggle UI Handler
  const audioToggleBtn = document.getElementById('audio-toggle');
  const audioLabel = document.getElementById('audio-label');
  if (audioToggleBtn) {
    audioToggleBtn.addEventListener('click', () => {
      const active = AudioEngine.toggleAudio();
      if (active) {
        audioToggleBtn.classList.add('active');
        audioLabel.textContent = 'FX: ON';
        AudioEngine.playSuccess();
      } else {
        audioToggleBtn.classList.remove('active');
        audioLabel.textContent = 'FX: OFF';
      }
    });
  }

  // Bind subtle sounds to buttons and nav items
  document.querySelectorAll('.btn, .cyber-tab, .blueprint-pin, .nav-link').forEach(el => {
    el.addEventListener('mouseenter', () => AudioEngine.playHover());
    el.addEventListener('click', () => AudioEngine.playClick());
  });


  /* --------------------------------------------------------------------------
     2. Interactive Cyber Particle & Grid Canvas
     -------------------------------------------------------------------------- */
  const canvas = document.getElementById('cyber-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initParticles();
    });

    const particles = [];
    const particleCount = Math.min(Math.floor((width * height) / 16000), 75);
    const mouse = { x: -1000, y: -1000, radius: 140 };

    window.addEventListener('mousemove', (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });

    window.addEventListener('mouseleave', () => {
      mouse.x = -1000;
      mouse.y = -1000;
    });

    class Particle {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.8;
        this.vy = (Math.random() - 0.5) * 0.8;
        this.radius = Math.random() * 2 + 1;
        this.color = Math.random() > 0.4 ? 'rgba(0, 240, 255, ' : 'rgba(168, 85, 247, ';
        this.baseAlpha = Math.random() * 0.6 + 0.2;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0) this.x = width;
        if (this.x > width) this.x = 0;
        if (this.y < 0) this.y = height;
        if (this.y > height) this.y = 0;

        // Mouse reaction
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius) {
          const force = (1 - dist / mouse.radius) * 0.03;
          this.x += dx * force;
          this.y += dy * force;
        }
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color + this.baseAlpha + ')';
        ctx.shadowColor = this.color.includes('240') ? '#00f0ff' : '#a855f7';
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    }

    function initParticles() {
      particles.length = 0;
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
      }
    }
    initParticles();

    function renderCanvas() {
      ctx.clearRect(0, 0, width, height);

      // Connect adjacent nodes
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 130) {
            const alpha = (1 - dist / 130) * 0.22;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(0, 240, 255, ${alpha})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }

      particles.forEach((p) => {
        p.update();
        p.draw();
      });

      requestAnimationFrame(renderCanvas);
    }
    renderCanvas();
  }


  /* --------------------------------------------------------------------------
     3. Live Telemetry Clock & Fluctuating Latency
     -------------------------------------------------------------------------- */
  const timeElem = document.getElementById('ticker-time');
  const latencyElem = document.getElementById('ticker-latency');

  function updateTelemetryClock() {
    const now = new Date();
    const utcHours = String(now.getUTCHours()).padStart(2, '0');
    const utcMins = String(now.getUTCMinutes()).padStart(2, '0');
    const utcSecs = String(now.getUTCSeconds()).padStart(2, '0');
    if (timeElem) {
      timeElem.innerHTML = `<i class="fa-regular fa-clock"></i> UTC ${utcHours}:${utcMins}:${utcSecs}`;
    }

    // Micro latency fluctuation
    if (latencyElem && Math.random() > 0.6) {
      const base = 0.08;
      const variation = (Math.random() * 0.03 - 0.015);
      latencyElem.textContent = (base + variation).toFixed(2);
    }
  }
  setInterval(updateTelemetryClock, 1000);
  updateTelemetryClock();


  /* --------------------------------------------------------------------------
     4. Navigation Bar, ScrollSpy & Mobile Toggle
     -------------------------------------------------------------------------- */
  const navbar = document.getElementById('navbar');
  const navToggle = document.getElementById('nav-toggle');
  const cyberNav = document.querySelector('.cyber-nav');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  // Scrolled state
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }, { passive: true });

  // Mobile Toggle
  if (navToggle && cyberNav) {
    navToggle.addEventListener('click', () => {
      const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', !isExpanded);
      cyberNav.classList.toggle('open');
    });

    // Close when clicking nav link
    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        navToggle.setAttribute('aria-expanded', 'false');
        cyberNav.classList.remove('open');
      });
    });
  }

  // Active ScrollSpy
  function onScrollSpy() {
    const scrollPos = window.scrollY + 200;

    sections.forEach((section) => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach((link) => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }
  window.addEventListener('scroll', onScrollSpy, { passive: true });


  /* --------------------------------------------------------------------------
     5. Scroll Reveal Animations (IntersectionObserver)
     -------------------------------------------------------------------------- */
  const revealElements = document.querySelectorAll('.reveal-on-scroll');
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -40px 0px'
  });

  revealElements.forEach((el) => revealObserver.observe(el));


  /* --------------------------------------------------------------------------
     6. Section 3: Evolutionary Pillars Tabs (Genesis)
     -------------------------------------------------------------------------- */
  const cyberTabs = document.querySelectorAll('.cyber-tab');
  const tabPanels = document.querySelectorAll('.tab-panel');

  cyberTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const targetPanelId = tab.getAttribute('aria-controls');

      cyberTabs.forEach((t) => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');

      tabPanels.forEach((panel) => {
        panel.classList.remove('active');
        panel.hidden = true;
      });

      const targetPanel = document.getElementById(targetPanelId);
      if (targetPanel) {
        targetPanel.hidden = false;
        // Trigger small reflow for css animation
        void targetPanel.offsetWidth;
        targetPanel.classList.add('active');
      }
    });
  });


  /* --------------------------------------------------------------------------
     7. Section 5: Interactive Human Augmentation Blueprint
     -------------------------------------------------------------------------- */
  const blueprintPins = document.querySelectorAll('.blueprint-pin');

  const zoneData = {
    ocular: {
      title: 'ZONE 01: OCULAR NEURO-RETINEX',
      code: 'OCU-808-X',
      status: 'CALIBRATED',
      power: '1.8W CONTINUOUS',
      compat: '99.998% GRADE-A',
      heading: 'Multi-Spectrum Optic Synthesizer',
      desc: 'Replaces organic optical sensors with quad-layer quantum dot synthetic retinas. Grants 240 FPS visual ingestion, automatic anti-glare polarization, night-vision amplification, and real-time facial threat recognition.',
      fidelity: '99.4%',
      bandwidth: '42.8 GB/s',
      bar1: '99.4%',
      bar2: '72%',
      log: 'Retinal LiDAR refresh synced to orbital beacon'
    },
    cortex: {
      title: 'ZONE 02: CEREBRAL CORTEX MESH',
      code: 'COR-909-Q',
      status: 'ONLINE // SYNCED',
      power: '3.2W OPTIMAL',
      compat: '99.999% NEURAL INERT',
      heading: 'Lossless Thought-to-Data Streamer',
      desc: 'Ultra-flexible biocompatible graphene weave enveloping frontal and parietal lobes. Bridges brain waves directly to local AI co-processors with near zero synaptic propagation delay.',
      fidelity: '99.98%',
      bandwidth: '128.4 GB/s',
      bar1: '99.98%',
      bar2: '89%',
      log: 'Cognitive buffer parity check: 0 errors detected'
    },
    core: {
      title: 'ZONE 03: BIO-FUSION MICRO-REACTOR',
      code: 'PWR-777-F',
      status: 'CONTINUOUS CRITICAL',
      power: '520W HARVESTED',
      compat: '100% IN-VIVO SAFE',
      heading: 'Sub-Dermal Quantum Core Generator',
      desc: 'Generates continuous electrical current through ambient biochemical glucose breakdown and thermoelectric conversion. Double magnetic casing guarantees zero thermal dissipation into host tissue.',
      fidelity: '99.99%',
      bandwidth: '12.0 V BUS',
      bar1: '100%',
      bar2: '45%',
      log: 'Thermoelectric junction temperature: 36.8°C stable'
    },
    spine: {
      title: 'ZONE 04: ZERO-LATENCY SPINAL BUS',
      code: 'SPN-101-S',
      status: 'SUPERCONDUCTING',
      power: '0.4W STEADY',
      compat: '99.995% TITANIUM',
      heading: 'High-Throughput Motor Impulse Trunk',
      desc: 'Runs parallel to the spinal column, wrapping biological nerve clusters with room-temperature superconducting metamaterial. Reduces peripheral motor reaction delay to 0.08 milliseconds.',
      fidelity: '99.85%',
      bandwidth: '84.2 GB/s',
      bar1: '99.85%',
      bar2: '64%',
      log: 'Reflex loop accelerated by 420% vs biological baseline'
    },
    limbs: {
      title: 'ZONE 05: CARBON NANOTUBE ACTUATORS',
      code: 'ACT-442-M',
      status: 'CHARGED',
      power: '45W PEAK HYDRAULIC',
      compat: '99.991% GRADE-A',
      heading: 'Bionic Synthetic Myomer Arms',
      desc: 'Electro-active polymer bundles offering up to 12.4 kN tensile torque. Capable of bending solid steel structural beams while retaining fine motor resolution down to 1 micrometer precision.',
      fidelity: '98.9%',
      bandwidth: '12.4 kN PEAK',
      bar1: '98.9%',
      bar2: '82%',
      log: 'Pneumatic damping valves calibrated to 100 psi'
    },
    legs: {
      title: 'ZONE 06: KINETIC HYDRAULIC STEMS',
      code: 'HYD-330-K',
      status: 'REACTIVE',
      power: '12W CONTINUOUS',
      compat: '99.996% BALLISTIC',
      heading: 'Shock-Absorbing Exoskeletal Struts',
      desc: 'Titanium-alloy lower limb replacements integrated with smart magnetorheological fluid shock absorbers. Enables safe landings from 15-meter drops and sprint speeds exceeding 75 km/h.',
      fidelity: '99.2%',
      bandwidth: '880 N·m TORQUE',
      bar1: '99.2%',
      bar2: '76%',
      log: 'Kinetic recoil dissipation array online'
    }
  };

  function updateDiagnosticConsole(zoneKey) {
    const data = zoneData[zoneKey];
    if (!data) return;

    const titleEl = document.getElementById('diag-zone-title');
    const codeEl = document.getElementById('diag-code');
    const statusEl = document.getElementById('diag-status');
    const powerEl = document.getElementById('diag-power');
    const compatEl = document.getElementById('diag-compat');
    const headingEl = document.getElementById('diag-heading');
    const descEl = document.getElementById('diag-desc');
    const bar1Val = document.getElementById('diag-bar1-val');
    const bar1 = document.getElementById('diag-bar1');
    const bar2Val = document.getElementById('diag-bar2-val');
    const bar2 = document.getElementById('diag-bar2');
    const logEl = document.getElementById('diag-log');

    if (titleEl) titleEl.textContent = data.title;
    if (codeEl) codeEl.textContent = data.code;
    if (statusEl) statusEl.textContent = data.status;
    if (powerEl) powerEl.textContent = data.power;
    if (compatEl) compatEl.textContent = data.compat;
    if (headingEl) headingEl.textContent = data.heading;
    if (descEl) descEl.textContent = data.desc;
    if (bar1Val) bar1Val.textContent = data.fidelity;
    if (bar1) bar1.style.width = data.bar1;
    if (bar2Val) bar2Val.textContent = data.bandwidth;
    if (bar2) bar2.style.width = data.bar2;
    if (logEl) logEl.textContent = data.log;
  }

  blueprintPins.forEach((pin) => {
    pin.addEventListener('click', () => {
      blueprintPins.forEach((p) => p.classList.remove('active'));
      pin.classList.add('active');
      const zone = pin.getAttribute('data-zone');
      updateDiagnosticConsole(zone);
      AudioEngine.playClick();
    });
  });

  // Re-calibrate button
  const btnRunDiag = document.getElementById('btn-run-diag');
  if (btnRunDiag) {
    btnRunDiag.addEventListener('click', () => {
      btnRunDiag.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> CALIBRATING...';
      btnRunDiag.disabled = true;
      AudioEngine.playDiagnostic();

      setTimeout(() => {
        btnRunDiag.innerHTML = '<i class="fa-solid fa-check text-cyan"></i> NODE OPTIMAL';
        AudioEngine.playSuccess();
        setTimeout(() => {
          btnRunDiag.innerHTML = '<i class="fa-solid fa-arrows-rotate"></i> RE-CALIBRATE NODE';
          btnRunDiag.disabled = false;
        }, 1800);
      }, 1200);
    });
  }

  // Export telemetry button
  const btnExport = document.getElementById('btn-export-telemetry');
  if (btnExport) {
    btnExport.addEventListener('click', () => {
      btnExport.innerHTML = '<i class="fa-solid fa-check"></i> TELEMETRY LOGGED';
      AudioEngine.playSuccess();
      setTimeout(() => {
        btnExport.innerHTML = '<i class="fa-solid fa-file-code"></i> EXPORT TELEMETRY';
      }, 1500);
    });
  }


  /* --------------------------------------------------------------------------
     8. Section 6: Animated Statistics Counters (IntersectionObserver)
     -------------------------------------------------------------------------- */
  const counterElements = document.querySelectorAll('.counter-val');
  let countersAnimated = false;

  const statsSection = document.getElementById('stats');
  if (statsSection) {
    const statsObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !countersAnimated) {
          countersAnimated = true;
          counterElements.forEach((counter) => {
            const target = parseFloat(counter.getAttribute('data-target'));
            const decimals = parseInt(counter.getAttribute('data-decimals') || '0', 10);
            const duration = 2000;
            const startTime = performance.now();

            function animateCount(currentTime) {
              const elapsed = currentTime - startTime;
              const progress = Math.min(elapsed / duration, 1);
              // Ease-out cubic
              const easeOutProgress = 1 - Math.pow(1 - progress, 3);
              const currentVal = easeOutProgress * target;

              counter.textContent = currentVal.toFixed(decimals);

              if (progress < 1) {
                requestAnimationFrame(animateCount);
              } else {
                counter.textContent = target.toFixed(decimals);
              }
            }
            requestAnimationFrame(animateCount);
          });
        }
      });
    }, { threshold: 0.25 });

    statsObserver.observe(statsSection);
  }


  /* --------------------------------------------------------------------------
     9. Section 7: Interactive 3D Card Tilt Effect
     -------------------------------------------------------------------------- */
  const tiltCards = document.querySelectorAll('[data-tilt]');

  tiltCards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -7;
      const rotateY = ((x - centerX) / centerX) * 7;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  // Suite Plan Selection: pre-populate form & smooth scroll
  const suiteButtons = document.querySelectorAll('.suite-select-btn');
  const contactSuiteSelect = document.getElementById('contact-suite');

  suiteButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const plan = btn.getAttribute('data-plan');
      if (contactSuiteSelect) {
        if (plan.includes('Apex') || plan.includes('Chrono')) {
          contactSuiteSelect.value = 'Apex';
        } else if (plan.includes('Alpha') || plan.includes('Operator')) {
          contactSuiteSelect.value = 'Alpha';
        } else if (plan.includes('Singularity') || plan.includes('Omega')) {
          contactSuiteSelect.value = 'Omega';
        }
      }
      const contactSection = document.getElementById('contact');
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });
      }
      AudioEngine.playClick();
    });
  });


  /* --------------------------------------------------------------------------
     10. Section 8: Terminal Contact Form Validation & Submission
     -------------------------------------------------------------------------- */
  const contactForm = document.getElementById('cyber-contact-form');
  const nameInput = document.getElementById('contact-name');
  const emailInput = document.getElementById('contact-email');
  const messageInput = document.getElementById('contact-message');
  const formFeedback = document.getElementById('form-feedback');
  const submitBtn = document.getElementById('btn-submit-form');

  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      let isValid = true;

      // Validate name
      if (!nameInput.value.trim() || nameInput.value.trim().length < 3) {
        nameInput.classList.add('is-invalid');
        isValid = false;
      } else {
        nameInput.classList.remove('is-invalid');
      }

      // Validate email
      if (!validateEmail(emailInput.value.trim())) {
        emailInput.classList.add('is-invalid');
        isValid = false;
      } else {
        emailInput.classList.remove('is-invalid');
      }

      // Validate message
      if (!messageInput.value.trim() || messageInput.value.trim().length < 10) {
        messageInput.classList.add('is-invalid');
        isValid = false;
      } else {
        messageInput.classList.remove('is-invalid');
      }

      if (!isValid) {
        AudioEngine.playHover();
        return;
      }

      // Simulated Transmission sequence
      AudioEngine.playClick();
      submitBtn.disabled = true;
      formFeedback.className = 'form-feedback-banner loading';
      formFeedback.innerHTML = `
        <div class="fb-spinner"><i class="fa-solid fa-circle-notch fa-spin"></i></div>
        <div class="fb-text">ENCRYPTING PACKETS WITH 4096-QBIT CIPHER...</div>
      `;

      setTimeout(() => {
        formFeedback.innerHTML = `
          <div class="fb-spinner"><i class="fa-solid fa-satellite fa-beat"></i></div>
          <div class="fb-text">TRANSMITTING TO ORBITAL RELAY // ACK RECEIVED...</div>
        `;
      }, 1000);

      setTimeout(() => {
        formFeedback.className = 'form-feedback-banner success';
        formFeedback.innerHTML = `
          <div class="fb-spinner"><i class="fa-solid fa-circle-check text-cyan"></i></div>
          <div class="fb-text">UPLINK CONFIRMED. PROTOCOL OMEGA ACTIVATED. OUR BIO-INTEGRATION SPECIALIST WILL COMMENCE FREQUENCY SYNC.</div>
        `;
        AudioEngine.playSuccess();
        contactForm.reset();
        submitBtn.disabled = false;
      }, 2400);
    });

    // Remove invalid states on typing
    [nameInput, emailInput, messageInput].forEach((input) => {
      if (input) {
        input.addEventListener('input', () => {
          input.classList.remove('is-invalid');
        });
      }
    });
  }

  // Newsletter subscribe
  const btnSubscribe = document.getElementById('btn-subscribe');
  const newsEmail = document.getElementById('news-email');
  if (btnSubscribe && newsEmail) {
    btnSubscribe.addEventListener('click', () => {
      if (validateEmail(newsEmail.value.trim())) {
        btnSubscribe.innerHTML = '<i class="fa-solid fa-check"></i>';
        AudioEngine.playSuccess();
        newsEmail.value = '';
        setTimeout(() => {
          btnSubscribe.innerHTML = '<i class="fa-solid fa-arrow-right"></i>';
        }, 2000);
      } else {
        newsEmail.focus();
        AudioEngine.playHover();
      }
    });
  }


  /* --------------------------------------------------------------------------
     11. Interactive Modal: Neural Synchronization Simulator
     -------------------------------------------------------------------------- */
  const syncModal = document.getElementById('sync-modal');
  const openModalBtn = document.getElementById('open-sync-modal');
  const closeModalBtn = document.getElementById('close-sync-modal');
  const modalBackdrop = document.getElementById('modal-backdrop');
  const cancelModalBtn = document.getElementById('btn-cancel-modal');
  const startSyncBtn = document.getElementById('btn-start-sync');

  const syncPct = document.getElementById('sync-pct');
  const syncStatusText = document.getElementById('sync-status-text');
  const spdHandshake = document.getElementById('spd-handshake');
  const spdPotential = document.getElementById('spd-potential');
  const spdCoherence = document.getElementById('spd-coherence');

  let syncInterval = null;

  function openModal() {
    if (syncModal) {
      syncModal.hidden = false;
      document.body.style.overflow = 'hidden';
      AudioEngine.playClick();
    }
  }

  function closeModal() {
    if (syncModal) {
      syncModal.hidden = true;
      document.body.style.overflow = '';
      if (syncInterval) clearInterval(syncInterval);
      resetSyncSimulator();
    }
  }

  function resetSyncSimulator() {
    if (syncPct) syncPct.textContent = '0%';
    if (syncStatusText) syncStatusText.textContent = 'SYSTEM STANDBY // READY FOR SYNC';
    if (spdHandshake) spdHandshake.textContent = 'WAITING';
    if (spdPotential) spdPotential.textContent = '-70 mV';
    if (spdCoherence) spdCoherence.textContent = '100%';
    if (startSyncBtn) {
      startSyncBtn.disabled = false;
      startSyncBtn.innerHTML = '<i class="fa-solid fa-play"></i> START SYNCHRONIZATION';
    }
  }

  if (openModalBtn) openModalBtn.addEventListener('click', openModal);
  if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
  if (modalBackdrop) modalBackdrop.addEventListener('click', closeModal);
  if (cancelModalBtn) cancelModalBtn.addEventListener('click', closeModal);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && syncModal && !syncModal.hidden) {
      closeModal();
    }
  });

  // Start Neural Sync Simulation
  if (startSyncBtn) {
    startSyncBtn.addEventListener('click', () => {
      startSyncBtn.disabled = true;
      startSyncBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> SYNCHRONIZING...';
      AudioEngine.playDiagnostic();

      let currentPct = 0;
      if (syncInterval) clearInterval(syncInterval);

      syncInterval = setInterval(() => {
        currentPct += 2;
        if (currentPct > 100) currentPct = 100;

        if (syncPct) syncPct.textContent = `${currentPct}%`;

        if (currentPct < 25) {
          syncStatusText.textContent = 'INITIALIZING SYNAPTIC LATTICE...';
          spdHandshake.textContent = 'SYN-ACK SENT';
          spdPotential.textContent = '-62 mV';
        } else if (currentPct < 60) {
          syncStatusText.textContent = 'QUANTUM CO-PROCESSOR HANDSHAKE ESTABLISHED...';
          spdHandshake.textContent = 'LOCKED (10 TB/s)';
          spdPotential.textContent = '-55 mV (ACTIVE)';
          spdCoherence.textContent = '99.98%';
        } else if (currentPct < 90) {
          syncStatusText.textContent = 'NEURAL MEMORY BUS ALIGNMENT IN PROGRESS...';
          spdHandshake.textContent = 'LOSSLESS MIRROR';
          spdPotential.textContent = '-45 mV (SPIKE)';
          spdCoherence.textContent = '99.999%';
        } else if (currentPct >= 100) {
          clearInterval(syncInterval);
          syncStatusText.innerHTML = '<span class="text-cyan">SYNCHRONIZATION COMPLETE // BIOLOGY TRANSCENDED</span>';
          spdHandshake.textContent = 'HOMO TECHNOLOGICUS V4';
          spdPotential.textContent = 'CONTINUOUS OPTIMAL';
          spdCoherence.textContent = '100% COHERENT';
          startSyncBtn.innerHTML = '<i class="fa-solid fa-check text-cyan"></i> COMPLETE';
          AudioEngine.playSuccess();
        }
      }, 50);
    });
  }


  /* --------------------------------------------------------------------------
     12. Back to Top Button
     -------------------------------------------------------------------------- */
  const backToTopBtn = document.getElementById('back-to-top');
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
      AudioEngine.playClick();
    });
  }

  // Hero Parallax effect on Hologram Stage
  const heroHologram = document.getElementById('hero-hologram');
  if (heroHologram && window.innerWidth > 992) {
    window.addEventListener('mousemove', (e) => {
      const xPercent = (e.clientX / window.innerWidth - 0.5) * 16;
      const yPercent = (e.clientY / window.innerHeight - 0.5) * 16;
      heroHologram.style.transform = `rotateY(${xPercent}deg) rotateX(${-yPercent}deg)`;
    });
  }

  console.log('%c CYBORG — The Future of Humanity %c System v4.8 Online ',
    'background: #00f0ff; color: #000; font-weight: bold; padding: 4px 8px; border-radius: 3px 0 0 3px;',
    'background: #a855f7; color: #fff; font-weight: bold; padding: 4px 8px; border-radius: 0 3px 3px 0;'
  );
});

