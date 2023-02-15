
import {
  Story,
  Meta
} from '@storybook/react';

import ImpermaxJadeButtonGroup, {
  ImpermaxJadeButtonGroupItem
} from '.';

const Template: Story = args => <ImpermaxJadeButtonGroup {...args} />;

const Default = Template.bind({});
Default.args = {
  children: (
    <ImpermaxJadeButtonGroup>
      <ImpermaxJadeButtonGroupItem>
        Years
      </ImpermaxJadeButtonGroupItem>
      <ImpermaxJadeButtonGroupItem>
        Months
      </ImpermaxJadeButtonGroupItem>
      <ImpermaxJadeButtonGroupItem>
        Days
      </ImpermaxJadeButtonGroupItem>
    </ImpermaxJadeButtonGroup>
  )
};

export {
  Default
};

export default {
  title: 'button-groups/ImpermaxJadeButtonGroup',
  component: ImpermaxJadeButtonGroup
} as Meta;
