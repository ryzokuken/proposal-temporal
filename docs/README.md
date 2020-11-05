# Temporal

<details>
  <summary><strong>Table of Contents</strong></summary>
<!-- toc -->
</details>

## Introduction

`Date` has been a long-standing pain point in ECMAScript.
This is a proposal for `Temporal`, a global `Object` that acts as a top-level namespace (like `Math`), that brings a modern date/time API to the ECMAScript language.
For a detailed look at some of the problems with `Date`, and the motivations for Temporal, see:
[Fixing JavaScript Date](https://maggiepint.com/2017/04/09/fixing-javascript-date-getting-started/).

Temporal fixes these problems by:

- Providing easy-to-use APIs for date and time computations
- First-class support for all time zones, including DST-safe arithmetic
- Dealing only with immutable objects
- Parsing a strictly specified string format
- Supporting non-Gregorian calendars

## Cookbook

A cookbook to help you get started and learn the ins and outs of Temporal is available [here](./cookbook.md).

## API Documentation

### **Temporal.now**

- `Temporal.now.instant()` - get the exact time since [Unix epoch](https://en.wikipedia.org/wiki/Unix_time)
- `Temporal.now.timeZone()` - get the current system time zone
- `Temporal.now.zonedDateTime(calendar)` - get the current date and wall-clock time in the system time zone and specified calendar
- `Temporal.now.zonedDateTimeISO()` - get the current date and wall-clock time in the system time zone and ISO-8601 calendar
- `Temporal.now.plainDate(calendar)` - get the current date in the system time zone and specified calendar
- `Temporal.now.plainDateISO()` - get the current date in the system time zone and ISO-8601 calendar
- `Temporal.now.time(calendar)` - get the current wall-clock time in the system time zone and specified calendar
- `Temporal.now.plainTimeISO()` - get the current wall-clock time in the system time zone and ISO-8601 calendar
- `Temporal.now.plainDateTime(calendar)` - get the current system date/time in the system time zone, but return an object that doesn't remember its time zone so should NOT be used to derive other values (e.g. 12 hours later) in time zones that use Daylight Saving Time (DST).
- `Temporal.now.plainDateTimeISO()` - same as above, but return the DateTime in the ISO-8601 calendar

See [Temporal.now Documentation](./now.md) for detailed documentation.

### **Temporal.Instant**

A `Temporal.Instant` represents a fixed point in time (called **"exact time"**), without regard to calendar or location.
For a human-readable local calendar date or clock time, use a `Temporal.TimeZone` and `Temporal.Calendar` to obtain a `Temporal.ZonedDateTime` or `Temporal.PlainDateTime`.

See [Temporal.Instant Documentation](./instant.md) for detailed documentation.

### **Temporal.ZonedDateTime**

_NOTE: Not all methods of this type are available in the polyfill yet._

A `Temporal.ZonedDateTime` is a timezone-aware, calendar-aware date/time type that represents a real event that has happened (or will happen) at a particular exact time from the perspective of a particular region on Earth.
This type is optimized for use cases that require a time zone, including DST-safe arithmetic and interoperability with RFC 5545 (iCalendar).

As the broadest `Temporal` type, `Temporal.ZonedDateTime` can be considered a combination of `Temporal.TimeZone`, `Temporal.Instant`, and `Temporal.PlainDateTime` (which includes `Temporal.Calendar`).

See [Temporal.ZonedDateTime Documentation](./zoneddatetime.md) for detailed documentation.

### **Temporal.PlainDate**

A `Temporal.PlainDate` object represents a calendar date that is not associated with a particular time or time zone.

This can also be converted to partial dates such as `Temporal.PlainYearMonth` and `Temporal.PlainMonthDay`.

See [Temporal.PlainDate Documentation](./date.md) for detailed documentation.

#### Time Zones and Resolving Ambiguity

Converting between wall-clock/calendar-date types (like `Temporal.PlainDate`, `Temporal.PlainTime`, and `Temporal.PlainDateTime`) and exact time types (`Temporal.Instant` and `Temporal.ZonedDateTime`) can be ambiguous because of time zones and daylight saving time.

Read more about [handling time zones, DST, and ambiguity in `Temporal`](./ambiguity.md).

### **Temporal.PlainTime**

A `Temporal.PlainTime` object represents a wall-clock time that is not associated with a particular date or time zone.

See [Temporal.PlainTime Documentation](./time.md) for detailed documentation.

### **Temporal.PlainDateTime**

A `Temporal.PlainDateTime` represents a calendar date and wall-clock time that does not carry time zone information. It can be converted to a `Temporal.ZonedDateTime` or a `Temporal.Instant` using a `Temporal.TimeZone`.
For use cases that require a time zone, especially using arithmetic or other derived values, consider using `Temporal.ZonedDateTime` instead because that type automatically adjusts for Daylight Saving Time.

See [Temporal.PlainDateTime Documentation](./datetime.md) for detailed documentation.

### **Temporal.PlainYearMonth**

A date without a day component.
This is useful to express things like "the November 2010 meeting".

See [Temporal.PlainYearMonth Documentation](./yearmonth.md) for detailed documentation.

### **Temporal.PlainMonthDay**

A date without a year component.
This is useful to express things like "Bastille Day is on the 14th of July".

See [Temporal.PlainMonthDay Documentation](./monthday.md) for detailed documentation.

### **Temporal.Duration**

A `Temporal.Duration` expresses a length of time.
This is used for date/time arithmetic and for measuring differences between `Temporal` objects.

See [Temporal.Duration Documentation](./duration.md) for detailed documentation.

#### Balancing

Unlike the other Temporal types, the units in `Temporal.Duration` don't naturally wrap around to 0: you may want to have a duration of "90 minutes," and you don't want it to unexpectedly turn into "1 hour and 30 minutes."

See [Duration balancing](./balancing.md) for more on this topic.

### **Temporal.TimeZone**

A `Temporal.TimeZone` represents an IANA time zone, a specific UTC offset, or UTC itself.
Because of this `Temporal.TimeZone` can be used to convert between `Temporal.Instant` and `Temporal.PlainDateTime` as well as finding out the offset at a specific `Temporal.Instant`.

See [Temporal.TimeZone Documentation](./timezone.md) for detailed documentation.
A conceptual explanation of handling [time zones, DST, and ambiguity in Temporal](./ambiguity.md) is also available.

### **Temporal.Calendar**

A `Temporal.Calendar` represents a calendar system.
Most code will use the ISO 8601 calendar, but other calendar systems are available.

See [Temporal.Calendar Documentation](./calendar.md) for detailed documentation.

## Other Documentation

### **Key Concepts**

- [Ambiguity](./ambiguity.md) &mdash; Explanation of missing times and double times due to daylight saving and time zone changes.
- [Balancing](./balancing.md) &mdash; Explanation of when `Temporal.Duration` units wrap around to 0 and when they don't.

### **Design drafts**

- [ISO string extensions](./iso-string-ext.md) &mdash; Discussion of extensions to the ISO 8601 standard which are used by Temporal and intended to be put on a standards track.

### Obsolete Pages

- [Calendar Subclassing Draft](./calendar-subclass.md) &mdash; Draft design document for alternative approach for calendar support.
  (**Obsolete;** rejected.)
- [Custom Time Zone Draft](./timezone-draft.md) &mdash; Draft design document for custom time zone support in Temporal.
  (**Obsolete;** superseded by the documentation of [Temporal.TimeZone](./timezone.md).)
- [Parse Draft](./parse-draft.md) &mdash; Draft design document for a `Temporal.parse` API, which is not currently planned to be implemented.
- [Calendar Draft](./calendar-draft.md) &mdash; Draft design document for calendar support in Temporal.
  Mostly superseded by the documentation of [Temporal.Calendar](./calendar.md), but also contains some discussion about whether to have a default calendar.
- [Zoned Date/Time Type Draft](./zoneddatetime-draft.md) &mdash; Explanation of `Temporal.ZonedDateTime` which is a new type combining an exact time with a time zone and calendar, and exposing a superset of the `Temporal.PlainDateTime` API.
  Superseded by the [documentation](./zoneddatetime.md), but contains background info about the reasons and goals behind this type.

## Object Relationship

<img src="object-model.svg">
