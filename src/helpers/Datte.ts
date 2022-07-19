import moment from 'moment-with-locales-es6';
import momenttz, { Moment } from 'moment-timezone';
import e from '../security/env.js';

/**
 * Class to normalize date usage (WIP)
 *
 * @public
 */
class Datte {
  public utc: Moment;

  protected tz: string;

  protected locale: string | null = null;

  constructor({
    date,
    locale = e.DEFAULT_LOCALE,
    tz = e.DEFAULT_TIMEZONE,
  }: { date?: string, locale?: string, tz?: string } = { }) {
    momenttz.tz.setDefault('UTC');
    this.tz = tz;
    this.locale = locale;
    this.utc = momenttz.utc(date);
  }

  /**
   * Get the Date object (utc)
   *
   * @returns
   *
   * @public
   */
  toDate() {
    return this.utc?.toDate();
  }

  /**
   * Get the local Date object (with timezone applied)
   *
   * @returns
   *
   * @public
   */
  toLocalDate() {
    const u = this.utc.tz(this.tz);
    const d = new Date(Date.UTC(u.year(), u.month(), u.date(), u.hour(), u.minute(), u.second()));
    return d;
  }

  /**
   * Date to string (utc)
   *
   * @param format - String of {@link https://momentjs.com/timezone/docs/#/using-timezones/formatting/ | tokens } corresponding to their values.
   * @returns
   *
   * @public
   */
  toString(format: string = e.DEFAULT_DATE_FORMAT) {
    moment.locale(this.locale);
    return moment(
      this.utc.format(format),
    ).format(format);
  }

  /**
   * Date to string (with timezone applied)
   *
   * @param format - String of {@link https://momentjs.com/timezone/docs/#/using-timezones/formatting/ | tokens } corresponding to their values.
   * @returns
   *
   * @public
   */
  toLocalString(format: string = e.DEFAULT_DATE_FORMAT) {
    moment.locale(this.locale);
    // return new Date(this.utc.tz(this.tz).format('YYYY-MM-DDTHH:mm:ss.SSS'));
    return moment(
      new Date(this.utc.tz(this.tz).format('YYYY-MM-DDTHH:mm:ss.SSS')),
    ).format(format);
  }
}

export default Datte;
