import { AccountLendingPoolPage } from '../';

function AccountLendingPoolPageSelector({
  pageSelected,
  setPageSelected,
  hasFarming
}: AccountLendingPoolPageSelectorProps): JSX.Element {
  return (
    <div className='account-lending-pool-page-selector'>
      {pageSelected === AccountLendingPoolPage.Leverage ? (
        <div className='selected'>Borrowing</div>
      ) : (
        <div onClick={() => setPageSelected(AccountLendingPoolPage.Leverage)}>Borrowing</div>
      )}
      {pageSelected === AccountLendingPoolPage.EarnInterest ? (
        <div className='selected'>Lending</div>
      ) : (
        <div onClick={() => setPageSelected(AccountLendingPoolPage.EarnInterest)}>Lending</div>
      )}
      {hasFarming && (
        <>
          {pageSelected === AccountLendingPoolPage.Farming ? (
            <div className='selected'>IMX Farming</div>
          ) : (
            <div onClick={() => setPageSelected(AccountLendingPoolPage.Farming)}>IMX Farming</div>
          )}
        </>
      )}
    </div>
  );
}

export interface AccountLendingPoolPageSelectorProps {
  pageSelected: AccountLendingPoolPage;
  // eslint-disable-next-line @typescript-eslint/ban-types
  setPageSelected: Function;
  hasFarming: boolean;
}

export default AccountLendingPoolPageSelector;
