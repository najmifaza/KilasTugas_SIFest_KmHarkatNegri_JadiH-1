const fs = require('fs');
const path = require('path');

const AUDIO_DIR = path.resolve(__dirname, '../public/audio');
if (!fs.existsSync(AUDIO_DIR)) {
  fs.mkdirSync(AUDIO_DIR, { recursive: true });
}

const SAMPLE_RATE = 44100;

function createWavBuffer(samples, sampleRate = SAMPLE_RATE) {
  const numChannels = 2;
  const bytesPerSample = 2; // 16-bit
  const blockAlign = numChannels * bytesPerSample;
  const byteRate = sampleRate * blockAlign;
  const dataSize = samples.length * blockAlign;
  const buffer = Buffer.alloc(44 + dataSize);

  // RIFF header
  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(36 + dataSize, 4);
  buffer.write('WAVE', 8);

  // fmt subchunk
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16); // SubChunk1Size (16 for PCM)
  buffer.writeUInt16LE(1, 20);  // AudioFormat (1 = PCM)
  buffer.writeUInt16LE(numChannels, 22);
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(byteRate, 28);
  buffer.writeUInt16LE(blockAlign, 32);
  buffer.writeUInt16LE(16, 34); // BitsPerSample

  // data subchunk
  buffer.write('data', 36);
  buffer.writeUInt32LE(dataSize, 40);

  let offset = 44;
  for (let i = 0; i < samples.length; i++) {
    // stereo: left and right
    const left = Math.max(-1, Math.min(1, samples[i][0] || 0));
    const right = Math.max(-1, Math.min(1, samples[i][1] || 0));

    const sL = left < 0 ? left * 0x8000 : left * 0x7FFF;
    const sR = right < 0 ? right * 0x8000 : right * 0x7FFF;

    buffer.writeInt16LE(Math.round(sL), offset);
    buffer.writeInt16LE(Math.round(sR), offset + 2);
    offset += 4;
  }

  return buffer;
}

// 1. CLICK / TAP (0.04s) - Clean modern haptic UI click
function generateClick() {
  const duration = 0.04;
  const totalSamples = Math.floor(SAMPLE_RATE * duration);
  const samples = [];

  for (let i = 0; i < totalSamples; i++) {
    const t = i / SAMPLE_RATE;
    const env = Math.exp(-t * 120);
    // Click tone with high transient
    const f = 1200 * Math.exp(-t * 80);
    const val = (Math.sin(2 * Math.PI * f * t) * 0.7 + (Math.random() * 2 - 1) * 0.3) * env * 0.7;
    samples.push([val, val]);
  }
  return samples;
}

// 2. POP / BUBBLE (0.08s) - For badges popping up
function generatePop() {
  const duration = 0.08;
  const totalSamples = Math.floor(SAMPLE_RATE * duration);
  const samples = [];

  for (let i = 0; i < totalSamples; i++) {
    const t = i / SAMPLE_RATE;
    const progress = i / totalSamples;
    const env = Math.sin(Math.PI * progress);
    const freq = 400 + 450 * progress; // Pitch slides up
    const val = Math.sin(2 * Math.PI * freq * t) * env * 0.6;
    samples.push([val, val]);
  }
  return samples;
}

// 3. WHOOSH / SWOOSH (0.35s) - Scene transitions and pans
function generateWhoosh() {
  const duration = 0.35;
  const totalSamples = Math.floor(SAMPLE_RATE * duration);
  const samples = [];

  for (let i = 0; i < totalSamples; i++) {
    const t = i / SAMPLE_RATE;
    const progress = i / totalSamples;
    // Bell curve amplitude envelope
    const env = Math.pow(Math.sin(Math.PI * progress), 2);
    // Filtered noise with pitch sweep
    const sweepFreq = 200 + 1200 * Math.sin(Math.PI * progress);
    const noise = (Math.random() * 2 - 1);
    const tone = Math.sin(2 * Math.PI * sweepFreq * t);
    const val = (noise * 0.65 + tone * 0.35) * env * 0.55;

    // slight stereo pan from left to right
    const panL = Math.cos(progress * Math.PI * 0.5);
    const panR = Math.sin(progress * Math.PI * 0.5);
    samples.push([val * panL, val * panR]);
  }
  return samples;
}

