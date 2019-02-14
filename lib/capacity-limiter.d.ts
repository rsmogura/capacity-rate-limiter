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
export declare class CapacityLimiter {
    static ON_CONSUMED_CAPACITY_CHANGE: string;
    /** Maximum allowed capacity */
    maximumCapacity: number;
    /**
     * Minimum allowed capacity, if consumers returns more capacity (ie. by using negative values
     * the returned capacity will be limited by this value.
     */
    minimumCapacity: number;
    private readonly emitter;
    private _consumedCapacity;
    constructor(props: CapacityLimiterConfig);
    /**
     * Consume specific amount of capacity.
     *
     * @returns promise which will get resolved when there's enough space (`consumedCapacity + amount maximumCapacity`)
     */
    consumeCapacity(amount: number): Promise<void>;
    getConsumedCapacity(): number;
    setConsumedCapacity(val: number): void;
    setMaximumCapacity(amount: number): void;
}
