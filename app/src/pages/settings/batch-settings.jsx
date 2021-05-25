import React from 'react';
import { TabsToggle } from '../../components/common/tabs-toggle';
import { ScrollContainer } from '../../components/layout';
import { 
  Departments,
  ProductionGroups,
  SKUS, TrackerDescriptor,
  Channels,
  VirtualSKU,
  SchedulerSettings,
} from '../../components/batches';

export const BatchSettings = () => {
  const configurationMenuTabs = [
    { title: 'SKUs', value: 'skus', component: SKUS },
    { title: 'Production Groups', value: 'productionGroups', component: ProductionGroups },
    { title: 'Departments', value: 'departments', component: Departments },
    { title: 'Tracker Descriptor', value: 'trackerDescriptor', component: TrackerDescriptor },
    { title: 'Channels', value: 'channels', component: Channels },
    { title: 'Ignore SKUs', value: 'ignoreSkus',  component: VirtualSKU },
    { title: 'Scheduler', value: 'scheduler', component: SchedulerSettings },
  ]

  const [selectedTab, changeTab] = React.useState(configurationMenuTabs[0].value);
  const BodyComponent = configurationMenuTabs.find(tab => tab.value === selectedTab).component;

  return (
    <ScrollContainer
      header={
        <TabsToggle
          items={configurationMenuTabs}
          value={selectedTab}
          onClick={changeTab}
        />
      }
      body={<BodyComponent />}
    />
  );
}
