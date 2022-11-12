import moment from 'moment-with-locales-es6';
import momenttz, { Moment } from 'moment-timezone';
import e from '../security/env.js';

// Dirtyfix, why when use in dependents moment is not exported as default ?
const mm = (moment.default) ? moment.default : moment;

/**
 * Class to normalize date usage (WIP)
 *
 * @public
 */
class Datte {
  public utc: Moment;

  protected tz: string;

  protected locale: string | null = null;

  protected unix = /^([0-9]{13})$/;

  constructor({
    date,
    locale = e.DEFAULT_LOCALE,
    tz = e.DEFAULT_TIMEZONE,
  }: { date?: string, locale?: string, tz?: string } = { }) {
    momenttz.tz.setDefault('UTC');
    this.tz = tz;
    this.locale = locale;
    if (date && this.unix.exec(date)) {
      this.utc = momenttz.utc(moment.unix(date));
    } else {
      this.utc = momenttz.utc(date);
    }
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
    mm.locale(this.locale);
    const utc = this.utc.format(format);
    if (this.unix.exec(utc)) {
      return mm.unix(utc).format(format);
    }
    return mm(utc).format(format);
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
    mm.locale(this.locale);
    // return new Date(this.utc.tz(this.tz).format('YYYY-MM-DDTHH:mm:ss.SSS'));
    return mm(
      new Date(this.utc.tz(this.tz).format('YYYY-MM-DDTHH:mm:ss.SSS')),
    ).format(format);
  }
}

export default Datte;
