/**
 * Application State
 */
const AppState = {
    currentStep: 1,
    selectedVibe: Config.vibeOptions[0],
    selectedTime: Config.timeOptions[0],
    dodgeCount: 0
};

/**
 * Audio & Haptic Feedback Module
 */
const FeedbackService = {
    playPop() {
        try {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            if (!AudioCtx) return;
            const ctx = new AudioCtx();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(400, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.08);
            gain.gain.setValueAtTime(0.15, ctx.currentTime);
            gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.08);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start();
            osc.stop(ctx.currentTime + 0.08);
        } catch (e) {
            // Audio autoplay restriction fallback
        }
    },
    vibrate() {
        if ('vibrate' in navigator) {
            navigator.vibrate(50);
        }
    }
};

/**
 * Main Application Controller
 */
const AppController = {
    init() {
        if (window.lucide) {
            lucide.createIcons();
        }
        ParticleEngine.init();
        this.renderStep1Options();
        this.goToStep(1, false);
    },

    renderStep1Options() {
        const vibeContainer = document.getElementById('vibeOptionsContainer');
        if (vibeContainer) {
            vibeContainer.innerHTML = Config.vibeOptions.map(vibe => `
                <button onclick="AppController.selectVibe('${vibe.id}')" 
                        id="vibe-${vibe.id}"
                        class="vibe-btn p-3 rounded-2xl border transition-all text-left flex flex-col justify-between ${
                            AppState.selectedVibe.id === vibe.id 
                            ? 'bg-rose-50 border-rose-500 text-rose-700 ring-2 ring-rose-400/20' 
                            : 'bg-white/80 border-rose-200 hover:border-rose-300 text-slate-700'
                        }">
                    <div class="text-2xl mb-1">${vibe.icon}</div>
                    <div>
                        <div class="font-bold text-sm">${vibe.label}</div>
                        <div class="text-[11px] text-slate-500">${vibe.desc}</div>
                    </div>
                </button>
            `).join('');
        }

        const timeContainer = document.getElementById('timeOptionsContainer');
        if (timeContainer) {
            timeContainer.innerHTML = Config.timeOptions.map(time => `
                <button onclick="AppController.selectTime('${time.id}')"
                        id="time-${time.id}"
                        class="time-btn py-3 px-4 rounded-xl border transition-all text-left flex items-center justify-between ${
                            AppState.selectedTime.id === time.id
                            ? 'bg-rose-50 border-rose-500 text-rose-700 font-bold ring-2 ring-rose-400/20'
                            : 'bg-white/80 border-rose-200 hover:border-rose-300 text-slate-700 font-semibold'
                        }">
                    <span class="text-sm">${time.label}</span>
                    ${time.badge ? `<span class="text-[10px] bg-rose-100 text-rose-600 px-2 py-0.5 rounded-full font-bold">${time.badge}</span>` : ''}
                </button>
            `).join('');
        }
    },

    selectVibe(vibeId) {
        AppState.selectedVibe = Config.vibeOptions.find(v => v.id === vibeId) || Config.vibeOptions[0];
        FeedbackService.playPop();
        this.renderStep1Options();
    },

    selectTime(timeId) {
        AppState.selectedTime = Config.timeOptions.find(t => t.id === timeId) || Config.timeOptions[0];
        FeedbackService.playPop();
        this.renderStep1Options();
    },

    goToStep(stepNumber, playSound = true) {
        AppState.currentStep = stepNumber;
        if (playSound) FeedbackService.playPop();

        // Hide all steps
        document.querySelectorAll('.step-view').forEach(el => el.classList.add('hidden'));
        
        // Show target step
        const currentView = document.getElementById(`step${stepNumber}`);
        if (currentView) currentView.classList.remove('hidden');

        // Update progress tracking header
        const stepText = document.getElementById('stepIndicatorText');
        if (stepText) stepText.innerText = `Step ${stepNumber} of 3`;

        const dotsContainer = document.getElementById('dotsContainer');
        if (dotsContainer) {
            const dots = dotsContainer.children;
            for (let i = 0; i < dots.length; i++) {
                dots[i].className = i < stepNumber 
                    ? 'w-2.5 h-2.5 rounded-full bg-rose-500 transition-all duration-300' 
                    : 'w-2.5 h-2.5 rounded-full bg-rose-200 transition-all duration-300';
            }
        }

        // Refresh icons if needed
        if (window.lucide) {
            lucide.createIcons();
        }
    },

    dodgeNoButton() {
        const noBtn = document.getElementById('noBtn');
        const yesBtn = document.getElementById('yesBtn');
        const container = document.getElementById('cardContainer');
        if (!noBtn || !yesBtn || !container) return;

        AppState.dodgeCount++;
        FeedbackService.playPop();
        FeedbackService.vibrate();

        // Dynamically grow YES button
        const scaleFactor = 1 + (AppState.dodgeCount * 0.1);
        yesBtn.style.transform = `scale(${Math.min(scaleFactor, 1.45)})`;

        // Calculate bounding coordinates
        const containerRect = container.getBoundingClientRect();
        const btnRect = noBtn.getBoundingClientRect();

        const maxX = (containerRect.width / 2) - (btnRect.width / 2) - 16;
        const maxY = 70;

        const randomX = (Math.random() - 0.5) * maxX * 1.6;
        const randomY = (Math.random() - 0.5) * maxY * 1.6;

        noBtn.style.position = 'relative';
        noBtn.style.left = `${randomX}px`;
        noBtn.style.top = `${randomY}px`;

        // Update playful prompt message
        const msgIdx = Math.min(AppState.dodgeCount - 1, Config.dodgeMessages.length - 1);
        const labelEl = document.getElementById('noBtnLabel');
        if (labelEl) labelEl.innerText = Config.dodgeMessages[msgIdx];

        // Surrender transformation after maximum dodges reached
        if (AppState.dodgeCount >= Config.maxDodges) {
            noBtn.className = "w-full sm:w-auto px-8 py-4 bg-rose-500 hover:bg-rose-600 text-white font-bold text-lg rounded-2xl shadow-lg transition-all z-20";
            noBtn.onmouseenter = null;
            noBtn.onclick = () => this.acceptProposal();
        }
    },

    acceptProposal() {
        this.goToStep(3);
        
        // Populate summary details
        const vibeEl = document.getElementById('summaryVibe');
        const timeEl = document.getElementById('summaryTime');
        if (vibeEl) vibeEl.innerText = `${AppState.selectedVibe.icon} ${AppState.selectedVibe.label}`;
        if (timeEl) timeEl.innerText = AppState.selectedTime.label;

        // Fire celebration confetti
        this.triggerCelebrationConfetti();
    },

    triggerCelebrationConfetti() {
        if (typeof confetti !== 'undefined') {
            const defaults = { origin: { y: 0.7 } };
            const fire = (particleRatio, opts) => {
                confetti(Object.assign({}, defaults, opts, {
                    particleCount: Math.floor(200 * particleRatio)
                }));
            };

            fire(0.25, { spread: 26, startVelocity: 55, colors: ['#f43f5e', '#ec4899'] });
            fire(0.2, { spread: 60, colors: ['#ffffff', '#fda4af'] });
            fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
            fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, colors: ['#e11d48'] });
        }
    },

    getSummaryText() {
        return `It's a date! 💕\nActivity: ${AppState.selectedVibe.icon} ${AppState.selectedVibe.label}\nSchedule: ${AppState.selectedTime.label}`;
    },

    sendWhatsApp() {
        const encodedText = encodeURIComponent(this.getSummaryText());
        window.open(`https://wa.me/?text=${encodedText}`, '_blank');
    },

    copySummaryToClipboard() {
        const text = this.getSummaryText();
        const copyBtnText = document.getElementById('copyBtnText');

        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(text).then(() => {
                this.showCopiedState(copyBtnText);
            }).catch(() => {
                this.fallbackCopy(text, copyBtnText);
            });
        } else {
            this.fallbackCopy(text, copyBtnText);
        }
    },

    fallbackCopy(text, copyBtnText) {
        const dummy = document.createElement('textarea');
        dummy.value = text;
        dummy.style.position = 'fixed';
        dummy.style.left = '-9999px';
        document.body.appendChild(dummy);
        dummy.select();
        try {
            document.execCommand('copy');
            this.showCopiedState(copyBtnText);
        } catch (err) {
            console.error('Fallback copy failed', err);
        }
        document.body.removeChild(dummy);
    },

    showCopiedState(el) {
        if (!el) return;
        el.innerText = 'Copied to Clipboard! ✨';
        setTimeout(() => {
            el.innerText = 'Copy Summary';
        }, 3000);
    },
};

// Initialize application on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    AppController.init();
});
