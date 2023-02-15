
import clsx from 'clsx';

const ListItem = ({
  className,
  ...rest
}: React.ComponentPropsWithRef<'li'>): JSX.Element => (
  <li
    className={clsx(
      'py-2.5',
      className
    )}
    {...rest} />
);

const List = ({
  className,
  ...rest
}: React.ComponentPropsWithRef<'ul'>): JSX.Element => (
  <ul
    className={clsx(
      'divide-y',
      'divide-impermaxMercury',
      className
    )}
    {...rest} />
);

export {
  ListItem
};

export default List;
