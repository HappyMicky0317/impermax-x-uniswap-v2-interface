
import * as React from 'react';
import {
  Story,
  Meta
} from '@storybook/react';
import clsx from 'clsx';

import ImpermaxModal, {
  ImpermaxModalTitle,
  ImpermaxModalInnerWrapper,
  Props
} from '.';

const Template: Story<Props> = args => {
  const [open, setOpen] = React.useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <button onClick={handleOpen}>
        Open
      </button>
      <ImpermaxModal
        {...args}
        open={open}
        onClose={handleClose}>
        <ImpermaxModalInnerWrapper className='max-w-lg'>
          <ImpermaxModalTitle
            as='h3'
            className={clsx(
              'text-lg',
              'font-medium'
            )}>
            Payment successful
          </ImpermaxModalTitle>
          <div className='mt-2'>
            <p
              className={clsx(
                'text-sm',
                'text-textSecondary'
              )}>
              Your payment has been successfully submitted. We’ve sent your
              an email with all of the details of your order.
            </p>
          </div>
          <div className='mt-4'>
            <button
              type='button'
              className={clsx(
                'inline-flex',
                'justify-center',
                'px-4',
                'py-2',
                'text-sm',
                'font-medium',
                'text-blue-900',
                'bg-blue-100',
                'border',
                'border-transparent',
                'rounded-md',
                'hover:bg-blue-200',
                'focus:outline-none',
                'focus-visible:ring-2',
                'focus-visible:ring-offset-2',
                'focus-visible:ring-blue-500'
              )}
              onClick={handleClose}>
              Got it, thanks!
            </button>
          </div>
        </ImpermaxModalInnerWrapper>
      </ImpermaxModal>
    </>
  );
};

const Default = Template.bind({});
Default.args = {};

export {
  Default
};

export default {
  title: 'UI/ImpermaxModal',
  component: ImpermaxModal
} as Meta;
