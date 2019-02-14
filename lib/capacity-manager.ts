import { CapacityLimiter } from "./capacity-limiter";

/**
 * Capacity manager is used to dynamically manage capacity object.
 * 
 * The most common function is to reset capacity on specified interval, so 
 * `CapacityLimiter` in fact can be used as **capacity per second limiter**.
 * 
 * More advanced use cases can include adjust capacity to dynamic environment
 * like:
 * * warm up - gradually increase allowed capacity to prevent spikes on startup (TBD)
 * * probe for new limits - like above (TBD)
 * * decrease capacity on errors (TBD)
 */
export class CapacityManager {
  private readonly limiters: CapacityLimiter[] = [];

  private readonly intervalMs?: number;

  constructor(props: {
    /** The time in milliseconds after which consumed capacity is reset */
    interval?: number;

    /** Capacity limiter managed by this class. */
    limiter: CapacityLimiter;
  }) {
    this.limiters.push(props.limiter);
    this.intervalMs = props.interval;

    this.start();
  }

  private start() {
    if (this.intervalMs) {
      setInterval(() => this.resetLimiters(), this.intervalMs);
    }
  }

  private resetLimiters() {
    // It's not the best... interval event can be delivered after capacity is consumed in new interval
    // If `CapacityLimiter` is used directly
    this.limiters.forEach(l => l.setConsumedCapacity(l.minimumCapacity));
  }
}