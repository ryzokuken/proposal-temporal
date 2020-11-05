# Temporal.PlainDate

<details>
  <summary><strong>Table of Contents</strong></summary>
<!-- toc -->
</details>

A `Temporal.PlainDate` represents a calendar date.
"Calendar date" refers to the concept of a date as expressed in everyday usage, independent of any time zone.
For example, it could be used to represent an event on a calendar which happens during the whole day no matter which time zone it's happening in.

`Temporal.PlainDate` refers to the whole of a specific day; if you need to refer to a specific time on that day, use `Temporal.PlainDateTime`.
A `Temporal.PlainDate` can be converted into a `Temporal.PlainDateTime` by combining it with a `Temporal.PlainTime` using the `toPlainDateTime()` method.

`Temporal.PlainYearMonth` and `Temporal.PlainMonthDay` carry less information than `Temporal.PlainDate` and should be used when complete information is not required.

## Constructor

### **new Temporal.PlainDate**(_isoYear_: number, _isoMonth_: number, _isoDay_: number, _calendar_?: object) : Temporal.PlainDate

**Parameters:**

- `isoYear` (number): A year.
- `isoMonth` (number): A month, ranging between 1 and 12 inclusive.
- `isoDay` (number): A day of the month, ranging between 1 and 31 inclusive.
- `calendar` (optional `Temporal.Calendar` or plain object): A calendar to project the date into.

**Returns:** a new `Temporal.PlainDate` object.

Use this constructor if you have the correct parameters for the date already as individual number values in the ISO 8601 calendar.
Otherwise, `Temporal.PlainDate.from()`, which accepts more kinds of input, allows inputting dates in different calendar reckonings, and allows controlling the overflow behaviour, is probably more convenient.

