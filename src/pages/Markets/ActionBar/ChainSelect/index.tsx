
import {
  useParams,
  useHistory
} from 'react-router-dom';
import clsx from 'clsx';

import Select, {
  SelectButton,
  SelectOptions,
  SelectOption,
  SelectBody,
  SelectCheck,
  SelectText
} from 'components/Select';
import ImpermaxImage from 'components/UI/ImpermaxImage';
import { SUPPORTED_CHAINS } from 'config/web3/chains';
import { PARAMETERS } from 'utils/constants/links';
import { SupportedChain } from 'types/web3/general.d';

interface Props {
  routeLink: string;
}

const ChainSelect = ({
  routeLink
}: Props): JSX.Element => {
  const { [PARAMETERS.CHAIN_ID]: selectedChainIDParam } = useParams<Record<string, string>>();
  const value = SUPPORTED_CHAINS.find(supportedChain => supportedChain.id === Number(selectedChainIDParam));

  if (!value) {
    throw new Error('Something went wrong!');
  }
  if (!routeLink.includes(PARAMETERS.CHAIN_ID)) {
    throw new Error('Invalid router link!');
  }

  const history = useHistory();
  const handleChange = (newValue: SupportedChain) => {
    history.push({
      ...history.location,
      pathname: routeLink.replace(`:${PARAMETERS.CHAIN_ID}`, newValue.id.toString())
    });
  };

  return (
    <Select
      value={value}
      onChange={handleChange}>
      {({ open }) => (
        <SelectBody
          style={{
            minWidth: 240
          }}>
          <SelectButton>
            <span
              className={clsx(
                'flex',
                'items-center',
                'space-x-3'
              )}>
              <ImpermaxImage
                src={value.iconPath}
                alt={value.label}
                className={clsx(
                  'flex-shrink-0',
                  'h-6',
                  'w-6',
                  'rounded-full'
                )} />
              <SelectText>
                {value.label}
              </SelectText>
            </span>
          </SelectButton>
          <SelectOptions open={open}>
            {SUPPORTED_CHAINS.map(chain => (
              <SelectOption
                key={chain.id}
                value={chain}>
                {({
                  selected,
                  active
                }) => (
                  <>
                    <div
                      className={clsx(
                        'flex',
                        'items-center',
                        'space-x-3'
                      )}>
                      <ImpermaxImage
                        src={chain.iconPath}
                        alt={chain.label}
                        className={clsx(
                          'flex-shrink-0',
                          'h-6',
                          'w-6',
                          'rounded-full'
                        )} />
                      <SelectText selected={selected}>
                        {chain.label}
                      </SelectText>
                    </div>
                    {selected ? (
                      <SelectCheck active={active} />
                    ) : null}
                  </>
                )}
              </SelectOption>
            ))}
          </SelectOptions>
        </SelectBody>
      )}
    </Select>
  );
};

export default ChainSelect;
