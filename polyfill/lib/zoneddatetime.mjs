/* global __debug__ */

import { GetISO8601Calendar } from './calendar.mjs';
import { ES } from './ecmascript.mjs';
import { DateTimeFormat } from './intl.mjs';
import { GetIntrinsic, MakeIntrinsicClass } from './intrinsicclass.mjs';
import {
  CALENDAR,
  EPOCHNANOSECONDS,
  ISO_HOUR,
  INSTANT,
  ISO_DAY,
  ISO_MONTH,
  ISO_YEAR,
  ISO_MICROSECOND,
  ISO_MILLISECOND,
  ISO_MINUTE,
  ISO_NANOSECOND,
  ISO_SECOND,
  TIME_ZONE,
  CreateSlots,
  GetSlot,
  SetSlot
} from './slots.mjs';

import bigInt from 'big-integer';

export class ZonedDateTime {
  constructor(epochNanoseconds, timeZone, calendar = GetISO8601Calendar()) {
    epochNanoseconds = ES.ToBigInt(epochNanoseconds);
    timeZone = ES.ToTemporalTimeZone(timeZone);
    calendar = ES.ToTemporalCalendar(calendar);

    ES.RejectInstantRange(epochNanoseconds);

    CreateSlots(this);
    SetSlot(this, EPOCHNANOSECONDS, epochNanoseconds);
    SetSlot(this, TIME_ZONE, timeZone);
    SetSlot(this, CALENDAR, calendar);

    const TemporalInstant = GetIntrinsic('%Temporal.Instant%');
    const instant = new TemporalInstant(GetSlot(this, EPOCHNANOSECONDS));
    SetSlot(this, INSTANT, instant);

    if (typeof __debug__ !== 'undefined' && __debug__) {
      Object.defineProperty(this, '_repr_', {
        value: `${this[Symbol.toStringTag]} <${zonedDateTimeToString(this, 'auto')}>`,
        writable: false,
        enumerable: false,
        configurable: false
      });
    }
  }
  get calendar() {
    if (!ES.IsTemporalZonedDateTime(this)) throw new TypeError('invalid receiver');
    return GetSlot(this, CALENDAR);
  }
  get timeZone() {
    if (!ES.IsTemporalZonedDateTime(this)) throw new TypeError('invalid receiver');
    return GetSlot(this, TIME_ZONE);
  }
  get year() {
    if (!ES.IsTemporalZonedDateTime(this)) throw new TypeError('invalid receiver');
    return GetSlot(this, CALENDAR).year(dateTime(this));
  }
  get month() {
    if (!ES.IsTemporalZonedDateTime(this)) throw new TypeError('invalid receiver');
    return GetSlot(this, CALENDAR).month(dateTime(this));
  }
  get day() {
    if (!ES.IsTemporalZonedDateTime(this)) throw new TypeError('invalid receiver');
    return GetSlot(this, CALENDAR).day(dateTime(this));
  }
  get hour() {
    if (!ES.IsTemporalZonedDateTime(this)) throw new TypeError('invalid receiver');
    return GetSlot(dateTime(this), ISO_HOUR);
  }
  get minute() {
    if (!ES.IsTemporalZonedDateTime(this)) throw new TypeError('invalid receiver');
    return GetSlot(dateTime(this), ISO_MINUTE);
  }
  get second() {
    if (!ES.IsTemporalZonedDateTime(this)) throw new TypeError('invalid receiver');
    return GetSlot(dateTime(this), ISO_SECOND);
  }
  get millisecond() {
    if (!ES.IsTemporalZonedDateTime(this)) throw new TypeError('invalid receiver');
    return GetSlot(dateTime(this), ISO_MILLISECOND);
  }
  get microsecond() {
    if (!ES.IsTemporalZonedDateTime(this)) throw new TypeError('invalid receiver');
    return GetSlot(dateTime(this), ISO_MICROSECOND);
  }
  get nanosecond() {
    if (!ES.IsTemporalZonedDateTime(this)) throw new TypeError('invalid receiver');
    return GetSlot(dateTime(this), ISO_NANOSECOND);
  }
  get epochSeconds() {
    if (!ES.IsTemporalZonedDateTime(this)) throw new TypeError('invalid receiver');
    const value = GetSlot(this, EPOCHNANOSECONDS);
    return +value.divide(1e9);
  }
  get epochMilliseconds() {
    if (!ES.IsTemporalZonedDateTime(this)) throw new TypeError('invalid receiver');
    const value = GetSlot(this, EPOCHNANOSECONDS);
    return +value.divide(1e6);
  }
  get epochMicroseconds() {
    if (!ES.IsTemporalZonedDateTime(this)) throw new TypeError('invalid receiver');
    const value = GetSlot(this, EPOCHNANOSECONDS);
    return bigIntIfAvailable(value.divide(1e3));
  }
  get epochNanoseconds() {
    if (!ES.IsTemporalZonedDateTime(this)) throw new TypeError('invalid receiver');
    return bigIntIfAvailable(GetSlot(this, EPOCHNANOSECONDS));
  }
  get dayOfWeek() {
    if (!ES.IsTemporalZonedDateTime(this)) throw new TypeError('invalid receiver');
    return GetSlot(this, CALENDAR).dayOfWeek(dateTime(this));
  }
  get dayOfYear() {
    if (!ES.IsTemporalZonedDateTime(this)) throw new TypeError('invalid receiver');
    return GetSlot(this, CALENDAR).dayOfYear(dateTime(this));
  }
  get weekOfYear() {
    if (!ES.IsTemporalZonedDateTime(this)) throw new TypeError('invalid receiver');
    return GetSlot(this, CALENDAR).weekOfYear(dateTime(this));
  }
  get hoursInDay() {
    if (!ES.IsTemporalZonedDateTime(this)) throw new TypeError('invalid receiver');
    const dt = dateTime(this);
    const DateTime = GetIntrinsic('%Temporal.PlainDateTime%');
    const year = GetSlot(dt, ISO_YEAR);
    const month = GetSlot(dt, ISO_MONTH);
    const day = GetSlot(dt, ISO_DAY);
    const today = new DateTime(year, month, day, 0, 0, 0, 0, 0, 0);
    const tomorrowFields = ES.AddDate(year, month, day, 0, 0, 0, 1, 'reject');
    const tomorrow = new DateTime(tomorrowFields.year, tomorrowFields.month, tomorrowFields.day, 0, 0, 0, 0, 0, 0);
    const timeZone = GetSlot(this, TIME_ZONE);
    const todayNs = GetSlot(ES.GetTemporalInstantFor(timeZone, today, 'compatible'), EPOCHNANOSECONDS);
    const tomorrowNs = GetSlot(ES.GetTemporalInstantFor(timeZone, tomorrow, 'compatible'), EPOCHNANOSECONDS);
    const { quotient, remainder } = tomorrowNs.subtract(todayNs).divmod(3.6e12);
    return quotient.toJSNumber() + remainder.toJSNumber() / 3.6e12;
  }
  get daysInWeek() {
    if (!ES.IsTemporalZonedDateTime(this)) throw new TypeError('invalid receiver');
    return GetSlot(this, CALENDAR).daysInWeek(dateTime(this));
  }
  get daysInMonth() {
    if (!ES.IsTemporalZonedDateTime(this)) throw new TypeError('invalid receiver');
    return GetSlot(this, CALENDAR).daysInMonth(dateTime(this));
  }
  get daysInYear() {
    if (!ES.IsTemporalZonedDateTime(this)) throw new TypeError('invalid receiver');
    return GetSlot(this, CALENDAR).daysInYear(dateTime(this));
  }
  get monthsInYear() {
    if (!ES.IsTemporalZonedDateTime(this)) throw new TypeError('invalid receiver');
    return GetSlot(this, CALENDAR).monthsInYear(dateTime(this));
  }
  get inLeapYear() {
    if (!ES.IsTemporalZonedDateTime(this)) throw new TypeError('invalid receiver');
    return GetSlot(this, CALENDAR).inLeapYear(dateTime(this));
  }
  get offset() {
    if (!ES.IsTemporalZonedDateTime(this)) throw new TypeError('invalid receiver');
    return ES.GetOffsetStringFor(GetSlot(this, TIME_ZONE), GetSlot(this, INSTANT));
  }
  with(temporalZonedDateTimeLike, options = undefined) {
    if (!ES.IsTemporalZonedDateTime(this)) throw new TypeError('invalid receiver');
    if (ES.Type(temporalZonedDateTimeLike) !== 'Object') {
      const str = ES.ToString(temporalZonedDateTimeLike);
      temporalZonedDateTimeLike = ES.RelevantTemporalObjectFromString(str);
    }
    options = ES.NormalizeOptionsObject(options);
    const overflow = ES.ToTemporalOverflow(options);
    const disambiguation = ES.ToTemporalDisambiguation(options);
    const offset = ES.ToTemporalOffset(options, 'prefer');

    void overflow;
    void disambiguation;
    void offset;
    throw new Error('with() not implemented yet');
  }
  withTimeZone(timeZone) {
    if (!ES.IsTemporalZonedDateTime(this)) throw new TypeError('invalid receiver');
    timeZone = ES.ToTemporalTimeZone(timeZone);
    const Construct = ES.SpeciesConstructor(this, ZonedDateTime);
    const result = new Construct(GetSlot(this, EPOCHNANOSECONDS), timeZone, GetSlot(this, CALENDAR));
    if (!ES.IsTemporalZonedDateTime(result)) throw new TypeError('invalid result');
    return result;
  }
  withCalendar(calendar) {
    if (!ES.IsTemporalZonedDateTime(this)) throw new TypeError('invalid receiver');
    calendar = ES.ToTemporalCalendar(calendar);
    const Construct = ES.SpeciesConstructor(this, ZonedDateTime);
    const result = new Construct(GetSlot(this, EPOCHNANOSECONDS), GetSlot(this, TIME_ZONE), calendar);
    if (!ES.IsTemporalZonedDateTime(result)) throw new TypeError('invalid result');
    return result;
  }
  add(temporalDurationLike, options = undefined) {
    if (!ES.IsTemporalZonedDateTime(this)) throw new TypeError('invalid receiver');
    const duration = ES.ToLimitedTemporalDuration(temporalDurationLike);
    const { years, months, weeks, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds } = duration;
    ES.RejectDurationSign(years, months, weeks, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds);
    options = ES.NormalizeOptionsObject(options);
    const overflow = ES.ToTemporalOverflow(options);
    const timeZone = GetSlot(this, TIME_ZONE);
    const calendar = GetSlot(this, CALENDAR);
    const epochNanoseconds = ES.AddZonedDateTime(
      GetSlot(this, INSTANT),
      timeZone,
      calendar,
      years,
      months,
      weeks,
      days,
      hours,
      minutes,
      seconds,
      milliseconds,
      microseconds,
      nanoseconds,
      overflow
    );
    const Construct = ES.SpeciesConstructor(this, ZonedDateTime);
    const result = new Construct(epochNanoseconds, timeZone, calendar);
    if (!ES.IsTemporalZonedDateTime(result)) throw new TypeError('invalid result');
    return result;
  }
  subtract(temporalDurationLike, options = undefined) {
    if (!ES.IsTemporalZonedDateTime(this)) throw new TypeError('invalid receiver');
    const duration = ES.ToLimitedTemporalDuration(temporalDurationLike);
    const { years, months, weeks, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds } = duration;
    ES.RejectDurationSign(years, months, weeks, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds);
    options = ES.NormalizeOptionsObject(options);
    const overflow = ES.ToTemporalOverflow(options);
    const timeZone = GetSlot(this, TIME_ZONE);
    const calendar = GetSlot(this, CALENDAR);
    const epochNanoseconds = ES.SubtractZonedDateTime(
      GetSlot(this, INSTANT),
      timeZone,
      calendar,
      years,
      months,
      weeks,
      days,
      hours,
      minutes,
      seconds,
      milliseconds,
      microseconds,
      nanoseconds,
      overflow
    );
    const Construct = ES.SpeciesConstructor(this, ZonedDateTime);
    const result = new Construct(epochNanoseconds, timeZone, calendar);
    if (!ES.IsTemporalZonedDateTime(result)) throw new TypeError('invalid result');
    return result;
  }
  until(other, options = undefined) {
    if (!ES.IsTemporalZonedDateTime(this)) throw new TypeError('invalid receiver');
    other = ES.ToTemporalZonedDateTime(other, ZonedDateTime);
    const calendar = GetSlot(this, CALENDAR);
    const otherCalendar = GetSlot(other, CALENDAR);
    const calendarId = ES.CalendarToString(calendar);
    const otherCalendarId = ES.CalendarToString(otherCalendar);
    if (calendarId !== otherCalendarId) {
      throw new RangeError(`cannot compute difference between dates of ${calendarId} and ${otherCalendarId} calendars`);
    }
    options = ES.NormalizeOptionsObject(options);
    const smallestUnit = ES.ToSmallestTemporalDurationUnit(options, 'nanoseconds');
    const defaultLargestUnit = ES.LargerOfTwoTemporalDurationUnits('days', smallestUnit);
    const largestUnit = ES.ToLargestTemporalUnit(options, defaultLargestUnit);
    ES.ValidateTemporalUnitRange(largestUnit, smallestUnit);
    const roundingMode = ES.ToTemporalRoundingMode(options, 'nearest');
    const roundingIncrement = ES.ToTemporalDateTimeRoundingIncrement(options, smallestUnit);
    void roundingMode;
    void roundingIncrement;
    throw new Error('until() not implemented yet');
  }
  since(other, options = undefined) {
    if (!ES.IsTemporalZonedDateTime(this)) throw new TypeError('invalid receiver');
    other = ES.ToTemporalZonedDateTime(other, ZonedDateTime);
    const calendar = GetSlot(this, CALENDAR);
    const otherCalendar = GetSlot(other, CALENDAR);
    const calendarId = ES.CalendarToString(calendar);
    const otherCalendarId = ES.CalendarToString(otherCalendar);
    if (calendarId !== otherCalendarId) {
      throw new RangeError(`cannot compute difference between dates of ${calendarId} and ${otherCalendarId} calendars`);
    }
    options = ES.NormalizeOptionsObject(options);
    const smallestUnit = ES.ToSmallestTemporalDurationUnit(options, 'nanoseconds');
    const defaultLargestUnit = ES.LargerOfTwoTemporalDurationUnits('days', smallestUnit);
    const largestUnit = ES.ToLargestTemporalUnit(options, defaultLargestUnit);
    ES.ValidateTemporalUnitRange(largestUnit, smallestUnit);
    let roundingMode = ES.ToTemporalRoundingMode(options, 'nearest');
    roundingMode = ES.NegateTemporalRoundingMode(roundingMode);
    const roundingIncrement = ES.ToTemporalDateTimeRoundingIncrement(options, smallestUnit);
    void roundingMode;
    void roundingIncrement;
    throw new Error('since() not implemented yet');
  }
  round(options) {
    if (!ES.IsTemporalZonedDateTime(this)) throw new TypeError('invalid receiver');
    if (options === undefined) throw new TypeError('options parameter is required');
    options = ES.NormalizeOptionsObject(options);
    const smallestUnit = ES.ToSmallestTemporalUnit(options);
    const roundingMode = ES.ToTemporalRoundingMode(options, 'nearest');
    const maximumIncrements = {
      day: 1,
      hour: 24,
      minute: 60,
      second: 60,
      millisecond: 1000,
      microsecond: 1000,
      nanosecond: 1000
    };
    const roundingIncrement = ES.ToTemporalRoundingIncrement(options, maximumIncrements[smallestUnit], false);

    // first, round the underlying DateTime fields
    const dt = dateTime(this);
    let year = GetSlot(dt, ISO_YEAR);
    let month = GetSlot(dt, ISO_MONTH);
    let day = GetSlot(dt, ISO_DAY);
    let hour = GetSlot(dt, ISO_HOUR);
    let minute = GetSlot(dt, ISO_MINUTE);
    let second = GetSlot(dt, ISO_SECOND);
    let millisecond = GetSlot(dt, ISO_MILLISECOND);
    let microsecond = GetSlot(dt, ISO_MICROSECOND);
    let nanosecond = GetSlot(dt, ISO_NANOSECOND);
    ({ year, month, day, hour, minute, second, millisecond, microsecond, nanosecond } = ES.RoundDateTime(
      year,
      month,
      day,
      hour,
      minute,
      second,
      millisecond,
      microsecond,
      nanosecond,
      roundingIncrement,
      smallestUnit,
      roundingMode
    ));

    // TODO: there's a case not yet implemented here: if there's a DST
    // transition during the current day, then it's ignored by rounding. For
    // example, using the `nearest` mode a time of 11:45 would round up in
    // DateTime rounding but should round down if the day is 23 hours long.
    // The since()/until() implementation will show one way to do this rounding.

    // Now reset all DateTime fields but leave the TimeZone. The offset will
    // also be retained if the new date/time values are still OK with the old
    // offset. Otherwise the offset will be changed to be compatible with the
    // new date/time values. If DST disambiguation is required, the `compatible`
    // disambiguation algorithm will be used.
    const DateTime = GetIntrinsic('%Temporal.PlainDateTime%');
    const calendar = GetSlot(this, CALENDAR);
    const rounded = new DateTime(
      year,
      month,
      day,
      hour,
      minute,
      second,
      millisecond,
      microsecond,
      nanosecond,
      calendar
    );

    const timeZone = GetSlot(this, TIME_ZONE);
    const offsetNs = ES.GetOffsetNanosecondsFor(timeZone, GetSlot(this, INSTANT));

    // See the 'prefer' algorithm in ToTemporalZonedDateTime
    let instant;
    const possibleInstants = timeZone.getPossibleInstantsFor(rounded);
    for (const candidate of possibleInstants) {
      const candidateOffset = ES.GetOffsetNanosecondsFor(timeZone, candidate);
      if (candidateOffset === offsetNs) {
        instant = candidate;
        break;
      }
    }
    if (!instant) instant = ES.GetTemporalInstantFor(timeZone, rounded, 'compatible');

    const Construct = ES.SpeciesConstructor(this, ZonedDateTime);
    const result = new Construct(GetSlot(instant, EPOCHNANOSECONDS), timeZone, calendar);
    if (!ES.IsTemporalZonedDateTime(result)) throw new TypeError('invalid result');
    return result;
  }
  equals(other) {
    if (!ES.IsTemporalZonedDateTime(this)) throw new TypeError('invalid receiver');
    other = ES.ToTemporalZonedDateTime(other, ZonedDateTime);
    const one = GetSlot(this, EPOCHNANOSECONDS);
    const two = GetSlot(other, EPOCHNANOSECONDS);
    if (!bigInt(one).equals(two)) return false;
    if (!ES.TimeZoneEquals(GetSlot(this, TIME_ZONE), GetSlot(other, TIME_ZONE))) return false;
    return ES.CalendarEquals(GetSlot(this, CALENDAR), GetSlot(other, CALENDAR));
  }
  toString(options = undefined) {
    if (!ES.IsTemporalZonedDateTime(this)) throw new TypeError('invalid receiver');
    options = ES.NormalizeOptionsObject(options);
    const { precision, unit, increment } = ES.ToSecondsStringPrecision(options);
    const roundingMode = ES.ToTemporalRoundingMode(options, 'trunc');
    const showCalendar = ES.ToShowCalendarOption(options);
    const showTimeZone = ES.ToShowTimeZoneNameOption(options);
    const showOffset = ES.ToShowOffsetOption(options);
    return zonedDateTimeToString(this, precision, showCalendar, showTimeZone, showOffset, {
      unit,
      increment,
      roundingMode
    });
  }
  toLocaleString(locales = undefined, options = undefined) {
    if (!ES.IsTemporalZonedDateTime(this)) throw new TypeError('invalid receiver');
    return new DateTimeFormat(locales, options).format(this);
  }
  toJSON() {
    if (!ES.IsTemporalZonedDateTime(this)) throw new TypeError('invalid receiver');
    return zonedDateTimeToString(this, 'auto');
  }
  valueOf() {
    throw new TypeError('use compare() or equals() to compare Temporal.ZonedDateTime');
  }
  startOfDay() {
    if (!ES.IsTemporalZonedDateTime(this)) throw new TypeError('invalid receiver');
    const dt = dateTime(this);
    const DateTime = GetIntrinsic('%Temporal.PlainDateTime%');
    const dtStart = new DateTime(GetSlot(dt, ISO_YEAR), GetSlot(dt, ISO_MONTH), GetSlot(dt, ISO_DAY), 0, 0, 0, 0, 0, 0);
    const timeZone = GetSlot(this, TIME_ZONE);
    const instant = ES.GetTemporalInstantFor(timeZone, dtStart, 'compatible');
    const Construct = ES.SpeciesConstructor(this, ZonedDateTime);
    const result = new Construct(GetSlot(instant, EPOCHNANOSECONDS), timeZone, GetSlot(this, CALENDAR));
    if (!ES.IsTemporalZonedDateTime(result)) throw new TypeError('invalid result');
    return result;
  }
  toInstant() {
    if (!ES.IsTemporalZonedDateTime(this)) throw new TypeError('invalid receiver');
    const TemporalInstant = GetIntrinsic('%Temporal.Instant%');
    return new TemporalInstant(GetSlot(this, EPOCHNANOSECONDS));
  }
  toPlainDate() {
    if (!ES.IsTemporalZonedDateTime(this)) throw new TypeError('invalid receiver');
    return ES.TemporalDateTimeToDate(dateTime(this));
  }
  toPlainTime() {
    if (!ES.IsTemporalZonedDateTime(this)) throw new TypeError('invalid receiver');
    return ES.TemporalDateTimeToTime(dateTime(this));
  }
  toPlainDateTime() {
    if (!ES.IsTemporalZonedDateTime(this)) throw new TypeError('invalid receiver');
    return dateTime(this);
  }
  toPlainYearMonth() {
    if (!ES.IsTemporalZonedDateTime(this)) throw new TypeError('invalid receiver');
    const YearMonth = GetIntrinsic('%Temporal.PlainYearMonth%');
    const calendar = GetSlot(this, CALENDAR);
    const fieldNames = ES.CalendarFields(calendar, ['day', 'month', 'year']);
    const fields = ES.ToTemporalDateFields(this, fieldNames);
    return calendar.yearMonthFromFields(fields, {}, YearMonth);
  }
  toPlainMonthDay() {
    if (!ES.IsTemporalZonedDateTime(this)) throw new TypeError('invalid receiver');
    const MonthDay = GetIntrinsic('%Temporal.PlainMonthDay%');
    const calendar = GetSlot(this, CALENDAR);
    const fieldNames = ES.CalendarFields(calendar, ['day', 'month', 'year']);
    const fields = ES.ToTemporalDateFields(this, fieldNames);
    return calendar.monthDayFromFields(fields, {}, MonthDay);
  }
  getFields() {
    if (!ES.IsTemporalZonedDateTime(this)) throw new TypeError('invalid receiver');
    const calendar = GetSlot(this, CALENDAR);
    const fieldNames = ES.CalendarFields(calendar, ['day', 'month', 'year']);
    const fields = ES.ToTemporalZonedDateTimeFields(this, fieldNames);
    fields.calendar = calendar;
    return fields;
  }
  getISOFields() {
    if (!ES.IsTemporalZonedDateTime(this)) throw new TypeError('invalid receiver');
    const dt = dateTime(this);
    const tz = GetSlot(this, TIME_ZONE);
    return {
      calendar: GetSlot(this, CALENDAR),
      isoDay: GetSlot(dt, ISO_DAY),
      isoHour: GetSlot(dt, ISO_HOUR),
      isoMicrosecond: GetSlot(dt, ISO_MICROSECOND),
      isoMillisecond: GetSlot(dt, ISO_MILLISECOND),
      isoMinute: GetSlot(dt, ISO_MINUTE),
      isoMonth: GetSlot(dt, ISO_MONTH),
      isoNanosecond: GetSlot(dt, ISO_NANOSECOND),
      isoSecond: GetSlot(dt, ISO_SECOND),
      isoYear: GetSlot(dt, ISO_YEAR),
      offset: ES.GetOffsetStringFor(tz, GetSlot(this, INSTANT)),
      timeZone: tz
    };
  }
  static from(item, options = undefined) {
    options = ES.NormalizeOptionsObject(options);
    const overflow = ES.ToTemporalOverflow(options);
    const disambiguation = ES.ToTemporalDisambiguation(options);
    const offset = ES.ToTemporalOffset(options, 'reject');
    if (ES.IsTemporalZonedDateTime(item)) {
      return new ZonedDateTime(GetSlot(item, EPOCHNANOSECONDS), GetSlot(item, TIME_ZONE), GetSlot(item, CALENDAR));
    }
    return ES.ToTemporalZonedDateTime(item, this, overflow, disambiguation, offset);
  }
  static compare(one, two) {
    one = ES.ToTemporalZonedDateTime(one, ZonedDateTime);
    two = ES.ToTemporalZonedDateTime(two, ZonedDateTime);
    const ns1 = GetSlot(one, EPOCHNANOSECONDS);
    const ns2 = GetSlot(two, EPOCHNANOSECONDS);
    if (bigInt(ns1).lesser(ns2)) return -1;
    if (bigInt(ns1).greater(ns2)) return 1;
    const calendarResult = ES.CalendarCompare(GetSlot(one, CALENDAR), GetSlot(two, CALENDAR));
    if (calendarResult) return calendarResult;
    return ES.TimeZoneCompare(GetSlot(one, TIME_ZONE), GetSlot(two, TIME_ZONE));
  }
}

