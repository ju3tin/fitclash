/** @jsx jsx */
import { FC } from 'react';
import { jsx } from 'theme-ui';
import {
  Tab as OriginalTab,
  TabProps,
  Tabs as OriginalTabs,
  TabsProps as OriginalTabsProps,
  TabList as OriginalTabList,
  TabListProps,
  TabPanel as OriginalTabPanel,
  TabPanelProps,
} from 'react-tabs';

/**
 * Tab heading - you should specify the title/label string as the children property. To be created inside the `<TabList />` component through the children prop.
 */
export const Tab: FC<TabProps> = OriginalTab;

/**
 * Container for `<Tab />` headings, to be created inside the `<Tabs />` component. The list of `<Tab />` components should be passed as the children prop. */
export const TabList: FC<TabListProps> = OriginalTabList;

/**
 * Panel body container, to be created inside the `<Tabs />` component through the children prop.
 */
export const TabPanel: FC<TabPanelProps> = OriginalTabPanel;

export interface TabsOwnProps {
  fontSize?: number | string;
}

type TabsProps = TabsOwnProps & Omit<OriginalTabsProps, 'ref'>;

/**
 * Tabs component with [react-tabs](https://reactcommunity.org/react-tabs/) and custom styling.
 *
 */
export const Tabs: FC<TabsProps> = ({ fontSize = 1, ...props }) => {
  return (
    <div
      style={{
        // You can adjust this style as needed
        fontSize,
      }}
    >
      {OriginalTabs(props)}
    </div>
  );
};