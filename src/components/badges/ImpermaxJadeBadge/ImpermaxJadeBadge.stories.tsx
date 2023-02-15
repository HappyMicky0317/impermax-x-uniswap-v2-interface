
import {
  Story,
  Meta
} from '@storybook/react';

import ImpermaxJadeBadge from '.';

const Template: Story = args => <ImpermaxJadeBadge {...args} />;

const Default = Template.bind({});
Default.args = {
  children: 'ImpermaxJadeBadge'
};

export {
  Default
};

export default {
  title: 'badges/ImpermaxJadeBadge',
  component: ImpermaxJadeBadge
} as Meta;
