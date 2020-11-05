/**
 * Takes a local date and time in one time zone, and serializes it to a string
 * expressing the local date and time in another time zone at the same exact
 * time.
 *
 * If `sourceDateTime` doesn't exist in `sourceTimeZone`, or exists twice, then
 * an error will be thrown by default.
 * Usually this is what you want. (FIXME: but is it?)
 * Use `sourceDisambiguationPolicy` to change this behaviour.
 *
 * @param {Temporal.PlainDateTime} sourceDateTime - The local date and time
 * @param {Temporal.TimeZone} sourceTimeZone - The time zone for
 *  `sourceDateTime`
 * @param {Temporal.TimeZone} targetTimeZone - The time zone for the
 *  return value
 * @param {string} [sourceDisambiguationPolicy=reject] - what to do when
 *  `sourceDateTime` is ambiguous
 * @returns {string} String indicating the time with time zone designation
 */
function getParseableZonedStringWithLocalTimeInOtherZone(
  sourceDateTime,
  sourceTimeZone,
  targetTimeZone,
  sourceDisambiguationPolicy = 'reject'
) {
  return sourceDateTime
    .toZonedDateTime(sourceTimeZone, { disambiguation: sourceDisambiguationPolicy })
    .withTimeZone(targetTimeZone)
    .toString();
}

const result = getParseableZonedStringWithLocalTimeInOtherZone(
  Temporal.PlainDateTime.from('2020-01-09T00:00'),
  Temporal.TimeZone.from('America/Chicago'),
  Temporal.TimeZone.from('America/Los_Angeles')
);
// On this date, when it's midnight in Chicago, it's 10 PM the previous night in LA
assert.equal(result, '2020-01-08T22:00:00-08:00[America/Los_Angeles]');
