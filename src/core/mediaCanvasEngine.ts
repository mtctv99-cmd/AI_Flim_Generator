// ============================================================================
// FLIM AI STUDIO — DYNAMIC CINEMATIC CANVAS & AUDIO SYNTHESIS ENGINE
// Renders live cinematic camera movement, anamorphic flares, rain, and audio
// ============================================================================

export interface RenderCanvasOptions {
  width: number;
  height: number;
  progress: number; // 0.0 - 1.0 (timeline / clip playback progress)
  shotType?: string;
  cameraMovement?: string;
  lightingCue?: string;
  characterAnchor?: string;
  seed?: number;
  timecode?: string;
  aspectRatio?: '16:9' | '9:16' | '2.39:1';
}

export function drawCinematicFrame(
  ctx: CanvasRenderingContext2D,
  options: RenderCanvasOptions
) {
  const { width, height, progress, cameraMovement = 'STATIC', lightingCue = '', seed = 42 } = options;
  const time = progress * 10; // virtual seconds

  // 1. Dark Base Canvas
  ctx.fillStyle = '#06080d';
  ctx.fillRect(0, 0, width, height);

  ctx.save();

  // 2. Camera Movement Simulation (Zoom, Pan, Dolly, Orbit)
  let scale = 1.0;
  let offsetX = 0;
  let offsetY = 0;

  if (cameraMovement === 'DOLLY_IN') {
    scale = 1.0 + progress * 0.18;
  } else if (cameraMovement === 'DOLLY_OUT') {
    scale = 1.18 - progress * 0.18;
  } else if (cameraMovement === 'PAN_LEFT') {
    offsetX = progress * 60;
  } else if (cameraMovement === 'PAN_RIGHT') {
    offsetX = -progress * 60;
  } else if (cameraMovement === 'TRACKING') {
    offsetX = Math.sin(progress * Math.PI) * 40;
    scale = 1.05 + Math.cos(progress * Math.PI) * 0.05;
  } else if (cameraMovement === 'ORBIT') {
    offsetX = Math.sin(time * 1.5) * 30;
    offsetY = Math.cos(time * 1.5) * 15;
    scale = 1.08;
  }

  ctx.translate(width / 2 + offsetX, height / 2 + offsetY);
  ctx.scale(scale, scale);
  ctx.translate(-width / 2, -height / 2);

  // 3. Cyberpunk / Sci-Fi Backdrop Gradient
  const grad = ctx.createLinearGradient(0, 0, 0, height);
  grad.addColorStop(0, '#040711');
  grad.addColorStop(0.5, '#0a1224');
  grad.addColorStop(1, '#020306');
  ctx.fillStyle = grad;
  ctx.fillRect(-50, -50, width + 100, height + 100);

  // 4. Distant Skyscraper Silhouettes
  ctx.fillStyle = '#070b14';
  const numBuildings = 8;
  for (let i = 0; i < numBuildings; i++) {
    const bx = (i * (width / numBuildings)) - 20;
    const bWidth = width / numBuildings * 0.85;
    const bHeight = height * 0.6 + ((i * 37 + seed) % 120);
    const by = height - bHeight;
    ctx.fillRect(bx, by, bWidth, bHeight);

    // Glowing window grid
    ctx.fillStyle = (i % 2 === 0) ? 'rgba(0, 229, 255, 0.25)' : 'rgba(255, 170, 0, 0.2)';
    for (let r = 0; r < 6; r++) {
      for (let c = 0; c < 3; c++) {
        if (((i * 7 + r * 3 + c + Math.floor(time * 2)) % 4) === 0) {
          ctx.fillRect(bx + 8 + c * 14, by + 20 + r * 22, 6, 8);
        }
      }
    }
    ctx.fillStyle = '#070b14';
  }

  // 5. Volumetric Neon Atmospheric Beams
  const beamGrad = ctx.createRadialGradient(
    width * 0.3 + Math.sin(time) * 40,
    height * 0.4,
    10,
    width * 0.3,
    height * 0.4,
    width * 0.7
  );
  beamGrad.addColorStop(0, 'rgba(0, 229, 255, 0.35)');
  beamGrad.addColorStop(0.4, 'rgba(255, 0, 128, 0.15)');
  beamGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = beamGrad;
  ctx.fillRect(0, 0, width, height);

  // 6. Foreground Character Silhouette & Glowing Cybernetic Iris
  const charX = width * 0.5 + (seed % 40) - 20;
  const charY = height * 0.68;

  // Body / Coat silhouette
  ctx.fillStyle = '#030508';
  ctx.beginPath();
  ctx.ellipse(charX, charY + 120, 110, 160, 0, 0, Math.PI * 2);
  ctx.fill();

  // Head
  ctx.beginPath();
  ctx.ellipse(charX, charY, 48, 62, 0, 0, Math.PI * 2);
  ctx.fill();

  // Cybernetic Glowing Eye / Beacon
  const eyeX = charX - 12;
  const eyeY = charY - 6;
  const eyePulse = 0.7 + Math.sin(time * 8) * 0.3;

  const eyeGlow = ctx.createRadialGradient(eyeX, eyeY, 1, eyeX, eyeY, 35 * eyePulse);
  eyeGlow.addColorStop(0, '#ffffff');
  eyeGlow.addColorStop(0.3, '#ffaa00');
  eyeGlow.addColorStop(0.7, 'rgba(255, 170, 0, 0.4)');
  eyeGlow.addColorStop(1, 'rgba(255, 170, 0, 0)');

  ctx.fillStyle = eyeGlow;
  ctx.beginPath();
  ctx.arc(eyeX, eyeY, 35 * eyePulse, 0, Math.PI * 2);
  ctx.fill();

  // Synthetic Cyan Secondary Eye / Seam
  const seamX = charX + 16;
  const seamY = charY - 4;
  const seamGlow = ctx.createRadialGradient(seamX, seamY, 1, seamX, seamY, 20);
  seamGlow.addColorStop(0, '#00e5ff');
  seamGlow.addColorStop(0.6, 'rgba(0, 229, 255, 0.3)');
  seamGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = seamGlow;
  ctx.beginPath();
  ctx.arc(seamX, seamY, 20, 0, Math.PI * 2);
  ctx.fill();

  // 7. Dynamic Rain Streaks
  ctx.strokeStyle = 'rgba(180, 225, 255, 0.25)';
  ctx.lineWidth = 1.2;
  const rainCount = 45;
  for (let i = 0; i < rainCount; i++) {
    const rx = ((i * 47 + time * 650) % (width + 100)) - 50;
    const ry = (i * 33 + time * 1200) % (height + 100) - 50;
    const len = 35 + (i % 20);
    ctx.beginPath();
    ctx.moveTo(rx, ry);
    ctx.lineTo(rx - 8, ry + len);
    ctx.stroke();
  }

  // 8. Anamorphic Horizontal Blue Flare Streaks
  const flareGrad = ctx.createLinearGradient(0, height * 0.45, width, height * 0.45);
  flareGrad.addColorStop(0, 'rgba(0, 229, 255, 0)');
  flareGrad.addColorStop(0.4, 'rgba(0, 229, 255, 0.45)');
  flareGrad.addColorStop(0.5, 'rgba(255, 255, 255, 0.9)');
  flareGrad.addColorStop(0.6, 'rgba(0, 229, 255, 0.45)');
  flareGrad.addColorStop(1, 'rgba(0, 229, 255, 0)');
  ctx.fillStyle = flareGrad;
  ctx.fillRect(0, height * 0.45 - 2, width, 4);

  ctx.restore();

  // 9. Letterbox CinemaScope 2.39:1 Bars (if needed)
  if (options.aspectRatio === '2.39:1') {
    const targetHeight = width / 2.39;
    const letterboxHeight = Math.max(0, (height - targetHeight) / 2);
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, width, letterboxHeight);
    ctx.fillRect(0, height - letterboxHeight, width, letterboxHeight);
  }

  // 10. Film Grain & Production HUD Overlay
  ctx.fillStyle = 'rgba(255, 255, 255, 0.04)';
  for (let i = 0; i < 150; i++) {
    const gx = Math.random() * width;
    const gy = Math.random() * height;
    ctx.fillRect(gx, gy, 1.5, 1.5);
  }

  // Subtle Timecode / Rec badge
  ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
  ctx.font = '10px monospace';
  const tc = options.timecode || `00:00:${Math.floor(progress * 10).toString().padStart(2, '0')}:18`;
  ctx.fillText(tc, 16, 24);

  // Red REC dot
  ctx.fillStyle = '#ef4444';
  ctx.beginPath();
  ctx.arc(width - 24, 20, 4, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
  ctx.font = 'bold 9px monospace';
  ctx.fillText('REC', width - 52, 23);
}

