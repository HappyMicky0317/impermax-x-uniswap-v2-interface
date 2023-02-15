
import {
  Story,
  Meta
} from '@storybook/react';

import ImpermaxTooltip, { Props } from '.';

const Template: Story<Props> = args => <ImpermaxTooltip {...args} />;

const Default = Template.bind({});
Default.args = {
  label: 'Save',
  children: <button style={{ fontSize: 25 }}>💾</button>
};

export {
  Default
};

export default {
  title: 'UI/ImpermaxTooltip',
  component: ImpermaxTooltip
} as Meta;
