import React from 'react';
import { Button } from '../components/Button';
import { Icons } from '../components/icons';

interface HomePageProps {
  onRegisterClick: () => void;
}

const HeroSection: React.FC<{ onRegisterClick: () => void }> = ({ onRegisterClick }) => {
  return (
    <section className="relative flex min-h-[90vh] w-full flex-col items-center justify-center bg-foundation px-4 py-24 text-center overflow-hidden">
      
      <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f1f1f_1px,transparent_1px),linear-gradient(to_bottom,#1f1f1f_1px,transparent_1px)] bg-[size:50px_50px] animate-moving-grid"></div>
      </div>
      <div className="absolute inset-0 bg-foundation [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,transparent_0%,#000_100%)] pointer-events-none"></div>

      <div className="relative z-10 max-w-6xl flex flex-col items-center">
        <div className="mb-8 inline-flex items-center gap-3 px-4 py-1.5 bg-neon-surge/5 border border-neon-surge/30 rounded-full text-neon-surge font-jetbrains-mono text-xs uppercase tracking-[0.3em] backdrop-blur-md">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neon-surge opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-neon-surge"></span>
            </span>
            INSTITUTIONAL GRADE TRANSPARENCY
        </div>

        <h1 className="text-5xl sm:text-7xl md:text-8xl font-orbitron font-black tracking-tighter text-white leading-none mb-8 drop-shadow-[0_0_25px_rgba(0,255,192,0.1)]">
          WE'RE NOT A CASINO.
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-neon-surge to-neon-surge">
            WE'RE THE CODE.
          </span>
        </h1>

        <p className="mx-auto max-w-3xl text-xl text-text-secondary md:text-2xl leading-relaxed mb-12 font-rajdhani">
          Your fortified gateway to a smarter, fairer crypto gambling ecosystem. Engineered by degens, hardened by ZK-Rollups, amplified by unassailable data.
        </p>

        <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button 
              size="lg" 
              onClick={onRegisterClick} 
              className="shadow-[0_0_50px_rgba(0,255,192,0.4)] uppercase tracking-[0.2em] py-4 px-10 text-lg animate-pulse-glow-shadow"
            >
                [ EXECUTE LOGIN PROTOCOL ]
            </Button>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-foundation via-foundation/80 to-transparent"></div>
    </section>
  );
};

const FeaturedCasinos = () => {
  const casinoNames = [ "DUEL", "STAKE", "GAMDOM", "SHUFFLE", "ROOBET", "ROLLBIT", "BC.GAME", "TRUSTDICE", "LIMBO", "BITCASINO" ];
  const marqueeContent = [...casinoNames, ...casinoNames, ...casinoNames];

  return (
    <section className="w-full bg-[#000000] py-12 border-y border-foundation-light">
      <div className="container mx-auto max-w-7xl px-4 mb-8">
        <h2 className="text-center text-xl md:text-2xl font-orbitron font-bold text-white uppercase tracking-widest opacity-80">
          POWERING THE TOP TIER OPERATORS
        </h2>
      </div>
      <div className="relative w-full overflow-hidden mask-image-lr">
        <div className="flex w-max animate-slide items-center">
          {marqueeContent.map((name, index) => (
            <div key={index} className="mx-6 md:mx-10 flex items-center justify-center select-none">
              <span className="text-2xl md:text-3xl font-orbitron font-extrabold text-white tracking-wider opacity-60 hover:opacity-100 hover:text-neon-surge transition-opacity transition-colors duration-300 cursor-default">
                {name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const FeaturesSection = () => {
  const features = [
    { icon: Icons.Shield, title: "ZK-ROLLUP SECURITY", description: "Every result is secured and proven by zero-knowledge proofs on a Layer 2 solution. Trust the math, not the operator. Verifiable Provenance Record (VPR) for all transactions." },
    { icon: Icons.Users, title: "XAI ETHICAL COMPLIANCE", description: "Our Explainable AI (XAI) framework provides automated Responsible Gaming (RG) interventions and transparent risk scoring. Regulatory strength baked into the protocol." },
    { icon: Icons.Zap, title: "DEGEN REWARDS PROTOCOL", description: "Earn Zap Points for network contribution, verifiable transparency checks, and mission completion. Loyalty is coded, not assumed. Maximize your tactical edge." }
  ];

  return (
    <section id="features" className="bg-foundation py-16 md:py-24">
      <div className="container mx-auto max-w-7xl px-4">
        <h2 className="mb-4 text-center text-4xl font-orbitron font-bold text-white md:text-5xl uppercase tracking-tight">THE ZAP MANDATE</h2>
        <p className="mb-12 text-center text-xl text-text-secondary font-rajdhani">We don't sell games. We sell institutional integrity.</p>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {features.map((feature, index) => (
            <div key={index} className="rounded-xl bg-foundation-light p-8 transition-all duration-500 hover:shadow-neon-card-hover border border-transparent hover:border-neon-surge/30 group card-lift">
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-neon-surge/10 border border-neon-surge/30 transition-colors duration-300 group-hover:bg-neon-surge/20">
                <feature.icon className="h-7 w-7 text-neon-surge transition-transform duration-500 group-hover:rotate-12" />
              </div>
              <h3 className="mb-3 text-2xl font-orbitron font-extrabold text-white">{feature.title}</h3>
              <p className="text-text-secondary text-base leading-relaxed font-rajdhani">{feature.description}</p>
              <a href="#" className="mt-4 inline-flex items-center text-neon-surge text-sm font-semibold group-hover:underline">
                Read Protocol
                <Icons.ArrowRight className="h-4 w-4 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const HomePage: React.FC<HomePageProps> = ({ onRegisterClick }) => {
  return (
    <div>
      <HeroSection onRegisterClick={onRegisterClick} />
      <FeaturedCasinos />
      <FeaturesSection />
    </div>
  );
};

export default HomePage;