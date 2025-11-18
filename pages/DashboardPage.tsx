import React from 'react';
import { SkeletonCard } from '../components/SkeletonCard';

const DashboardPage: React.FC = () => {
  return (
    <div className="animate-fadeIn">
      <h1 className="font-orbitron text-3xl font-bold text-white mb-2">COMMAND CENTER</h1>
      <p className="text-text-secondary mb-8">Welcome back, Operator. Systems are online and nominal.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="card-lift"><SkeletonCard /></div>
        <div className="card-lift"><SkeletonCard /></div>
        <div className="card-lift"><SkeletonCard /></div>
      </div>

       <div className="mt-12">
        <h2 className="font-orbitron text-2xl font-bold text-white mb-4">Live Game Feed</h2>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="card-lift"><SkeletonCard /></div>
            <div className="card-lift"><SkeletonCard /></div>
         </div>
      </div>
    </div>
  );
};

export default DashboardPage;