# Temporal.PlainTime

<details>
  <summary><strong>Table of Contents</strong></summary>
<!-- toc -->
</details>

A `Temporal.PlainTime` represents a wall-clock time, with a precision in nanoseconds, and without any time zone.
"Wall-clock time" refers to the concept of a time as expressed in everyday usage &mdash; the time that you read off the clock on the wall.
For example, it could be used to represent an event that happens daily at a certain time, no matter what time zone.

`Temporal.PlainTime` refers to a time with no associated calendar date; if you need to refer to a specific time on a specific day, use `Temporal.PlainDateTime`.
A `Temporal.PlainTime` can be converted into a `Temporal.PlainDateTime` by combining it with a `Temporal.PlainDate` using the `toPlainDateTime()` method.

## Constructor

### **new Temporal.PlainTime**(_isoHour_: number = 0, _isoMinute_: number = 0, _isoSecond_: number = 0, _isoMillisecond_: number = 0, _isoMicrosecond_: number = 0, _isoNanosecond_: number = 0, _calendar_?: object) : Temporal.PlainTime

**Parameters:**

- `isoHour` (optional number): An hour of the day, ranging between 0 and 23 inclusive.
- `isoMinute` (optional number): A minute, ranging between 0 and 59 inclusive.
- `isoSecond` (optional number): A second, ranging between 0 and 59 inclusive.
- `isoMillisecond` (optional number): A number of milliseconds, ranging between 0 and 999 inclusive.
- `isoMicrosecond` (optional number): A number of microseconds, ranging between 0 and 999 inclusive.
- `isoNanosecond` (optional number): A number of nanoseconds, ranging between 0 and 999 inclusive.
- `calendar` (optional `Temporal.Calendar` or plain object): A calendar to project the time into.

**Returns:** a new `Temporal.PlainTime` object.

Use this constructor if you have the correct parameters for the time already as individual number values in the ISO 8601 calendar.
Otherwise, `Temporal.PlainTime.from()`, which accepts more kinds of input, allows inputting times in different calendar reckonings, and allows controlling the overflow behaviour, is probably more convenient.