// 4. SPARKLE / AI BREAKDOWN CHIME (1.4s) - Pentatonic crystalline bell
function generateSparkle() {
  const duration = 1.4;
  const totalSamples = Math.floor(SAMPLE_RATE * duration);
  const samples = new Array(totalSamples).fill(0).map(() => [0, 0]);

  // Arpeggio notes: C6 (1046.5), E6 (1318.5), G6 (1567.98), B6 (1975.5), C7 (2093.0)
  const notes = [
    { freq: 1046.50, start: 0.00, gain: 0.35 },
    { freq: 1318.51, start: 0.08, gain: 0.32 },
    { freq: 1567.98, start: 0.16, gain: 0.30 },
    { freq: 1975.53, start: 0.24, gain: 0.28 },
    { freq: 2093.00, start: 0.32, gain: 0.38 },
  ];

  notes.forEach((n) => {
    const startSample = Math.floor(n.start * SAMPLE_RATE);
    for (let i = startSample; i < totalSamples; i++) {
      const t = (i - startSample) / SAMPLE_RATE;
      const env = Math.exp(-t * 4.2);
      // Pure bell: fundamental + 2nd harmonic + 3rd harmonic
      const val = (
        Math.sin(2 * Math.PI * n.freq * t) * 0.7 +
        Math.sin(2 * Math.PI * n.freq * 2.01 * t) * 0.2 +
        Math.sin(2 * Math.PI * n.freq * 3.02 * t) * 0.1
      ) * env * n.gain;

      samples[i][0] += val * 0.85;
      samples[i][1] += val * 0.85;
    }
  });

  return samples;
}

// 5. SUCCESS CHIME (1.2s) - Warm major chord for subtask check & milestone
function generateSuccess() {
  const duration = 1.2;
  const totalSamples = Math.floor(SAMPLE_RATE * duration);
  const samples = new Array(totalSamples).fill(0).map(() => [0, 0]);

  // E5, G#5, B5, E6
  const chord = [
    { freq: 659.25, gain: 0.35 },
    { freq: 830.61, gain: 0.30 },
    { freq: 987.77, gain: 0.25 },
    { freq: 1318.51, gain: 0.32 },
  ];

  chord.forEach((n, idx) => {
    const delay = idx * 0.035;
    const startSample = Math.floor(delay * SAMPLE_RATE);
    for (let i = startSample; i < totalSamples; i++) {
      const t = (i - startSample) / SAMPLE_RATE;
      const env = Math.exp(-t * 3.5);
      const val = (
        Math.sin(2 * Math.PI * n.freq * t) * 0.75 +
        Math.sin(2 * Math.PI * n.freq * 2 * t) * 0.25
      ) * env * n.gain;

      samples[i][0] += val * 0.75;
      samples[i][1] += val * 0.75;
    }
  });

  return samples;
}

