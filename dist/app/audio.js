/** Locally synthesized feedback. No copyrighted or downloaded sound assets. */
let muted = false;
try {
    muted = localStorage.getItem('lebenslinien-muted') === '1';
}
catch { }
export function isMuted() { return muted; }
export function toggleSound() { muted = !muted; try {
    localStorage.setItem('lebenslinien-muted', muted ? '1' : '0');
}
catch { } return muted; }
export function playSound(kind = 'tap') {
    if (muted)
        return;
    try {
        const Ctx = window.AudioContext;
        if (!Ctx)
            return;
        const ctx = new Ctx();
        const now = ctx.currentTime;
        const notes = kind === 'year' ? [392, 523] : kind === 'bad' ? [250, 185] : kind === 'good' ? [587, 784] : [460];
        notes.forEach((hz, i) => {
            const oscillator = ctx.createOscillator();
            const gain = ctx.createGain();
            oscillator.type = 'sine';
            oscillator.frequency.value = hz;
            gain.gain.setValueAtTime(.0001, now + i * .085);
            gain.gain.exponentialRampToValueAtTime(.055, now + i * .085 + .012);
            gain.gain.exponentialRampToValueAtTime(.0001, now + i * .085 + .12);
            oscillator.connect(gain).connect(ctx.destination);
            oscillator.start(now + i * .085);
            oscillator.stop(now + i * .085 + .13);
        });
        void new Promise(resolve => setTimeout(resolve, 350)).then(() => ctx.close());
    }
    catch { /* Audio may be disallowed or unavailable; gameplay still works. */ }
}
