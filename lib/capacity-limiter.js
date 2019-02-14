"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const events = require("events");
/**
 * Capacity limiter is used to track *abstract* capacity.
 *
 * Limiter has `maximumCapacity`. Consumers can add (or remove using negative values)
 * *consumed* capacity using one of `consumeCapacity`. If requested capacity exceeds
 * maximum provisioned capacity request will be queued.
 */
class CapacityLimiter {
    constructor(props) {
        /**
         * Minimum allowed capacity, if consumers returns more capacity (ie. by using negative values
         * the returned capacity will be limited by this value.
         */
        this.minimumCapacity = 0;
        this.emitter = new events.EventEmitter();
        this.maximumCapacity = props.maximumCapacity;
        this.minimumCapacity = props.minimumCapacity || 0;
        this.setConsumedCapacity(props.initialCapacity || this.minimumCapacity);
    }
    /**
     * Consume specific amount of capacity.
     *
     * @returns promise which will get resolved when there's enough space (`consumedCapacity + amount maximumCapacity`)
     */
    consumeCapacity(amount) {
        if (this._consumedCapacity + amount <= this.maximumCapacity) {
            this.setConsumedCapacity(this._consumedCapacity + amount);
            return Promise.resolve();
        }
        return new Promise(resolve => {
            const handler = () => {
                if (this._consumedCapacity + amount <= this.maximumCapacity) {
                    this.setConsumedCapacity(this._consumedCapacity + amount);
                    // Prevent memory leak
                    this.emitter.removeListener(CapacityLimiter.ON_CONSUMED_CAPACITY_CHANGE, handler);
                    resolve();
                }
            };
            this.emitter.on(CapacityLimiter.ON_CONSUMED_CAPACITY_CHANGE, handler);
        });
    }
    getConsumedCapacity() {
        return this._consumedCapacity;
    }
    setConsumedCapacity(val) {
        this._consumedCapacity = Math.max(val, this.minimumCapacity);
        this.emitter.emit(CapacityLimiter.ON_CONSUMED_CAPACITY_CHANGE, this);
    }
    setMaximumCapacity(amount) {
        this.maximumCapacity = amount;
        // Trigger update, to notify listeners
        this.setConsumedCapacity(this._consumedCapacity);
    }
}
CapacityLimiter.ON_CONSUMED_CAPACITY_CHANGE = 'consumedCapacityChanged';
exports.CapacityLimiter = CapacityLimiter;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FwYWNpdHktbGltaXRlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImNhcGFjaXR5LWxpbWl0ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxpQ0FBaUM7QUFnQmpDOzs7Ozs7R0FNRztBQUNILE1BQWEsZUFBZTtJQWdCMUIsWUFBWSxLQUE0QjtRQVZ4Qzs7O1dBR0c7UUFDSSxvQkFBZSxHQUFXLENBQUMsQ0FBQztRQUVsQixZQUFPLEdBQUcsSUFBSSxNQUFNLENBQUMsWUFBWSxFQUFFLENBQUM7UUFLbkQsSUFBSSxDQUFDLGVBQWUsR0FBRyxLQUFLLENBQUMsZUFBZSxDQUFDO1FBQzdDLElBQUksQ0FBQyxlQUFlLEdBQUcsS0FBSyxDQUFDLGVBQWUsSUFBSSxDQUFDLENBQUM7UUFDbEQsSUFBSSxDQUFDLG1CQUFtQixDQUFDLEtBQUssQ0FBQyxlQUFlLElBQUksSUFBSSxDQUFDLGVBQWUsQ0FBQyxDQUFDO0lBQzFFLENBQUM7SUFFRDs7OztPQUlHO0lBQ0ksZUFBZSxDQUFDLE1BQWM7UUFDbkMsSUFBSSxJQUFJLENBQUMsaUJBQWlCLEdBQUcsTUFBTSxJQUFJLElBQUksQ0FBQyxlQUFlLEVBQUU7WUFDM0QsSUFBSSxDQUFDLG1CQUFtQixDQUFDLElBQUksQ0FBQyxpQkFBaUIsR0FBRyxNQUFNLENBQUMsQ0FBQztZQUUxRCxPQUFPLE9BQU8sQ0FBQyxPQUFPLEVBQUUsQ0FBQztTQUMxQjtRQUVELE9BQU8sSUFBSSxPQUFPLENBQUMsT0FBTyxDQUFDLEVBQUU7WUFDM0IsTUFBTSxPQUFPLEdBQUcsR0FBRyxFQUFFO2dCQUNuQixJQUFJLElBQUksQ0FBQyxpQkFBaUIsR0FBRyxNQUFNLElBQUksSUFBSSxDQUFDLGVBQWUsRUFBRTtvQkFDM0QsSUFBSSxDQUFDLG1CQUFtQixDQUFDLElBQUksQ0FBQyxpQkFBaUIsR0FBRyxNQUFNLENBQUMsQ0FBQztvQkFFMUQsc0JBQXNCO29CQUN0QixJQUFJLENBQUMsT0FBTyxDQUFDLGNBQWMsQ0FBQyxlQUFlLENBQUMsMkJBQTJCLEVBQUUsT0FBTyxDQUFDLENBQUM7b0JBQ2xGLE9BQU8sRUFBRSxDQUFDO2lCQUNYO1lBQ0gsQ0FBQyxDQUFDO1lBRUYsSUFBSSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsZUFBZSxDQUFDLDJCQUEyQixFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBQ3hFLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUVNLG1CQUFtQjtRQUN4QixPQUFPLElBQUksQ0FBQyxpQkFBaUIsQ0FBQztJQUNoQyxDQUFDO0lBRU0sbUJBQW1CLENBQUMsR0FBVztRQUNwQyxJQUFJLENBQUMsaUJBQWlCLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLGVBQWUsQ0FBQyxDQUFDO1FBQzdELElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQywyQkFBMkIsRUFBRSxJQUFJLENBQUMsQ0FBQztJQUN2RSxDQUFDO0lBRU0sa0JBQWtCLENBQUMsTUFBYztRQUN0QyxJQUFJLENBQUMsZUFBZSxHQUFHLE1BQU0sQ0FBQztRQUU5QixzQ0FBc0M7UUFDdEMsSUFBSSxDQUFDLG1CQUFtQixDQUFDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO0lBQ25ELENBQUM7O0FBOURhLDJDQUEyQixHQUFHLHlCQUF5QixDQUFDO0FBRHhFLDBDQWdFQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGV2ZW50cyBmcm9tICdldmVudHMnO1xuXG5leHBvcnQgaW50ZXJmYWNlIENhcGFjaXR5TGltaXRlckNvbmZpZyB7XG4gIC8qKiBNYXhpbXVtIGFsbG93ZWQgY2FwYWNpdHkgKi9cbiAgbWF4aW11bUNhcGFjaXR5OiBudW1iZXI7XG5cbiAgLyoqIFxuICAgKiBNaW5pbXVtIGFsbG93ZWQgY2FwYWNpdHksIGlmIGNvbnN1bWVycyByZXR1cm5zIG1vcmUgY2FwYWNpdHkgKGllLiBieSB1c2luZyBuZWdhdGl2ZSB2YWx1ZXNcbiAgICogdGhlIHJldHVybmVkIGNhcGFjaXR5IHdpbGwgYmUgbGltaXRlZCBieSB0aGlzIHZhbHVlLlxuICAgKi9cbiAgbWluaW11bUNhcGFjaXR5PzogbnVtYmVyO1xuXG5cbiAgLyoqIEluaXRpYWwgY29uc3VtZWQgY2FwYWNpdHkuIElmIG5vdCBzcGVjaWZpZWQgZXF1YWxzIHRvIGBtaW5pbXVtQ2FwYWNpdHlgICovXG4gIGluaXRpYWxDYXBhY2l0eT86IG51bWJlcjtcbn1cbi8qKlxuICogQ2FwYWNpdHkgbGltaXRlciBpcyB1c2VkIHRvIHRyYWNrICphYnN0cmFjdCogY2FwYWNpdHkuXG4gKiBcbiAqIExpbWl0ZXIgaGFzIGBtYXhpbXVtQ2FwYWNpdHlgLiBDb25zdW1lcnMgY2FuIGFkZCAob3IgcmVtb3ZlIHVzaW5nIG5lZ2F0aXZlIHZhbHVlcylcbiAqICpjb25zdW1lZCogY2FwYWNpdHkgdXNpbmcgb25lIG9mIGBjb25zdW1lQ2FwYWNpdHlgLiBJZiByZXF1ZXN0ZWQgY2FwYWNpdHkgZXhjZWVkcyBcbiAqIG1heGltdW0gcHJvdmlzaW9uZWQgY2FwYWNpdHkgcmVxdWVzdCB3aWxsIGJlIHF1ZXVlZC5cbiAqL1xuZXhwb3J0IGNsYXNzIENhcGFjaXR5TGltaXRlciB7XG4gIHB1YmxpYyBzdGF0aWMgT05fQ09OU1VNRURfQ0FQQUNJVFlfQ0hBTkdFID0gJ2NvbnN1bWVkQ2FwYWNpdHlDaGFuZ2VkJztcblxuICAvKiogTWF4aW11bSBhbGxvd2VkIGNhcGFjaXR5ICovXG4gIHB1YmxpYyBtYXhpbXVtQ2FwYWNpdHk6IG51bWJlcjtcblxuICAvKiogXG4gICAqIE1pbmltdW0gYWxsb3dlZCBjYXBhY2l0eSwgaWYgY29uc3VtZXJzIHJldHVybnMgbW9yZSBjYXBhY2l0eSAoaWUuIGJ5IHVzaW5nIG5lZ2F0aXZlIHZhbHVlc1xuICAgKiB0aGUgcmV0dXJuZWQgY2FwYWNpdHkgd2lsbCBiZSBsaW1pdGVkIGJ5IHRoaXMgdmFsdWUuXG4gICAqL1xuICBwdWJsaWMgbWluaW11bUNhcGFjaXR5OiBudW1iZXIgPSAwO1xuXG4gIHByaXZhdGUgcmVhZG9ubHkgZW1pdHRlciA9IG5ldyBldmVudHMuRXZlbnRFbWl0dGVyKCk7XG5cbiAgcHJpdmF0ZSBfY29uc3VtZWRDYXBhY2l0eTogbnVtYmVyO1xuXG4gIGNvbnN0cnVjdG9yKHByb3BzOiBDYXBhY2l0eUxpbWl0ZXJDb25maWcpIHtcbiAgICB0aGlzLm1heGltdW1DYXBhY2l0eSA9IHByb3BzLm1heGltdW1DYXBhY2l0eTtcbiAgICB0aGlzLm1pbmltdW1DYXBhY2l0eSA9IHByb3BzLm1pbmltdW1DYXBhY2l0eSB8fCAwO1xuICAgIHRoaXMuc2V0Q29uc3VtZWRDYXBhY2l0eShwcm9wcy5pbml0aWFsQ2FwYWNpdHkgfHwgdGhpcy5taW5pbXVtQ2FwYWNpdHkpO1xuICB9XG5cbiAgLyoqIFxuICAgKiBDb25zdW1lIHNwZWNpZmljIGFtb3VudCBvZiBjYXBhY2l0eS5cbiAgICogXG4gICAqIEByZXR1cm5zIHByb21pc2Ugd2hpY2ggd2lsbCBnZXQgcmVzb2x2ZWQgd2hlbiB0aGVyZSdzIGVub3VnaCBzcGFjZSAoYGNvbnN1bWVkQ2FwYWNpdHkgKyBhbW91bnQgbWF4aW11bUNhcGFjaXR5YClcbiAgICovXG4gIHB1YmxpYyBjb25zdW1lQ2FwYWNpdHkoYW1vdW50OiBudW1iZXIpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBpZiAodGhpcy5fY29uc3VtZWRDYXBhY2l0eSArIGFtb3VudCA8PSB0aGlzLm1heGltdW1DYXBhY2l0eSkge1xuICAgICAgdGhpcy5zZXRDb25zdW1lZENhcGFjaXR5KHRoaXMuX2NvbnN1bWVkQ2FwYWNpdHkgKyBhbW91bnQpO1xuXG4gICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKHJlc29sdmUgPT4ge1xuICAgICAgY29uc3QgaGFuZGxlciA9ICgpID0+IHtcbiAgICAgICAgaWYgKHRoaXMuX2NvbnN1bWVkQ2FwYWNpdHkgKyBhbW91bnQgPD0gdGhpcy5tYXhpbXVtQ2FwYWNpdHkpIHtcbiAgICAgICAgICB0aGlzLnNldENvbnN1bWVkQ2FwYWNpdHkodGhpcy5fY29uc3VtZWRDYXBhY2l0eSArIGFtb3VudCk7XG5cbiAgICAgICAgICAvLyBQcmV2ZW50IG1lbW9yeSBsZWFrXG4gICAgICAgICAgdGhpcy5lbWl0dGVyLnJlbW92ZUxpc3RlbmVyKENhcGFjaXR5TGltaXRlci5PTl9DT05TVU1FRF9DQVBBQ0lUWV9DSEFOR0UsIGhhbmRsZXIpO1xuICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgfVxuICAgICAgfTtcblxuICAgICAgdGhpcy5lbWl0dGVyLm9uKENhcGFjaXR5TGltaXRlci5PTl9DT05TVU1FRF9DQVBBQ0lUWV9DSEFOR0UsIGhhbmRsZXIpO1xuICAgIH0pO1xuICB9XG5cbiAgcHVibGljIGdldENvbnN1bWVkQ2FwYWNpdHkoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2NvbnN1bWVkQ2FwYWNpdHk7XG4gIH1cblxuICBwdWJsaWMgc2V0Q29uc3VtZWRDYXBhY2l0eSh2YWw6IG51bWJlcikge1xuICAgIHRoaXMuX2NvbnN1bWVkQ2FwYWNpdHkgPSBNYXRoLm1heCh2YWwsIHRoaXMubWluaW11bUNhcGFjaXR5KTtcbiAgICB0aGlzLmVtaXR0ZXIuZW1pdChDYXBhY2l0eUxpbWl0ZXIuT05fQ09OU1VNRURfQ0FQQUNJVFlfQ0hBTkdFLCB0aGlzKTtcbiAgfVxuXG4gIHB1YmxpYyBzZXRNYXhpbXVtQ2FwYWNpdHkoYW1vdW50OiBudW1iZXIpIHtcbiAgICB0aGlzLm1heGltdW1DYXBhY2l0eSA9IGFtb3VudDtcblxuICAgIC8vIFRyaWdnZXIgdXBkYXRlLCB0byBub3RpZnkgbGlzdGVuZXJzXG4gICAgdGhpcy5zZXRDb25zdW1lZENhcGFjaXR5KHRoaXMuX2NvbnN1bWVkQ2FwYWNpdHkpO1xuICB9XG59XG5cbiJdfQ==