// ==========================================
// BROWSER WEB AUDIO SYNTHESIZER
// Generates ambient drone and dialogue beeps
// ==========================================

class SoundEngine {
  private ctx: AudioContext | null = null;
  private droneOsc1: OscillatorNode | null = null;
  private droneOsc2: OscillatorNode | null = null;
  private gainNode: GainNode | null = null;
  private isMuted: boolean = false;

  private init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
  }

  public playAmbientDrone() {
    try {
      this.init();
      if (!this.ctx || this.isMuted) return;
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }

      this.stop();

      this.gainNode = this.ctx.createGain();
      this.gainNode.gain.setValueAtTime(0.04, this.ctx.currentTime);
      this.gainNode.connect(this.ctx.destination);

      // Low frequency drone
      this.droneOsc1 = this.ctx.createOscillator();
      this.droneOsc1.type = 'sawtooth';
      this.droneOsc1.frequency.setValueAtTime(55, this.ctx.currentTime); // A1 note

      // Harmonic fifth
      this.droneOsc2 = this.ctx.createOscillator();
      this.droneOsc2.type = 'sine';
      this.droneOsc2.frequency.setValueAtTime(82.4, this.ctx.currentTime); // E2 note

      this.droneOsc1.connect(this.gainNode);
      this.droneOsc2.connect(this.gainNode);

      this.droneOsc1.start();
      this.droneOsc2.start();
    } catch (e) {
      // Audio autoplay policy handled gracefully
    }
  }

  public playLaserCue() {
    try {
      this.init();
      if (!this.ctx || this.isMuted) return;
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(110, this.ctx.currentTime + 0.35);

      gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.35);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.35);
    } catch (e) {}
  }

  public playSfxGlitch() {
    try {
      this.init();
      if (!this.ctx || this.isMuted) return;
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(320, this.ctx.currentTime);
      osc.frequency.setValueAtTime(180, this.ctx.currentTime + 0.05);
      osc.frequency.setValueAtTime(440, this.ctx.currentTime + 0.1);

      gain.gain.setValueAtTime(0.06, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.2);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.2);
    } catch (e) {}
  }

  public stop() {
    try {
      if (this.droneOsc1) {
        this.droneOsc1.stop();
        this.droneOsc1.disconnect();
        this.droneOsc1 = null;
      }
      if (this.droneOsc2) {
        this.droneOsc2.stop();
        this.droneOsc2.disconnect();
        this.droneOsc2 = null;
      }
    } catch (e) {}
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.isMuted) {
      this.stop();
    }
    return this.isMuted;
  }
}

export const soundEngine = new SoundEngine();
