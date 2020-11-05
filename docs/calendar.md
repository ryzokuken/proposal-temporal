# Temporal.Calendar

<details>
  <summary><strong>Table of Contents</strong></summary>
<!-- toc -->
</details>

A `Temporal.Calendar` is a representation of a calendar system.
It includes information about how many days are in each year, how many months are in each year, how many days are in each month, and how to do arithmetic in that calendar system.

Much of the world uses the [Gregorian calendar](https://en.wikipedia.org/wiki/Gregorian_calendar), which was invented in 1582 C.E.
On the modern Internet, the most often used calendar system is the calendar standardized by ISO 8601, which is the same as the Gregorian calendar with the addition of week-numbering rules.
In general it is extended backwards ("proleptically") to cover the period of history before its invention, which is an optional modification allowed by the ISO 8601 standard.

However, the ISO 8601 calendar is not the only calendar in common use in the world.
Some places use another calendar system as the main calendar, or have a separate calendar system as a commonly-used civil or religious calendar.

> **NOTE:** The Temporal polyfill currently only includes the ISO 8601 calendar, but the Temporal proposal will eventually provide all the calendars supported by Intl.
> See [issue #541](https://github.com/tc39/proposal-temporal/issues/541).

### When to use the `Temporal.Calendar`

It is best practice to specify a calendar system when performing calendar-sensitive operations, which are those involving arithmetic or other calculation in months or years.

For example, to add a month to a date in the Hebrew calendar:
```javascript
date.withCalendar('hebrew').add({ months: 1 })
```

Temporal types' `toLocaleString()` methods use the user's preferred calendar, without needing to call `withCalendar()`.
To perform arithmetic consistently with the `toLocaleString()` calendar system:

```javascript
const calendar = new Intl.DateTimeFormat().resolvedOptions().calendar;
date.withCalendar(calendar).add({ months: 1 })
```

### Custom calendars

For specialized applications where you need to do calculations in a calendar system that is not supported by Intl, you can implement a custom calendar.
There are two ways to do this.

The recommended way is to create a class inheriting from `Temporal.Calendar`, call `super()` in the constructor with a calendar identifier string, and implement all the members except `id`, `toString()`, and `fields()`, which are optional.
If you don't implement the optional members, then the base class's default implementations will be used.

The other, more difficult, way to create a custom calendar is to create a plain object implementing the `Temporal.Calendar` protocol, without subclassing.
The object must implement all of the `Temporal.Calendar` methods except for `fields()`.
Any object with the required methods will return the correct output from any Temporal property or method.
However, most other code will assume that custom calendars act like built-in `Temporal.Calendar` objects.
To interoperate with libraries or other code that you didn't write, then you should implement the `id` property and the `fields()` method as well.
Your object must not have a `calendar` property, so that it can be distinguished in `Temporal.Calendar.from()` from other Temporal objects that have a calendar.

The identifier of a custom calendar must consist of one or more components of between 3 and 8 ASCII alphanumeric characters each, separated by dashes, as described in [Unicode Technical Standard 35](https://unicode.org/reports/tr35/tr35.html#Unicode_locale_identifier).

## Constructor

### **new Temporal.Calendar**(_calendarIdentifier_: string) : Temporal.Calendar

**Parameters:**
- `calendarIdentifier` (string): An identifier for the calendar.

**Returns:** a new `Temporal.Calendar` object.

For a list of calendar identifiers, see the documentation for [Intl.DateTimeFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat#Parameters).
If `calendarIdentifier` is not a built-in calendar, then a `RangeError` is thrown.

Use this constructor directly if you have a string that is known to be a correct built-in calendar identifier.
If you have an ISO 8601 date-time string with a `[c=identifier]` annotation, then `Temporal.Calendar.from()` is more convenient than parsing the identifier out of the string, and also the only way to parse strings annotated with a non-built-in calendar.

Example usage:
```javascript
cal = new Temporal.Calendar('iso8601');
cal = new Temporal.Calendar('gregory');
/*⚠️*/ cal = new Temporal.Calendar('discordian');  // not a built-in calendar, throws
```

## Static methods

### Temporal.Calendar.**from**(_thing_: any) : Temporal.Calendar

**Parameters:**
- `thing`: A calendar object, a Temporal object that carries a calendar, or a value from which to create a `Temporal.Calendar`.

**Returns:** a calendar object.

This static method creates a new calendar from another value.
If the value is another `Temporal.Calendar` object, or object implementing the calendar protocol, the same object is returned.
If the value is another Temporal object that carries a calendar or an object with a `calendar` property, such as a `Temporal.ZonedDateTime`, the object's calendar is returned.

Any other value is converted to a string, which is expected to be either:
- a string that is accepted by `new Temporal.Calendar()`; or
- a string in the ISO 8601 format.

Note that the ISO 8601 string can be extended with a `[c=identifier]` annotation in square brackets appended to it.
Without such an annotation, the calendar is taken to be `iso8601`.

This function is often more convenient to use than `new Temporal.Calendar()` because it handles a wider range of input.

Usage examples:
```javascript
// Calendar names
cal = Temporal.Calendar.from('iso8601');
cal = Temporal.Calendar.from('gregory');

// ISO 8601 string with or without calendar annotation
cal = Temporal.Calendar.from('2020-01-13T16:31:00.065858086');
cal = Temporal.Calendar.from('2020-01-13T16:31:00.065858086-08:00[America/Vancouver][c=iso8601]');

// Existing calendar object
cal2 = Temporal.Calendar.from(cal);

// Custom calendar that is a plain object (this calendar does not do much)
cal = Temporal.Calendar.from({id: 'mycalendar'});

/*⚠️*/ cal = Temporal.Calendar.from('discordian');  // not a built-in calendar, throws
/*⚠️*/ cal = Temporal.Calendar.from('[c=iso8601]');  // lone annotation not a valid ISO 8601 string
```

## Properties

### calendar.**id** : string

The `id` property gives an unambiguous identifier for the calendar.
Effectively, this is whatever `calendarIdentifier` was passed as a parameter to the constructor.

When subclassing `Temporal.Calendar`, this property doesn't need to be overridden because the default implementation gives the result of calling `toString()`.

## Methods

### calendar.**year**(_date_: Temporal.PlainDate | Temporal.PlainDateTime | Temporal.ZonedDateTime | Temporal.PlainYearMonth | object | string) : number

### calendar.**month**(_date_: Temporal.PlainDate | Temporal.PlainDateTime | Temporal.ZonedDateTime | Temporal.PlainYearMonth | Temporal.PlainMonthDay | object | string) : number

### calendar.**day**(_date_: Temporal.PlainDate | Temporal.PlainDateTime | Temporal.ZonedDateTime | Temporal.PlainMonthDay | object | string) : number



### calendar.**dayOfWeek**(_date_: Temporal.PlainDate | Temporal.PlainDateTime | Temporal.ZonedDateTime | object | string): number

### calendar.**dayOfYear**(_date_: Temporal.PlainDate | Temporal.PlainDateTime | Temporal.ZonedDateTime | object | string): number

### calendar.**weekOfYear**(_date_: Temporal.PlainDate | Temporal.PlainDateTime | Temporal.ZonedDateTime | object | string): number

### calendar.**daysInWeek**(_date_: Temporal.PlainDate | Temporal.PlainDateTime | Temporal.ZonedDateTime | object | string): number

### calendar.**daysInMonth**(_date_: Temporal.PlainDate | Temporal.PlainDateTime | Temporal.ZonedDateTime | Temporal.PlainYearMonth | object | string): number

### calendar.**daysInYear**(_date_: Temporal.PlainDate | Temporal.PlainDateTime | Temporal.ZonedDateTime | Temporal.PlainYearMonth | object | string): number

### calendar.**monthsInYear**(_date_: Temporal.PlainDate | Temporal.PlainDateTime | Temporal.ZonedDateTime | Temporal.PlainYearMonth | object | string): number

### calendar.**inLeapYear**(_date_: Temporal.PlainDate | Temporal.PlainDateTime | Temporal.ZonedDateTime | Temporal.PlainYearMonth | object | string): boolean

The above methods are all similar.
They provide a way to query properties of a particular date in the calendar's date reckoning.

**Parameters:**
- `date` (`Temporal.PlainDate`, or value convertible to one): A date.

**Returns:** some piece of data (year, month, day, etc., depending on the method) associated with `date`, in `calendar`'s calendar system.

If `date` is not one of the appropriate Temporal objects, then it will be converted to a `Temporal.PlainDate` as if it were passed to `Temporal.PlainDate.from()`.

None of the above methods need to be called directly except in specialized code.
They are called indirectly when reading the various properties of `Temporal.ZonedDateTime`, `Temporal.PlainDateTime`, `Temporal.PlainDate`, `Temporal.PlainMonthDay`, or `Temporal.PlainYearMonth`.

For example:
```javascript
const date = Temporal.PlainDate.from('2020-05-29').withCalendar('hebrew');
date.year  // => 5780
date.calendar.year(date)  // same result, but calling the method directly
date.daysInYear  // => 355
date.calendar.daysInYear(date)  // same result, but calling the method directly
```

### calendar.**hour**(_time_: Temporal.PlainTime | Temporal.PlainDateTime | Temporal.ZonedDateTime | object | string) : number

### calendar.**minute**(_time_: Temporal.PlainTime | Temporal.PlainDateTime | Temporal.ZonedDateTime | object | string) : number

### calendar.**second**(_time_: Temporal.PlainTime | Temporal.PlainDateTime | Temporal.ZonedDateTime | object | string) : number

### calendar.**millisecond**(_time_: Temporal.PlainTime | Temporal.PlainDateTime | Temporal.ZonedDateTime | object | string) : number

### calendar.**microsecond**(_time_: Temporal.PlainTime | Temporal.PlainDateTime | Temporal.ZonedDateTime | object | string) : number

### calendar.**nanosecond**(_time_: Temporal.PlainTime | Temporal.PlainDateTime | Temporal.ZonedDateTime | object | string) : number

The above methods are all similar.
They provide a way to query properties of a particular time in the calendar's time reckoning.

**Parameters:**
- `time` (`Temporal.PlainTime`, or value convertible to one): A time.

**Returns:** some piece of data (hour, minute, second, etc., depending on the method) associated with `time`, in `calendar`'s calendar system.

If `time` is not one of the appropriate Temporal objects, then it will be converted to a `Temporal.PlainTime` as if it were passed to `Temporal.PlainTime.from()`.

None of the above methods need to be called directly except in specialized code.
They are called indirectly when reading the various properties of `Temporal.ZonedDateTime`, `Temporal.PlainDateTime`, `Temporal.PlainTime`.

For example:
```javascript
const time = Temporal.PlainTime.from('03:20:00').withCalendar('ethiopic');
time.hour  // => 9
time.calendar.hour(time)  // same result, but calling the method directly
```


### calendar.**dateFromFields**(_fields_: object, _options_: object, _constructor_: function) : Temporal.PlainDate

### calendar.**timeFromFields**(_fields_: object, _options_: object, _constructor_: function) : Temporal.PlainTime

### calendar.**yearMonthFromFields**(_fields_: object, _options_: object, _constructor_: function) : Temporal.PlainYearMonth

### calendar.**monthDayFromFields**(_fields_: object, _options_: object, _constructor_: function) : Temporal.PlainMonthDay

The above three methods are similar.
They provide a way to construct other Temporal objects from values in the calendar's date or time reckoning.

**Parameters:**
- `fields` (object): An object with properties similar to what is passed to `Temporal.PlainDate.from()`, `Temporal.PlainTime.from()`, `Temporal.PlainYearMonth.from()`, or `Temporal.PlainMonthDay.from()`, respectively.
- `options`: (object): An object with properties representing options for constructing the Temporal object.
  The following options are recognized:
  - `overflow` (string): How to deal with out-of-range values in `fields`.
    Allowed values are `constrain`, `balance`, and `reject`.
    The default is `constrain`.
- `constructor` (function): The constructor function of the Temporal type to construct.
  This is used when subclassing Temporal objects.

**Returns:** a new object of the type of `constructor`.

None of the above methods need to be called directly except in specialized code.
They are called indirectly when using `Temporal.PlainDate.from()`, `Temporal.PlainTime.from()`, `Temporal.PlainDateTime.from()`, `Temporal.PlainYearMonth.from()`, and `Temporal.PlainMonthDay.from()`.

For example:
```javascript
date = Temporal.PlainDate.from(
    { year: 5780, month: 9, day: 6, calendar: 'hebrew' },
    { overflow: 'reject' }
);
date.year        // => 5780
date.month       // => 9
date.day         // => 6
date.toString()  // => 2020-05-29[c=hebrew]

// same result, but calling the method directly:
date = Temporal.Calendar.from('hebrew').dateFromFields(
    { year: 5780, month: 9, day: 6 },
    { overflow: 'reject' },
    Temporal.PlainDate
);
date.year        // => 5780
date.month       // => 9
date.day         // => 6
date.toString()  // => 2020-05-29[c=hebrew]
```

### calendar.**dateAdd**(_date_: Temporal.PlainDate | object | string, _duration_: Temporal.Duration | object | string, _options_: object, _constructor_: function) : Temporal.PlainDate

### calendar.**dateSubtract**(_date_: Temporal.PlainDate | object | string, _duration_: Temporal.Duration | object | string, _options_: object, _constructor_: function) : Temporal.PlainDate

The above two methods are similar.
They provide a way to do date arithmetic in the calendar's date reckoning.

**Parameters:**
- `date` (`Temporal.PlainDate`, or value convertible to one): A date.
- `duration` (`Temporal.Duration`, or value convertible to one): A duration to add or subtract from `date`.
- `options` (object): An object with properties representing options for performing the addition or subtraction.
  The following options are recognized:
  - `overflow` (string): How to deal with out-of-range values in the result of the addition or subtraction.
    Allowed values are `constrain` and `reject`.
    The default is `constrain`.
- `constructor` (function): The constructor function of the Temporal type to construct.
  This is used when subclassing Temporal objects.

**Returns:** a new object of the type of `constructor`.

If `date` is not a `Temporal.PlainDate` object, or `duration` not a `Temporal.Duration` object, then they will be converted to one as if they were passed to `Temporal.PlainDate.from()` or `Temporal.Duration.from()`, respectively.

Neither of the above methods need to be called directly except in specialized code.
They are called indirectly when using the `add()` and `subtract()` methods, respectively, of `Temporal.PlainDateTime`, `Temporal.PlainDate`, and `Temporal.PlainYearMonth`.

For example:
```javascript
date = Temporal.PlainDate.from('2020-05-29').withCalendar('islamic').add(
    Temporal.Duration.from({ months: 1 }),
    { overflow: 'reject' }
);
date.year        // => 1441
date.month       // => 11
date.day         // => 7
date.toString()  // => 2020-06-28[c=islamic]

// same result, but calling the method directly:
date = Temporal.Calendar.from('islamic').dateAdd(
    Temporal.PlainDate.from('2020-05-29'),
    Temporal.Duration.from({ months: 1 }),
    { overflow: 'reject' },
    Temporal.PlainDate
);
date.year        // => 1441
date.month       // => 11
date.day         // => 7
date.toString()  // => 2020-06-28[c=islamic]
```

### calendar.**timeAdd**(_time_: Temporal.PlainTime | object | string, _duration_: Temporal.Duration | object | string, _options_: object, _constructor_: function) : Temporal.PlainDate

### calendar.**timeSubtract**(_time_: Temporal.PlainTime | object | string, _duration_: Temporal.Duration | object | string, _options_: object, _constructor_: function) : Temporal.PlainDate

The above two methods are similar.
They provide a way to do time arithmetic in the calendar's time reckoning.

**Parameters:**
- `time` (`Temporal.PlainTime`, or value convertible to one): A time.
- `duration` (`Temporal.Duration`, or value convertible to one): A duration to add or subtract from `time`.
- `options` (object): An object with properties representing options for performing the addition or subtraction.
  The following options are recognized:
  - `overflow` (string): How to deal with out-of-range values in the result of the addition or subtraction.
    Allowed values are `constrain` and `reject`.
    The default is `constrain`.
- `constructor` (function): The constructor function of the Temporal type to construct.
  This is used when subclassing Temporal objects.

**Returns:** a new object of the type of `constructor`.

If `time` is not a `Temporal.PlainTime` object, or `duration` not a `Temporal.Duration` object, then they will be converted to one as if they were passed to `Temporal.PlainTime.from()` or `Temporal.Duration.from()`, respectively.

Neither of the above methods need to be called directly except in specialized code.
They are called indirectly when using the `add()` and `subtract()` methods, respectively, of `Temporal.PlainDateTime`, and `Temporal.PlainTime`.

For example:
```javascript
time = Temporal.PlainTime.from('03:20:00').withCalendar('ethiopic').add(
    Temporal.Duration.from({ minutes: 1 }),
    { overflow: 'reject' }
);
time.hour       // => 9
time.minute     // => 21
time.second     // => 0
time.toString() // => 03:21:00[c=ethiopic]

// same result, but calling the method directly:
time = Temporal.Calendar.from('ethiopic').timeAdd(
    Temporal.PlainTime.from('03:20:00'),
    Temporal.Duration.from({ minutes: 1 }),
    { overflow: 'reject' },
    Temporal.PlainTime
);
time.hour       // => 9
time.minute     // => 21
time.second     // => 0
time.toString() // => 03:20:00[c=ethiopic]
```

### calendar.**dateUntil**(_one_: Temporal.PlainDate | object | string, _two_: Temporal.PlainDate | object | string, _options_: object) : Temporal.Duration

**Parameters:**
- `one` (`Temporal.PlainDate`, or value convertible to one): A date.
- `two` (`Temporal.PlainDate`, or value convertible to one): Another date.
- `options` (object): An object with properties representing options for the operation.
  The following options are recognized:
  - `largestUnit` (optional string): The largest unit of time to allow in the resulting `Temporal.Duration` object.
    Valid values are `'auto'`, `'years'`, `'months'`, and `'days'`.
    The default is `'auto'`.

**Returns:** a `Temporal.Duration` representing the time elapsed after `one` and until `two`.

If either of `one` or `two` are not `Temporal.PlainDate` objects, then they will be converted to one as if they were passed to `Temporal.PlainDate.from()`.

This method does not need to be called directly except in specialized code.
It is called indirectly when using the `until()` and `since()` methods of `Temporal.PlainDateTime`, `Temporal.PlainDate`, and `Temporal.PlainYearMonth`.

If `one` is later than `two`, then the resulting duration should be negative.

The default `largestUnit` value of `'auto'` is the same as `'days'`.

For example:
```javascript
d1 = Temporal.PlainDate.from('2020-07-29').withCalendar('chinese');
d2 = Temporal.PlainDate.from('2020-08-29').withCalendar('chinese');
d1.until(d2, { largestUnit: 'months' })  // => P1M2D

// same result, but calling the method directly:
Temporal.Calendar.from('chinese').dateUntil(
    Temporal.PlainDate.from('2020-07-29'),
    Temporal.PlainDate.from('2020-08-29'),
    { largestUnit: 'months' }
)  // => P1M2D
```

### calendar.**timeUntil**(_one_: Temporal.PlainTime | object | string, _two_: Temporal.PlainTime | object | string, _options_: object) : Temporal.Duration

**Parameters:**
- `one` (`Temporal.PlainTime`, or value convertible to one): A time.
- `two` (`Temporal.PlainTime`, or value convertible to one): Another time.
- `options` (object): An object with properties representing options for the operation.
  The following options are recognized:
  - `largestUnit` (optional string): The largest unit of time to allow in the resulting `Temporal.Duration` object.
    Valid values are `'auto'`, `'hours'`, `'minutes'`, `'seconds'`, `'milliseconds'`, `microseconds'` and `'nanoseconds'`.
    The default is `'auto'`.

**Returns:** a `Temporal.Duration` representing the time elapsed after `one` and until `two`.

If either of `one` or `two` are not `Temporal.PlainTime` objects, then they will be converted to one as if they were passed to `Temporal.PlainTime.from()`.

This method does not need to be called directly except in specialized code.
It is called indirectly when using the `until()` and `since()` methods of `Temporal.PlainDateTime`, and `Temporal.PlainTime`.

If `one` is later than `two`, then the resulting duration should be negative.

The default `largestUnit` value of `'auto'` is the same as `'hours'`.

For example:
```javascript
t1 = Temporal.PlainTime.from('03:10:00').withCalendar('ethiopic');
t2 = Temporal.PlainTime.from('03:30:00').withCalendar('ethiopic');
t1.until(t2, { largestUnit: 'minutes' })  // => PT20M

// same result, but calling the method directly:
Temporal.Calendar.from('ethiopic').timeUntil(
    Temporal.PlainTime.from('03:10:00'),
    Temporal.PlainTime.from('03:30:00'),
    { largestUnit: 'minutes' }
)  // => PT20M
```

### calendar.**fields**(fields: array<string>) : array<string>

**Parameters:**

- `fields` (array of strings): A list of field names.

**Returns:** a new list of field names.

This method does not need to be called directly except in specialized code.
It is called indirectly when using the `from()` static methods and `with()` methods of `Temporal.PlainDateTime`, `Temporal.PlainDate`, `Temporal.PlainTime`, and `Temporal.PlainYearMonth`.

Custom calendars should override this method if they require more fields with which to denote the date than the standard `year`, `month`, `day`, `hour`, `minute`, `second`, `millisecond`, `microsecond`, and `nanosecond` (for example, `era`).
The input array contains the field names that are necessary for a particular operation (for example, `'month'` and `'day'` for `Temporal.PlainMonthDay.prototype.with()`), and the method should make a copy of the array and add whichever extra fields are necessary.

When subclassing `Temporal.Calendar`, this method doesn't need to be overridden, unless your calendar requires extra fields, because the default implementation returns a copy of `fields`.

Usage example:

```js
// In built-in calendars, this method just makes a copy of the input array
Temporal.Calendar.from('iso8601').fields(['month', 'day']);
  // => ['month', 'day']
```

### calendar.**toString**() : string

**Returns:** The string given by `calendar.id`.

This method overrides `Object.prototype.toString()` and provides the calendar's `id` property as a human-readable description.

Example usage:
```javascript
Temporal.PlainDate.from('2020-05-29[c=gregory]').calendar.toString()  // => gregory
```
