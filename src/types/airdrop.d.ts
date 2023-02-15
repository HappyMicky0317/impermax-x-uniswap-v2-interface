
import { BigNumber } from '@ethersproject/bignumber';

export interface AirdropData {
  index: number;
  amount: BigNumber;
  proof: Array<string>;
}
