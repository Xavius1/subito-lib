/**
 * Sleep your execution
 *
 * @param delay - Your delay in ms
 * @returns
 *
 * @public
 */
const sleep = (delay: number) => new Promise((resolve) => setTimeout(resolve, delay)); // eslint-disable-line no-promise-executor-return, max-len

export default sleep;
