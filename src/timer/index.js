import { ref, watch } from "vue";
import EventEmitter from "events";

export default class Timer extends EventEmitter {
  constructor(settings) {
    super();

    this._settings = settings;

    this._counter = ref(this._settings.timerDuration);
    this._running = ref(false);
    this._currentPlayerIndex = ref(0);

    this._interval = null;

    // reset counter when timer duration changes
    watch(() => this._settings.timerDuration, () => this.stop());

    // reset player index when current player is removed
    watch(() => this._settings.playerNames.length, () => {
      if (this._currentPlayerIndex.value >= this._settings.playerNames.length) {
        this._currentPlayerIndex.value = 0;
      }
    });
  }

  get counter() {
    return this._counter.value;
  }

  set counter(value) {
    this._counter.value = value;
  }

  get running() {
    return this._running.value;
  }

  get currentPlayerIndex() {
    return this._currentPlayerIndex.value;
  }

  _tick() {
    if (this._counter.value > 0) {
      // decrement counter
      this._counter.value--;

      // emit tick events
      this.emit("tick", this._counter.value);
      if (this._counter.value === 0) {
        this.emit("timeout");
      }
    } else {
      // start next player's turn
      this.next();
    }
  }

  start(immediate = true) {
    if (this._running.value) {
      return;
    }

    this._running.value = true;

    this._interval = setInterval(() => this._tick(), 1000);

    if (immediate) {
      this._tick();
    }
  }

  pause() {
    if (!this._running.value) {
      return;
    }

    this._running.value = false;

    clearInterval(this._interval);
  }

  stop() {
    this.pause();
    this._counter.value = this._settings.timerDuration;
  }

  next() {
    // stop current timer
    const wasRunning = this._running.value;
    this.stop();

    // increment player index
    this._currentPlayerIndex.value = (this._currentPlayerIndex.value + 1) % this._settings.playerNames.length;

    // start timer for the next player
    if (this._settings.continueAfterTimerEnds && wasRunning) {
      this.start(false);
    }
  }

  prev() {
    console.warn("prev() is not implemented yet");
  }
}