All values are given as reckoned in the [ISO 8601 calendar](https://en.wikipedia.org/wiki/ISO_8601#Dates).
Together, `isoHour`, `isoMinute`, `isoSecond`, `isoMillisecond`, `isoMicrosecond`, and `isoNanosecond` must represent a valid date in that calendar, even if you are passing a different calendar as the `calendar` parameter.

Usage examples:

```javascript
// Leet hour
time = new Temporal.PlainTime(13, 37); // => 13:37
```

## Static methods

### Temporal.PlainTime.**from**(_thing_: any, _options_?: object) : Temporal.PlainTime

**Parameters:**

- `thing`: The value representing the desired time.
- `options` (optional object): An object with properties representing options for constructing the time.
  The following options are recognized:
  - `overflow` (optional string): How to deal with out-of-range values of the other parameters.
    Allowed values are `constrain` and `reject`.
    The default is `constrain`.

**Returns:** a new `Temporal.PlainTime` object.

This static method creates a new `Temporal.PlainTime` object from another value.
If the value is another `Temporal.PlainTime` object, a new object representing the same time is returned.
If the value is any other object, a `Temporal.PlainTime` will be constructed from the values of any `hour`, `minute`, `second`, `millisecond`, `microsecond`, `nanosecond`, and `calendar` properties that are present.
Any missing ones except `calendar` will be assumed to be 0.

If the `calendar` property is not present, it will be assumed to be `Temporal.Calendar.from('iso8601')`, the [ISO 8601 calendar](https://en.wikipedia.org/wiki/ISO_8601#Dates).

Any non-object value will be converted to a string, which is expected to be in ISO 8601 format.
If the string designates a date or a time zone, they will be ignored.

The `overflow` option works as follows:

- In `constrain` mode (the default), any out-of-range values are clamped to the nearest in-range value.
- In `reject` mode, the presence of out-of-range values will cause the function to throw a `RangeError`.

> **NOTE**: Although Temporal does not deal with leap seconds, times coming from other software may have a `second` value of 60.
> In the default `constrain` mode, this will be converted to 59.
> In `reject` mode, the constructor will throw, so if you have to interoperate with times that may contain leap seconds, don't use `reject`.
> However, if parsing an ISO 8601 string with a seconds component of `:60`, then it will always result in a `second` value of 59, in accordance with POSIX.

Example usage:

<!-- prettier-ignore-start -->
```javascript
time = Temporal.PlainTime.from('03:24:30'); // => 03:24:30
time = Temporal.PlainTime.from('1995-12-07T03:24:30'); // => 03:24:30
time = Temporal.PlainTime.from('1995-12-07T03:24:30Z'); // => 03:24:30
time = Temporal.PlainTime.from('1995-12-07T03:24:30+01:00[Europe/Brussels]');
  // => same as above; time zone is ignored
time === Temporal.PlainTime.from(time); // => true

time = Temporal.PlainTime.from({
  hour: 19,
  minute: 39,
  second: 9,
  millisecond: 68,
  microsecond: 346,
  nanosecond: 205
}); // => 19:39:09.068346205
time = Temporal.PlainTime.from({ hour: 19, minute: 39, second: 9 }); // => 19:39:09
time = Temporal.PlainTime.from(Temporal.PlainDateTime.from('2020-02-15T19:39:09'));
  // => same as above; Temporal.PlainDateTime has hour, minute, etc. properties

// Different overflow modes
time = Temporal.PlainTime.from({ hour: 15, minute: 60 }, { overflow: 'constrain' });
  // => 15:59
time = Temporal.PlainTime.from({ hour: 15, minute: -1 }, { overflow: 'constrain' });
  // => 15:00
time = Temporal.PlainTime.from({ hour: 15, minute: 60 }, { overflow: 'reject' });
  // throws
time = Temporal.PlainTime.from({ hour: 15, minute: -1 }, { overflow: 'reject' });
  // throws
```
<!-- prettier-ignore-end -->

### Temporal.PlainTime.**compare**(_one_: Temporal.PlainTime | object | string, _two_: Temporal.PlainTime | object | string) : number

**Parameters:**

- `one` (`Temporal.PlainTime` or value convertible to one): First time to compare.
- `two` (`Temporal.PlainTime` or value convertible to one): Second time to compare.

**Returns:** &minus;1, 0, or 1.

Compares two `Temporal.PlainTime` objects.
Returns an integer indicating whether `one` comes before or after or is equal to `two`.

- &minus;1 if `one` comes before `two`;
- 0 if `one` and `two` are the same;
- 1 if `one` comes after `two`.

If `one` and `two` are not `Temporal.PlainTime` objects, then they will be converted to one as if they were passed to `Temporal.PlainTime.from()`.

This function can be used to sort arrays of `Temporal.PlainTime` objects.
For example:

```javascript
one = Temporal.PlainTime.from('03:24');
two = Temporal.PlainTime.from('01:24');
three = Temporal.PlainTime.from('01:24:05');
sorted = [one, two, three].sort(Temporal.PlainTime.compare);
sorted.join(' '); // => 01:24 01:24:05 03:24
```

## Properties

### time.**hour**: number

### time.**minute**: number

### time.**second**: number

### time.**millisecond**: number

### time.**microsecond**: number

### time.**nanosecond**: number

The above read-only properties allow accessing each component of the time individually.

Usage examples:

<!-- prettier-ignore-start -->
```javascript
time = Temporal.PlainTime.from('19:39:09.068346205');
time.hour;        // => 19
time.minute;      // => 39
time.second;      // => 9
time.millisecond; // => 68
time.microsecond; // => 346
time.nanosecond;  // => 205
```
<!-- prettier-ignore-end -->

### time.**calendar**: object

The `calendar` read-only property gives the calendar that the `hour`, `minute`, `second`, `millisecond`, `microsecond`, and `nanosecond` properties are interpreted in.

## Methods

### time.**with**(_timeLike_: object | string, _options_?: object) : Temporal.PlainTime

**Parameters:**

- `timeLike` (object or string): an object with some or all of the properties of a `Temporal.PlainTime`, or an ISO string.
- `options` (optional object): An object with properties representing options for the operation.
  The following options are recognized:
  - `overflow` (string): How to deal with out-of-range values.
    Allowed values are `constrain` and `reject`.
    The default is `constrain`.

**Returns:** a new `Temporal.PlainTime` object.

This method creates a new `Temporal.PlainTime` which is a copy of `time`, but any properties present on `timeLike` override the ones already present on `time`.

If `timeLike` is a string, then it will be attempted to be converted into a `Temporal.PlainTime`.
(In this case, the result is identical to to `Temporal.PlainTime.from(timeLike)`.)

Since `Temporal.PlainTime` objects are immutable, use this method instead of modifying one.

Usage example:

```javascript
time = Temporal.PlainTime.from('19:39:09.068346205');
// What's the top of the next hour?
time.add({ hours: 1 }).with({
  minute: 0,
  second: 0,
  millisecond: 0,
  microsecond: 0,
  nanosecond: 0
}); // => 20:00
```

### time.**withCalendar**(_calendar_: object | string) : Temporal.PlainTime

**Parameters:**

- `calendar` (`Temporal.Calendar` or plain object or string): The calendar into which to project `time`.

**Returns:** a new `Temporal.PlainTime` object which is the time indicated by `time`, projected into `calendar`.

Usage example:

```javascript
time = Temporal.PlainTime.from('03:20:00[c=ethiopic]');
time.withCalendar('iso8601'); // => 03:20:00
```

### time.**add**(_duration_: Temporal.Duration | object | string, _options_?: object) : Temporal.PlainTime

**Parameters:**

- `duration` (`Temporal.Duration` or value convertible to one): The duration to add.
- `options` (optional object): An object with properties representing options for the addition.
  The following options are recognized:
  - `overflow` (string): How to deal with additions that result in out-of-range values.
    Allowed values are `constrain` and `reject`.
    The default is `constrain`.

**Returns:** a new `Temporal.PlainTime` object which is the time indicated by `time` plus `duration`.

This method adds `duration` to `time`.
Due to times wrapping around when reaching 24 hours, the returned point in time may be either in the future or in the past relative to `time`, or even the same time.

The `duration` argument is an object with properties denoting a duration, such as `{ hours: 5, minutes: 30 }`, or a string such as `PT5H30M`, or a `Temporal.Duration` object.
If `duration` is not a `Temporal.Duration` object, then it will be converted to one as if it were passed to `Temporal.Duration.from()`.

The `overflow` parameter has no effect in the default ISO calendar, because the units of hours, minutes, and seconds are always the same length and therefore not ambiguous.
However, it may have an effect in other calendars where those units are not always the same length.

Adding a negative duration is equivalent to subtracting the absolute value of that duration.

Usage example:

```javascript
time = Temporal.PlainTime.from('19:39:09.068346205');
time.add({ minutes: 5, nanoseconds: 800 }); // => 19:44:09.068347005
```

### time.**subtract**(_duration_: Temporal.Duration | object | string, _options_?: object) : Temporal.PlainTime

**Parameters:**

- `duration` (`Temporal.Duration` or value convertible to one): The duration to subtract.
- `options` (optional object): An object with properties representing options for the subtraction.
  The following options are recognized:
  - `overflow` (string): How to deal with subtractions that result in out-of-range values.
    Allowed values are `constrain` and `reject`.
    The default is `constrain`.

**Returns:** a new `Temporal.PlainTime` object which is the time indicated by `time` minus `duration`.

This method subtracts `duration` from `time`.
Due to times wrapping around when reaching 24 hours, the returned point in time may be either in the future or in the past relative to `time`, or even the same time.

The `duration` argument is an object with properties denoting a duration, such as `{ hours: 5, minutes: 30 }`, or a string such as `PT5H30M`, or a `Temporal.Duration` object.
If `duration` is not a `Temporal.Duration` object, then it will be converted to one as if it were passed to `Temporal.Duration.from()`.

The `overflow` parameter has no effect in the default ISO calendar, because the units of hours, minutes, and seconds are always the same length and therefore not ambiguous.
However, it may have an effect in other calendars where those units are not always the same length.

Subtracting a negative duration is equivalent to adding the absolute value of that duration.

Usage example:

```javascript
time = Temporal.PlainTime.from('19:39:09.068346205');
time.subtract({ minutes: 5, nanoseconds: 800 }); // => 19:34:09.068345405
```

### time.**until**(_other_: Temporal.PlainTime | object | string, _options_?: object) : Temporal.Duration

**Parameters:**

- `other` (`Temporal.PlainTime` or value convertible to one): Another time until when to compute the difference.
- `options` (optional object): An object with properties representing options for the operation.
  The following options are recognized:
  - `largestUnit` (string): The largest unit of time to allow in the resulting `Temporal.Duration` object.
    Valid values are `'auto'`, `'hours'`, `'minutes'`, `'seconds'`, `'milliseconds'`, `'microseconds'`, and `'nanoseconds'`.
    The default is `'auto'`.
  - `smallestUnit` (string): The smallest unit of time to round to in the resulting `Temporal.Duration` object.
    Valid values are `'hours'`, `'minutes'`, `'seconds'`, `'milliseconds'`, `'microseconds'`, and `'nanoseconds'`.
    The default is `'nanoseconds'`, i.e., no rounding.
  - `roundingIncrement` (number): The granularity to round to, of the unit given by `smallestUnit`.
    The default is 1.
  - `roundingMode` (string): How to handle the remainder, if rounding.
    Valid values are `'nearest'`, `'ceil'`, `'trunc'`, and `'floor'`.
    The default is `'nearest'`.

**Returns:** a `Temporal.Duration` representing the elapsed time after `time` and until `other`.

This method computes the difference between the two times represented by `time` and `other`, optionally rounds it, and returns it as a `Temporal.Duration` object.
If `other` is earlier than `time` then the resulting duration will be negative.

If `other` is not a `Temporal.PlainTime` object, then it will be converted to one as if it were passed to `Temporal.PlainTime.from()`.

The `largestUnit` parameter controls how the resulting duration is expressed.
The returned `Temporal.Duration` object will not have any nonzero fields that are larger than the unit in `largestUnit`.
A difference of two hours will become 7200 seconds when `largestUnit` is `'seconds'`, for example.
However, a difference of 30 seconds will still be 30 seconds even if `largestUnit` is `'hours'`.
A value of `'auto'` means `'hours'`.

You can round the result using the `smallestUnit`, `roundingIncrement`, and `roundingMode` options.
These behave as in the `Temporal.Duration.round()` method.
The default is to do no rounding.

Computing the difference between two times in different calendar systems is not supported.
If you need to do this, choose the calendar in which the computation takes place by converting one of the times with `time.withCalendar()`.

Usage example:

<!-- prettier-ignore-start -->
```javascript
time = Temporal.PlainTime.from('20:13:20.971398099');
time.until(Temporal.PlainTime.from('22:39:09.068346205')); // => PT2H25M49.903051894S
time.until(Temporal.PlainTime.from('19:39:09.068346205')); // => -PT34M11.903051894S

// Rounding, for example if you don't care about sub-seconds
time.until(Temporal.PlainTime.from('22:39:09.068346205'), { smallestUnit: 'seconds' });
  // => PT2H25M50S
```
<!-- prettier-ignore-end -->

### time.**since**(_other_: Temporal.PlainTime | object | string, _options_?: object) : Temporal.Duration

**Parameters:**

- `other` (`Temporal.PlainTime` or value convertible to one): Another time since when to compute the difference.
- `options` (optional object): An object with properties representing options for the operation.
  The following options are recognized:
  - `largestUnit` (string): The largest unit of time to allow in the resulting `Temporal.Duration` object.
    Valid values are `'auto'`, `'hours'`, `'minutes'`, `'seconds'`, `'milliseconds'`, `'microseconds'`, and `'nanoseconds'`.
    The default is `'auto'`.
  - `smallestUnit` (string): The smallest unit of time to round to in the resulting `Temporal.Duration` object.
    Valid values are `'hours'`, `'minutes'`, `'seconds'`, `'milliseconds'`, `'microseconds'`, and `'nanoseconds'`.
    The default is `'nanoseconds'`, i.e., no rounding.
  - `roundingIncrement` (number): The granularity to round to, of the unit given by `smallestUnit`.
    The default is 1.
  - `roundingMode` (string): How to handle the remainder, if rounding.
    Valid values are `'nearest'`, `'ceil'`, `'trunc'`, and `'floor'`.
    The default is `'nearest'`.

**Returns:** a `Temporal.Duration` representing the elapsed time before `time` and since `other`.

This method computes the difference between the two times represented by `time` and `other`, optionally rounds it, and returns it as a `Temporal.Duration` object.
If `other` is later than `time` then the resulting duration will be negative.

This method does the same thing as the `Temporal.PlainTime.prototype.until()` method, but reversed, and rounding takes place relative to `time` as an ending point instead of a starting point.
With the default options, the outcome of `time1.since(time2)` is the same as `time1.until(time2).negated()`.

Usage example:

```javascript
time = Temporal.PlainTime.from('20:13:20.971398099');
time.since(Temporal.PlainTime.from('19:39:09.068346205')); // => PT34M11.903051894S
time.since(Temporal.PlainTime.from('22:39:09.068346205')); // => -PT2H25M49.903051894S
```

### time.**round**(_options_: object) : Temporal.PlainTime

**Parameters:**

- `options` (object): An object with properties representing options for the operation.
  The following options are recognized:
  - `smallestUnit` (required string): The unit to round to.
    Valid values are `'hour'`, `'minute'`, `'second'`, `'millisecond'`, `'microsecond'`, and `'nanosecond'`.
  - `roundingIncrement` (number): The granularity to round to, of the unit given by `smallestUnit`.
    The default is 1.
  - `roundingMode` (string): How to handle the remainder.
    Valid values are `'nearest'`, `'ceil'`, `'trunc'`, and `'floor'`.
    The default is `'nearest'`.

**Returns:** a new `Temporal.PlainTime` object which is `time` rounded to `roundingIncrement` of `smallestUnit`.

Rounds `time` to the given unit and increment, and returns the result as a new `Temporal.PlainTime` object.

The `smallestUnit` option determines the unit to round to.
For example, to round to the nearest minute, use `smallestUnit: 'minute'`.
This option is required.

The `roundingIncrement` option allows rounding to an integer number of units.
For example, to round to increments of a half hour, use `smallestUnit: 'minute', roundingIncrement: 30`.

The value given as `roundingIncrement` must divide evenly into the next highest unit after `smallestUnit`, and must not be equal to it.
(For example, if `smallestUnit` is `'minutes'`, then the number of minutes given by `roundingIncrement` must divide evenly into 60 minutes, which is one hour.
The valid values in this case are 1 (default), 2, 3, 4, 5, 6, 10, 12, 15, 20, and 30.
Instead of 60 minutes, use 1 hour.)

The `roundingMode` option controls how the rounding is performed.

- `ceil`: Always round up, towards 23:59:59.999999999.
- `floor`, `trunc`: Always round down, 00:00.
  (These two modes behave the same, but are both included for consistency with `Temporal.Duration.round()`, where they are not the same.)
- `nearest`: Round to the nearest of the values allowed by `roundingIncrement` and `smallestUnit`.
  When there is a tie, round up, like `ceil`.

Example usage:

<!-- prettier-ignore-start -->
```javascript
time = Temporal.PlainTime.from('19:39:09.068346205');

// Round to a particular unit
time.round({ smallestUnit: 'hour' }); // => 20:00
// Round to an increment of a unit, e.g. half an hour:
time.round({ roundingIncrement: 30, smallestUnit: 'minute' });
  // => 19:30
// Round to the same increment but round up instead:
time.round({ roundingIncrement: 30, smallestUnit: 'minute', roundingMode: 'ceil' });
  // => 20:00
```
<!-- prettier-ignore-end -->

### time.**equals**(_other_: Temporal.PlainTime | object | string) : boolean

**Parameters:**

- `other` (`Temporal.PlainTime` or value convertible to one): Another time to compare.

**Returns:** `true` if `time` and `other` are equal, or `false` if not.

Compares two `Temporal.PlainTime` objects for equality.

This function exists because it's not possible to compare using `time == other` or `time === other`, due to ambiguity in the primitive representation and between Temporal types.

If you don't need to know the order in which the two times occur, then this function may be less typing and more efficient than `Temporal.PlainTime.compare`.

If `other` is not a `Temporal.PlainTime` object, then it will be converted to one as if it were passed to `Temporal.PlainTime.from()`.

Example usage:

```javascript
time = Temporal.PlainTime.from('19:39:09.068346205');
other = Temporal.PlainTime.from('20:13:20.971398099');
time.equals(other); // => false
time.equals(time); // => true
```

### time.**toString**(_options_?: object) : string

**Parameters:**

- `options` (optional object): An object with properties representing options for the operation.
  The following options are recognized:
  - `calendar` (string): Whether to show the calendar annotation in the return value.
    Valid values are `'auto'`, `'always'`, and `'never'`.
    The default is `'auto'`.
  - `fractionalSecondDigits` (number or string): How many digits to print after the decimal point in the output string.
    Valid values are `'auto'`, 0, 1, 2, 3, 4, 5, 6, 7, 8, or 9.
    The default is `'auto'`.
  - `smallestUnit` (string): The smallest unit of time to include in the output string.
    This option overrides `fractionalSecondDigits` if both are given.
    Valid values are `'minute'`, `'second'`, `'millisecond'`, `'microsecond'`, and `'nanosecond'`.
  - `roundingMode` (string): How to handle the remainder.
    Valid values are `'ceil'`, `'floor'`, `'trunc'`, and `'nearest'`.
    The default is `'trunc'`.

**Returns:** a string in the ISO 8601 time format representing `time`.

This method overrides the `Object.prototype.toString()` method and provides a convenient, unambiguous string representation of `time`.
The string can be passed to `Temporal.PlainTime.from()` to create a new `Temporal.PlainTime` object.

The output precision can be controlled with the `fractionalSecondDigits` or `smallestUnit` option.
If no options are given, the default is `fractionalSecondDigits: 'auto'`, which omits trailing zeroes after the decimal point.

The value is truncated to fit the requested precision, unless a different rounding mode is given with the `roundingMode` option, as in `Temporal.PlainDateTime.round()`.
Note that rounding may change the value of other units as well.

Normally, a calendar annotation is shown when `time`'s calendar is not the ISO 8601 calendar.
By setting the `calendar` option to `'always'` or `'never'` this can be overridden to always or never show the annotation, respectively.
For more information on the calendar annotation, see [ISO string extensions](./iso-string-ext.md#calendar-systems).

Example usage:

```js
time = Temporal.PlainTime.from('19:39:09.068346205');
time.toString(); // => 19:39:09.068346205

time.toString({ smallestUnit: 'minute' }); // => 19:39
time.toString({ fractionalSecondDigits: 0 }); // => 19:39:09
time.toString({ fractionalSecondDigits: 4 }); // => 19:39:09.0683
time.toString({ fractionalSecondDigits: 5, roundingMode: 'nearest' })
  // => 19:39:09.06835
```

### time.**toLocaleString**(_locales_?: string | array&lt;string&gt;, _options_?: object) : string

**Parameters:**

- `locales` (optional string or array of strings): A string with a BCP 47 language tag with an optional Unicode extension key, or an array of such strings.
- `options` (optional object): An object with properties influencing the formatting.

**Returns:** a language-sensitive representation of `time`.

This method overrides `Object.prototype.toLocaleString()` to provide a human-readable, language-sensitive representation of `time`.

The `locales` and `options` arguments are the same as in the constructor to [`Intl.DateTimeFormat`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DateTimeFormat).

> **NOTE**: Unlike in [`Temporal.Instant.prototype.toLocaleString()`](./instant.html#toLocaleString), `locales.timeZone` will have no effect, because `Temporal.PlainTime` carries no time zone information and is just a wall-clock time.

Example usage:

```js
time = Temporal.PlainTime.from('19:39:09.068346205');
time.toLocaleString(); // => example output: 7:39:09 p.m.
time.toLocaleString('de-DE'); // => example output: 19:39:09
time.toLocaleString('de-DE', { timeZone: 'Europe/Berlin' }); // => 19:39:09
time.toLocaleString('en-US-u-nu-fullwide-hc-h24'); // => １９:３９:０９
```

### time.**toJSON**() : string

**Returns:** a string in the ISO 8601 date format representing `time`.

This method is the same as `time.toString()`.
It is usually not called directly, but it can be called automatically by `JSON.stringify()`.

The reverse operation, recovering a `Temporal.PlainTime` object from a string, is `Temporal.PlainTime.from()`, but it cannot be called automatically by `JSON.parse()`.
If you need to rebuild a `Temporal.PlainTime` object from a JSON string, then you need to know the names of the keys that should be interpreted as `Temporal.PlainTime`s.
In that case you can build a custom "reviver" function for your use case.

Example usage:

```js
const workBreak = {
  type: 'mandatory',
  name: 'Lunch',
  startTime: Temporal.PlainTime.from({ hour: 12 }),
  endTime: Temporal.PlainTime.from({ hour: 13 })
};
const str = JSON.stringify(workBreak, null, 2);
console.log(str);
// =>
// {
//   "type": "mandatory",
//   "name": "Lunch",
//   "startTime": "12:00",
//   "endTime": "13:00"
// }

// To rebuild from the string:
function reviver(key, value) {
  if (key.endsWith('Time')) return Temporal.PlainTime.from(value);
  return value;
}
JSON.parse(str, reviver);
```

### time.**valueOf**()

This method overrides `Object.prototype.valueOf()` and always throws an exception.
This is because it's not possible to compare `Temporal.PlainTime` objects with the relational operators `<`, `<=`, `>`, or `>=`.
Use `Temporal.PlainTime.compare()` for this, or `time.equals()` for equality.

### time.**toZonedDateTime**(_timeZone_?: Temporal.TimeZone | object | string, _date_: Temporal.PlainDate | object | string, _options_?: object) : Temporal.ZonedDateTime

**Parameters:**

- `timeZone` (optional string or object): The time zone in which to interpret `time` and `date`, as a `Temporal.TimeZone` object, an object implementing the [time zone protocol](./timezone.md#protocol), or a string.
- `date` (`Temporal.PlainDate` or value convertible to one): A date used to merge into a `Temporal.ZonedDateTime` along with `time`.
- `options` (optional object): An object with properties representing options for the operation.
  The following options are recognized:
  - `disambiguation` (string): How to disambiguate if the date and time given by `time` and `date` does not exist in the time zone, or exists more than once.
    Allowed values are `'compatible'`, `'earlier'`, `'later'`, and `'reject'`.
    The default is `'compatible'`.

**Returns:** a `Temporal.ZonedDateTime` object that represents the clock `time` on the calendar `date` projected into `timeZone`.

This method can be used to convert `Temporal.PlainTime` into a `Temporal.ZonedDateTime`, by supplying the time zone and date.

For a list of IANA time zone names, see the current version of the [IANA time zone database](https://www.iana.org/time-zones).
A convenient list is also available [on Wikipedia](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones), although it might not reflect the latest official status.

In addition to the `timeZone`, the converted object carries a copy of all the relevant fields of `time` and `date`.
This method produces identical results to [`Temporal.PlainDate.from(date).toZonedDateTime(time)`](./date.html#toZonedDateTime).

If `date` is not a `Temporal.PlainDate` object, then it will be converted to one as if it were passed to `Temporal.PlainDate.from()`.

In the case of ambiguity caused by DST or other time zone changes, the `disambiguation` option controls how to resolve the ambiguity:

- `'compatible'` (the default): Acts like `'earlier'` for backward transitions and `'later'` for forward transitions.
- `'earlier'`: The earlier of two possible times.
- `'later'`: The later of two possible times.
- `'reject'`: Throw a `RangeError` instead.

When interoperating with existing code or services, `'compatible'` mode matches the behavior of legacy `Date` as well as libraries like moment.js, Luxon, and date-fns.
This mode also matches the behavior of cross-platform standards like [RFC 5545 (iCalendar)](https://tools.ietf.org/html/rfc5545).

During "skipped" clock time like the hour after DST starts in the Spring, this method interprets invalid times using the pre-transition time zone offset if `'compatible'` or `'later'` is used or the post-transition time zone offset if `'earlier'` is used.
This behavior avoids exceptions when converting non-existent date/time values to `Temporal.ZonedDateTime`, but it also means that values during these periods will result in a different `Temporal.PlainTime` value in "round-trip" conversions to `Temporal.ZonedDateTime` and back again.

For usage examples and a more complete explanation of how this disambiguation works and why it is necessary, see [Resolving ambiguity](./ambiguity.md).

If the result is earlier or later than the range that `Temporal.ZonedDateTime` can represent (approximately half a million years centered on the [Unix epoch](https://en.wikipedia.org/wiki/Unix_time)), then a `RangeError` will be thrown, no matter the value of `disambiguation`.

Usage example:

```javascript
time = Temporal.PlainTime.from('15:23:30.003');
date = Temporal.PlainDate.from('2006-08-24');
time.toZonedDateTime('America/Los_Angeles', date); // => 2006-08-24T15:23:30.003-07:00[America/Los_Angeles]
```

### time.**toPlainDateTime**(_date_: Temporal.PlainDate | object | string) : Temporal.PlainDateTime

**Parameters:**

- `date` (`Temporal.PlainDate` or value convertible to one): A calendar date on which to place `time`.

**Returns:** a `Temporal.PlainDateTime` object that represents the wall-clock time `time` on the calendar date `date`.

This method can be used to convert `Temporal.PlainTime` into a `Temporal.PlainDateTime`, by supplying the calendar date to use.
The converted object carries a copy of all the relevant fields of `date` and `time`.

This has identical results to [`Temporal.PlainDate.from(date).toPlainDateTime(time)`](./date.html#toPlainDateTime).

If `date` is not a `Temporal.PlainDate` object, then it will be converted to one as if it were passed to `Temporal.PlainDate.from()`.

Usage example:

```javascript
time = Temporal.PlainTime.from('15:23:30.003');
date = Temporal.PlainDate.from('2006-08-24');
time.toPlainDateTime(date); // => 2006-08-24T15:23:30.003
```

### time.**getFields**() : { hour: number, minute: number, second: number, millisecond: number, microsecond: number, nanosecond: number }

**Returns:** a plain object with properties equal to the fields of `time`.

This method can be used to convert a `Temporal.PlainTime` into a record-like data structure.
It returns a new plain JavaScript object, with all the fields as enumerable, writable, own data properties.

Note that if using a different calendar from ISO 8601, these will be the calendar-specific values and may include extra properties.

Usage example:

```javascript
time = Temporal.PlainTime.from('15:23:30.003');
Object.assign({}, time).minute; // => undefined
Object.assign({}, time.getFields()).minute; // => 23
```

### time.**getISOFields**(): { isoHour: number, isoMinute: number, isoSecond: number, isoMillisecond: number, isoMicrosecond: number, isoNanosecond: number, calendar: object }

**Returns:** a plain object with properties expressing `time` in the ISO 8601 calendar, as well as the value of `time.calendar`.

This method is mainly useful if you are implementing a custom calendar.
Most code will not need to use it.
Use `time.getFields()` instead, or `time.withCalendar('iso8601').getFields()`.

Usage example:

```javascript
time = Temporal.PlainTime.from('03:20:00');
f = time.getISOFields();
f.isoHour; // => 3
// Fields correspond exactly to constructor arguments:
time2 = new Temporal.PlainTime(f.isoHour, f.isoMinute, f.isoSecond, f.isoMillisecond, f.isoMicrosecond, f.isoNanosecond, f.calendar);
time.equals(time2); // => true

// Time in other calendar
time = time.withCalendar('ethiopic');
time.getFields().hour; // => 9
time.getISOFields().isoHour; // => 3

// Most likely what you need is this:
time.withCalendar('iso8601').hour; // => 3
```
