import React from 'react';
import Sidebar from '../components/Dashboard/Sidebar'; 
import MainContent from '../components/Dashboard/MainContent'; 

const DashboardPage: React.FC = () => {
  return (
    <div className="flex min-h-screen">
        
      {/* Sidebar: Menú lateral */}
      <Sidebar />

      {/* MainContent: Área principal */}
      <MainContent />
    </div>
  );
};

export default DashboardPage;