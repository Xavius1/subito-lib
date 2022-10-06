const sleep = (delay: number) => new Promise((resolve) => setTimeout(resolve, delay)); // eslint-disable-line no-promise-executor-return, max-len

export default sleep;
