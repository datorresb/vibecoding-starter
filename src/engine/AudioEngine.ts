/**
 * Audio Engine using Web Audio API
 * Generates all sounds procedurally - no external files needed
 */

export class AudioEngine {
    private audioContext: AudioContext | null = null;
    private masterGain: GainNode | null = null;
    private isMuted: boolean = false;
    private musicOscillators: OscillatorNode[] = [];
    private isMusicPlaying: boolean = false;
    private gameLevel: number = 1;
    private tempoMultiplier: number = 1.0;

    constructor() {
        this.initContext();
    }

    // Set level and adjust tempo
    public setLevel(level: number) {
        this.gameLevel = level;
        // Speed up music: 10% faster per level, max 2x speed
        this.tempoMultiplier = Math.min(2.0, 1.0 + (level - 1) * 0.1);
    }

    public getLevel(): number {
        return this.gameLevel;
    }

    private initContext() {
        try {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
            this.masterGain = this.audioContext.createGain();
            this.masterGain.connect(this.audioContext.destination);
            this.masterGain.gain.value = 0.3;
        } catch {
            console.warn('Web Audio API not supported');
        }
    }

    public resume() {
        if (this.audioContext?.state === 'suspended') {
            this.audioContext.resume();
        }
    }

    public setMuted(muted: boolean) {
        this.isMuted = muted;
        if (this.masterGain) {
            this.masterGain.gain.value = muted ? 0 : 0.3;
        }
    }

    public toggleMute(): boolean {
        this.setMuted(!this.isMuted);
        return this.isMuted;
    }

    public getMuted(): boolean {
        return this.isMuted;
    }

    // Play a simple tone
    private playTone(frequency: number, duration: number, type: OscillatorType = 'square', volume: number = 0.3) {
        if (!this.audioContext || !this.masterGain || this.isMuted) return;

        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        oscillator.type = type;
        oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);

        gainNode.gain.setValueAtTime(volume, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);

