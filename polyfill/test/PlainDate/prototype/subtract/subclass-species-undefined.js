// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
esid: sec-temporal.date.prototype.subtract
includes: [compareArray.js]
features: [Symbol.species]
---*/

let called = 0;

class MyDate extends Temporal.PlainDate {
  constructor(year, month, day) {
    assert.compareArray([year, month, day], [2000, 5, 2], "constructor arguments");
    ++called;
    super(year, month, day);
  }
}

const instance = MyDate.from("2000-05-02");
assert.sameValue(called, 1);

MyDate.prototype.constructor = {
  [Symbol.species]: undefined,
};

const result = instance.subtract({ days: 1 });
assert.sameValue(result.year, 2000, "year result");
assert.sameValue(result.month, 5, "month result");
assert.sameValue(result.day, 1, "day result");
assert.sameValue(called, 1);
assert.sameValue(Object.getPrototypeOf(result), Temporal.PlainDate.prototype);
