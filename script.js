function landingPage() {
  return {
    icons: [],
    nextId: 0,
    lastSpawn: 0,
    spawnInterval: 130,
    prefersReducedMotion: false,
    scrollTicking: false,
    bgStops: ['#0d0d17', '#1a1230', '#171029', '#0d0d17'],

    ICONS: [
      { emoji: '🎧', bg: '#1DB954', shape: 'circle' },
      { emoji: '🎬', bg: '#E50914', shape: 'square' },
      { emoji: '📝', bg: '#000000', shape: 'rounded' },
      { emoji: '💬', bg: '#4A154B', shape: 'rounded' },
      { emoji: '🎨', bg: '#0ACF83', shape: 'circle' },
      { emoji: '📷', bg: '#C13584', shape: 'circle' },
      { emoji: '🎮', bg: '#5865F2', shape: 'rounded' },
      { emoji: '📚', bg: '#F3722C', shape: 'square' },
      { emoji: '✈️', bg: '#0091FF', shape: 'circle' },
      { emoji: '🎵', bg: '#FA243C', shape: 'circle' },
      { emoji: '📅', bg: '#4285F4', shape: 'rounded' },
      { emoji: '💰', bg: '#00D09C', shape: 'square' }
    ],
    SHAPE_RADIUS: { circle: '50%', square: '6px', rounded: '16px' },

    init() {
      this.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (this.prefersReducedMotion) {
        document.querySelectorAll('.reveal').forEach(el => el.classList.add('in-view'));
      }
    },

    onScroll() {
      if (this.prefersReducedMotion || this.scrollTicking) return;
      this.scrollTicking = true;
      requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = docHeight > 0 ? Math.min(scrollY / docHeight, 1) : 0;

        const parallaxY = scrollY * 0.5;
        document.documentElement.style.setProperty('--parallax-y', `${parallaxY}px`);

        document.body.style.backgroundColor = this.interpolateColor(progress);

        this.scrollTicking = false;
      });
    },

    interpolateColor(progress) {
      const segment = progress * (this.bgStops.length - 1);
      const index = Math.min(Math.floor(segment), this.bgStops.length - 2);
      const localProgress = segment - index;

      const from = this.hexToRgb(this.bgStops[index]);
      const to = this.hexToRgb(this.bgStops[index + 1]);

      const r = Math.round(from.r + (to.r - from.r) * localProgress);
      const g = Math.round(from.g + (to.g - from.g) * localProgress);
      const b = Math.round(from.b + (to.b - from.b) * localProgress);

      return `rgb(${r}, ${g}, ${b})`;
    },

    hexToRgb(hex) {
      const clean = hex.replace('#', '');
      return {
        r: parseInt(clean.substring(0, 2), 16),
        g: parseInt(clean.substring(2, 4), 16),
        b: parseInt(clean.substring(4, 6), 16)
      };
    },

    handleMove(x, y) {
      if (this.prefersReducedMotion) return;
      const now = Date.now();
      if (now - this.lastSpawn < this.spawnInterval) return;
      this.lastSpawn = now;
      this.spawnIcon(x, y);
    },

    spawnIcon(x, y) {
      const choice = this.ICONS[Math.floor(Math.random() * this.ICONS.length)];
      const id = this.nextId++;

      const icon = {
        id,
        emoji: choice.emoji,
        bg: choice.bg,
        radius: this.SHAPE_RADIUS[choice.shape],
        x, y,
        driftX: (Math.random() - 0.5) * 90,
        driftY: -30 - Math.random() * 55,
        rotStart: (Math.random() - 0.5) * 70,
        rotEnd: (Math.random() - 0.5) * 90,
        scaleEnd: 0.75 + Math.random() * 0.3
      };

      this.icons.push(icon);
      // auto-cleanup after the trail-pop animation finishes (1.4s + buffer)
      setTimeout(() => {
        this.icons = this.icons.filter(i => i.id !== id);
      }, 1450);
    },

    magnetic(e) {
      if (this.prefersReducedMotion) return;
      const btn = e.currentTarget;
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${x * 0.35}px, ${y * 0.35}px)`;
    },

    resetMagnetic(e) {
      e.currentTarget.style.transform = '';
    }
  };
}
