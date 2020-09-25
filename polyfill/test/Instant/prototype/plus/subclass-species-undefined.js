// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
esid: sec-temporal.absolute.prototype.plus
---*/

let called = 0;

class MyInstant extends Temporal.Instant {
  constructor(ns) {
    assert.sameValue(ns, 10n, "constructor argument");
    ++called;
    super(ns);
  }
}

const instance = MyInstant.fromEpochNanoseconds(10n);
assert.sameValue(called, 1);

MyInstant.prototype.constructor = {
  [Symbol.species]: undefined,
};

const result = instance.plus({ nanoseconds: 5 });
assert.sameValue(result.getEpochNanoseconds(), 15n, "getEpochNanoseconds result");
assert.sameValue(called, 1);
assert.sameValue(Object.getPrototypeOf(result), Temporal.Instant.prototype);