        oscillator.connect(gainNode);
        gainNode.connect(this.masterGain);

        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + duration);
    }

    // Play a sequence of notes
    private playSequence(notes: { freq: number; dur: number }[], type: OscillatorType = 'square') {
        if (!this.audioContext || this.isMuted) return;

        let time = this.audioContext.currentTime;
        notes.forEach(note => {
            this.playToneAt(note.freq, time, note.dur, type);
            time += note.dur;
        });
    }

    private playToneAt(frequency: number, startTime: number, duration: number, type: OscillatorType = 'square') {
        if (!this.audioContext || !this.masterGain) return;

        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        oscillator.type = type;
        oscillator.frequency.setValueAtTime(frequency, startTime);

        gainNode.gain.setValueAtTime(0.2, startTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + duration * 0.9);

        oscillator.connect(gainNode);
        gainNode.connect(this.masterGain);

        oscillator.start(startTime);
        oscillator.stop(startTime + duration);
    }

    // === SOUND EFFECTS ===

    public playMove() {
        this.playTone(200, 0.05, 'square', 0.1);
    }

    public playRotate() {
        this.playTone(300, 0.08, 'square', 0.15);
    }

    public playDrop() {
        this.playTone(150, 0.1, 'square', 0.2);
    }

    public playHardDrop() {
        // Descending thud
        if (!this.audioContext || !this.masterGain || this.isMuted) return;

        const osc = this.audioContext.createOscillator();
        const gain = this.audioContext.createGain();

        osc.type = 'square';
        osc.frequency.setValueAtTime(200, this.audioContext.currentTime);
        osc.frequency.exponentialRampToValueAtTime(50, this.audioContext.currentTime + 0.15);

        gain.gain.setValueAtTime(0.3, this.audioContext.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.15);

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start();
        osc.stop(this.audioContext.currentTime + 0.15);
    }

    public playLineClear(lines: number = 1) {
        // Higher pitch and longer for more lines
        const baseFreq = 400 + (lines * 100);
        const duration = 0.15 + (lines * 0.05);

        if (lines === 4) {
            // Tetris! Special sound
            this.playSequence([
                { freq: 523, dur: 0.1 },  // C5
                { freq: 659, dur: 0.1 },  // E5
                { freq: 784, dur: 0.1 },  // G5
                { freq: 1047, dur: 0.2 }, // C6
            ], 'square');
        } else {
            this.playTone(baseFreq, duration, 'square', 0.25);
        }
    }

    public playLevelUp() {
        this.playSequence([
            { freq: 440, dur: 0.1 },  // A4
            { freq: 554, dur: 0.1 },  // C#5
            { freq: 659, dur: 0.1 },  // E5
            { freq: 880, dur: 0.15 }, // A5
        ], 'square');
    }

    public playGameOver() {
        // Sad descending tones
        this.playSequence([
            { freq: 392, dur: 0.2 },  // G4
            { freq: 349, dur: 0.2 },  // F4
            { freq: 330, dur: 0.2 },  // E4
            { freq: 294, dur: 0.4 },  // D4
        ], 'square');
    }

    public playPause() {
        this.playTone(440, 0.1, 'sine', 0.2);
    }

    public playResume() {
        this.playSequence([
            { freq: 440, dur: 0.08 },
            { freq: 554, dur: 0.08 },
        ], 'sine');
    }

    // === BACKGROUND MUSIC (Korobeiniki melody) ===

    public startMusic() {
        if (this.isMusicPlaying || !this.audioContext || this.isMuted) return;
        this.isMusicPlaying = true;
        this.playKorobeinikiLoop();
    }

    public stopMusic() {
        this.isMusicPlaying = false;
        this.musicOscillators.forEach(osc => {
            try { osc.stop(); } catch { /* already stopped */ }
        });
        this.musicOscillators = [];
    }

    private playKorobeinikiLoop() {
        if (!this.isMusicPlaying || !this.audioContext || !this.masterGain) return;

        // Korobeiniki (Tetris theme) - extended melody
        // Part A + Part B of the classic theme
        const melody = [
            // Part A - Main theme
            { freq: 659, dur: 0.4 },   // E5
            { freq: 494, dur: 0.2 },   // B4
            { freq: 523, dur: 0.2 },   // C5
            { freq: 587, dur: 0.4 },   // D5
            { freq: 523, dur: 0.2 },   // C5
            { freq: 494, dur: 0.2 },   // B4
            { freq: 440, dur: 0.4 },   // A4
            { freq: 440, dur: 0.2 },   // A4
            { freq: 523, dur: 0.2 },   // C5
            { freq: 659, dur: 0.4 },   // E5
            { freq: 587, dur: 0.2 },   // D5
            { freq: 523, dur: 0.2 },   // C5
            { freq: 494, dur: 0.6 },   // B4
            { freq: 523, dur: 0.2 },   // C5
            { freq: 587, dur: 0.4 },   // D5
            { freq: 659, dur: 0.4 },   // E5
            { freq: 523, dur: 0.4 },   // C5
            { freq: 440, dur: 0.4 },   // A4
            { freq: 440, dur: 0.4 },   // A4
            { freq: 0, dur: 0.2 },     // Rest

            // Part A repeat with variation
            { freq: 587, dur: 0.6 },   // D5
            { freq: 698, dur: 0.2 },   // F5
            { freq: 880, dur: 0.4 },   // A5
            { freq: 784, dur: 0.2 },   // G5
            { freq: 698, dur: 0.2 },   // F5
            { freq: 659, dur: 0.6 },   // E5
            { freq: 523, dur: 0.2 },   // C5
            { freq: 659, dur: 0.4 },   // E5
            { freq: 587, dur: 0.2 },   // D5
            { freq: 523, dur: 0.2 },   // C5
            { freq: 494, dur: 0.4 },   // B4
            { freq: 494, dur: 0.2 },   // B4
            { freq: 523, dur: 0.2 },   // C5
            { freq: 587, dur: 0.4 },   // D5
            { freq: 659, dur: 0.4 },   // E5
            { freq: 523, dur: 0.4 },   // C5
            { freq: 440, dur: 0.4 },   // A4
            { freq: 440, dur: 0.4 },   // A4
            { freq: 0, dur: 0.2 },     // Rest

            // Part B - Bridge section
            { freq: 659, dur: 0.8 },   // E5
            { freq: 523, dur: 0.8 },   // C5
            { freq: 587, dur: 0.8 },   // D5
            { freq: 494, dur: 0.8 },   // B4
            { freq: 523, dur: 0.8 },   // C5
            { freq: 440, dur: 0.8 },   // A4
            { freq: 415, dur: 0.8 },   // G#4
            { freq: 494, dur: 0.8 },   // B4
            { freq: 0, dur: 0.2 },     // Rest

            // Part B repeat
            { freq: 659, dur: 0.8 },   // E5
            { freq: 523, dur: 0.8 },   // C5
            { freq: 587, dur: 0.8 },   // D5
            { freq: 494, dur: 0.8 },   // B4
            { freq: 523, dur: 0.4 },   // C5
            { freq: 659, dur: 0.4 },   // E5
            { freq: 880, dur: 0.8 },   // A5
            { freq: 831, dur: 0.8 },   // G#5
            { freq: 0, dur: 0.4 },     // Rest
        ];

        let time = this.audioContext.currentTime;
        // Apply tempo multiplier - higher level = faster music
        const adjustedMelody = melody.map(note => ({
            freq: note.freq,
            dur: note.dur / this.tempoMultiplier
        }));
        const totalDuration = adjustedMelody.reduce((sum, n) => sum + n.dur, 0);

        adjustedMelody.forEach(note => {
            if (note.freq > 0) {
                this.playMusicNote(note.freq, time, note.dur * 0.9);
            }
            time += note.dur;
        });

        // Schedule next loop
        setTimeout(() => {
            if (this.isMusicPlaying) {
                this.playKorobeinikiLoop();
            }
        }, totalDuration * 1000);
    }

    private playMusicNote(frequency: number, startTime: number, duration: number) {
        if (!this.audioContext || !this.masterGain) return;

        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        oscillator.type = 'square';
        oscillator.frequency.setValueAtTime(frequency, startTime);

        // Softer volume for background music
        gainNode.gain.setValueAtTime(0.08, startTime);
        gainNode.gain.setValueAtTime(0.08, startTime + duration * 0.7);
        gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + duration);

        oscillator.connect(gainNode);
        gainNode.connect(this.masterGain);

        oscillator.start(startTime);
        oscillator.stop(startTime + duration);

        this.musicOscillators.push(oscillator);
    }
}

// Singleton instance
export const audioEngine = new AudioEngine();
