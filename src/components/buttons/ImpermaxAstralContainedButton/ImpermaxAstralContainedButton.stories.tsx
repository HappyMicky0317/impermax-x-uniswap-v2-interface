
import {
  Story,
  Meta
} from '@storybook/react';

import ImpermaxAstralContainedButton, { Props } from '.';

const Template: Story<Props> = args => <ImpermaxAstralContainedButton {...args} />;

const Default = Template.bind({});
Default.args = {
  children: 'ImpermaxAstralContainedButton'
};

export {
  Default
};

export default {
  title: 'buttons/ImpermaxAstralContainedButton',
  component: ImpermaxAstralContainedButton
} as Meta;
