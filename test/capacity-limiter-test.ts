import 'mocha';

import { assert } from 'chai';
import * as util from 'util';

import { CapacityLimiter } from '../lib/capacity-limiter';

const setTimeoutPromise = util.promisify(setTimeout);

describe('Capacity Limiter', () => {
  it('Capacity operations', () => {
    const limiter = new CapacityLimiter({
      maximumCapacity: 200,
      minimumCapacity: -10
    });

    limiter.consumeCapacity(-10);
    assert.equal(limiter.getConsumedCapacity(), -10);

    limiter.consumeCapacity(10);
    assert.equal(limiter.getConsumedCapacity(), 0);

    limiter.consumeCapacity(-100);
    assert.equal(limiter.getConsumedCapacity(), -10);
  });

  it('Listeners wait for capacity', done => {
    const limiter = new CapacityLimiter({
      maximumCapacity: 200
    });

    let waitResolved = false;
    const wait = limiter.consumeCapacity(100)
      .then(() => limiter.consumeCapacity(150))
      .then(() => waitResolved = true);

    setTimeoutPromise(10) // Wait a little bit to check if promise didn't get resolved
      .then(() => {
        assert.isFalse(waitResolved)
        assert.equal(limiter.getConsumedCapacity(), 100);

        limiter.consumeCapacity(-70);

        return wait.then(() => {
          assert.equal(limiter.getConsumedCapacity(), 180); // 100 + 150 (wait) - 70
          done();
        })
      })
      .catch(done)
  });

  it('Only one listeners gets invoked', done => {
    const limiter = new CapacityLimiter({
      maximumCapacity: 200
    });

    let resolvedPromises = 0;
    limiter.consumeCapacity(100);

    Promise.all([
      limiter.consumeCapacity(150).then(() => {resolvedPromises++; assert.equal(resolvedPromises, 1)}),
      limiter.consumeCapacity(160).then(() => {resolvedPromises++; assert.equal(resolvedPromises, 1)}),
      limiter.consumeCapacity(170).then(() => {resolvedPromises++; assert.equal(resolvedPromises, 1)})
    ])
    .then(() => done('Should not all be resolved'))
    .catch(err => done(err));

    limiter.consumeCapacity(-100);
    
    setTimeoutPromise(10) // Wait a little bit to check if promise didn't get resolved
      .then(() => assert.equal(resolvedPromises, 1))
      .then(() => done())
      .catch(done)
  });

  it('Changing maximum capacity notifies listeners', done => {
    const limiter = new CapacityLimiter({
      maximumCapacity: 200
    });

    let waitResolved = false;
    const wait = limiter.consumeCapacity(100)
      .then(() => limiter.consumeCapacity(150))
      .then(() => waitResolved = true);

    setTimeoutPromise(10) // Wait a little bit to check if promise didn't get resolved
      .then(() => {
        assert.isFalse(waitResolved)
        assert.equal(limiter.getConsumedCapacity(), 100);

        limiter.setMaximumCapacity(250);

        return wait.then(() => {
          assert.equal(limiter.getConsumedCapacity(), 250);
          done();
        })
      })
      .catch(done)
  });
})