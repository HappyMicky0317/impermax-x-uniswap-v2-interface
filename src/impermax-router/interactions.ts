/* eslint-disable no-invalid-this */
import { BigNumber } from '@ethersproject/bignumber';
import { formatUnits } from '@ethersproject/units';

import ImpermaxRouter from '.';
import { Address, PoolTokenType } from '../types/interfaces';
import { PermitData } from '../hooks/useApprove';
import { DistributorDetails } from '../utils/constants';
import { CreatePairStep } from '../hooks/useCreateNewPair';
import { W_ETH_ADDRESSES } from 'config/web3/contracts/w-eths';

export async function deposit(
  this: ImpermaxRouter,
  uniswapV2PairAddress: Address,
  poolTokenType: PoolTokenType,
  amount: BigNumber,
  permitData: PermitData,
  // eslint-disable-next-line @typescript-eslint/ban-types
  onTransactionHash: Function
): Promise<void> {
  const [poolToken, token] = await this.getContracts(uniswapV2PairAddress, poolTokenType);
  const data = permitData ? permitData.permitData : '0x';
  const deadline = permitData ? permitData.deadline : this.getDeadline();
  try {
    const wETHAddress = W_ETH_ADDRESSES[this.chainId];
    let receipt;
    if (token.address === wETHAddress) {
      const overrides = { value: amount };
      const tx = await this.router.mintETH(poolToken.address, this.account, deadline, overrides);
      receipt = await tx.wait();
    } else if (poolTokenType === PoolTokenType.Collateral) {
      const tx = await this.router.mintCollateral(poolToken.address, amount, this.account, deadline, data);
      receipt = await tx.wait();
    } else {
      const tx = await this.router.mint(poolToken.address, amount, this.account, deadline);
      receipt = await tx.wait();
    }
    onTransactionHash(receipt.transactionHash);
  } catch (error) {
    console.error('[deposit] error.message => ', error.message);
  }
}

export async function withdraw(
  this: ImpermaxRouter,
  uniswapV2PairAddress: Address,
  poolTokenType: PoolTokenType,
  tokens: BigNumber,
  permitData: PermitData,
  // eslint-disable-next-line @typescript-eslint/ban-types
  onTransactionHash: Function
): Promise<void> {
  const [poolToken, token] = await this.getContracts(uniswapV2PairAddress, poolTokenType);
  const data = permitData ? permitData.permitData : '0x';
  const deadline = permitData ? permitData.deadline : this.getDeadline();

  let receipt;
  try {
    const wETHAddress = W_ETH_ADDRESSES[this.chainId];
    if (token.address === wETHAddress) {
      const tx = await this.router.redeemETH(poolToken.address, tokens, this.account, deadline, data);
      receipt = await tx.wait();
    } else {
      const tx = await this.router.redeem(poolToken.address, tokens, this.account, deadline, data);
      receipt = await tx.wait();
    }
    onTransactionHash(receipt.transactionHash);
  } catch (error) {
    console.error('[withdraw] error.message => ', error.message);
  }
}

export async function borrow(
  this: ImpermaxRouter,
  uniswapV2PairAddress: Address,
  poolTokenType: PoolTokenType,
  amount: BigNumber,
  permitData: PermitData,
  // eslint-disable-next-line @typescript-eslint/ban-types
  onTransactionHash: Function
): Promise<void> {
  const [borrowable, token] = await this.getContracts(uniswapV2PairAddress, poolTokenType);
  const data = permitData ? permitData.permitData : '0x';
  const deadline = permitData ? permitData.deadline : this.getDeadline();

  try {
    const wETHAddress = W_ETH_ADDRESSES[this.chainId];
    let receipt;
    if (token.address === wETHAddress) {
      const tx = await this.router.borrowETH(borrowable.address, amount, this.account, deadline, data);
      receipt = await tx.wait();
    } else {
      const tx = await this.router.borrow(borrowable.address, amount, this.account, deadline, data);
      receipt = await tx.wait();
    }
    onTransactionHash(receipt.transactionHash);
  } catch (error) {
    console.error('[borrow] error.message => ', error.message);
  }
}

export async function repay(
  this: ImpermaxRouter,
  uniswapV2PairAddress: Address,
  poolTokenType: PoolTokenType,
  amount: BigNumber,
  // eslint-disable-next-line @typescript-eslint/ban-types
  onTransactionHash: Function
): Promise<void> {
  const [borrowable, token] = await this.getContracts(uniswapV2PairAddress, poolTokenType);
  const deadline = this.getDeadline();

  try {
    const wETHAddress = W_ETH_ADDRESSES[this.chainId];
    let receipt;
    if (token.address === wETHAddress) {
      const overrides = { value: amount };
      const tx = await this.router.repayETH(borrowable.address, this.account, deadline, overrides);
      receipt = await tx.wait();
    } else {
      const tx = await this.router.repay(borrowable.address, amount, this.account, deadline);
      receipt = await tx.wait();
    }
    onTransactionHash(receipt.transactionHash);
  } catch (error) {
    console.error('[repay] error.message => ', error.message);
  }
}

export async function leverage(
  this: ImpermaxRouter,
  uniswapV2PairAddress: Address,
  amountA: BigNumber,
  amountB: BigNumber,
  amountAMin: BigNumber,
  amountBMin: BigNumber,
  permitDataA: PermitData,
  permitDataB: PermitData,
  // eslint-disable-next-line @typescript-eslint/ban-types
  onTransactionHash: Function
): Promise<void> {
  const dataA = permitDataA ? permitDataA.permitData : '0x';
  const dataB = permitDataB ? permitDataB.permitData : '0x';
  if (permitDataA && permitDataB && !permitDataA.deadline.eq(permitDataB.deadline)) {
    return console.error('Permits deadline are not equal');
  }
  const deadline = permitDataA ? permitDataA.deadline : permitDataB ? permitDataB.deadline : this.getDeadline();
  try {
    const tx =
      await this.router.leverage(
        uniswapV2PairAddress,
        amountA,
        amountB,
        amountAMin,
        amountBMin,
        this.account,
        deadline,
        dataA,
        dataB
      );
    const receipt = await tx.wait();
    onTransactionHash(receipt.transactionHash);
  } catch (error) {
    console.error('[leverage] error.message => ', error.message);
  }
}

