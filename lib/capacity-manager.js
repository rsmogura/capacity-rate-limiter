"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
class CapacityManager {
    constructor(props) {
        this.limiters = [];
        this.limiters.push(props.limiter);
        this.intervalMs = props.interval;
        this.start();
    }
    start() {
        if (this.intervalMs) {
            setInterval(() => this.resetLimiters(), this.intervalMs);
        }
    }
    resetLimiters() {
        // It's not the best... interval event can be delivered after capacity is consumed in new interval
        // If `CapacityLimiter` is used directly
        this.limiters.forEach(l => l.setConsumedCapacity(l.minimumCapacity));
    }
}
exports.CapacityManager = CapacityManager;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FwYWNpdHktbWFuYWdlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImNhcGFjaXR5LW1hbmFnZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFFQTs7Ozs7Ozs7Ozs7R0FXRztBQUNILE1BQWEsZUFBZTtJQUsxQixZQUFZLEtBTVg7UUFWZ0IsYUFBUSxHQUFzQixFQUFFLENBQUM7UUFXaEQsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ2xDLElBQUksQ0FBQyxVQUFVLEdBQUcsS0FBSyxDQUFDLFFBQVEsQ0FBQztRQUVqQyxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7SUFDZixDQUFDO0lBRU8sS0FBSztRQUNYLElBQUksSUFBSSxDQUFDLFVBQVUsRUFBRTtZQUNuQixXQUFXLENBQUMsR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDLGFBQWEsRUFBRSxFQUFFLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztTQUMxRDtJQUNILENBQUM7SUFFTyxhQUFhO1FBQ25CLGtHQUFrRztRQUNsRyx3Q0FBd0M7UUFDeEMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUM7SUFDdkUsQ0FBQztDQUNGO0FBN0JELDBDQTZCQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENhcGFjaXR5TGltaXRlciB9IGZyb20gXCIuL2NhcGFjaXR5LWxpbWl0ZXJcIjtcblxuLyoqXG4gKiBDYXBhY2l0eSBtYW5hZ2VyIGlzIHVzZWQgdG8gZHluYW1pY2FsbHkgbWFuYWdlIGNhcGFjaXR5IG9iamVjdC5cbiAqIFxuICogVGhlIG1vc3QgY29tbW9uIGZ1bmN0aW9uIGlzIHRvIHJlc2V0IGNhcGFjaXR5IG9uIHNwZWNpZmllZCBpbnRlcnZhbCwgc28gXG4gKiBgQ2FwYWNpdHlMaW1pdGVyYCBpbiBmYWN0IGNhbiBiZSB1c2VkIGFzICoqY2FwYWNpdHkgcGVyIHNlY29uZCBsaW1pdGVyKiouXG4gKiBcbiAqIE1vcmUgYWR2YW5jZWQgdXNlIGNhc2VzIGNhbiBpbmNsdWRlIGFkanVzdCBjYXBhY2l0eSB0byBkeW5hbWljIGVudmlyb25tZW50XG4gKiBsaWtlOlxuICogKiB3YXJtIHVwIC0gZ3JhZHVhbGx5IGluY3JlYXNlIGFsbG93ZWQgY2FwYWNpdHkgdG8gcHJldmVudCBzcGlrZXMgb24gc3RhcnR1cCAoVEJEKVxuICogKiBwcm9iZSBmb3IgbmV3IGxpbWl0cyAtIGxpa2UgYWJvdmUgKFRCRClcbiAqICogZGVjcmVhc2UgY2FwYWNpdHkgb24gZXJyb3JzIChUQkQpXG4gKi9cbmV4cG9ydCBjbGFzcyBDYXBhY2l0eU1hbmFnZXIge1xuICBwcml2YXRlIHJlYWRvbmx5IGxpbWl0ZXJzOiBDYXBhY2l0eUxpbWl0ZXJbXSA9IFtdO1xuXG4gIHByaXZhdGUgcmVhZG9ubHkgaW50ZXJ2YWxNcz86IG51bWJlcjtcblxuICBjb25zdHJ1Y3Rvcihwcm9wczoge1xuICAgIC8qKiBUaGUgdGltZSBpbiBtaWxsaXNlY29uZHMgYWZ0ZXIgd2hpY2ggY29uc3VtZWQgY2FwYWNpdHkgaXMgcmVzZXQgKi9cbiAgICBpbnRlcnZhbD86IG51bWJlcjtcblxuICAgIC8qKiBDYXBhY2l0eSBsaW1pdGVyIG1hbmFnZWQgYnkgdGhpcyBjbGFzcy4gKi9cbiAgICBsaW1pdGVyOiBDYXBhY2l0eUxpbWl0ZXI7XG4gIH0pIHtcbiAgICB0aGlzLmxpbWl0ZXJzLnB1c2gocHJvcHMubGltaXRlcik7XG4gICAgdGhpcy5pbnRlcnZhbE1zID0gcHJvcHMuaW50ZXJ2YWw7XG5cbiAgICB0aGlzLnN0YXJ0KCk7XG4gIH1cblxuICBwcml2YXRlIHN0YXJ0KCkge1xuICAgIGlmICh0aGlzLmludGVydmFsTXMpIHtcbiAgICAgIHNldEludGVydmFsKCgpID0+IHRoaXMucmVzZXRMaW1pdGVycygpLCB0aGlzLmludGVydmFsTXMpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgcmVzZXRMaW1pdGVycygpIHtcbiAgICAvLyBJdCdzIG5vdCB0aGUgYmVzdC4uLiBpbnRlcnZhbCBldmVudCBjYW4gYmUgZGVsaXZlcmVkIGFmdGVyIGNhcGFjaXR5IGlzIGNvbnN1bWVkIGluIG5ldyBpbnRlcnZhbFxuICAgIC8vIElmIGBDYXBhY2l0eUxpbWl0ZXJgIGlzIHVzZWQgZGlyZWN0bHlcbiAgICB0aGlzLmxpbWl0ZXJzLmZvckVhY2gobCA9PiBsLnNldENvbnN1bWVkQ2FwYWNpdHkobC5taW5pbXVtQ2FwYWNpdHkpKTtcbiAgfVxufSJdfQ==