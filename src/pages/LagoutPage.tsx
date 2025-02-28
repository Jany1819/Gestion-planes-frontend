import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '@/components/Lagout/Sidebar';

const DashboardPage: React.FC = () => {
    return (
        <div className="flex min-h-screen">
            {/* Sidebar */}
            <Sidebar />

            {/* Main Content */}
            <div className="flex-grow bg-[#3b3b3b] p-8">
                <div className="max-w-4xl mx-auto"> 
                    <Outlet /> 
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;