import * as events from 'events';

export interface CapacityLimiterConfig {
  /** Maximum allowed capacity */
  maximumCapacity: number;

  /** 
   * Minimum allowed capacity, if consumers returns more capacity (ie. by using negative values
   * the returned capacity will be limited by this value.
   */
  minimumCapacity?: number;


  /** Initial consumed capacity. If not specified equals to `minimumCapacity` */
  initialCapacity?: number;
}
/**
 * Capacity limiter is used to track *abstract* capacity.
 * 
 * Limiter has `maximumCapacity`. Consumers can add (or remove using negative values)
 * *consumed* capacity using one of `consumeCapacity`. If requested capacity exceeds 
 * maximum provisioned capacity request will be queued.
 */
export class CapacityLimiter {
  public static ON_CONSUMED_CAPACITY_CHANGE = 'consumedCapacityChanged';

  /** Maximum allowed capacity */
  public maximumCapacity: number;

  /** 
   * Minimum allowed capacity, if consumers returns more capacity (ie. by using negative values
   * the returned capacity will be limited by this value.
   */
  public minimumCapacity: number = 0;

  private readonly emitter = new events.EventEmitter();

  private _consumedCapacity: number;

  constructor(props: CapacityLimiterConfig) {
    this.maximumCapacity = props.maximumCapacity;
    this.minimumCapacity = props.minimumCapacity || 0;
    this.setConsumedCapacity(props.initialCapacity || this.minimumCapacity);

    this.emitter.setMaxListeners(Infinity);
  }

  /** 
   * Consume specific amount of capacity.
   * 
   * @returns promise which will get resolved when there's enough space (`consumedCapacity + amount maximumCapacity`)
   */
  public consumeCapacity(amount: number): Promise<void> {
    if (this._consumedCapacity + amount <= this.maximumCapacity) {
      this.setConsumedCapacity(this._consumedCapacity + amount);

      return Promise.resolve();
    }

    return new Promise(resolve => {
      const handler = () => {
        if (this._consumedCapacity + amount <= this.maximumCapacity) {
          // Prevent memory leak
          this.emitter.removeListener(CapacityLimiter.ON_CONSUMED_CAPACITY_CHANGE, handler);

          this.setConsumedCapacity(this._consumedCapacity + amount);

          resolve();
        }
      };

      this.emitter.on(CapacityLimiter.ON_CONSUMED_CAPACITY_CHANGE, handler);
    });
  }

  public getConsumedCapacity() {
    return this._consumedCapacity;
  }

  public setConsumedCapacity(val: number) {
    this._consumedCapacity = Math.max(val, this.minimumCapacity);
    setImmediate(() => this.emitter.emit(CapacityLimiter.ON_CONSUMED_CAPACITY_CHANGE, this));
  }

  public setMaximumCapacity(amount: number) {
    this.maximumCapacity = amount;

    // Trigger update, to notify listeners
    this.setConsumedCapacity(this._consumedCapacity);
  }
}

