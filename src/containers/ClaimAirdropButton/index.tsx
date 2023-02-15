
import * as React from 'react';
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import { formatUnits } from '@ethersproject/units';
import { Contract } from '@ethersproject/contracts';

import ImpermaxJadeContainedButton from 'components/buttons/ImpermaxJadeContainedButton';
import getAirdropData from 'services/get-airdrop-data';
import { formatNumberWithCommaDecimals } from 'utils/helpers/format-number';
import MerkleDistributorJSON from 'abis/contracts/IMerkleDistributor.json';
import { MERKLE_DISTRIBUTOR_ADDRESSES } from 'config/web3/contracts/merkle-distributors';
import { IMX_DECIMALS } from 'config/web3/contracts/imxes';
import { useTransactionAdder } from 'store/transactions/hooks';
import { AirdropData } from 'types/airdrop';
import STATUSES from 'utils/constants/statuses';

const useMerkleDistributorContract = () => {
  const {
    chainId,
    library,
    account
  } = useWeb3React<Web3Provider>();

  if (!chainId) return null;
  if (!library) return null;
  if (!account) return null;

  const signer = library.getSigner(account);
  const merkleDistributorContractAddress = MERKLE_DISTRIBUTOR_ADDRESSES[chainId];

  if (!merkleDistributorContractAddress) {
    throw new Error('Invalid merkle distributor contract address!');
  }

  const merkleDistributorContract =
    new Contract(merkleDistributorContractAddress, MerkleDistributorJSON.abi, signer);

  return merkleDistributorContract;
};

const ClaimAirdropButton = (): JSX.Element | null => {
  const {
    chainId,
    account
  } = useWeb3React<Web3Provider>();

  const addTransaction = useTransactionAdder();

  const [airdropData, setAirdropData] = React.useState<AirdropData>();
  const [claimed, setClaimed] = React.useState<boolean>();
  const [claimStatus, setClaimStatus] = React.useState(STATUSES.IDLE);

  const merkleDistributorContract = useMerkleDistributorContract();

  React.useEffect(() => {
    if (!chainId) return;
    if (!account) return;

    (async () => {
      try {
        const theAirdropData = await getAirdropData(chainId, account);

        setAirdropData(theAirdropData);
      } catch (error) {
        // TODO: should add error handling UX
        console.log('[ClaimAirdrop useEffect] error.message => ', error.message);
      }
    })();
  }, [
    chainId,
    account
  ]);

  React.useEffect(() => {
    if (!airdropData) return;
    if (!merkleDistributorContract) return;

    try {
      (async () => {
        const theClaimed = await merkleDistributorContract.isClaimed(airdropData.index);
        setClaimed(!!theClaimed);
      })();
    } catch (error) {
      // TODO: should add error handling UX
      console.log('[ClaimAirdrop useEffect] error.message => ', error.message);
    }
  }, [
    airdropData,
    merkleDistributorContract
  ]);

  const handleClaim = async () => {
    try {
      if (!merkleDistributorContract) {
        throw new Error('Invalid merkleDistributorContract!');
      }
      if (!airdropData) {
        throw new Error('Invalid airdropData!');
      }
      if (!account) {
        throw new Error('Invalid account!');
      }

      setClaimStatus(STATUSES.PENDING);
      const tx =
        await merkleDistributorContract.claim(airdropData.index, account, airdropData.amount, airdropData.proof);
      const receipt = await tx.wait();

      // const amount = parseFloat(airdropData.amount.toString()) / 1e18; // TODO: update other cases
      const amount = parseFloat(formatUnits(airdropData.amount, IMX_DECIMALS));
      const summary = `Claim ${formatNumberWithCommaDecimals(amount)} IMX`;
      addTransaction({ hash: receipt.transactionHash }, { summary });
      setClaimStatus(STATUSES.RESOLVED);
      setClaimed(true);
    } catch (error) {
      setClaimStatus(STATUSES.REJECTED);
      // TODO: should add error handling UX
      console.log('[handleClaim] error.message => ', error.message);
    }
  };

  if (!airdropData?.amount) return null;
  if (claimed) return null;

  return (
    <ImpermaxJadeContainedButton
      style={{
        height: 36
      }}
      pending={claimStatus === STATUSES.PENDING}
      onClick={handleClaim}>
      Claim {formatNumberWithCommaDecimals(parseFloat(formatUnits(airdropData.amount, IMX_DECIMALS)))} IMX
    </ImpermaxJadeContainedButton>
  );
};

export default ClaimAirdropButton;
