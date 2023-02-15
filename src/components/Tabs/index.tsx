
import clsx from 'clsx';

interface TabProps {
  index: number;
  selectedIndex: number;
  id: string;
  children: React.ReactNode;
  onSelect: () => void;
  className?: string;
}

const Tab = ({
  index,
  selectedIndex,
  id,
  children,
  onSelect,
  className
}: TabProps): JSX.Element => {
  const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    onSelect();
  };

  const selected = index === selectedIndex;

  return (
    <a
      id={id}
      className={clsx(
        'inline-grid',
        'place-items-center',
        selected ?
          clsx(
            'bg-gray-100',
            'text-gray-700'
          ) :
          clsx(
            'text-impermaxBlackHaze-100',
            'hover:text-impermaxBlackHaze-600'
          ),
        'px-3',
        'py-2',
        'font-medium',
        'text-md',
        'rounded-md',
        className
      )}
      href={`#${id}`}
      role='tablist'
      data-toggle='tab'
      onClick={handleClick}>
      {children}
    </a>
  );
};

interface TabPanelProps {
  id: string;
  index: number;
  selectedIndex: number;
}

const TabPanel = ({
  id,
  index,
  selectedIndex,
  ...rest
}: TabPanelProps & React.ComponentPropsWithRef<'div'>): JSX.Element | null => {
  const selected = selectedIndex === index;
  if (!selected) return null;

  return (
    <div
      id={id}
      {...rest} />
  );
};

const Tabs = ({
  className,
  ...rest
}: TabsProps): JSX.Element => {
  return (
    <nav
      className={clsx(
        'flex',
        className
      )}
      role='tablist'
      {...rest} />
  );
};

export type TabsProps = React.ComponentPropsWithRef<'nav'>;

export {
  Tab,
  TabPanel
};

export default Tabs;
