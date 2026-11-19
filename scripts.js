    // Smooth lerp helper
    function lerp(a, b, t) { return a + (b - a) * t; }

    // PRELOADER
    const bootFill = document.getElementById('bootFill');
    let pct = 0;
    const duration = 700;
    const start = performance.now();

    function animateLoader(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      pct = eased * 100;
      if (bootFill) bootFill.style.width = pct + '%';
      if (progress < 1) requestAnimationFrame(animateLoader);
      else setTimeout(launchSite, 120);
    }
    requestAnimationFrame(animateLoader);

    function launchSite() {
      const pre = document.getElementById('preloader');
      pre.classList.add('shatter');
      // Let the shatter animation play smoothly before removing
      setTimeout(() => {
        pre.style.display = 'none';
        document.body.style.overflow = '';
        startHero();
      }, 600);
    }

    // HERO
    function startHero() {
      const name = 'ATHMEEYA M KASHYAP';
      const container = document.getElementById('heroName');
      const words = name.split(' ');
      let ci = 0;
      words.forEach((word, wi) => {
        const wordWrap = document.createElement('span');
        wordWrap.style.display = 'inline-flex';
        wordWrap.style.whiteSpace = 'nowrap';
        word.split('').forEach(ch => {
          const span = document.createElement('span');
          span.className = 'letter';
          span.textContent = ch;
          // Smoother stagger: longer delays with easing overlap
          span.style.transitionDelay = (ci * 50) + 'ms';
          setTimeout(() => span.classList.add('visible'), 200 + ci * 50);
          wordWrap.appendChild(span);
          ci++;
        });
        container.appendChild(wordWrap);
        if (wi < words.length - 1) {
          const space = document.createElement('span');
          space.className = 'letter space';
          container.appendChild(space);
          ci++;
        }
      });
      // Start subtitle with smooth delay sync
      setTimeout(typeSubtitle, ci * 50 + 400);
    }
    function typeSubtitle() {
      const el = document.getElementById('heroSubtitle');
      el.style.opacity = 1;
      el.innerHTML = '';
      const text = ['B.Tech CS + MS Computational Natural Sciences · IIIT Hyderabad', 'Undergraduate Researcher · INMO Qualifier'];
      let ci = 0;
      text.forEach((line, li) => {
        // Split into words so we can wrap each word in a nowrap container,
        // preventing mid-word breaks on narrow mobile screens.
        const words = line.split(' ');
        words.forEach((word, wi) => {
          const wordWrap = document.createElement('span');
          wordWrap.style.display = 'inline-flex';
          wordWrap.style.whiteSpace = 'nowrap';
          word.split('').forEach(ch => {
            const span = document.createElement('span');
            span.className = 'letter';
            span.textContent = ch;
            span.style.transitionDelay = (ci * 15) + 'ms';
            setTimeout(() => span.classList.add('visible'), ci * 15);
            wordWrap.appendChild(span);
            ci++;
          });
          el.appendChild(wordWrap);
          // Add a space span between words
          if (wi < words.length - 1) {
            const space = document.createElement('span');
            space.className = 'letter space';
            space.textContent = '\u00A0';
            space.style.transitionDelay = (ci * 15) + 'ms';
            setTimeout(() => space.classList.add('visible'), ci * 15);
            el.appendChild(space);
            ci++;
          }
        });
        if (li < text.length - 1) {
          // Full-width block forces a clean line break in the flex container
          const lineBreak = document.createElement('span');
          lineBreak.style.cssText = 'width:100%;display:block;height:6px;';
          el.appendChild(lineBreak);
        }
      });
    }

    // SCROLL REVEALS (staggered + smoother)
    const reveals = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          // Get all sibling reveals within the same parent for stagger sync
          const parent = e.target.parentElement;
          const siblings = parent ? Array.from(parent.querySelectorAll(':scope > .reveal')) : [];
          const idx = siblings.indexOf(e.target);
          const staggerDelay = idx >= 0 ? idx * 80 : 0;
          
          // Only add delay if the element doesn't already have a stagger class
          if (!e.target.className.match(/stagger-\d/)) {
            e.target.style.transitionDelay = staggerDelay + 'ms';
          }
          
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              e.target.classList.add('visible');
            });
          });
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach(r => revealObserver.observe(r));

    // STAT COUNTERS (eased)
    const statNums = document.querySelectorAll('.stat-num[data-count]');
    const statObs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          const el = e.target;
          const target = parseInt(el.dataset.count);
          const suffix = el.dataset.suffix || '';
          let current = 0;
          const duration = 1500;
          const start = performance.now();
          
          function easeOutQuart(t) { return 1 - Math.pow(1 - t, 4); }
          
          function animate(now) {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            current = Math.round(easeOutQuart(progress) * target);
            el.textContent = current + suffix;
            if (progress < 1) requestAnimationFrame(animate);
          }
          requestAnimationFrame(animate);
          statObs.unobserve(el);
        }
      });
    }, { threshold: .5 });
    statNums.forEach(n => statObs.observe(n));

    // EDU LINE (staggered smooth fill)
    const eduObs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          // Smooth sequential fill
          const lineFill = document.getElementById('eduLineFill');
          lineFill.style.transition = 'height 2.5s cubic-bezier(0.16, 1, 0.3, 1)';
          lineFill.style.height = '100%';

          // Stagger dot pulses in sync
          setTimeout(() => document.getElementById('dot2').classList.add('pulse'), 800);
          setTimeout(() => document.getElementById('dot3').classList.add('pulse'), 1600);
          
          eduObs.disconnect();
        }
      });
    }, { threshold: .15 });
    const eduSec = document.getElementById('education');
    if (eduSec) eduObs.observe(eduSec);

    // RADAR
    const radarC = document.getElementById('radarCanvas');
    const rctx = radarC.getContext('2d');
    const RW = radarC.width, RH = radarC.height;
    const CX = RW / 2, CY = RH / 2, MAX_R = RW / 2 - 20;
    let radarAngle = 0;
    let smoothRadarAngle = 0;
    const blips = [
      { angle: 0.8, dist: .6, label: 'IIIT HYD' },
      { angle: 2.1, dist: .45, label: 'INMO' },
      { angle: 4.5, dist: .75, label: 'SUPERBIKES' },
      { angle: 3.2, dist: .5, label: 'SGFI' },
    ];
    function drawRadar() {
      rctx.clearRect(0, 0, RW, RH);
      // circles
      [.25, .5, .75, 1].forEach(f => {
        rctx.beginPath();
        rctx.arc(CX, CY, MAX_R * f, 0, Math.PI * 2);
        rctx.strokeStyle = 'rgba(20, 18, 14,0.15)';
        rctx.lineWidth = 1;
        rctx.stroke();
      });
      // crosshair
      rctx.strokeStyle = 'rgba(20, 18, 14,0.1)';
      rctx.beginPath(); rctx.moveTo(CX, 20); rctx.lineTo(CX, RH - 20); rctx.stroke();
      rctx.beginPath(); rctx.moveTo(20, CY); rctx.lineTo(RW - 20, CY); rctx.stroke();
      // sweep
      const grad = rctx.createConicalGradient ? null : null;
      rctx.save();
      rctx.translate(CX, CY);
      rctx.rotate(radarAngle);
      const sg = rctx.createLinearGradient(0, 0, MAX_R, 0);
      sg.addColorStop(0, 'rgba(20, 18, 14,0.45)');
      sg.addColorStop(1, 'transparent');
      rctx.beginPath();
      rctx.moveTo(0, 0);
      rctx.arc(0, 0, MAX_R, -0.3, 0);
      rctx.fillStyle = sg;
      rctx.fill();
      rctx.restore();
      radarAngle += 0.025;
      smoothRadarAngle = lerp(smoothRadarAngle, radarAngle, 0.15);
      // blips
      blips.forEach(b => {
        const diff = ((b.angle - radarAngle) % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2);
        const fade = diff < 0.3 ? 1 : Math.max(0, 1 - (diff - 0.3) / (Math.PI * .8));
        if (fade < 0.01) return;
        const bx = CX + Math.cos(b.angle) * MAX_R * b.dist;
        const by = CY + Math.sin(b.angle) * MAX_R * b.dist;
        rctx.beginPath();
        rctx.arc(bx, by, 4, 0, Math.PI * 2);
        rctx.fillStyle = `rgba(20, 18, 14,${fade})`;
        rctx.shadowBlur = 0; rctx.shadowColor = '#16140E';
        rctx.fill();
        rctx.shadowBlur = 0;
        rctx.fillStyle = `rgba(20, 18, 14,${fade * .7})`;
        rctx.font = '12px Space Mono, monospace';
        rctx.fillText(b.label, bx + 8, by + 4);
      });
      requestAnimationFrame(drawRadar);
    }
    drawRadar();

    // NAV SCROLL + BACK TO TOP (rAF-throttled for smoothness)
    const navEl = document.getElementById('nav');
    const backToTop = document.getElementById('back-to-top');
    let scrollTicking = false;
    let lastActiveSection = 'hero';
    const navSectionMap = {
      hero: 'hero',
      about: 'about',
      experience: 'experience',
      'research-experience': 'research-experience',
      education: 'education',
      skills: 'skills',
      achievements: 'achievements',
      projects: 'projects',
      contact: 'contact'
    };
    const navSectionOrder = ['hero', 'about', 'experience', 'research-experience', 'education', 'skills', 'achievements', 'projects', 'contact'];
    
    function updateScroll() {
      const sy = window.scrollY;
      
      // Smooth nav state
      navEl.classList.toggle('scrolled', sy > 60);
      
      // back to top (smooth opacity via class)
      backToTop.classList.toggle('visible', sy > 500);
      
      // active section (with hysteresis to avoid flickering)
      let active = 'hero';
      navSectionOrder.forEach(id => {
        const el = document.getElementById(id);
        if (el && sy >= el.offsetTop - 250) active = navSectionMap[id] || id;
      });
      
      if (active !== lastActiveSection) {
        lastActiveSection = active;
        document.querySelectorAll('.nav-links a').forEach(a => {
          const isActive = a.getAttribute('href') === '#' + active;
          if (isActive !== a.classList.contains('active')) {
            a.classList.toggle('active', isActive);
          }
        });
      }
      
      scrollTicking = false;
    }
    
    window.addEventListener('scroll', () => {
      if (!scrollTicking) {
        requestAnimationFrame(updateScroll);
        scrollTicking = true;
      }
    }, { passive: true });

    // MOBILE MENU
    const hamburgerEl = document.getElementById('hamburger');
    function openMobile() {
      document.getElementById('mobileMenu').classList.add('open');
      hamburgerEl.setAttribute('aria-expanded', 'true');
    }
    hamburgerEl.addEventListener('click', openMobile);
    document.getElementById('mobileClose').addEventListener('click', closeMobile);
    function closeMobile() {
      document.getElementById('mobileMenu').classList.remove('open');
      hamburgerEl.setAttribute('aria-expanded', 'false');
    }
    // keyboard support for the role="button" controls
    hamburgerEl.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openMobile(); } });
    document.getElementById('mobileClose').addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); closeMobile(); } });

    // FILM GRAIN
    const grainC = document.getElementById('grain');
    const gctx = grainC.getContext('2d');
    function resizeGrain() {
      grainC.width = Math.ceil(window.innerWidth / 3);
      grainC.height = Math.ceil(window.innerHeight / 3);
    }
    resizeGrain(); window.addEventListener('resize', resizeGrain);
    let grainFrame = 0;
    function drawGrain() {
      if (++grainFrame % 3 === 0) {
        const w = grainC.width, h = grainC.height;
        const imgData = gctx.createImageData(w, h);
        const data = imgData.data;
        for (let i = 0; i < data.length; i += 4) {
          const v = Math.random() * 255;
          data[i] = data[i + 1] = data[i + 2] = v;
          data[i + 3] = 200;
        }
        gctx.putImageData(imgData, 0, 0);
      }
      requestAnimationFrame(drawGrain);
    }
    // drawGrain(); // film grain removed for light editorial theme

    // TEXT SCRAMBLE on section titles (smoother)
    const scrambleChars = '!<>-_\\/[]{}.=+*^?#_ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    function scrambleText(el) {
      const html = el.innerHTML;
      const tokens = [];
      let textLen = 0;
      html.split(/(<br\s*\/?>)/gi).forEach((part, i) => {
        if (i % 2 === 1) {
          tokens.push({ type: 'br', value: part });
        } else {
          for (const ch of part) {
            tokens.push({ type: 'char', value: ch, idx: textLen++ });
          }
        }
      });
      let iteration = 0;
      const totalFrames = textLen + 10;
      const interval = setInterval(() => {
        let result = '';
        tokens.forEach(tok => {
          if (tok.type === 'br') { result += tok.value; return; }
          if (tok.value === ' ') { result += ' '; return; }
          // Smooth reveal: each char has a window where it scrambles before resolving
          const revealAt = tok.idx * 0.8;
          if (iteration >= revealAt + 4) {
            result += tok.value;
          } else if (iteration >= revealAt) {
            result += scrambleChars[Math.floor(Math.random() * scrambleChars.length)];
          } else {
            result += tok.value.replace(/[^\s]/, scrambleChars[Math.floor(Math.random() * scrambleChars.length)]);
          }
        });
        el.innerHTML = result;
        if (iteration >= totalFrames) clearInterval(interval);
        iteration += 1;
      }, 25);
    }
    // observe section titles for scramble
    const titleObs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          scrambleText(e.target);
          titleObs.unobserve(e.target);
        }
      });
    }, { threshold: 0.5 });
    document.querySelectorAll('.section-title').forEach(t => titleObs.observe(t));

    // MAGNETIC BUTTONS (smoother with lerp)
    document.querySelectorAll('.btn-primary, .btn-secondary, .cv-btn').forEach(btn => {
      let btnX = 0, btnY = 0, targetX = 0, targetY = 0;
      let btnAnimId = null;
      
      function animateBtn() {
        btnX = lerp(btnX, targetX, 0.1);
        btnY = lerp(btnY, targetY, 0.1);
        btn.style.transform = `translate(${btnX}px, ${btnY}px)`;
        if (Math.abs(btnX - targetX) > 0.1 || Math.abs(btnY - targetY) > 0.1) {
          btnAnimId = requestAnimationFrame(animateBtn);
        } else {
          btnAnimId = null;
        }
      }
      
      btn.addEventListener('mousemove', e => {
        const r = btn.getBoundingClientRect();
        targetX = (e.clientX - r.left - r.width / 2) * 0.2;
        targetY = (e.clientY - r.top - r.height / 2) * 0.2;
        if (!btnAnimId) btnAnimId = requestAnimationFrame(animateBtn);
      });
      btn.addEventListener('mouseleave', () => { 
        targetX = 0; targetY = 0;
        if (!btnAnimId) btnAnimId = requestAnimationFrame(animateBtn);
      });
    });

    // 3D TILT for every card type, via one shared helper.
    // Each card declares `transition: transform ...` for its reveal/hover, and that
    // transition fights the per-frame rAF tilt and lags it into near-invisibility.
    // The helper suppresses the transition while the pointer is over the card, then
    // restores it once the card settles, so the tilt is responsive on EVERY card
    // (achievements + projects included, not just the first). No `.bento-card`
    // exists in the markup, so it is intentionally not wired up.
    function addCardTilt(selector, maxDeg, perspective, lift) {
      document.querySelectorAll(selector).forEach(card => {
        let tiltX = 0, tiltY = 0, targetTiltX = 0, targetTiltY = 0;
        let tiltAnim = null;

        function animateTilt() {
          tiltX = lerp(tiltX, targetTiltX, 0.08);
          tiltY = lerp(tiltY, targetTiltY, 0.08);
          card.style.transform = `perspective(${perspective}px) rotateY(${tiltX}deg) rotateX(${tiltY}deg) translateY(${lift}px)`;
          if (Math.abs(tiltX - targetTiltX) > 0.05 || Math.abs(tiltY - targetTiltY) > 0.05) {
            tiltAnim = requestAnimationFrame(animateTilt);
          } else { tiltAnim = null; }
        }

        // Cards like .ach-panel / .project-card declare `transition: transform .5s`
        // for their reveal/hover. That transition fights the per-frame tilt updates
        // and lags so far behind that the tilt never visibly applies. Suppress it
        // while the pointer is over the card (the rAF lerp already smooths motion);
        // restore it once the card settles back so reveal/hover transitions return.
        card.addEventListener('mouseenter', () => { card.style.transition = 'none'; });

        card.addEventListener('mousemove', e => {
          const r = card.getBoundingClientRect();
          targetTiltX = ((e.clientX - r.left) / r.width - .5) * maxDeg;
          targetTiltY = -((e.clientY - r.top) / r.height - .5) * maxDeg;
          if (!tiltAnim) tiltAnim = requestAnimationFrame(animateTilt);
        });
        card.addEventListener('mouseleave', () => {
          targetTiltX = 0; targetTiltY = 0;
          function returnToZero() {
            tiltX = lerp(tiltX, 0, 0.06);
            tiltY = lerp(tiltY, 0, 0.06);
            if (Math.abs(tiltX) > 0.05 || Math.abs(tiltY) > 0.05) {
              card.style.transform = `perspective(${perspective}px) rotateY(${tiltX}deg) rotateX(${tiltY}deg)`;
              requestAnimationFrame(returnToZero);
            } else {
              card.style.transform = '';
              card.style.transition = '';
              tiltAnim = null;
            }
          }
          requestAnimationFrame(returnToZero);
        });
      });
    }

    addCardTilt('.ach-panel', 10, 600, -8);
    addCardTilt('.project-card', 6, 800, -6);
    addCardTilt('.edu-card', 6, 700, -4);
    addCardTilt('.skill-cluster', 6, 700, -4);
    addCardTilt('.exp-card', 5, 1000, -4);

    // PARALLAX ON SCROLL (rAF-smoothed)
    const parallaxSections = document.querySelectorAll('.floating-shapes');
    let parallaxTicking = false;
    let parallaxTargets = new Map();
    let parallaxCurrent = new Map();
    
    function updateParallax() {
      parallaxSections.forEach(el => {
        const parent = el.closest('section');
        if (!parent) return;
        const rect = parent.getBoundingClientRect();
        if (rect.bottom > 0 && rect.top < window.innerHeight) {
          const target = (rect.top / window.innerHeight) * 30;
          const key = el;
          const current = parallaxCurrent.get(key) || 0;
          const smoothed = lerp(current, target, 0.08);
          parallaxCurrent.set(key, smoothed);
          el.style.transform = `translateY(${smoothed}px)`;
        }
      });
      requestAnimationFrame(updateParallax);
    }
    requestAnimationFrame(updateParallax);

    // SMOOTH REVEAL for left/right animations
    const revealLR = document.querySelectorAll('.reveal-left, .reveal-right');
    const lrObs = new IntersectionObserver(entries => {
      entries.forEach(e => { 
        if (e.isIntersecting) { 
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              e.target.classList.add('visible'); 
            });
          });
        } 
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
    revealLR.forEach(r => lrObs.observe(r));

    // KONAMI CODE EASTER EGG
    const konamiCode = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65];
    let konamiIdx = 0;
    document.addEventListener('keydown', e => {
      if (e.keyCode === konamiCode[konamiIdx]) {
        konamiIdx++;
        if (konamiIdx === konamiCode.length) {
          konamiIdx = 0;
          document.body.style.transition = 'filter 1s';
          document.body.style.filter = 'hue-rotate(180deg)';
          setTimeout(() => { document.body.style.filter = ''; }, 3000);
        }
      } else konamiIdx = 0;
    });

