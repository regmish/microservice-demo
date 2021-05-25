import React from 'react';
import MuiTabs from '@material-ui/core/Tabs';
import MuiTab from '@material-ui/core/Tab';
import Divider from '@material-ui/core/Divider';
import Box from '@material-ui/core/Box';

export const TabsToggle = ({ items, onClick, value = ''}) => {

  const handleChange = (event, tabValue) => {
    onClick(tabValue);
  };

  return (
    <Box px={2}>
      <MuiTabs
        value={value || items?.[0]?.value}
        onChange={handleChange}
        variant="scrollable"
        scrollButtons="auto"
        indicatorColor="primary"
        textColor="primary"
        aria-label="tabs"
      >
        {items.map(({ value: tabValue, title, icon }) => (
          <MuiTab
            key={tabValue}
            label={title}
            icon={icon}
            value={tabValue}
          />
        ))}
      </MuiTabs>
      <Divider />
    </Box>
  );
};
