
// TODO: should use a good library
// - https://formatjs.io/docs/react-intl/
// - https://github.com/adamwdraper/Numeral-js
const formatNumberWithFixedDecimals = (numberOfDecimals: number) => (value: number): number => {
  const helper = Math.pow(10, numberOfDecimals);
  const formattedValue = Math.floor((value + Number.EPSILON) * helper) / helper;

  return formattedValue;
};

export default formatNumberWithFixedDecimals;
