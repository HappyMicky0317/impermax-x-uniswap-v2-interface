
import { isAddress } from '@ethersproject/address';

const shortenAddress = (address: string): string => {
  const valid = isAddress(address);
  if (!valid) {
    throw Error(`Invalid 'address' parameter '${address}'!`);
  }

  return address?.length > 8 ? `${address.slice(0, 6)}...${address.slice(-4)}` : address;
};

export default shortenAddress;