MakeIntrinsicClass(ZonedDateTime, 'Temporal.ZonedDateTime');

function bigIntIfAvailable(wrapper) {
  return typeof BigInt === 'undefined' ? wrapper : wrapper.value;
}

function dateTime(zdt) {
  return ES.GetTemporalDateTimeFor(GetSlot(zdt, TIME_ZONE), GetSlot(zdt, INSTANT), GetSlot(zdt, CALENDAR));
}

function zonedDateTimeToString(
  zdt,
  precision,
  showCalendar = 'auto',
  showTimeZone = 'auto',
  showOffset = 'auto',
  options = undefined
) {
  const dt = dateTime(zdt);
  let year = GetSlot(dt, ISO_YEAR);
  let month = GetSlot(dt, ISO_MONTH);
  let day = GetSlot(dt, ISO_DAY);
  let hour = GetSlot(dt, ISO_HOUR);
  let minute = GetSlot(dt, ISO_MINUTE);
  let second = GetSlot(dt, ISO_SECOND);
  let millisecond = GetSlot(dt, ISO_MILLISECOND);
  let microsecond = GetSlot(dt, ISO_MICROSECOND);
  let nanosecond = GetSlot(dt, ISO_NANOSECOND);

  if (options) {
    const { unit, increment, roundingMode } = options;
    ({ year, month, day, hour, minute, second, millisecond, microsecond, nanosecond } = ES.RoundDateTime(
      year,
      month,
      day,
      hour,
      minute,
      second,
      millisecond,
      microsecond,
      nanosecond,
      increment,
      unit,
      roundingMode
    ));
  }

  year = ES.ISOYearString(year);
  month = ES.ISODateTimePartString(month);
  day = ES.ISODateTimePartString(day);
  hour = ES.ISODateTimePartString(hour);
  minute = ES.ISODateTimePartString(minute);
  const seconds = ES.FormatSecondsStringPart(second, millisecond, microsecond, nanosecond, precision);
  const tz = GetSlot(zdt, TIME_ZONE);
  let result = `${year}-${month}-${day}T${hour}:${minute}${seconds}`;
  if (showOffset !== 'never') result += ES.GetOffsetStringFor(tz, GetSlot(zdt, INSTANT));
  if (showTimeZone !== 'never') result += `[${ES.TimeZoneToString(tz)}]`;
  result += ES.FormatCalendarAnnotation(GetSlot(zdt, CALENDAR), showCalendar);
  return result;
}
