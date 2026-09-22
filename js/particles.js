/**
 * Particle Background Engine
 * Renders floating romantic emojis and sparkles across a responsive HTML5 canvas.
 */
const ParticleEngine = {
    canvas: null,
    ctx: null,
    particles: [],
    symbols: ['❤️', '💖', '✨', '🌸', '💕'],

    init() {
        this.canvas = document.getElementById('particleCanvas');
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');
        this.resize();
        window.addEventListener('resize', () => this.resize());
        this.createParticles(25);
        this.animate();
    },

    resize() {
        if (!this.canvas) return;
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    },

    createParticles(count) {
        this.particles = [];
        for (let i = 0; i < count; i++) {
            this.particles.push({
                x: Math.random() * (this.canvas ? this.canvas.width : window.innerWidth),
                y: Math.random() * (this.canvas ? this.canvas.height : window.innerHeight),
                size: 14 + Math.random() * 16,
                symbol: this.symbols[Math.floor(Math.random() * this.symbols.length)],
                speedY: 0.3 + Math.random() * 0.8,
                speedX: (Math.random() - 0.5) * 0.4,
                opacity: 0.3 + Math.random() * 0.5
            });
        }
    },

    animate() {
        if (!this.ctx || !this.canvas) return;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.particles.forEach(p => {
            p.y -= p.speedY;
            p.x += p.speedX;

            if (p.y < -30) {
                p.y = this.canvas.height + 20;
                p.x = Math.random() * this.canvas.width;
            }

            this.ctx.globalAlpha = p.opacity;
            this.ctx.font = `${p.size}px sans-serif`;
            this.ctx.fillText(p.symbol, p.x, p.y);
        });

        requestAnimationFrame(() => this.animate());
    }
};
