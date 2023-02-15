// TODO: <
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
// TODO: >

import {
  LendingPoolData,
  Address,
  UserData
} from 'types/interfaces';
import * as initializer from './initializer';
import * as cacheData from './cacheData';
import * as account from './account';

class Subgraph {
  chainId: number;
  lendingPoolsData: Promise<{
    [key in Address]?: LendingPoolData
  }>;
  usersData: {
    [key in Address]?: Promise<UserData>
  };

  constructor(config: SubgraphConfigInterface) {
    this.chainId = config.chainId;
    this.usersData = {};
  }

  cleanCache(): void {
    this.lendingPoolsData = null;
    this.usersData = null;
  }

  // Fetchers
  public fetchLendingPools = initializer.fetchLendingPools;
  public fetchPastVolume = initializer.fetchPastVolume;
  public fetchCurrentVolumeAndReserves = initializer.fetchCurrentVolumeAndReserves;
  public fetchUniswapAPY = initializer.fetchUniswapAPY;
  public fetchBlockByTimestamp = initializer.fetchBlockByTimestamp;
  public initializeLendingPoolsData = initializer.initializeLendingPoolsData;
  public getLendingPoolsData = initializer.getLendingPoolsData;
  public getLendingPoolData = initializer.getLendingPoolData;
  public fetchUserData = initializer.fetchUserData;
  public initializeUserData = initializer.initializeUserData;
  public getUserData = initializer.getUserData;

  // Data Getters
  public getSymbol = cacheData.getSymbol;
  public getDecimals = cacheData.getDecimals;
  public getExchangeRate = cacheData.getExchangeRate;
  public getUnderlyingAddress = cacheData.getUnderlyingAddress;
  public getTokenPrice = cacheData.getTokenPrice;
  public getImxPrice = cacheData.getImxPrice;
  public getTotalBalance = cacheData.getTotalBalance;
  public getTotalBalanceUSD = cacheData.getTotalBalanceUSD;
  public getReserveFactor = cacheData.getReserveFactor;
  public getKinkBorrowRate = cacheData.getKinkBorrowRate;
  public getKinkUtilizationRate = cacheData.getKinkUtilizationRate;
  public getBorrowIndex = cacheData.getBorrowIndex;
  public getAccrualTimestamp = cacheData.getAccrualTimestamp;
  public getTotalBorrows = cacheData.getTotalBorrows;
  public getCurrentTotalBorrows = cacheData.getCurrentTotalBorrows;
  public getTotalBorrowsUSD = cacheData.getTotalBorrowsUSD;
  public getBorrowRate = cacheData.getBorrowRate;
  public getNextBorrowRate = cacheData.getNextBorrowRate;
  public getNextBorrowAPY = cacheData.getNextBorrowAPY;
  public getSupply = cacheData.getSupply;
  public getUtilizationRate = cacheData.getUtilizationRate;
  public getNextSupplyRate = cacheData.getNextSupplyRate;
  public getNextSupplyAPY = cacheData.getNextSupplyAPY;
  public getUniswapAPY = cacheData.getUniswapAPY;
  public getRewardSpeed = cacheData.getRewardSpeed;
  public getNextFarmingAPY = cacheData.getNextFarmingAPY;

  // Account
  public getBorrowPositions = account.getBorrowPositions;
  public getSupplyPositions = account.getSupplyPositions;
  public getCollateralAmount = account.getCollateralAmount;
  public getCollateralValue = account.getCollateralValue;
  public getBorrowedAmount = account.getBorrowedAmount;
  public getBorrowedValue = account.getBorrowedValue;
  public getBorrowerEquityValue = account.getBorrowerEquityValue;
  public getSuppliedAmount = account.getSuppliedAmount;
  public getSuppliedValue = account.getSuppliedValue;
  public getAccountTotalValueLocked = account.getAccountTotalValueLocked;
  public getAccountTotalValueSupplied = account.getAccountTotalValueSupplied;
  public getAccountTotalValueBorrowed = account.getAccountTotalValueBorrowed;
}

export interface SubgraphConfigInterface {
  chainId: number;
}

export default Subgraph;