export async function deleverage(
  this: ImpermaxRouter,
  uniswapV2PairAddress: Address,
  tokens: BigNumber,
  amountAMin: BigNumber,
  amountBMin: BigNumber,
  permitData: PermitData,
  // eslint-disable-next-line @typescript-eslint/ban-types
  onTransactionHash: Function
): Promise<void> {
  const data = permitData ? permitData.permitData : '0x';
  const deadline = permitData ? permitData.deadline : this.getDeadline();
  try {
    const tx =
      await this.router.deleverage(uniswapV2PairAddress, tokens, amountAMin, amountBMin, deadline, data);
    const receipt = await tx.wait();
    onTransactionHash(receipt.transactionHash);
  } catch (error) {
    console.error('[deleverage] error.message => ', error.message);
  }
}

export async function trackBorrows(
  this: ImpermaxRouter,
  uniswapV2PairAddress: Address,
  // eslint-disable-next-line @typescript-eslint/ban-types
  onTransactionHash: Function
): Promise<void> {
  const toTrack = [];
  const borrowableA = await this.getPoolToken(uniswapV2PairAddress, PoolTokenType.BorrowableA);
  const borrowableB = await this.getPoolToken(uniswapV2PairAddress, PoolTokenType.BorrowableB);
  const borrowedA = await this.getBorrowed(uniswapV2PairAddress, PoolTokenType.BorrowableA);
  const borrowedB = await this.getBorrowed(uniswapV2PairAddress, PoolTokenType.BorrowableB);
  const sharesA = await this.getFarmingShares(uniswapV2PairAddress, PoolTokenType.BorrowableA);
  const sharesB = await this.getFarmingShares(uniswapV2PairAddress, PoolTokenType.BorrowableB);
  if (borrowedA > 0 && sharesA === 0) toTrack.push(borrowableA.address);
  if (borrowedB > 0 && sharesB === 0) toTrack.push(borrowableB.address);
  try {
    const tx = await this.claimAggregator.trackBorrows(this.account, toTrack);
    const receipt = await tx.wait();
    onTransactionHash(receipt.transactionHash);
  } catch (error) {
    console.error('[trackBorrows] error.message => ', error.message);
  }
}

export async function claims(
  this: ImpermaxRouter,
  uniswapV2PairAddress: Address,
  // eslint-disable-next-line @typescript-eslint/ban-types
  onTransactionHash: Function
): Promise<void> {
  const toClaim = [];
  const farmingPoolA = await this.getFarmingPool(uniswapV2PairAddress, PoolTokenType.BorrowableA);
  const farmingPoolB = await this.getFarmingPool(uniswapV2PairAddress, PoolTokenType.BorrowableB);
  const bigClaimAmountA = await farmingPoolA.claim();
  const claimAmountA = parseFloat(formatUnits(bigClaimAmountA));
  const bigClaimAmountB = await farmingPoolB.claim();
  const claimAmountB = parseFloat(formatUnits(bigClaimAmountB));
  if (claimAmountA * 1 > 0) toClaim.push(farmingPoolA.address);
  if (claimAmountB * 1 > 0) toClaim.push(farmingPoolB.address);
  try {
    const tx = this.claimAggregator.claims(this.account, toClaim);
    const receipt = await tx.wait();
    onTransactionHash(receipt.transactionHash);
  } catch (error) {
    console.error('[claims] error.message => ', error.message);
  }
}

export async function claimDistributor(
  this: ImpermaxRouter,
  distributorDetails: DistributorDetails,
  // eslint-disable-next-line @typescript-eslint/ban-types
  onTransactionHash: Function
): Promise<void> {
  const claimable = await this.getClaimable(distributorDetails.claimableAddress);
  try {
    const tx = await claimable.claim();
    const receipt = await tx.wait();
    onTransactionHash(receipt.transactionHash);
  } catch (error) {
    console.error('[claimDistributor] error.message => ', error.message);
  }
}

export async function createNewPair(
  this: ImpermaxRouter,
  uniswapV2PairAddress: Address,
  createPairStep: CreatePairStep,
  // eslint-disable-next-line @typescript-eslint/ban-types
  onTransactionHash: Function
): Promise<void> {
  try {
    let receipt;
    if (createPairStep === CreatePairStep.BORROWABLE0) {
      const tx = await this.factory.createBorrowable0(uniswapV2PairAddress);
      receipt = await tx.wait();
    }
    if (createPairStep === CreatePairStep.BORROWABLE1) {
      const tx = await this.factory.createBorrowable1(uniswapV2PairAddress);
      receipt = await tx.wait();
    }
    if (createPairStep === CreatePairStep.COLLATERAL) {
      const tx = await this.factory.createCollateral(uniswapV2PairAddress);
      receipt = await tx.wait();
    }
    if (createPairStep === CreatePairStep.INITIALIZE) {
      const tx = await this.factory.initializeLendingPool(uniswapV2PairAddress);
      receipt = await tx.wait();
    }
    onTransactionHash(receipt.transactionHash);
  } catch (error) {
    console.error('[createNewPair] error.message => ', error.message);
  }
}
