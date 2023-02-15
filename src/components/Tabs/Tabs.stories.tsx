
import * as React from 'react';
import {
  Story,
  Meta
} from '@storybook/react';

import Tabs, {
  Tab,
  TabPanel,
  TabsProps
} from './';

const TAB_ITEMS = [
  {
    id: 'my-account',
    label: 'My Account'
  },
  {
    id: 'company',
    label: 'Company'
  },
  {
    id: 'team-members',
    label: 'Team Members'
  },
  {
    id: 'billing',
    label: 'Billing'
  }
];

const Template: Story<TabsProps> = args => {
  const [selectedIndex, setSelectedIndex] = React.useState(0);

  const handleSelect = (newIndex: number) => () => {
    setSelectedIndex(newIndex);
  };

  return (
    <>
      <Tabs {...args}>
        {TAB_ITEMS.map((tabItem, index) => (
          <Tab
            key={tabItem.id}
            id={tabItem.id}
            index={index}
            selectedIndex={selectedIndex}
            onSelect={handleSelect(index)}>
            {tabItem.label}
          </Tab>
        ))}
      </Tabs>
      <TabPanel
        index={0}
        selectedIndex={selectedIndex}
        id='link1'>
        <p>
          TabPanel1
        </p>
      </TabPanel>
      <TabPanel
        index={1}
        selectedIndex={selectedIndex}
        id='link2'>
        <p>
          TabPanel2
        </p>
      </TabPanel>
      <TabPanel
        index={2}
        selectedIndex={selectedIndex}
        id='link3'>
        <p>
          TabPanel3
        </p>
      </TabPanel>
      <TabPanel
        index={3}
        selectedIndex={selectedIndex}
        id='link4'>
        <p>
          TabPanel4
        </p>
      </TabPanel>
    </>
  );
};

const Default = Template.bind({});
Default.args = {};

export {
  Default
};

export default {
  title: 'Tabs',
  component: Tabs
} as Meta;
