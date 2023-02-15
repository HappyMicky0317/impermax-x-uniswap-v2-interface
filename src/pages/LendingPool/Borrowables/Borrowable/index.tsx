
import clsx from 'clsx';
import List, { ListItem } from 'components/List';
import Panel from 'components/Panel';

import ImpermaxImage from 'components/UI/ImpermaxImage';

/**
 * Generate the Currency Equity Details card,
 * giving information about the supply and rates for a particular currency in the system.
 */

interface Props {
  tokenIcon: string;
  tokenName: string;
  tokenSymbol: string;
  items: Array<{
    name: string;
    value: string;
  }>
}

const Borrowable = ({
  tokenIcon,
  tokenName,
  tokenSymbol,
  items
}: Props): JSX.Element => {
  return (
    <Panel
      className={clsx(
        'px-6',
        'py-6',
        'bg-white'
      )}>
      <div
        className={clsx(
          'py-3',
          'flex',
          'items-center',
          'space-x-3'
        )}>
        <ImpermaxImage
          width={32}
          height={32}
          src={tokenIcon} />
        <h4
          className='text-lg'>
          {tokenName} ({tokenSymbol})
        </h4>
      </div>
      <List>
        {items.map(item => (
          <ListItem
            key={item.name}
            className={clsx(
              'flex',
              'items-center',
              'justify-between'
            )}>
            <span>{item.name}</span>
            <span>{item.value}</span>
          </ListItem>
        ))}
      </List>
    </Panel>
  );
};

export default Borrowable;
