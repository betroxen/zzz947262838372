import React from 'react';

const PlaceholderPage: React.FC<{ title: string; description: string }> = ({ title, description }) => (
    <div className="animate-fadeIn text-center py-20">
      <h1 className="font-orbitron text-4xl font-bold text-white mb-2">
        <span className="text-neon-surge">//</span> {title}
      </h1>
      <p className="text-text-secondary mt-4 max-w-2xl mx-auto">{description}</p>
    </div>
);

const CasinoDirectoryPage: React.FC = () => {
  return (
    <PlaceholderPage
      title="Operator Grid"
      description="This is the casino and operator directory. Unbiased data, reviews, and live RTP feeds for all our partners will be listed here. This module is currently under development."
    />
  );
};

export default CasinoDirectoryPage;
