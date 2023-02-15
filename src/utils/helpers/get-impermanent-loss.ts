
const getImpermanentLoss = (priceSwing: number): number => {
  return Math.sqrt(priceSwing) / (priceSwing + 1) * 2;
};

export default getImpermanentLoss;
