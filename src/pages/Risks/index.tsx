
import MainContainer from 'parts/MainContainer';

const Risks = (): JSX.Element => {
  return (
    <MainContainer>
      <div className='article card'>
        <h1 className='font-weight-bold'>Risks of Using Impermax Finance</h1>
        <p>The use of Impermax Finance involves risks. Only invest what you can afford to lose. By using this application you acknowledge and take responsibility for the risks involved. The possible risks include, but are not limited to, the following.</p>
        <h2>Contract Security</h2>
        <p>
          Impermax smart contracts were audited by&nbsp;
          <a
            target='_blank'
            href='https://www.certik.org/'
            rel='noopener noreferrer'>
            Certik
          </a>
          &nbsp;and&nbsp;
          <a
            target='_blank'
            href='https://cyberunit.tech/'
            rel='noopener noreferrer'>
            Cyber Unit
          </a>.
          <ul>
            <li>
              <a
                target='_blank'
                href='https://github.com/Impermax-Finance/impermax-x-uniswapv2-core/blob/main/audit/CertiK%20Audit%20Report%20for%20impermax-x-uniswapv2-core.pdf'
                rel='noopener noreferrer'>
                Core audit by Certik
              </a>
            </li>
            <li>
              <a
                target='_blank'
                href='https://github.com/Impermax-Finance/IMX/blob/main/audit/CertiK%20Audit%20Report%20for%20IMX.pdf'
                rel='noopener noreferrer'>
                IMX audit by Certik
              </a>
            </li>
            <li>
              <a
                target='_blank'
                href='https://github.com/Impermax-Finance/impermax-x-uniswapv2-core/blob/main/audit/SC_impermax_core.pdf'
                rel='noopener noreferrer'>
                Core audit by Cyber Unit
              </a>
            </li>
            <li>
              <a
                target='_blank'
                href='https://github.com/Impermax-Finance/impermax-x-uniswapv2-periphery/blob/main/audit/SC_impermax_periphery.pdf'
                rel='noopener noreferrer'>
                Periphery audit by Cyber Unit
              </a>
            </li>
            <li>
              <a
                target='_blank'
                href='https://github.com/Impermax-Finance/simple-uniswap-oracle/blob/main/audit/SC_impermax_oracle.pdf'
                rel='noopener noreferrer'>
                Oracle audit by Cyber Unit
              </a>
            </li>
          </ul>
          However, audited smart contracts may still contain bugs and errors. Please consider this while using Impermax’s DeFi applications.
        </p>
        <p>
          <b>Official Impermax Smart Contract Addresses:</b>
          <ul>
            <li>
              <b>Impermax (IMX): </b>
              <a
                target='_blank'
                href='https://etherscan.io/token/0x7b35Ce522CB72e4077BaeB96Cb923A5529764a00'
                rel='noopener noreferrer'>
                0x7b35Ce522CB72e4077BaeB96Cb923A5529764a00
              </a>
            </li>
            <li>
              <b>Factory: </b>
              <a
                target='_blank'
                href='https://etherscan.io/address/0x8C3736e2FE63cc2cD89Ee228D9dBcAb6CE5B767B'
                rel='noopener noreferrer'>
                0x8C3736e2FE63cc2cD89Ee228D9dBcAb6CE5B767B
              </a>
            </li>
            <li>
              <b>Router: </b>
              <a
                target='_blank'
                href='https://etherscan.io/address/0x5e169082fFf23cEE6766062B96051A78c543127D'
                rel='noopener noreferrer'>
                0x5e169082fFf23cEE6766062B96051A78c543127D
              </a>
            </li>
            <li>
              <b>Oracle: </b>
              <a
                target='_blank'
                href='https://etherscan.io/address/0x5671B249391cA5E6a8FE28CEb1e85Dc41c12Ba7D'
                rel='noopener noreferrer'>
                0x5671B249391cA5E6a8FE28CEb1e85Dc41c12Ba7D
              </a>
            </li>
          </ul>
        </p>
        <h2>Borrowing</h2>
        <p>When you use your LP tokens as collateral to require a loan or enter in a leverage position on Impermax, your collateral is always at stake and it may be liquidated when certain conditions are met. Before requiring a loan the application will show an <i>estimation</i> of the liquidation prices. When the market price crosses the liquidation prices, your collateral may be liquidated in order to repay your loan. Please notice that the liquidation prices are not fixed and may change as your loan size increases.</p>
        <h2>Lending</h2>
        <p>
          Supplying liquidity on Impermax is a low risk way to earn interest on your funds. However, it is not risk-free. There are three main factors that a lender should consider:
          <ul>
            <li><b>Contract security</b>: as mentioned earlier, Impermax is a new platform and it is still untested in a production environment with millions of USD in assets under management. An unexpected bug or hack to the platform may result in the loss of your funds.</li>
            <li><b>You may temporarily be unable to withdraw</b>: as with every protocol based on lending pools, the lender may not be able to withdraw all of his funds at a certain point in time if there isn’t enough liquidity in the pool. Impermax uses a dynamic interest rate model that reduces the likelihood of funds not being withdrawable for a prolonged period of time.</li>
            <li><b>Unliquidated loans</b>: lenders rely on the fact that when the ratio of collateral to loan value for a certain loan is low enough, liquidators will take action to liquidate the loan. However, if this does not happen in time the loan may default. Impermax aligns all the economic incentives to reduce the likelihood of loan default to the minimum. It also keeps a percentage of the protocol profits in reserves that can be used to repay eventual loans that have defaulted, but this is still a risk that lenders should consider.</li>
          </ul>
        </p>
        <h2>Be Aware of Low Liquidity Pairs and Malicious Pairs</h2>
        <p>Impermax is a permissionless platform to which anyone can add a new pair. This means that some pairs will involve more risks than others, and some may even be created solely as scams.</p>
        <p>
          <b>Low Liquidity Pairs</b><br />
          Low liquidity pairs where there are not many active users can be very risky for both borrowers and lenders. In particular a few problems of low liquidity pairs are:
          <ul>
            <li>Inactive price oracle: Impermax relies on TWAP (Time Weighted Average Prices) calculated as the average price between an operation and the previous one on the pair. If a pair is inactive for a long period of time, the price of the oracle may differ substantially by the market price.</li>
            <li>Inactive liquidators: as soon as a loan becomes liquidatable, liquidators can liquidate it and earn a profit. However, in an inactive pair there may be no liquidator following liquidations, and this can result in a possible funds loss for lenders.</li>
          </ul>
        </p>
        <p>
          <b>Malicious Pairs</b><br />
          Users may create pairs on Impermax solely as scams. If you deposit your funds in such a pair you may not be able to withdraw them. When you use a pair on Impermax, you should always check the address in the URL. It should correspond with the address of the Uniswap LP token correlated to that pair.
        </p>
        <h2>Test our Product on Testnet First</h2>
        <p>
          If you’re new to Impermax and are unsure of how it works and how to use it, please check out our&nbsp;
          <a
            target='_blank'
            href='https://ropsten.impermax.finance/'
            rel='noopener noreferrer'>
            application on the ropsten testnet
          </a> first. There, you will be able to use the same application and see how it interoperates with Uniswap in a safe environment with free funds.
        </p>
      </div>
    </MainContainer>
  );
};

export default Risks;
