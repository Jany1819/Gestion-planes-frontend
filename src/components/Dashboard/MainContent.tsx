import React from 'react';
import { Outlet } from 'react-router-dom';

const MainContent: React.FC = () => {
  return (
    <div className="flex-grow p-8 bg-[#ececec]">
      <Outlet />
    </div>
  );
};

export default MainContent;