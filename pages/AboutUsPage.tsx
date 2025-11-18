import React from 'react';
import { Icons } from '../components/icons';

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

const AboutUsPage: React.FC = () => {
    return (
        <div className="animate-fadeIn max-w-4xl mx-auto">
            <h1 className="font-orbitron text-3xl md:text-4xl font-bold text-white text-center">
                ABOUT ZAPWAY: <span className="text-neon-surge text-glow">INTEGRITY IS THE CODE.</span>
            </h1>
            <p className="text-text-secondary text-lg text-center mt-4 font-bold">
                Directive: Gamble Smarter, Not Harder.
            </p>
            <p className="mt-8 text-text-secondary leading-relaxed">
                The legacy gambling model is broken. ZapWay was founded on one mandate: replace centralized trust with verifiable math. We are not just an iGaming platform; we are the institutional infrastructure for the new crypto economy.
            </p>

            <div className="mt-12">
                <h2 className="font-orbitron text-2xl font-bold text-white mb-6">THE ZAPWAY STACK: ELIMINATING TRUST</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InfoCard icon={Icons.Zap} title="ZK-Rollup Finality">
                        Every wager, outcome, and transaction is processed on a Layer 2 ZK-Rollup. This means results are cryptographically proven, not just promised, with an immutable record committed on-chain.
                    </InfoCard>
                    <InfoCard icon={Icons.RefreshCw} title="Decentralized VRF">
                        Game outcomes are powered by audited Verifiable Random Functions (VRF) Oracles, guaranteeing randomness and provable fairness for every single hand or spin.
                    </InfoCard>
                     <InfoCard icon={Icons.Shield} title="MPC Custody">
                        Our corporate treasury and player assets are secured by Multi-Party Computation (MPC). This eliminates the single point of failure, even for us, enforcing N-of-M multi-signature security for all asset movements.
                    </InfoCard>
                </div>
            </div>

            <div className="mt-12">
                <h2 className="font-orbitron text-2xl font-bold text-white mb-6">INSTITUTIONAL STRENGTH, PLAYER PROTECTION</h2>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InfoCard icon={Icons.Cpu} title="Explainable AI (XAI)">
                        Our proprietary Ethical AI system proactively monitors and enforces Responsible Gaming limits. Every automated intervention is transparent and auditable, fulfilling rigorous GDPR Article 22 mandates.
                    </InfoCard>
                    <InfoCard icon={Icons.FileCheck} title="VASP Compliance">
                        We operate under strict dual-licensing requirements, meeting both iGaming and VASP (Virtual Asset Service Provider) AML/CTF standards. We have a zero-tolerance policy for illicit activity.
                    </InfoCard>
                    <InfoCard icon={Icons.Verified} title="Verifiable Data">
                        Every player gets a real-time dashboard to verify the cryptographic proofs (VPR) of their gameplay.
                    </InfoCard>
                </div>
            </div>
            
            <div className="mt-12 border-t border-[#333] pt-8">
                <h2 className="font-orbitron text-2xl font-bold text-white mb-4">OUR MISSION</h2>
                <p className="text-text-secondary leading-relaxed mb-6">
                    We partner with elite operators, integrating our Provably Fair protocols directly onto their platforms, bringing a new standard of integrity to the wider crypto market.
                </p>
                <p className="font-bold text-white text-lg">
                    We're not just playing the game. We're rewriting the rules.
                </p>
                 <p className="text-neon-surge font-bold text-lg mt-4">
                    Join the new standard. Join ZapWay.
                </p>
            </div>
        </div>
    );
};

export default AboutUsPage;
