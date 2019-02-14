import 'mocha';

import { assert } from 'chai';
import * as util from 'util';

import { CapacityLimiter } from '../lib/capacity-limiter';
import { CapacityManager } from '../lib/capacity-manager';

const setTimeoutPromise = util.promisify(setTimeout);

describe('Capacity Manager', () => {
  it('Capacity manager resets capacity', (done) => {
    const limiter = new CapacityLimiter({
      maximumCapacity: 200
    });

    // tslint:disable-next-line:no-unused-expression
    new CapacityManager({
      interval: 20,
      limiter
    });

    const start = Date.now();

    limiter.consumeCapacity(200);

    let shouldFail = true;

    limiter.consumeCapacity(150)
      .then(() => {
        assert.isFalse(shouldFail)
        const timeDiff = Date.now() - start;
        assert.isTrue(timeDiff < 25);
        assert.isTrue(timeDiff >= 20);
        assert.equal(limiter.getConsumedCapacity(), 150);
        done();
      })
      .catch(err => done(err));
    
    // Update fail just before it can end
    setTimeoutPromise(17).then(() => shouldFail = false);
  })
});