/**
 * Web Pedometer — uses DeviceMotion accelerometer to count steps while the
 * page is open. Works on iOS Safari (after permission) and Android Chrome.
 *
 * This is a peak-detection algorithm on magnitude of acceleration including
 * gravity. Not as accurate as a native M7/M10 coprocessor, but OK for MVP.
 *
 * Caveats:
 *  - Only counts while the page is in foreground (web can't run in background).
 *  - Over-counts if the phone is tapped or shaken heavily.
 *  - User must click a button first on iOS to grant permission.
 */

type DeviceMotionEventIOS = typeof DeviceMotionEvent & {
  requestPermission?: () => Promise<'granted' | 'denied'>;
};

export interface PedometerState {
  running: boolean;
  steps: number;
  error?: string;
}

type Listener = (s: PedometerState) => void;

// Peak detection tuning
const PEAK_THRESHOLD = 11.5;   // m/s² — a typical step peak is ~12-15
const MIN_STEP_INTERVAL = 280; // ms — max ~3.5 steps/sec (running)

export class Pedometer {
  private listeners = new Set<Listener>();
  private state: PedometerState = { running: false, steps: 0 };
  private lastPeakAt = 0;
  private lastMag = 0;
  private trending: 'up' | 'down' = 'down';

  /** Request DeviceMotion permission (iOS 13+ needs explicit user gesture). */
  async requestPermission(): Promise<boolean> {
    const DM = window.DeviceMotionEvent as unknown as DeviceMotionEventIOS;
    if (!DM) {
      this.setState({ error: 'Device motion not supported' });
      return false;
    }
    if (typeof DM.requestPermission === 'function') {
      try {
        const result = await DM.requestPermission();
        return result === 'granted';
      } catch (e) {
        this.setState({ error: String(e) });
        return false;
      }
    }
    // Android / desktop — permission implicit
    return true;
  }

  start(initialSteps = 0): void {
    if (this.state.running) return;
    this.setState({ running: true, steps: initialSteps });
    window.addEventListener('devicemotion', this.onMotion);
  }

  stop(): void {
    if (!this.state.running) return;
    window.removeEventListener('devicemotion', this.onMotion);
    this.setState({ running: false });
  }

  reset(): void {
    this.setState({ steps: 0 });
  }

  getState(): PedometerState {
    return this.state;
  }

  subscribe(fn: Listener): () => void {
    this.listeners.add(fn);
    fn(this.state);
    return () => this.listeners.delete(fn);
  }

  private setState(patch: Partial<PedometerState>): void {
    this.state = { ...this.state, ...patch };
    for (const l of this.listeners) l(this.state);
  }

  private onMotion = (ev: DeviceMotionEvent): void => {
    const a = ev.accelerationIncludingGravity;
    if (!a) return;
    const mag = Math.sqrt((a.x ?? 0) ** 2 + (a.y ?? 0) ** 2 + (a.z ?? 0) ** 2);

    // Detect a peak: we were trending up, now trending down, above threshold.
    const now = performance.now();
    if (mag > this.lastMag) {
      this.trending = 'up';
    } else if (this.trending === 'up' && mag < this.lastMag) {
      // Just turned down — that was a peak
      if (
        this.lastMag > PEAK_THRESHOLD &&
        now - this.lastPeakAt > MIN_STEP_INTERVAL
      ) {
        this.lastPeakAt = now;
        this.setState({ steps: this.state.steps + 1 });
      }
      this.trending = 'down';
    }
    this.lastMag = mag;
  };
}

export const pedometer = new Pedometer();
