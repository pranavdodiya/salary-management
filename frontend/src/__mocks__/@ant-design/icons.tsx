import React from 'react';

const createIcon = (name: string) => {
  const Icon: React.FC<any> = (props) => <span data-testid={`icon-${name}`} {...props} />;
  Icon.displayName = name;
  return Icon;
};

export const PlusOutlined = createIcon('PlusOutlined');
export const EditOutlined = createIcon('EditOutlined');
export const DeleteOutlined = createIcon('DeleteOutlined');
export const SearchOutlined = createIcon('SearchOutlined');
export const ReloadOutlined = createIcon('ReloadOutlined');
export const DollarOutlined = createIcon('DollarOutlined');
export const TeamOutlined = createIcon('TeamOutlined');
export const RiseOutlined = createIcon('RiseOutlined');
export const FallOutlined = createIcon('FallOutlined');
export const BarChartOutlined = createIcon('BarChartOutlined');
export const GlobalOutlined = createIcon('GlobalOutlined');
export const DashboardOutlined = createIcon('DashboardOutlined');
export const DownloadOutlined = createIcon('DownloadOutlined');
export const TrophyOutlined = createIcon('TrophyOutlined');
