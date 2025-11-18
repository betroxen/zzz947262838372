import React from 'react';
import { Icons } from '../components/icons';
import { Button } from '../components/Button';

const InfoCard = ({ icon: Icon, title, children }: { icon: React.FC<any>, title: string, children: React.ReactNode }) => (
    <div className="bg-foundation-light p-6 border border-[#333] rounded-lg card-lift">
        <div className="flex items-center gap-4 mb-4">
            <div className="bg-neon-surge/10 p-2 rounded-md">
                <Icon className="h-6 w-6 text-neon-surge" />
            </div>
            <h3 className="font-orbitron text-lg font-bold text-white">{title}</h3>
        </div>
        <p className="text-text-secondary text-sm leading-relaxed">{children}</p>
    </div>
);

const AffiliatePage: React.FC = () => {
    const tiers = [
        { tier: 'Tier 1', wagers: '$0 - $10,000', revShare: '25%' },
        { tier: 'Tier 2', wagers: '$10,001 - $50,000', revShare: '30%' },
        { tier: 'Tier 3', wagers: '$50,001 - $250,000', revShare: '35%' },
        { tier: 'Tier 4', wagers: '$250,001+', revShare: '40% (Custom)' },
    ];

    return (
        <div className="animate-fadeIn max-w-4xl mx-auto">
            <h1 className="font-orbitron text-3xl md:text-4xl font-bold text-white text-center">
                ZAP <span className="text-neon-surge text-glow">AMBASSADOR PROGRAM</span>
            </h1>
            <p className="text-text-secondary text-lg text-center mt-4 font-bold">
                Directive: Partner with the protocol. Monetize integrity.
            </p>
            <p className="mt-8 text-text-secondary leading-relaxed text-center max-w-3xl mx-auto">
                Join an elite cadre of partners dedicated to promoting a fairer, more transparent gaming ecosystem. Our ambassador program rewards you for bringing operators and players to the most secure infrastructure in iGaming.
            </p>

            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
                <InfoCard icon={Icons.TrendingUp} title="Industry-Leading Commissions">
                    Benefit from a transparent, tiered revenue share model. The more volume you drive, the higher your reward.
                </InfoCard>
                <InfoCard icon={Icons.BarChart} title="Real-Time Analytics">
                    Access a dedicated dashboard with live, verifiable data on your referrals' activity and earnings. No opaque reporting.
                </InfoCard>
                <InfoCard icon={Icons.Target} title="High-Value Creatives">
                    Utilize our library of professionally designed banners, links, and marketing materials engineered for high conversion.
                </InfoCard>
            </div>
            
            <div className="mt-12">
                <h2 className="font-orbitron text-2xl font-bold text-white mb-6 text-center">COMMISSION STRUCTURE</h2>
                 <div className="overflow-x-auto bg-foundation-light border border-[#333] rounded-lg p-2">
                    <table className="w-full text-left font-jetbrains-mono">
                        <thead>
                            <tr className="border-b border-[#333] text-xs text-text-tertiary uppercase tracking-wider">
                                <th className="p-4">Tier</th>
                                <th className="p-4">Monthly Wagers</th>
                                <th className="p-4 text-right">Revenue Share</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#333]">
                            {tiers.map(tier => (
                                <tr key={tier.tier} className="hover:bg-foundation-lighter/50">
                                    <td className="p-4 font-bold text-white">{tier.tier}</td>
                                    <td className="p-4 text-text-secondary">{tier.wagers}</td>
                                    <td className="p-4 text-right text-neon-surge font-bold">{tier.revShare}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="mt-12 text-center">
                <Button size="lg" className="shadow-neon-glow-md uppercase tracking-widest px-12">
                    Apply Now
                </Button>
            </div>
        </div>
    );
};

export default AffiliatePage;
