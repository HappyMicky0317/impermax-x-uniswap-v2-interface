import clsx from 'clsx';
import { useMeasure } from 'react-use';

import AppBar from 'parts/AppBar';
import Footer from 'parts/Footer';
import { LAYOUT } from 'utils/constants/styles';

const Layout = ({
  children,
  className,
  ...rest
}: React.ComponentPropsWithRef<'div'>): JSX.Element => {
  const [ref, { height: footerHeight }] = useMeasure<HTMLDivElement>();

  return (
    <div
      style={{
        paddingTop: LAYOUT.APP_BAR_HEIGHT
      }}
      className={clsx(
        'bg-impermaxBlackHaze',
        'relative',
        'min-h-screen',
        className
      )}
      {...rest}>
      <AppBar
        appBarHeight={LAYOUT.APP_BAR_HEIGHT}
        className={clsx(
          'fixed',
          'top-0',
          'right-0',
          'left-0',
          'z-impermaxAppBar'
        )} />
      <main
        className={clsx(
          'container',
          'mx-auto',
          'px-4',
          'sm:px-8'
        )}
        style={{
          paddingBottom: footerHeight
        }}>
        {children}
      </main>
      <Footer
        ref={ref}
        className={clsx(
          'absolute',
          'bottom-0',
          'w-full'
        )} />
    </div>
  );
};

export default Layout;
