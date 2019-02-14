"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("mocha");
const chai_1 = require("chai");
const util = require("util");
const capacity_limiter_1 = require("../lib/capacity-limiter");
const capacity_manager_1 = require("../lib/capacity-manager");
const setTimeoutPromise = util.promisify(setTimeout);
describe('Capacity Manager', () => {
    it('Capacity manager resets capacity', (done) => {
        const limiter = new capacity_limiter_1.CapacityLimiter({
            maximumCapacity: 200
        });
        // tslint:disable-next-line:no-unused-expression
        new capacity_manager_1.CapacityManager({
            interval: 20,
            limiter
        });
        const start = Date.now();
        limiter.consumeCapacity(200);
        let shouldFail = true;
        limiter.consumeCapacity(150)
            .then(() => {
            chai_1.assert.isFalse(shouldFail);
            const timeDiff = Date.now() - start;
            chai_1.assert.isTrue(timeDiff < 25);
            chai_1.assert.isTrue(timeDiff >= 20);
            chai_1.assert.equal(limiter.getConsumedCapacity(), 150);
            done();
        })
            .catch(err => done(err));
        // Update fail just before it can end
        setTimeoutPromise(17).then(() => shouldFail = false);
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FwYWNpdHktbWFuYWdlci10ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiY2FwYWNpdHktbWFuYWdlci10ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsaUJBQWU7QUFFZiwrQkFBOEI7QUFDOUIsNkJBQTZCO0FBRTdCLDhEQUEwRDtBQUMxRCw4REFBMEQ7QUFFMUQsTUFBTSxpQkFBaUIsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBRXJELFFBQVEsQ0FBQyxrQkFBa0IsRUFBRSxHQUFHLEVBQUU7SUFDaEMsRUFBRSxDQUFDLGtDQUFrQyxFQUFFLENBQUMsSUFBSSxFQUFFLEVBQUU7UUFDOUMsTUFBTSxPQUFPLEdBQUcsSUFBSSxrQ0FBZSxDQUFDO1lBQ2xDLGVBQWUsRUFBRSxHQUFHO1NBQ3JCLENBQUMsQ0FBQztRQUVILGdEQUFnRDtRQUNoRCxJQUFJLGtDQUFlLENBQUM7WUFDbEIsUUFBUSxFQUFFLEVBQUU7WUFDWixPQUFPO1NBQ1IsQ0FBQyxDQUFDO1FBRUgsTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDO1FBRXpCLE9BQU8sQ0FBQyxlQUFlLENBQUMsR0FBRyxDQUFDLENBQUM7UUFFN0IsSUFBSSxVQUFVLEdBQUcsSUFBSSxDQUFDO1FBRXRCLE9BQU8sQ0FBQyxlQUFlLENBQUMsR0FBRyxDQUFDO2FBQ3pCLElBQUksQ0FBQyxHQUFHLEVBQUU7WUFDVCxhQUFNLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFBO1lBQzFCLE1BQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxHQUFHLEVBQUUsR0FBRyxLQUFLLENBQUM7WUFDcEMsYUFBTSxDQUFDLE1BQU0sQ0FBQyxRQUFRLEdBQUcsRUFBRSxDQUFDLENBQUM7WUFDN0IsYUFBTSxDQUFDLE1BQU0sQ0FBQyxRQUFRLElBQUksRUFBRSxDQUFDLENBQUM7WUFDOUIsYUFBTSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsbUJBQW1CLEVBQUUsRUFBRSxHQUFHLENBQUMsQ0FBQztZQUNqRCxJQUFJLEVBQUUsQ0FBQztRQUNULENBQUMsQ0FBQzthQUNELEtBQUssQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBRTNCLHFDQUFxQztRQUNyQyxpQkFBaUIsQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUMsVUFBVSxHQUFHLEtBQUssQ0FBQyxDQUFDO0lBQ3ZELENBQUMsQ0FBQyxDQUFBO0FBQ0osQ0FBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgJ21vY2hhJztcblxuaW1wb3J0IHsgYXNzZXJ0IH0gZnJvbSAnY2hhaSc7XG5pbXBvcnQgKiBhcyB1dGlsIGZyb20gJ3V0aWwnO1xuXG5pbXBvcnQgeyBDYXBhY2l0eUxpbWl0ZXIgfSBmcm9tICcuLi9saWIvY2FwYWNpdHktbGltaXRlcic7XG5pbXBvcnQgeyBDYXBhY2l0eU1hbmFnZXIgfSBmcm9tICcuLi9saWIvY2FwYWNpdHktbWFuYWdlcic7XG5cbmNvbnN0IHNldFRpbWVvdXRQcm9taXNlID0gdXRpbC5wcm9taXNpZnkoc2V0VGltZW91dCk7XG5cbmRlc2NyaWJlKCdDYXBhY2l0eSBNYW5hZ2VyJywgKCkgPT4ge1xuICBpdCgnQ2FwYWNpdHkgbWFuYWdlciByZXNldHMgY2FwYWNpdHknLCAoZG9uZSkgPT4ge1xuICAgIGNvbnN0IGxpbWl0ZXIgPSBuZXcgQ2FwYWNpdHlMaW1pdGVyKHtcbiAgICAgIG1heGltdW1DYXBhY2l0eTogMjAwXG4gICAgfSk7XG5cbiAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6bm8tdW51c2VkLWV4cHJlc3Npb25cbiAgICBuZXcgQ2FwYWNpdHlNYW5hZ2VyKHtcbiAgICAgIGludGVydmFsOiAyMCxcbiAgICAgIGxpbWl0ZXJcbiAgICB9KTtcblxuICAgIGNvbnN0IHN0YXJ0ID0gRGF0ZS5ub3coKTtcblxuICAgIGxpbWl0ZXIuY29uc3VtZUNhcGFjaXR5KDIwMCk7XG5cbiAgICBsZXQgc2hvdWxkRmFpbCA9IHRydWU7XG5cbiAgICBsaW1pdGVyLmNvbnN1bWVDYXBhY2l0eSgxNTApXG4gICAgICAudGhlbigoKSA9PiB7XG4gICAgICAgIGFzc2VydC5pc0ZhbHNlKHNob3VsZEZhaWwpXG4gICAgICAgIGNvbnN0IHRpbWVEaWZmID0gRGF0ZS5ub3coKSAtIHN0YXJ0O1xuICAgICAgICBhc3NlcnQuaXNUcnVlKHRpbWVEaWZmIDwgMjUpO1xuICAgICAgICBhc3NlcnQuaXNUcnVlKHRpbWVEaWZmID49IDIwKTtcbiAgICAgICAgYXNzZXJ0LmVxdWFsKGxpbWl0ZXIuZ2V0Q29uc3VtZWRDYXBhY2l0eSgpLCAxNTApO1xuICAgICAgICBkb25lKCk7XG4gICAgICB9KVxuICAgICAgLmNhdGNoKGVyciA9PiBkb25lKGVycikpO1xuICAgIFxuICAgIC8vIFVwZGF0ZSBmYWlsIGp1c3QgYmVmb3JlIGl0IGNhbiBlbmRcbiAgICBzZXRUaW1lb3V0UHJvbWlzZSgxNykudGhlbigoKSA9PiBzaG91bGRGYWlsID0gZmFsc2UpO1xuICB9KVxufSk7Il19