All values are given as reckoned in the [ISO 8601 calendar](https://en.wikipedia.org/wiki/ISO_8601#Dates).
Together, `isoYear`, `isoMonth`, and `isoDay` must represent a valid date in that calendar, even if you are passing a different calendar as the `calendar` parameter.

The range of allowed values for this type is exactly enough that calling [`toPlainDate()`](./datetime.html#toPlainDate) on any valid `Temporal.PlainDateTime` will succeed.
If `isoYear`, `isoMonth`, and `isoDay` form a date outside of this range, then this function will throw a `RangeError`.

> **NOTE**: The `isoMonth` argument ranges from 1 to 12, which is different from legacy `Date` where months are represented by zero-based indices (0 to 11).

Usage examples:

```javascript
// Pi day in 2020
date = new Temporal.PlainDate(2020, 3, 14); // => 2020-03-14
```

## Static methods

### Temporal.PlainDate.**from**(_thing_: any, _options_?: object) : Temporal.PlainDate

**Parameters:**

- `thing`: The value representing the desired date.
- `options` (optional object): An object with properties representing options for constructing the date.
  The following options are recognized:
  - `overflow` (string): How to deal with out-of-range values in `thing`.
    Allowed values are `constrain` and `reject`.
    The default is `constrain`.

**Returns:** a new `Temporal.PlainDate` object.

This static method creates a new `Temporal.PlainDate` object from another value.
If the value is another `Temporal.PlainDate` object, a new object representing the same date is returned.
If the value is any other object, it must have `year`, `month`, and `day` properties, and optionally the `calendar` property.
A `Temporal.PlainDate` will be constructed from these properties.

If the `calendar` property is not present, it will be assumed to be `Temporal.Calendar.from('iso8601')`, the [ISO 8601 calendar](https://en.wikipedia.org/wiki/ISO_8601#Dates).

Any non-object value is converted to a string, which is expected to be in ISO 8601 format.
Any time or time zone part is optional and will be ignored.
If the string isn't valid according to ISO 8601, then a `RangeError` will be thrown regardless of the value of `overflow`.

The `overflow` option works as follows:

- In `constrain` mode (the default), any out-of-range values are clamped to the nearest in-range value.
- In `reject` mode, the presence of out-of-range values will cause the function to throw a `RangeError`.

Additionally, if the result is earlier or later than the range of dates that `Temporal.PlainDate` can represent (approximately half a million years centered on the [Unix epoch](https://en.wikipedia.org/wiki/Unix_time)), then this function will throw a `RangeError` regardless of `overflow`.

> **NOTE**: The allowed values for the `thing.month` property start at 1, which is different from legacy `Date` where months are represented by zero-based indices (0 to 11).

Example usage:

```javascript
date = Temporal.PlainDate.from('2006-08-24'); // => 2006-08-24
date = Temporal.PlainDate.from('2006-08-24T15:43:27'); // => 2006-08-24
date = Temporal.PlainDate.from('2006-08-24T15:43:27Z'); // => 2006-08-24
date = Temporal.PlainDate.from('2006-08-24T15:43:27+01:00[Europe/Brussels]');
  // => 2006-08-24
date === Temporal.PlainDate.from(date) // => true

date = Temporal.PlainDate.from({year: 2006, month: 8, day: 24}); // => 2006-08-24
date = Temporal.PlainDate.from(Temporal.PlainDateTime.from('2006-08-24T15:43:27'));
  // => same as above; Temporal.PlainDateTime has year, month, and day properties

calendar = Temporal.Calendar.from('islamic');
date = Temporal.PlainDate.from({ year: 1427, month; 8, day: 1, calendar }); // => 2006-08-24[c=islamic]
date = Temporal.PlainDate.from({ year: 1427, month: 8, day: 1, calendar: 'islamic' });
  // => same as above

// Different overflow modes
date = Temporal.PlainDate.from({ year: 2001, month: 13, day: 1 }, { overflow: 'constrain' })
  // => 2001-12-01
date = Temporal.PlainDate.from({ year: 2001, month: -1, day: 1 }, { overflow: 'constrain' })
  // => 2001-01-01
date = Temporal.PlainDate.from({ year: 2001, month: 13, day: 1 }, { overflow: 'reject' })
  // throws
date = Temporal.PlainDate.from({ year: 2001, month: -1, day: 1 }, { overflow: 'reject' })
  // throws
```

### Temporal.PlainDate.**compare**(_one_: Temporal.PlainDate | object | string, _two_: Temporal.PlainDate | object | string) : number

**Parameters:**

- `one` (`Temporal.PlainDate` or value convertible to one): First date to compare.
- `two` (`Temporal.PlainDate` or value convertible to one): Second date to compare.

**Returns:** &minus;1, 0, or 1.

Compares two `Temporal.PlainDate` objects.
Returns an integer indicating whether `one` comes before or after or is equal to `two`.

- &minus;1 if `one` comes before `two`;
- 0 if `one` and `two` are the same;
- 1 if `one` comes after `two`.

If `one` or `two` are not `Temporal.PlainDate` objects, then they will be converted to one as if they were passed to `Temporal.PlainDate.from()`.

This function can be used to sort arrays of `Temporal.PlainDate` objects.
For example:

```javascript
one = Temporal.PlainDate.from('2006-08-24');
two = Temporal.PlainDate.from('2015-07-14');
three = Temporal.PlainDate.from('1930-02-18');
sorted = [one, two, three].sort(Temporal.PlainDate.compare);
sorted.join(' '); // => 1930-02-18 2006-08-24 2015-07-14
```

## Properties

### date.**year** : number

### date.**month** : number

### date.**day** : number

The above read-only properties allow accessing each component of the date individually.

> **NOTE**: The possible values for the `month` property start at 1, which is different from legacy `Date` where months are represented by zero-based indices (0 to 11).

Usage examples:

<!-- prettier-ignore-start -->
```javascript
date = Temporal.PlainDate.from('2006-08-24');
date.year;  // => 2006
date.month; // => 8
date.day;   // => 24
```
<!-- prettier-ignore-end -->

### date.**calendar** : object

The `calendar` read-only property gives the calendar that the `year`, `month`, and `day` properties are interpreted in.

### date.**dayOfWeek** : number

The `dayOfWeek` read-only property gives the weekday number that the date falls on.
For the ISO 8601 calendar, the weekday number is defined as in the ISO 8601 standard: a value between 1 and 7, inclusive, with Monday being 1, and Sunday 7.
For an overview, see [ISO 8601 on Wikipedia](https://en.wikipedia.org/wiki/ISO_8601#Week_dates).

Usage example:

```javascript
date = Temporal.PlainDate.from('2006-08-24');
['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'][date.dayOfWeek - 1]; // => THU
```

### date.**dayOfYear** : number

The `dayOfYear` read-only property gives the ordinal day of the year that the date falls on.
For the ISO 8601 calendar, this is a value between 1 and 365, or 366 in a leap year.

Usage example:

```javascript
date = Temporal.PlainDate.from('2006-08-24');
// ISO ordinal date
console.log(date.year, date.dayOfYear); // => 2006 236
```

### date.**weekOfYear** : number

The `weekOfYear` read-only property gives the ISO week number of the date.
For the ISO 8601 calendar, this is normally a value between 1 and 52, but in a few cases it can be 53 as well.
ISO week 1 is the week containing the first Thursday of the year.
For more information on ISO week numbers, see for example the Wikipedia article on [ISO week date](https://en.wikipedia.org/wiki/ISO_week_date).

Usage example:

```javascript
date = Temporal.PlainDate.from('2006-08-24');
// ISO week date
console.log(date.year, date.weekOfYear, date.dayOfWeek); // => 2006 34 4
```

### date.**daysInWeek** : number

The `daysInWeek` read-only property gives the number of days in the week that the date falls in.
For the ISO 8601 calendar, this is always 7, but in other calendar systems it may differ from week to week.

Usage example:

```javascript
date = Temporal.PlainDate.from('2006-08-24');
date.daysInWeek; // => 7
```

### date.**daysInMonth** : number

The `daysInMonth` read-only property gives the number of days in the month that the date falls in.
For the ISO 8601 calendar, this is 28, 29, 30, or 31, depending on the month and whether the year is a leap year.

Usage example:

```javascript
// Attempt to write some mnemonic poetry
const monthsByDays = {};
for (let month = 1; month <= 12; month++) {
  const date = Temporal.now.plainDate().with({ month });
  monthsByDays[date.daysInMonth] = (monthsByDays[date.daysInMonth] || []).concat(date);
}

const strings = monthsByDays[30].map((date) => date.toLocaleString('en', { month: 'long' }));
// Shuffle to improve poem as determined empirically
strings.unshift(strings.pop());
const format = new Intl.ListFormat('en');
const poem = `Thirty days hath ${format.format(strings)}`;

console.log(poem);
```

### date.**daysInYear** : number

The `daysInYear` read-only property gives the number of days in the year that the date falls in.
For the ISO 8601 calendar, this is 365 or 366, depending on whether the year is a leap year.

Usage example:

```javascript
date = Temporal.now.plainDate();
percent = date.dayOfYear / date.daysInYear;
`The year is ${percent.toLocaleString('en', { style: 'percent' })} over!`;
// example output: "The year is 10% over!"
```

### date.**monthsInYear**: number

The `monthsInYear` read-only property gives the number of months in the year that the date falls in.
For the ISO 8601 calendar, this is always 12, but in other calendar systems it may differ from year to year.

Usage example:

```javascript
date = Temporal.PlainDate.from('1900-01-01');
date.monthsInYear; // => 12
```

### date.**inLeapYear** : boolean

The `inLeapYear` read-only property tells whether the year that the date falls in is a leap year or not.
Its value is `true` if the year is a leap year, and `false` if not.

Usage example:

```javascript
// Is this year a leap year?
date = Temporal.now.plainDate();
date.inLeapYear; // example output: true
// Is 2100 a leap year? (no, because it's divisible by 100 and not 400)
date.with({ year: 2100 }).inLeapYear; // => false
```

## Methods

### date.**with**(_dateLike_: object | string, _options_?: object) : Temporal.PlainDate

**Parameters:**

- `dateLike` (object or string): an object with some or all of the properties of a `Temporal.PlainDate`, or an ISO string.
- `options` (optional object): An object with properties representing options for the operation.
  The following options are recognized:
  - `overflow` (string): How to deal with out-of-range values.
    Allowed values are `constrain` and `reject`.
    The default is `constrain`.

**Returns:** a new `Temporal.PlainDate` object.

This method creates a new `Temporal.PlainDate` which is a copy of `date`, but any properties present on `dateLike` override the ones already present on `date`.

If `dateLike` is a string, then it will be attempted to be converted into a `Temporal.PlainDate`.
(In this case the result is the same as `Temporal.PlainDate.from(dateLike)`.)

Since `Temporal.PlainDate` objects are immutable, use this method instead of modifying one.

If the result is earlier or later than the range of dates that `Temporal.PlainDate` can represent (approximately half a million years centered on the [Unix epoch](https://en.wikipedia.org/wiki/Unix_time)), then this method will throw a `RangeError` regardless of `overflow`.

> **NOTE**: The allowed values for the `dateLike.month` property start at 1, which is different from legacy `Date` where months are represented by zero-based indices (0 to 11).

> **NOTE**: If a `calendar` property is provided on `dateLike`, the new calendar is applied first, before any of the other properties.
> If you are passing in an object with _only_ a `calendar` property, it is recommended to use the `withCalendar` method instead.

Usage example:

```javascript
date = Temporal.PlainDate.from('2006-01-24');
// What's the first day of this month?
date.with({ day: 1 }); // => 2006-01-01
// What's the last day of the next month?
date.add({ months: 1 }).with({ day: date.daysInMonth }); // => 2006-02-28
// Temporal.PlainYearMonth and Temporal.PlainMonthDay also have some of the
// properties of Temporal.PlainDate:
yearMonth = Temporal.PlainYearMonth.from('2018-04');
date.with(yearMonth); // => 2018-04-24
monthDay = Temporal.PlainMonthDay.from('02-29');
date.with(monthDay); // => 2006-02-28
```

### date.**withCalendar**(_calendar_: object | string) : Temporal.PlainDate

**Parameters:**

- `calendar` (`Temporal.Calendar` or plain object or string): The calendar into which to project `date`.

**Returns:** a new `Temporal.PlainDate` object which is the date indicated by `date`, projected into `calendar`.

This method is the same as `date.with({ calendar })`, but may be more efficient.

Usage example:

```javascript
date = Temporal.PlainDate.from('2006-08-24[c=japanese]');
date.withCalendar('iso8601'); // => 2006-08-24
```

### date.**add**(_duration_: Temporal.Duration | object | string, _options_?: object) : Temporal.PlainDate

**Parameters:**

- `duration` (`Temporal.Duration` or value convertible to one): The duration to add.
- `options` (optional object): An object with properties representing options for the addition.
  The following options are recognized:
  - `overflow` (optional string): How to deal with additions that result in out-of-range values.
    Allowed values are `constrain` and `reject`.
    The default is `constrain`.

**Returns:** a new `Temporal.PlainDate` object which is the date indicated by `date` plus `duration`.

This method adds `duration` to `date`, returning a date that is in the future relative to `date`.

The `duration` argument is an object with properties denoting a duration, such as `{ days: 5 }`, or a string such as `P5D`, or a `Temporal.Duration` object.
If `duration` is not a `Temporal.Duration` object, then it will be converted to one as if it were passed to `Temporal.Duration.from()`.

Some additions may be ambiguous, because months have different lengths.
For example, adding one month to August 31 would result in September 31, which doesn't exist.
For these cases, the `overflow` option tells what to do:

- In `constrain` mode (the default), out-of-range values are clamped to the nearest in-range value.
- In `reject` mode, an addition that would result in an out-of-range value fails, and a `RangeError` is thrown.

Additionally, if the result is earlier or later than the range of dates that `Temporal.PlainDate` can represent (approximately half a million years centered on the [Unix epoch](https://en.wikipedia.org/wiki/Unix_time)), then this method will throw a `RangeError` regardless of `overflow`.

Adding a negative duration is equivalent to subtracting the absolute value of that duration.

Usage example:

```javascript
date = Temporal.PlainDate.from('2006-08-24');
date.add({ years: 20, months: 4 }); // => 2026-12-24

date = Temporal.PlainDate.from('2019-01-31');
date.add({ months: 1 }); // => 2019-02-28
date.add({ months: 1 }, { overflow: 'reject' }); // => throws
```

### date.**subtract**(_duration_: Temporal.Duration | object | string, _options_?: object) : Temporal.PlainDate

**Parameters:**

- `duration` (`Temporal.Duration` or value convertible to one): The duration to subtract.
- `options` (optional object): An object with properties representing options for the subtraction.
  The following options are recognized:
  - `overflow` (string): How to deal with subtractions that result in out-of-range values.
    Allowed values are `constrain` and `reject`.
    The default is `constrain`.

**Returns:** a new `Temporal.PlainDate` object which is the date indicated by `date` minus `duration`.

This method subtracts `duration` from `date`, returning a date that is in the past relative to `date`.

The `duration` argument is an object with properties denoting a duration, such as `{ days: 5 }`, or a string such as `P5D`, or a `Temporal.Duration` object.
If `duration` is not a `Temporal.Duration` object, then it will be converted to one as if it were passed to `Temporal.Duration.from()`.

Some subtractions may be ambiguous, because months have different lengths.
For example, subtracting one month from July 31 would result in June 31, which doesn't exist.
For these cases, the `overflow` option tells what to do:

- In `constrain` mode (the default), out-of-range values are clamped to the nearest in-range value.
- In `reject` mode, an addition that would result in an out-of-range value fails, and a `RangeError` is thrown.

Additionally, if the result is earlier or later than the range of dates that `Temporal.PlainDate` can represent (approximately half a million years centered on the [Unix epoch](https://en.wikipedia.org/wiki/Unix_time)), then this method will throw a `RangeError` regardless of `overflow`.

Subtracting a negative duration is equivalent to adding the absolute value of that duration.

Usage example:

```javascript
date = Temporal.PlainDate.from('2006-08-24');
date.subtract({ years: 20, months: 4 }); // => 1986-04-24

date = Temporal.PlainDate.from('2019-03-31');
date.subtract({ months: 1 }); // => 2019-02-28
date.subtract({ months: 1 }, { overflow: 'reject' }); // => throws
```

### date.**until**(_other_: Temporal.PlainDate | object | string, _options_?: object) : Temporal.Duration

**Parameters:**

- `other` (`Temporal.PlainDate` or value convertible to one): Another date until when to compute the difference.
- `options` (optional object): An object with properties representing options for the operation.
  The following options are recognized:
  - `largestUnit` (optional string): The largest unit of time to allow in the resulting `Temporal.Duration` object.
    Valid values are `'auto'`, `'years'`, `'months'`, `'weeks'`, and `'days'`.
    The default is `'auto'`.
  - `smallestUnit` (string): The smallest unit of time to round to in the resulting `Temporal.Duration` object.
    Valid values are `'years'`, `'months'`, `'weeks'`, `'days'`.
    The default is `'days'`, i.e., no rounding.
  - `roundingIncrement` (number): The granularity to round to, of the unit given by `smallestUnit`.
    The default is 1.
  - `roundingMode` (string): How to handle the remainder, if rounding.
    Valid values are `'nearest'`, `'ceil'`, `'trunc'`, and `'floor'`.
    The default is `'nearest'`.

**Returns:** a `Temporal.Duration` representing the time elapsed after `date` and until `other`.

This method computes the difference between the two dates represented by `date` and `other`, optionally rounds it, and returns it as a `Temporal.Duration` object.
If `other` is earlier than `date` then the resulting duration will be negative.

If `other` is not a `Temporal.PlainDate` object, then it will be converted to one as if it were passed to `Temporal.PlainDate.from()`.

The `largestUnit` option controls how the resulting duration is expressed.
The returned `Temporal.Duration` object will not have any nonzero fields that are larger than the unit in `largestUnit`.
A difference of two years will become 24 months when `largestUnit` is `"months"`, for example.
However, a difference of two months will still be two months even if `largestUnit` is `"years"`.
A value of `'auto'` means `'days'`, unless `smallestUnit` is `'years'`, `'months'`, or `'weeks'`, in which case `largestUnit` is equal to `smallestUnit`.

By default, the largest unit in the result is days.
This is because months and years can be different lengths depending on which month is meant and whether the year is a leap year.

You can round the result using the `smallestUnit`, `roundingIncrement`, and `roundingMode` options.
These behave as in the `Temporal.Duration.round()` method, but increments of days and larger are allowed.
Because rounding to calendar units requires a reference point, `date` is used as the starting point.
The default is to do no rounding.

Unlike other Temporal types, hours and lower are not allowed for either `largestUnit` or `smallestUnit`, because the data model of `Temporal.PlainDate` doesn't have that accuracy.

Computing the difference between two dates in different calendar systems is not supported.
If you need to do this, choose the calendar in which the computation takes place by converting one of the dates with `date.withCalendar()`.

Usage example:

<!-- prettier-ignore-start -->
```javascript
earlier = Temporal.PlainDate.from('2006-08-24');
later = Temporal.PlainDate.from('2019-01-31');
earlier.until(later);                           // => P4543D
earlier.until(later, { largestUnit: 'years' }); // => P12Y5M7D
later.until(earlier, { largestUnit: 'years' }); // => -P12Y5M7D

// If you really need to calculate the difference between two Dates in
// hours, you can eliminate the ambiguity by explicitly choosing the
// point in time from which you want to reckon the difference. For
// example, using noon:
noon = Temporal.PlainTime.from('12:00');
earlier.toPlainDateTime(noon).until(later.toPlainDateTime(noon), { largestUnit: 'hours' });
  // => PT109032H
```
<!-- prettier-ignore-end -->

### date.**since**(_other_: Temporal.PlainDate | object | string, _options_?: object) : Temporal.Duration

**Parameters:**

- `other` (`Temporal.PlainDate` or value convertible to one): Another date since when to compute the difference.
- `options` (optional object): An object with properties representing options for the operation.
  The following options are recognized:
  - `largestUnit` (optional string): The largest unit of time to allow in the resulting `Temporal.Duration` object.
    Valid values are `'auto'`, `'years'`, `'months'`, `'weeks'`, and `'days'`.
    The default is `'auto'`.
  - `smallestUnit` (string): The smallest unit of time to round to in the resulting `Temporal.Duration` object.
    Valid values are `'years'`, `'months'`, `'weeks'`, `'days'`.
    The default is `'days'`, i.e., no rounding.
  - `roundingIncrement` (number): The granularity to round to, of the unit given by `smallestUnit`.
    The default is 1.
  - `roundingMode` (string): How to handle the remainder, if rounding.
    Valid values are `'nearest'`, `'ceil'`, `'trunc'`, and `'floor'`.
    The default is `'nearest'`.

**Returns:** a `Temporal.Duration` representing the time elapsed before `date` and since `other`.

This method computes the difference between the two dates represented by `date` and `other`, optionally rounds it, and returns it as a `Temporal.Duration` object.
If `other` is later than `date` then the resulting duration will be negative.

This method does the same thing as the `Temporal.PlainDate.prototype.until()` method, but reversed, and rounding takes place relative to `date` as an ending point instead of a starting point.
With the default options, the outcome of `date1.since(date2)` is the same as `date1.until(date2).negated()`.

Usage example:

```javascript
earlier = Temporal.PlainDate.from('2006-08-24');
later = Temporal.PlainDate.from('2019-01-31');
later.since(earlier); // => P4543D
```

### date.**equals**(_other_: Temporal.PlainDate | object | string) : boolean

**Parameters:**

- `other` (`Temporal.PlainDate` or value convertible to one): Another date to compare.

**Returns:** `true` if `date` and `other` are equal, or `false` if not.

Compares two `Temporal.PlainDate` objects for equality.

This function exists because it's not possible to compare using `date == other` or `date === other`, due to ambiguity in the primitive representation and between Temporal types.

If you don't need to know the order in which the two dates occur, then this function may be less typing and more efficient than `Temporal.PlainDate.compare`.

Note that this function will return `true` if the two dates are equal, even if they are expressed in different calendar systems.

If `other` is not a `Temporal.PlainDate` object, then it will be converted to one as if it were passed to `Temporal.PlainDate.from()`.

Example usage:

```javascript
date = Temporal.PlainDate.from('2006-08-24');
other = Temporal.PlainDate.from('2019-01-31');
date.equals(other); // => false
date.equals(date); // => true
```

### date.**toString**(_options_?: object) : string

**Parameters:**

- `options` (optional object): An object with properties influencing the formatting.
  The following options are recognized:
  - `calendar` (string): Whether to show the calendar annotation in the return value.
    Valid values are `'auto'`, `'always'`, and `'never'`.
    The default is `'auto'`.

**Returns:** a string in the ISO 8601 date format representing `date`.

This method overrides the `Object.prototype.toString()` method and provides a convenient, unambiguous string representation of `date`.
The string can be passed to `Temporal.PlainDate.from()` to create a new `Temporal.PlainDate` object.

Normally, a calendar annotation is shown when `date`'s calendar is not the ISO 8601 calendar.
By setting the `calendar` option to `'always'` or `'never'` this can be overridden to always or never show the annotation, respectively.
For more information on the calendar annotation, see [ISO string extensions](./iso-string-ext.md#calendar-systems).

Example usage:

```js
date = Temporal.PlainDate.from('2006-08-24');
date.toString(); // => 2006-08-24
```

### date.**toLocaleString**(_locales_?: string | array&lt;string&gt;, _options_?: object) : string

**Parameters:**

- `locales` (optional string or array of strings): A string with a BCP 47 language tag with an optional Unicode extension key, or an array of such strings.
- `options` (optional object): An object with properties influencing the formatting.

**Returns:** a language-sensitive representation of `date`.

This method overrides `Object.prototype.toLocaleString()` to provide a human-readable, language-sensitive representation of `date`.

The `locales` and `options` arguments are the same as in the constructor to [`Intl.DateTimeFormat`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DateTimeFormat).

Example usage:

```js
date = Temporal.PlainDate.from('2006-08-24');
date.toLocaleString(); // => example output: 8/24/2006
date.toLocaleString('de-DE'); // => example output: 24.8.2006
date.toLocaleString('de-DE', { weekday: 'long' }); // => Donnerstag
date.toLocaleString('en-US-u-nu-fullwide'); // => ８/２４/２００６
```

### date.**toJSON**() : string

**Returns:** a string in the ISO 8601 date format representing `date`.

This method is the same as `date.toString()`.
It is usually not called directly, but it can be called automatically by `JSON.stringify()`.

The reverse operation, recovering a `Temporal.PlainDate` object from a string, is `Temporal.PlainDate.from()`, but it cannot be called automatically by `JSON.parse()`.
If you need to rebuild a `Temporal.PlainDate` object from a JSON string, then you need to know the names of the keys that should be interpreted as `Temporal.PlainDate`s.
In that case you can build a custom "reviver" function for your use case.

Example usage:

```js
const student = {
  id: 429,
  name: 'Emilia Connor',
  birthDate: Temporal.PlainDate.from('1997-09-08')
};
const str = JSON.stringify(student, null, 2);
console.log(str);
// =>
// {
//   "id": 429,
//   "name": "Emilia Connor",
//   "birthDate": "1997-09-08"
// }

// To rebuild from the string:
function reviver(key, value) {
  if (key.endsWith('Date')) return Temporal.PlainDate.from(value);
  return value;
}
JSON.parse(str, reviver);
```

### date.**valueOf**()

This method overrides `Object.prototype.valueOf()` and always throws an exception.
This is because it's not possible to compare `Temporal.PlainDate` objects with the relational operators `<`, `<=`, `>`, or `>=`.
Use `Temporal.PlainDate.compare()` for this, or `date.equals()` for equality.

### date.**toZonedDateTime**(_timeZone_: _timeZone_ : object | string, _time_?: Temporal.PlainTime | object | string, _options_?: object) : Temporal.ZonedDateTime

**Parameters:**

- `timeZone` (optional string or object): The time zone in which to interpret `date` and `time`, as a `Temporal.TimeZone` object, an object implementing the [time zone protocol](./timezone.md#protocol), or a string.
- `time` (optional `Temporal.PlainTime` or value convertible to one): A time of day on `date`.
- `options` (optional object): An object with properties representing options for the operation.
  The following options are recognized:
  - `disambiguation` (string): How to disambiguate if the date and time given by `date` and `time` does not exist in the time zone, or exists more than once.
    Allowed values are `'compatible'`, `'earlier'`, `'later'`, and `'reject'`.
    The default is `'compatible'`.

**Returns:** a `Temporal.ZonedDateTime` object that represents the wall-clock time `time` on the calendar date `date` projected into `timeZone`.

This method can be used to convert `Temporal.PlainDate` into a `Temporal.ZonedDateTime`, by supplying the time zone and time of day.
The default `time`, if it's not provided, is the first valid local time in `timeZone` on the calendar date `date`.
Usually this is midnight (`00:00`), but may be a different time in rare circumstances like DST starting at midnight or calendars like `ethiopic` where each day doesn't start at midnight.

For a list of IANA time zone names, see the current version of the [IANA time zone database](https://www.iana.org/time-zones).
A convenient list is also available [on Wikipedia](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones), although it might not reflect the latest official status.

In addition to the `timeZone`, the converted object carries a copy of all the relevant fields of `date` and `time`.
If `time` is given, this method is equivalent to [`Temporal.PlainTime.from(time).toZonedDateTime(date)`](./time.html#toZonedDateTime).

If `time` is given but is not a `Temporal.PlainTime` object, then it will be converted to one as if it were passed to `Temporal.PlainTime.from()`.

In the case of ambiguity caused by DST or other time zone changes, the `disambiguation` option controls how to resolve the ambiguity:

- `'compatible'` (the default): Acts like `'earlier'` for backward transitions and `'later'` for forward transitions.
- `'earlier'`: The earlier of two possible times.
- `'later'`: The later of two possible times.
- `'reject'`: Throw a `RangeError` instead.

When interoperating with existing code or services, `'compatible'` mode matches the behavior of legacy `Date` as well as libraries like moment.js, Luxon, and date-fns.
This mode also matches the behavior of cross-platform standards like [RFC 5545 (iCalendar)](https://tools.ietf.org/html/rfc5545).

During "skipped" clock time like the hour after DST starts in the Spring, this method interprets invalid times using the pre-transition time zone offset if `'compatible'` or `'later'` is used or the post-transition time zone offset if `'earlier'` is used.
This behavior avoids exceptions when converting non-existent date/time values to `Temporal.ZonedDateTime`, but it also means that values during these periods will result in a different `Temporal.PlainDate` value in "round-trip" conversions to `Temporal.ZonedDateTime` and back again.

For usage examples and a more complete explanation of how this disambiguation works and why it is necessary, see [Resolving ambiguity](./ambiguity.md).

If the result is earlier or later than the range that `Temporal.ZonedDateTime` can represent (approximately half a million years centered on the [Unix epoch](https://en.wikipedia.org/wiki/Unix_time)), then a `RangeError` will be thrown, no matter the value of `disambiguation`.

Usage example:

```javascript
date = Temporal.PlainDate.from('2006-08-24');
time = Temporal.PlainTime.from('15:23:30.003');
date.toZonedDateTime('America/Los_Angeles', time); // => 2006-08-24T15:23:30.003-07:00[America/Los_Angeles]
date.toZonedDateTime('America/Los_Angeles'); // => 2006-08-24T00:00-07:00[America/Los_Angeles]
```

### date.**toPlainDateTime**(_time_?: Temporal.PlainTime | object | string) : Temporal.PlainDateTime

**Parameters:**

- `time` (optional `Temporal.PlainTime` or value convertible to one): A time of day on `date`.

**Returns:** a `Temporal.PlainDateTime` object that represents the wall-clock time `time` on the calendar date `date`.

This method can be used to convert `Temporal.PlainDate` into a `Temporal.PlainDateTime`, by supplying the time of day to use.
The default `time`, if it is not given, is midnight (00:00).
The converted object carries a copy of all the relevant fields of `date` and `time`.

If `time` is given, this is equivalent to [`Temporal.PlainTime.from(time).toPlainDateTime(date)`](./time.html#toPlainDateTime).

If `time` is given and is not a `Temporal.PlainTime` object, then it will be converted to one as if it were passed to `Temporal.PlainTime.from()`.

Usage example:

```javascript
date = Temporal.PlainDate.from('2006-08-24');
time = Temporal.PlainTime.from('15:23:30.003');
date.toPlainDateTime(time); // => 2006-08-24T15:23:30.003
date.toPlainDateTime(); // => 2006-08-24T00:00
```

### date.**toPlainYearMonth**() : Temporal.PlainYearMonth

**Returns:** a `Temporal.PlainYearMonth` object that is the same as the year and month of `date`.

### date.**toPlainMonthDay**() : Temporal.PlainMonthDay

**Returns:** a `Temporal.PlainMonthDay` object that is the same as the month and day of `date`.

The above two methods can be used to convert `Temporal.PlainDate` into a `Temporal.PlainYearMonth` or `Temporal.PlainMonthDay` respectively.
The converted object carries a copy of all the relevant fields of `date` (for example, in `toPlainYearMonth()`, the `year` and `month` properties are copied.)

Usage example:

```javascript
date = Temporal.PlainDate.from('2006-08-24');
date.toPlainYearMonth(); // => 2006-08
date.toPlainMonthDay(); // => 08-24
```

### date.**getFields**() : { year: number, month: number, day: number, calendar: object, [propName: string]: unknown }

**Returns:** a plain object with properties equal to the fields of `date`.

This method can be used to convert a `Temporal.PlainDate` into a record-like data structure.
It returns a new plain JavaScript object, with all the fields as enumerable, writable, own data properties.

Note that if using a different calendar from ISO 8601, these will be the calendar-specific values and may include extra properties such as `era`.

> **NOTE**: The possible values for the `month` property of the returned object start at 1, which is different from legacy `Date` where months are represented by zero-based indices (0 to 11).

Usage example:

```javascript
date = Temporal.PlainDate.from('2006-08-24');
Object.assign({}, date).day; // => undefined
Object.assign({}, date.getFields()).day; // => 24
```

### date.**getISOFields**(): { isoYear: number, isoMonth: number, isoDay: number, calendar: object }

**Returns:** a plain object with properties expressing `date` in the ISO 8601 calendar, as well as the value of `date.calendar`.

This method is mainly useful if you are implementing a custom calendar.
Most code will not need to use it.
Use `date.getFields()` instead, or `date.withCalendar('iso8601').getFields()`.

Usage example:

```javascript
date = Temporal.PlainDate.from('2006-08-24');
f = date.getISOFields();
f.isoDay; // => 24
// Fields correspond exactly to constructor arguments:
date2 = new Temporal.PlainDate(f.isoYear, f.isoMonth, f.isoDay, f.calendar);
date.equals(date2); // => true

// Date in other calendar
date = date.withCalendar('hebrew');
date.getFields().day; // => 30
date.getISOFields().isoDay; // => 24

// Most likely what you need is this:
date.withCalendar('iso8601').day; // => 24
```
