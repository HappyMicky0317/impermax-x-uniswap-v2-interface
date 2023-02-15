
const SECONDS_IN_YEAR = 365 * 24 * 3600;

const toAPY = (value: number) : number => {
  const apy = value * SECONDS_IN_YEAR;

  return apy;
};

export default toAPY;
