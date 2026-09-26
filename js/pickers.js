/**
 * Custom Date & Time Pickers
 * Inline calendar and scroll-wheel time picker used on step 1.
 */
const PickerUtils = {
    pad(n) {
        return String(n).padStart(2, '0');
    },

    toISODate(date) {
        return `${date.getFullYear()}-${this.pad(date.getMonth() + 1)}-${this.pad(date.getDate())}`;
    },

    parseISODate(value) {
        const [y, m, d] = value.split('-').map(Number);
        return new Date(y, m - 1, d);
    },

    startOfToday() {
        const d = new Date();
        d.setHours(0, 0, 0, 0);
        return d;
    }
};

const CHEVRON_LEFT = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>';
const CHEVRON_RIGHT = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>';

/**
 * Inline Month Calendar
 */
const DatePicker = {
    container: null,
    selected: '',
    view: null,
    onChange: null,
    maxMonthsAhead: 12,

    init(container, { selected = '', onChange } = {}) {
        this.container = container;
        this.selected = selected;
        this.onChange = onChange;
        const base = selected ? PickerUtils.parseISODate(selected) : new Date();
        this.view = { year: base.getFullYear(), month: base.getMonth() };
        this.render();
    },

    canShift(delta) {
        const today = new Date();
        const offset = (this.view.year - today.getFullYear()) * 12 + (this.view.month - today.getMonth()) + delta;
        return offset >= 0 && offset <= this.maxMonthsAhead;
    },

    shiftMonth(delta) {
        if (!this.canShift(delta)) return;
        const d = new Date(this.view.year, this.view.month + delta, 1);
        this.view = { year: d.getFullYear(), month: d.getMonth() };
        FeedbackService.playPop();
        this.render(delta > 0 ? 'next' : 'prev');
    },

    select(iso) {
        this.selected = iso;
        const date = PickerUtils.parseISODate(iso);
        this.view = { year: date.getFullYear(), month: date.getMonth() };
        FeedbackService.playPop();
        FeedbackService.tick();
        this.render();
        if (this.onChange) this.onChange(iso);
    },

    getCountdown(iso) {
        const days = Math.round((PickerUtils.parseISODate(iso) - PickerUtils.startOfToday()) / 86400000);
        if (days === 0) return 'Today! 🥳';
        if (days === 1) return 'Tomorrow! 💫';
        return `In ${days} days ⏳`;
    },

    render(direction) {
        if (!this.container) return;
        const { year, month } = this.view;
        const today = PickerUtils.startOfToday();
        const todayISO = PickerUtils.toISODate(today);
        const firstWeekday = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const title = new Date(year, month, 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

        const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
            .map(d => `<span class="cal-weekday">${d}</span>`).join('');

        const cells = [];
        for (let i = 0; i < firstWeekday; i++) cells.push('<span></span>');
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(year, month, day);
            const iso = PickerUtils.toISODate(date);
            const isPast = date < today;
            const isSelected = iso === this.selected;
            const classes = ['cal-day'];
            if (isSelected) classes.push('is-selected');
            if (iso === todayISO) classes.push('is-today');
            if (date.getDay() === 0 || date.getDay() === 6) classes.push('is-weekend');
            const ariaLabel = date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
            cells.push(`
                <button type="button" class="${classes.join(' ')}" aria-label="${ariaLabel}"
                        ${isSelected ? 'aria-pressed="true"' : ''}
                        ${isPast ? 'disabled' : `onclick="DatePicker.select('${iso}')"`}>${day}</button>
            `);
        }

        let footer;
        if (this.selected) {
            const label = PickerUtils.parseISODate(this.selected).toLocaleDateString('en-US', {
                weekday: 'long', month: 'long', day: 'numeric'
            });
            footer = `
                <span class="font-bold text-slate-700">💌 ${label}</span>
                <span class="cal-countdown">${this.getCountdown(this.selected)}</span>
            `;
        } else {
            footer = `
                <span class="font-semibold text-slate-400">Tap a day to choose 💕</span>
                <button type="button" class="cal-today-btn" onclick="DatePicker.select('${todayISO}')">Today</button>
            `;
        }

        const slideClass = direction === 'next' ? 'cal-slide-next' : direction === 'prev' ? 'cal-slide-prev' : '';

        this.container.innerHTML = `
            <div class="flex items-center justify-between mb-3">
                <button type="button" class="cal-nav" onclick="DatePicker.shiftMonth(-1)" aria-label="Previous month" ${this.canShift(-1) ? '' : 'disabled'}>${CHEVRON_LEFT}</button>
                <div class="text-sm font-extrabold text-slate-800 tracking-tight">${title}</div>
                <button type="button" class="cal-nav" onclick="DatePicker.shiftMonth(1)" aria-label="Next month" ${this.canShift(1) ? '' : 'disabled'}>${CHEVRON_RIGHT}</button>
            </div>
            <div class="cal-grid mb-1">${weekdays}</div>
            <div class="cal-grid ${slideClass}">${cells.join('')}</div>
            <div class="mt-3 pt-3 border-t border-rose-100 flex items-center justify-between gap-2 text-xs">${footer}</div>
        `;
    }
};

