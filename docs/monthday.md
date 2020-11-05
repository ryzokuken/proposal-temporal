# Temporal.PlainMonthDay

<details>
  <summary><strong>Table of Contents</strong></summary>
<!-- toc -->
</details>

A `Temporal.PlainMonthDay` represents a particular day on the calendar, but without a year.
For example, it could be used to represent a yearly recurring event, like "Bastille Day is on the 14th of July."

If you need to refer to a certain instance of a calendar event, in a particular year, use `Temporal.PlainDate` or even `Temporal.PlainDateTime`.
A `Temporal.PlainMonthDay` can be converted into a `Temporal.PlainDate` by combining it with a year, using the `toPlainDate()` method.

## Constructor

### **new Temporal.PlainMonthDay**(_isoMonth_: number, _isoDay_: number, _calendar_?: object, _referenceISOYear_?: number) : Temporal.PlainMonthDay

**Parameters:**
- `isoMonth` (number): A month, ranging between 1 and 12 inclusive.
- `isoDay` (number): A day of the month, ranging between 1 and 31 inclusive.
- `calendar` (optional `Temporal.Calendar` or plain object): A calendar to project the date into.
- `referenceISOYear` (optional number): A reference year, used for disambiguation when implementing other calendar systems.
  The default is the first leap year after the [Unix epoch](https://en.wikipedia.org/wiki/Unix_time).
  You can omit this parameter unless using a non-ISO-8601 calendar.

**Returns:** a new `Temporal.PlainMonthDay` object.

Use this constructor if you have the correct parameters for the date already as individual number values, or you are implementing a custom calendar.
Otherwise, `Temporal.PlainMonthDay.from()`, which accepts more kinds of input, allows inputting dates in different calendar reckonings, and allows controlling the overflow behaviour, is probably more convenient.

All values are given as reckoned in the [ISO 8601 calendar](https://en.wikipedia.org/wiki/ISO_8601#Dates).
Together, `referenceISOYear`, `isoMonth` and `isoDay` must represent a valid date in that calendar.
For example, February 29 (Leap day in the ISO 8601 calendar) is a valid value for `Temporal.PlainMonthDay`, even though that date does not occur every year, because the default value of `referenceISOYear` is a leap year.

> **NOTE**: The `isoMonth` argument ranges from 1 to 12, which is different from legacy `Date` where months are represented by zero-based indices (0 to 11).

Usage examples:
```javascript
// Pi day
md = new Temporal.PlainMonthDay(3, 14)  // => 03-14
// Leap day
md = new Temporal.PlainMonthDay(2, 29)  // => 02-29
```

## Static methods

### Temporal.PlainMonthDay.**from**(_thing_: any, _options_?: object) : Temporal.PlainMonthDay

**Parameters:**
- `thing`: The value representing the desired date.
- `options` (optional object): An object with properties representing options for constructing the date.
  The following options are recognized:
  - `overflow` (string): How to deal with out-of-range values in `thing`.
    Allowed values are `constrain` and `reject`.
    The default is `constrain`.

**Returns:** a new `Temporal.PlainMonthDay` object.

This static method creates a new `Temporal.PlainMonthDay` object from another value.
If the value is another `Temporal.PlainMonthDay` object, a new object representing the same month and day is returned.
If the value is any other object, it must have `month` and `day` properties, and optionally a `calendar` property, and a `Temporal.PlainMonthDay` will be constructed from these properties.

If the `calendar` property is not present, it will be assumed to be `Temporal.Calendar.from('iso8601')`, the [ISO 8601 calendar](https://en.wikipedia.org/wiki/ISO_8601#Dates).

Any non-object value will be converted to a string, which is expected to be in ISO 8601 format.
Any parts of the string other than the month and the day are optional and will be ignored.
If the string isn't valid according to ISO 8601, then a `RangeError` will be thrown regardless of the value of `overflow`.

The `overflow` option works as follows:
- In `constrain` mode (the default), any out-of-range values are clamped to the nearest in-range value.
- In `reject` mode, the presence of out-of-range values will cause the function to throw a `RangeError`.

> **NOTE**: The allowed values for the `thing.month` property start at 1, which is different from legacy `Date` where months are represented by zero-based indices (0 to 11).

Example usage:
```javascript
md = Temporal.PlainMonthDay.from('08-24');  // => 08-24
md = Temporal.PlainMonthDay.from('2006-08-24');  // => 08-24
md = Temporal.PlainMonthDay.from('2006-08-24T15:43:27');  // => 08-24
md = Temporal.PlainMonthDay.from('2006-08-24T15:43:27Z');  // => 08-24
md = Temporal.PlainMonthDay.from('2006-08-24T15:43:27+01:00[Europe/Brussels]');
  // => 08-24
md === Temporal.PlainMonthDay.from(md)  // => true

md = Temporal.PlainMonthDay.from({month: 8, day: 24});  // => 08-24
md = Temporal.PlainMonthDay.from(Temporal.PlainDate.from('2006-08-24'));
  // => same as above; Temporal.PlainDate has month and day properties

// Different overflow modes
md = Temporal.PlainMonthDay.from({ month: 13, day: 1 }, { overflow: 'constrain' })
  // => 12-01
md = Temporal.PlainMonthDay.from({ month: -1, day: 1 }, { overflow: 'constrain' })
  // => 01-01
md = Temporal.PlainMonthDay.from({ month: 13, day: 1 }, { overflow: 'reject' })
  // throws
md = Temporal.PlainMonthDay.from({ month: -1, day: 1 }, { overflow: 'reject' })
  // throws
```

## Properties

### monthDay.**month** : number

### monthDay.**day** : number

The above read-only properties allow accessing each component of the date individually.

> **NOTE**: The possible values for the `month` property start at 1, which is different from legacy `Date` where months are represented by zero-based indices (0 to 11).

Usage examples:
```javascript
md = Temporal.PlainMonthDay.from('08-24');
md.month  // => 8
md.day    // => 24
```

### monthDay.**calendar** : object

The `calendar` read-only property gives the calendar that the `month` and `day` properties are interpreted in.

## Methods

### monthDay.**with**(_monthDayLike_: object, _options_?: object) : Temporal.PlainMonthDay

**Parameters:**
- `monthDayLike` (object): an object with some or all of the properties of a `Temporal.PlainMonthDay`.
- `options` (optional object): An object with properties representing options for the operation.
  The following options are recognized:
  - `overflow` (string): How to deal with out-of-range values.
    Allowed values are `constrain` and `reject`.
    The default is `constrain`.

**Returns:** a new `Temporal.PlainMonthDay` object.

This method creates a new `Temporal.PlainMonthDay` which is a copy of `monthDay`, but any properties present on `monthDayLike` override the ones already present on `monthDay`.

The `overflow` option tells what should happen when out-of-range values are given or when the result would be an invalid month-day combination, such as "June 31":
- In `constrain` mode (the default), any out-of-range values are clamped to the nearest in-range value, so June 31 would become June 30.
- In `reject` mode, the presence of out-of-range values will cause the constructor to throw a `RangeError`.

> **NOTE:** For the purpose of this method, February is treated as having 29 days, so that it remains possible to construct a `Temporal.PlainMonthDay` for February 29.

> **NOTE**: The allowed values for the `monthDayLike.month` property start at 1, which is different from legacy `Date` where months are represented by zero-based indices (0 to 11).

Since `Temporal.PlainMonthDay` objects are immutable, use this method instead of modifying one.

> **NOTE**: Unlike in `Temporal.PlainDate.prototype.with()`, a `calendar` property is not allowed on `monthDayLike`.
> It is not possible to convert a `Temporal.PlainMonthDay` to another calendar system without knowing the year.
> If you need to do this, use `monthDay.toPlainDate({ year }).withCalendar(calendar).toPlainMonthDay()`.

Usage example:
```javascript
md = Temporal.PlainMonthDay.from('11-15');
// What's the last day of that month?
md.with({ day: 31 })  // => 11-30
Temporal.PlainMonthDay.from('02-01').with({ day: 31 });  // => 02-29
```

### monthDay.**equals**(_other_: Temporal.PlainMonthDay | object | string) : boolean

**Parameters:**
- `other` (`Temporal.PlainMonthDay` or value convertible to one): Another month-day to compare.

**Returns:** `true` if `monthDay` and `other` are equal, or `false` if not.

Compares two `Temporal.PlainMonthDay` objects for equality.

This function exists because it's not possible to compare using `monthDay == other` or `monthDay === other`, due to ambiguity in the primitive representation and between Temporal types.

Note that two `Temporal.PlainMonthDay`s expressed in different calendar systems can never be equal, because it's impossible to tell whether they fall on the same day without knowing the year.

If `other` is not a `Temporal.PlainMonthDay` object, then it will be converted to one as if it were passed to `Temporal.PlainMonthDay.from()`.

Example usage:
```javascript
dt1 = Temporal.PlainDateTime.from('1995-12-07T03:24:30.000003500');
dt2 = Temporal.PlainDateTime.from('2019-01-31T15:30');
dt1.equals(dt2)  // => false
dt1.equals(dt1)  // => true
```

### monthDay.**toString**() : string

**Parameters:**

- `options` (optional object): An object with properties influencing the formatting.
  The following options are recognized:
  - `calendar` (string): Whether to show the calendar annotation in the return value.
    Valid values are `'auto'`, `'always'`, and `'never'`.
    The default is `'auto'`.

**Returns:** a string in the ISO 8601 date format representing `monthDay`.

This method overrides the `Object.prototype.toString()` method and provides a convenient, unambiguous string representation of `monthDay`.
The string can be passed to `Temporal.PlainMonthDay.from()` to create a new `Temporal.PlainMonthDay` object.

Normally, a calendar annotation is shown when `monthDay`'s calendar is not the ISO 8601 calendar.
By setting the `calendar` option to `'always'` or `'never'` this can be overridden to always or never show the annotation, respectively.
For more information on the calendar annotation, see [ISO string extensions](./iso-string-ext.md#calendar-systems).

Example usage:
```js
md = Temporal.PlainMonthDay.from('08-24');
md.toString();  // => 08-24
```

### monthDay.**toLocaleString**(_locales_?: string | array&lt;string&gt;, _options_?: object) : string

**Parameters:**
- `locales` (optional string or array of strings): A string with a BCP 47 language tag with an optional Unicode extension key, or an array of such strings.
- `options` (optional object): An object with properties influencing the formatting.

**Returns:** a language-sensitive representation of `monthDay`.

This method overrides `Object.prototype.toLocaleString()` to provide a human-readable, language-sensitive representation of `monthDay`.

The `locales` and `options` arguments are the same as in the constructor to [`Intl.DateTimeFormat`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DateTimeFormat).

The calendar in the output locale (given by `new Intl.DateTimeFormat(locales, options).resolvedOptions().calendar`) must match `monthDay.calendar`, or this method will throw an exception.
This is because it's not possible to convert a Temporal.PlainMonthDay from one calendar to another without more information.
In order to ensure that the output always matches `monthDay`'s internal calendar, you must either explicitly construct `monthDay` with the locale's calendar, or explicitly specify the calendar in the `options` parameter:

```js
monthDay.toLocaleString(locales, { calendar: monthDay.calendar });

// OR

monthDay = Temporal.PlainMonthDay.from({ /* ... */, calendar: localeCalendar });
monthDay.toLocaleString();
```

Example usage:

```js
({ calendar } = new Intl.DateTimeFormat().resolvedOptions());
md = Temporal.PlainMonthDay.from({ month: 8, day: 24, calendar });
md.toLocaleString(); // => example output: 08-24
// Same as above, but explicitly specifying the calendar:
md.toLocaleString(undefined, { calendar });

md.toLocaleString('de-DE', { calendar });  // => example output: 24.8.
md.toLocaleString('de-DE', { month: 'long', day: 'numeric', calendar });  // => 24. August
md.toLocaleString(`en-US-u-nu-fullwide-u-ca-${calendar}`);  // => ８/２４
```

### monthDay.**toJSON**() : string

**Returns:** a string in the ISO 8601 date format representing `monthDay`.

This method is the same as `monthDay.toString()`.
It is usually not called directly, but it can be called automatically by `JSON.stringify()`.

The reverse operation, recovering a `Temporal.PlainMonthDay` object from a string, is `Temporal.PlainMonthDay.from()`, but it cannot be called automatically by `JSON.parse()`.
If you need to rebuild a `Temporal.PlainMonthDay` object from a JSON string, then you need to know the names of the keys that should be interpreted as `Temporal.PlainMonthDay`s.
In that case you can build a custom "reviver" function for your use case.

Example usage:
```js
const holiday = {
  name: 'Canada Day',
  holidayMonthDay: Temporal.PlainMonthDay.from({ month: 7, day: 1 }),
};
const str = JSON.stringify(holiday, null, 2);
console.log(str);
// =>
// {
//   "name": "Canada Day",
//   "holidayMonthDay": "07-01"
// }

// To rebuild from the string:
function reviver(key, value) {
  if (key.endsWith('MonthDay'))
    return Temporal.PlainMonthDay.from(value);
  return value;
}
JSON.parse(str, reviver);
```

### monthDay.**valueOf**()

This method overrides `Object.prototype.valueOf()` and always throws an exception.
This is because it's not possible to compare `Temporal.PlainMonthDay` objects with the relational operators `<`, `<=`, `>`, or `>=`.
Instead, use `monthDay.equals()` to check for equality.

### monthDay.**toPlainDate**(_year_: object, _options_?: object) : Temporal.PlainDate

**Parameters:**
- `year` (object): An object with a `'year'` property, which must have a day corresponding to `monthDay`.
- `options` (optional object): An object with properties representing options for the operation.
  The following options are recognized:
  - `overflow` (string): How to deal with out-of-range values.
    Allowed values are `constrain` and `reject`.
    The default is `constrain`.

**Returns:** a `Temporal.PlainDate` object that represents the calendar date of `monthDay` in `year`.

This method can be used to convert `Temporal.PlainMonthDay` into a `Temporal.PlainDate`, by supplying a year to use.
The converted object carries a copy of all the relevant fields of `monthDay`.

Usage example:
```javascript
md = Temporal.PlainMonthDay.from('08-24');
md.toPlainDate({ year: 2017 })  // => 2017-08-24

md = Temporal.PlainMonthDay.from('02-29');
md.toPlainDate({ year: 2020 })  // => 2020-02-29
md.toPlainDate({ year: 2017 })  // => 2017-02-28
md.toPlainDate({ year: 2017 }, { overflow: 'reject' })  // throws
```

In calendars where more information than just the year is needed to convert a `Temporal.PlainMonthDay` to a `Temporal.PlainDate`, you can pass the necessary properties in the _year_ object.

Example:
```javascript
md = Temporal.PlainMonthDay.from({
  calendar: 'japanese',
  month: 1,
  day: 1
});

date = md.toPlainDate({ era: 'reiwa', year: 2 });
```

### monthDay.**getFields**() : { month: number, day: number, calendar: object, [propName: string]: unknown }

**Returns:** a plain object with properties equal to the fields of `monthDay`.

This method can be used to convert a `Temporal.PlainMonthDay` into a record-like data structure.
It returns a new plain JavaScript object, with all the fields as enumerable, writable, own data properties.

Note that if using a different calendar from ISO 8601, these will be the calendar-specific values and may include extra properties.

> **NOTE**: The possible values for the `month` property of the returned object start at 1, which is different from legacy `Date` where months are represented by zero-based indices (0 to 11).

Usage example:
```javascript
md = Temporal.PlainMonthDay.from('08-24');
Object.assign({}, md).day  // => undefined
Object.assign({}, md.getFields()).day  // => 24
```

### monthDay.**getISOFields**(): { isoYear: number, isoMonth: number, isoDay: number, calendar: object }

**Returns:** a plain object with properties expressing `monthDay` in the ISO 8601 calendar, as well as the value of `monthDay.calendar`.

This method is mainly useful if you are implementing a custom calendar.
Most code will not need to use it.
Use `monthDay.getFields()` instead.

The value of the `isoYear` property will be equal to the `referenceISOYear` constructor argument passed when `monthDay` was constructed.

Usage example:
```javascript
md = Temporal.PlainMonthDay.from('08-24');
md.getISOFields().isoDay  // => 24
```
