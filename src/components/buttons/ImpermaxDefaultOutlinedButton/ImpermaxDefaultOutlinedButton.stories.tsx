
import {
  Story,
  Meta
} from '@storybook/react';

import ImpermaxDefaultOutlinedButton, { Props } from '.';

const Template: Story<Props> = args => <ImpermaxDefaultOutlinedButton {...args} />;

const Default = Template.bind({});
Default.args = {
  children: 'ImpermaxDefaultOutlinedButton'
};

export {
  Default
};

export default {
  title: 'buttons/ImpermaxDefaultOutlinedButton',
  component: ImpermaxDefaultOutlinedButton
} as Meta;