/**
 * Scroll-Wheel Time Picker
 */
const TimePicker = {
    ITEM_HEIGHT: 36,
    hours: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    minutes: Array.from({ length: 12 }, (_, i) => i * 5),
    container: null,
    value: { hour: 7, minute: 30, period: 'PM' },
    onChange: null,

    init(container, { value, onChange } = {}) {
        this.container = container;
        if (value) this.value = { ...value };
        this.onChange = onChange;
        this.render();
        this.bindWheel('hour');
        this.bindWheel('minute');
        this.sync(false);
    },

    to24Hour({ hour, period }) {
        return (hour % 12) + (period === 'PM' ? 12 : 0);
    },

    getMood(value = this.value) {
        const h = this.to24Hour(value);
        if (h >= 5 && h < 11) return { emoji: '☀️', text: 'Sweet morning date' };
        if (h >= 11 && h < 14) return { emoji: '🥪', text: "Lunch date o'clock" };
        if (h >= 14 && h < 17) return { emoji: '🍰', text: 'Afternoon treats' };
        if (h >= 17 && h < 19) return { emoji: '🌅', text: 'Golden hour magic' };
        if (h >= 19 && h < 22) return { emoji: '🌙', text: 'Perfect dinner & movie time' };
        return { emoji: '✨', text: 'Late night adventure' };
    },

    formatLabel(value = this.value) {
        return `${this.getMood(value).emoji} ${value.hour}:${PickerUtils.pad(value.minute)} ${value.period}`;
    },

    wheelEl(kind) {
        return document.getElementById(kind === 'hour' ? 'tpHourWheel' : 'tpMinuteWheel');
    },

    list(kind) {
        return kind === 'hour' ? this.hours : this.minutes;
    },

    render() {
        if (!this.container) return;
        const wheelItems = kind => this.list(kind).map((v, i) => `
            <div class="wheel-item" onclick="TimePicker.scrollToIndex('${kind}', ${i}, true)">${kind === 'hour' ? v : PickerUtils.pad(v)}</div>
        `).join('');

        const chips = Config.timeSlots.map(slot => `
            <button type="button" class="time-chip" data-slot="${slot.id}" onclick="TimePicker.applyPreset('${slot.id}')">
                ${slot.emoji} ${slot.label}
            </button>
        `).join('');

        this.container.innerHTML = `
            <div class="flex items-center justify-between mb-4">
                <div class="text-left">
                    <div id="tpDisplay" class="tp-display"></div>
                    <div id="tpMood" class="text-xs font-semibold text-slate-500 mt-0.5"></div>
                </div>
                <div id="tpIcon" class="tp-icon"></div>
            </div>
            <div class="flex flex-wrap gap-2 mb-3">${chips}</div>
            <div class="flex items-center gap-2">
                <div class="wheel-wrap">
                    <div class="wheel-band"></div>
                    <div id="tpHourWheel" class="wheel" tabindex="0" role="listbox" aria-label="Hour">${wheelItems('hour')}</div>
                </div>
                <div class="text-2xl font-extrabold text-rose-400 pb-1">:</div>
                <div class="wheel-wrap">
                    <div class="wheel-band"></div>
                    <div id="tpMinuteWheel" class="wheel" tabindex="0" role="listbox" aria-label="Minute">${wheelItems('minute')}</div>
                </div>
                <div class="period-toggle" role="group" aria-label="AM or PM">
                    <button type="button" class="period-btn" data-period="AM" onclick="TimePicker.setPeriod('AM')">AM</button>
                    <button type="button" class="period-btn" data-period="PM" onclick="TimePicker.setPeriod('PM')">PM</button>
                </div>
            </div>
        `;
    },

    bindWheel(kind) {
        const el = this.wheelEl(kind);
        if (!el) return;
        let settleTimer = null;

        el.addEventListener('scroll', () => {
            this.paintWheel(kind);
            const list = this.list(kind);
            const idx = Math.min(Math.max(Math.round(el.scrollTop / this.ITEM_HEIGHT), 0), list.length - 1);
            if (list[idx] !== this.value[kind]) {
                this.value[kind] = list[idx];
                FeedbackService.tick();
                this.updateDisplay();
            }
            clearTimeout(settleTimer);
            settleTimer = setTimeout(() => this.emit(), 150);
        }, { passive: true });

        el.addEventListener('keydown', e => {
            if (e.key !== 'ArrowUp' && e.key !== 'ArrowDown') return;
            e.preventDefault();
            const idx = this.list(kind).indexOf(this.value[kind]) + (e.key === 'ArrowDown' ? 1 : -1);
            if (idx >= 0 && idx < this.list(kind).length) this.scrollToIndex(kind, idx, true);
        });
    },

    paintWheel(kind) {
        const el = this.wheelEl(kind);
        if (!el) return;
        Array.from(el.children).forEach((item, i) => {
            const distance = Math.abs(i * this.ITEM_HEIGHT - el.scrollTop) / this.ITEM_HEIGHT;
            item.style.opacity = Math.max(0.2, 1 - distance * 0.35);
            item.style.transform = `scale(${1 - Math.min(distance, 2) * 0.12})`;
            item.classList.toggle('is-active', distance < 0.5);
        });
    },

    scrollToIndex(kind, idx, smooth) {
        const el = this.wheelEl(kind);
        if (!el) return;
        el.scrollTo({ top: idx * this.ITEM_HEIGHT, behavior: smooth ? 'smooth' : 'auto' });
        if (!smooth) this.paintWheel(kind);
    },

    // Re-align wheels with the current value (e.g. after the step becomes visible again).
    sync(smooth) {
        ['hour', 'minute'].forEach(kind => {
            const idx = Math.max(this.list(kind).indexOf(this.value[kind]), 0);
            this.scrollToIndex(kind, idx, smooth);
        });
        this.updateDisplay();
    },

    setPeriod(period) {
        if (this.value.period === period) return;
        this.value.period = period;
        FeedbackService.playPop();
        this.updateDisplay();
        this.emit();
    },

    applyPreset(slotId) {
        const slot = Config.timeSlots.find(s => s.id === slotId);
        if (!slot) return;
        this.value = { hour: slot.hour, minute: slot.minute, period: slot.period };
        FeedbackService.playPop();
        this.sync(true);
        this.emit();
    },

    updateDisplay() {
        const { hour, minute, period } = this.value;
        const mood = this.getMood();
        const display = document.getElementById('tpDisplay');
        const moodEl = document.getElementById('tpMood');
        const icon = document.getElementById('tpIcon');
        if (display) display.innerHTML = `${hour}:${PickerUtils.pad(minute)} <span class="text-rose-500">${period}</span>`;
        if (moodEl) moodEl.innerText = mood.text;
        if (icon && icon.innerText !== mood.emoji) {
            icon.innerText = mood.emoji;
            icon.classList.remove('tp-icon-pop');
            void icon.offsetWidth;
            icon.classList.add('tp-icon-pop');
        }

        this.container.querySelectorAll('.period-btn').forEach(btn => {
            btn.classList.toggle('is-active', btn.dataset.period === period);
        });
        this.container.querySelectorAll('.time-chip').forEach(chip => {
            const slot = Config.timeSlots.find(s => s.id === chip.dataset.slot);
            chip.classList.toggle('is-active', !!slot && slot.hour === hour && slot.minute === minute && slot.period === period);
        });
    },

    emit() {
        if (this.onChange) this.onChange({ ...this.value });
    }
};
