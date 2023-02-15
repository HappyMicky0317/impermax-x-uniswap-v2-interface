
import {
  Story,
  Meta
} from '@storybook/react';

import ImpermaxMirageContainedButton, { Props } from '.';

const Template: Story<Props> = args => <ImpermaxMirageContainedButton {...args} />;

const Default = Template.bind({});
Default.args = {
  children: 'ImpermaxMirageContainedButton'
};

export {
  Default
};

export default {
  title: 'buttons/ImpermaxMirageContainedButton',
  component: ImpermaxMirageContainedButton
} as Meta;