// 6. BGM - Warm, elegant modern tech demo soundtrack (68s @ 105 BPM)
function generateBGM() {
  const duration = 68.0;
  const totalSamples = Math.floor(SAMPLE_RATE * duration);
  const samples = new Array(totalSamples).fill(0).map(() => [0, 0]);

  const bpm = 105;
  const beatSec = 60 / bpm;
  const barSec = beatSec * 4;

  // Chord progression: Fmaj7 (F3, A3, C4, E4), G (G3, B3, D4, G4), Em7 (E3, G3, B3, D4), Am7 (A3, C4, E4, G4)
  const progressions = [
    [174.61, 220.00, 261.63, 329.63], // Fmaj7
    [196.00, 246.94, 293.66, 392.00], // G
    [164.81, 196.00, 246.94, 293.66], // Em7
    [220.00, 261.63, 329.63, 392.00], // Am7
  ];

  const totalBars = Math.ceil(duration / barSec);

  for (let bar = 0; bar < totalBars; bar++) {
    const chord = progressions[bar % progressions.length];
    const barStart = bar * barSec;

    // 1. Warm electric piano / rhodes chords with soft tremolo & gentle strum
    chord.forEach((freq, noteIdx) => {
      const noteDelay = noteIdx * 0.03;
      const noteStartSec = barStart + noteDelay;
      const startSample = Math.floor(noteStartSec * SAMPLE_RATE);
      const endSample = Math.min(totalSamples, Math.floor((barStart + barSec * 0.95) * SAMPLE_RATE));

      for (let s = startSample; s < endSample; s++) {
        const t = (s - startSample) / SAMPLE_RATE;
        // Warm decay
        const env = Math.exp(-t * 0.9) * (1 - Math.exp(-t * 30));
        const tremolo = 1 + 0.08 * Math.sin(2 * Math.PI * 4.5 * t);
        // Soft electric piano: sine + soft 2nd & 3rd harmonic
        const tone = (
          Math.sin(2 * Math.PI * freq * t) * 0.65 +
          Math.sin(2 * Math.PI * freq * 2 * t) * 0.22 +
          Math.sin(2 * Math.PI * freq * 3 * t) * 0.10
        ) * env * tremolo * 0.085;

        // Stereo spread
        const pan = (noteIdx / (chord.length - 1)) * 0.4 + 0.3; // 0.3 to 0.7
        samples[s][0] += tone * (1 - pan);
        samples[s][1] += tone * pan;
      }
    });

    // 2. Soft melodic acoustic bass note on beat 1 and beat 3.5
    const rootFreq = chord[0] / 2; // bass octave
    const bassHits = [0, 2.5];
    bassHits.forEach((hitBeat) => {
      const hitSec = barStart + hitBeat * beatSec;
      const startSample = Math.floor(hitSec * SAMPLE_RATE);
      const endSample = Math.min(totalSamples, Math.floor((hitSec + 1.8) * SAMPLE_RATE));

      for (let s = startSample; s < endSample; s++) {
        const t = (s - startSample) / SAMPLE_RATE;
        const env = Math.exp(-t * 2.2);
        const bassTone = (
          Math.sin(2 * Math.PI * rootFreq * t) * 0.7 +
          Math.sin(2 * Math.PI * rootFreq * 2 * t) * 0.25
        ) * env * 0.12;

        samples[s][0] += bassTone;
        samples[s][1] += bassTone;
      }
    });

    // 3. Subtle organic percussion (soft kick on 1, soft rim/click on 2 & 4, light shaker)
    for (let beat = 0; beat < 4; beat++) {
      const beatSecTime = barStart + beat * beatSec;
      
      // Kick on 1 and 3 (subtle, warm rounded thud)
      if (beat === 0 || beat === 2) {
        const startSample = Math.floor(beatSecTime * SAMPLE_RATE);
        const endSample = Math.min(totalSamples, startSample + Math.floor(0.18 * SAMPLE_RATE));
        for (let s = startSample; s < endSample; s++) {
          const t = (s - startSample) / SAMPLE_RATE;
          const kFreq = 90 * Math.exp(-t * 25) + 45;
          const kEnv = Math.exp(-t * 18);
          const kick = Math.sin(2 * Math.PI * kFreq * t) * kEnv * 0.12;
          samples[s][0] += kick;
          samples[s][1] += kick;
        }
      }

      // Soft snap / rimclick on beat 1 and 3 (beats 2 and 4 in 4/4)
      if (beat === 1 || beat === 3) {
        const startSample = Math.floor(beatSecTime * SAMPLE_RATE);
        const endSample = Math.min(totalSamples, startSample + Math.floor(0.08 * SAMPLE_RATE));
        for (let s = startSample; s < endSample; s++) {
          const t = (s - startSample) / SAMPLE_RATE;
          const rEnv = Math.exp(-t * 50);
          const rim = ((Math.random() * 2 - 1) * 0.6 + Math.sin(2 * Math.PI * 1800 * t) * 0.4) * rEnv * 0.055;
          samples[s][0] += rim;
          samples[s][1] += rim;
        }
      }
    }
  }

  // Master fade in (first 1.5s) and fade out (last 3s)
  const fadeInSamples = Math.floor(1.5 * SAMPLE_RATE);
  const fadeOutSamples = Math.floor(3.0 * SAMPLE_RATE);
  const fadeOutStart = totalSamples - fadeOutSamples;

  for (let i = 0; i < totalSamples; i++) {
    let vol = 1.0;
    if (i < fadeInSamples) {
      vol = i / fadeInSamples;
    } else if (i > fadeOutStart) {
      vol = (totalSamples - i) / fadeOutSamples;
    }
    samples[i][0] *= vol;
    samples[i][1] *= vol;
  }

  return samples;
}

console.log('Generating sound effects...');

fs.writeFileSync(path.join(AUDIO_DIR, 'click.wav'), createWavBuffer(generateClick()));
console.log('✓ click.wav');

fs.writeFileSync(path.join(AUDIO_DIR, 'pop.wav'), createWavBuffer(generatePop()));
console.log('✓ pop.wav');

fs.writeFileSync(path.join(AUDIO_DIR, 'whoosh.wav'), createWavBuffer(generateWhoosh()));
console.log('✓ whoosh.wav');

fs.writeFileSync(path.join(AUDIO_DIR, 'sparkle.wav'), createWavBuffer(generateSparkle()));
console.log('✓ sparkle.wav');

fs.writeFileSync(path.join(AUDIO_DIR, 'success.wav'), createWavBuffer(generateSuccess()));
console.log('✓ success.wav');

console.log('Synthesizing background music (68s)...');
fs.writeFileSync(path.join(AUDIO_DIR, 'bgm.wav'), createWavBuffer(generateBGM()));
console.log('✓ bgm.wav');

console.log('All audio effects created successfully in', AUDIO_DIR);
