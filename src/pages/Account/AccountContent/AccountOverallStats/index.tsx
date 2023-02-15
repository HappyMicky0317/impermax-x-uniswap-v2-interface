
import OverallStatsInternal from 'components/OverallStatsInternal';
import {
  useAccountTotalValueLocked,
  useAccountTotalValueSupplied,
  useAccountTotalValueBorrowed
} from 'hooks/useAccountData';

const AccountOverallStats = (): JSX.Element => {
  const totalValueLocked = useAccountTotalValueLocked();
  const totalValueSupplied = useAccountTotalValueSupplied();
  const totalValueBorrowed = useAccountTotalValueBorrowed();

  return (
    <OverallStatsInternal
      totalValueLocked={totalValueLocked}
      totalValueSupplied={totalValueSupplied}
      totalValueBorrowed={totalValueBorrowed} />
  );
};

export default AccountOverallStats;
