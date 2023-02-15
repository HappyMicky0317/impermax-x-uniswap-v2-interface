
import {
  Story,
  Meta
} from '@storybook/react';

import ImpermaxCarnationBadge from './';

const Template: Story = args => <ImpermaxCarnationBadge {...args} />;

const Default = Template.bind({});
Default.args = {
  children: 'ImpermaxCarnationBadge'
};

export {
  Default
};

export default {
  title: 'badges/ImpermaxCarnationBadge',
  component: ImpermaxCarnationBadge
} as Meta;
