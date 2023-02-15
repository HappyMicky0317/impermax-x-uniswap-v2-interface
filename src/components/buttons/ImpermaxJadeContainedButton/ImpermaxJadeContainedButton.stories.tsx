
import {
  Story,
  Meta
} from '@storybook/react';

import ImpermaxJadeContainedButton, { Props } from '.';

const Template: Story<Props> = args => <ImpermaxJadeContainedButton {...args} />;

const Default = Template.bind({});
Default.args = {
  children: 'ImpermaxJadeContainedButton'
};

export {
  Default
};

export default {
  title: 'buttons/ImpermaxJadeContainedButton',
  component: ImpermaxJadeContainedButton
} as Meta;
