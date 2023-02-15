import './index.scss';
import { DistributorDetails } from '../../../utils/constants';
import { useAvailableClaimable } from '../../../hooks/useData';
import InteractionButton from '../../../components/InteractionButton';
import useClaimDistributor from '../../../hooks/useClaimDistributor';
import { formatAmount } from '../../../utils/format';

export default function ClaimDistributor({ distributor }: { distributor: DistributorDetails }): JSX.Element | null {
  const availableClaimable = useAvailableClaimable(distributor.claimableAddress);
  const [claimDistributorState, onClaimDistributor] = useClaimDistributor(distributor);

  if (!availableClaimable) return null;

  return (
    <div className='claim-distributor'>
      <div><b>{distributor.name}</b></div>
      <div>
        <InteractionButton
          name={'Claim ' + formatAmount(availableClaimable) + ' IMX'}
          onCall={onClaimDistributor}
          state={claimDistributorState} />
      </div>
    </div>
  );
}
