import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { AuthPage } from './AuthPage';
import { ArrowRightIcon, SparklesIcon, DesktopIcon, DownloadIcon, GithubIcon, SuvoLogo, WandSparklesIcon, EyeIcon, RocketIcon, TwitterIcon } from './icons';

// --- Animation Hook ---
const useScrollAnimation = () => {
    useEffect(() => {
        const elements = document.querySelectorAll('.scroll-animate');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    // Optional: unobserve after animation
                    // observer.unobserve(entry.target); 
                }
            });
        }, { threshold: 0.1 });

        elements.forEach(el => observer.observe(el));

        return () => elements.forEach(el => observer.unobserve(el));
    }, []);
};

// --- Sub-components for Homepage Sections ---

const FeatureCard: React.FC<{ icon: React.FC<{className?:string}>, title: string, children: React.ReactNode, delay: number }> = ({ icon: Icon, title, children, delay }) => (
    <div className="relative glowing-card group scroll-animate transition-transform duration-300 hover:-translate-y-2" style={{ transitionDelay: `${delay}ms`}}>
        <div className="relative p-8 bg-zinc-950/80 backdrop-blur-md rounded-2xl h-full overflow-hidden">
            <div className="flex items-center justify-center w-12 h-12 bg-white text-black rounded-lg">
                <Icon className="w-6 h-6" />
            </div>
            <h3 className="mt-6 text-2xl font-bold text-white font-logo">{title}</h3>
            <p className="mt-2 text-zinc-400">{children}</p>
        </div>
    </div>
);

const HowToStepCard: React.FC<{ icon: React.FC<{className?:string}>, number: string, title: string, children: React.ReactNode, delay: number }> = ({ icon: Icon, number, title, children, delay }) => (
    <div className="relative group scroll-animate" style={{ transitionDelay: `${delay}ms`}}>
        <div className="absolute -top-8 -left-8 text-[12rem] font-bold font-logo text-white/5 group-hover:text-white/10 transition-colors duration-300 -z-10 select-none">
            {number}
        </div>
        <div className="relative p-8 bg-zinc-950/50 backdrop-blur-sm rounded-2xl border border-white/10 transition-all duration-300 group-hover:border-white/20 group-hover:-translate-y-1">
            <div className="flex items-center justify-center w-12 h-12 bg-white/10 border border-white/20 rounded-lg">
                <Icon className="w-6 h-6 text-white" />
            </div>
            <h3 className="mt-6 text-2xl font-bold text-white">{title}</h3>
            <p className="mt-2 text-zinc-400">{children}</p>
        </div>
    </div>
);

// Fix: Define HomePageProps interface
interface HomePageProps {
  onLaunchWorkspace: (prompt?: string, image?: File | null) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onLaunchWorkspace }) => {
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  useScrollAnimation();
  
  const handleLaunchDemo = () => {
    setIsExiting(true);
    setTimeout(() => {
      onLaunchWorkspace();
    }, 500); // duration of the fade-out animation
  };

  const handleGetStarted = () => {
    setIsAuthOpen(true);
  }

  const handleLearnMore = () => {
    const element = document.getElementById('what-is-raone');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }

  return (
    <div 
      className={`text-white bg-black transition-opacity duration-500 ${isExiting ? 'opacity-0' : 'opacity-100'}`}
    >
        <div className="relative">
             {/* Header */}
            <header className="fixed w-full z-30 top-0 left-0 pt-6 transition-all duration-300">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-between p-2">
                        <Link to="/" className="flex items-center gap-2 pl-4">
                            <h1 className="text-2xl font-bold text-white select-none font-logo">Raone</h1>
                        </Link>
                        <button 
                            onClick={() => setIsAuthOpen(true)}
                            className="px-5 py-2 bg-black text-white rounded-full hover:bg-zinc-800 transition-colors font-semibold text-sm"
                        >
                            Sign In
                        </button>
                    </div>
                </div>
            </header>

            {/* Section 1: Hero */}
            <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 pt-24 pb-16 overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <div className="absolute top-[-20%] left-[-15%] w-[50vw] h-[50vw] bg-pink-500/20 rounded-full filter blur-3xl animate-background-blob opacity-80"></div>
                    <div className="absolute top-[10%] right-[-20%] w-[60vw] h-[60vw] bg-purple-600/20 rounded-full filter blur-3xl animate-background-blob animation-delay-4000 opacity-70"></div>
                    <div className="absolute bottom-[-30%] left-[15%] w-[45vw] h-[45vw] bg-red-500/10 rounded-full filter blur-3xl animate-background-blob animation-delay-2000 opacity-60"></div>
                </div>
                 <div 
                    className="absolute inset-0 z-10"
                    style={{
                    backgroundImage: 'linear-gradient(to right, rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 1px, transparent 1px)',
                    backgroundSize: '40px 40px',
                    maskImage: 'radial-gradient(ellipse at center, white 10%, transparent 70%)',
                    }}
                ></div>

                <div className="relative z-20">
                    <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tighter text-white animate-fade-in-up">
                        Build apps with the power of ai agent
                    </h1>
                    <p className="mt-8 max-w-4xl mx-auto text-xl md:text-2xl text-zinc-200 text-center leading-relaxed animate-fade-in-up font-code" style={{ animationDelay: '0.2s' }}>
                        Raone: The secure agent that transforms app ideas into production-ready software in hours.
                    </p>
                    <div className="mt-16 flex flex-col items-center gap-6 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                        <div className="flex flex-wrap items-center justify-center gap-4">
                             <button
                                onClick={handleGetStarted}
                                className="group inline-flex items-center justify-center gap-3 px-8 py-4 bg-white text-black rounded-full hover:bg-zinc-200 transition-colors font-semibold text-lg"
                            >
                                <span>Get Started</span>
                            </button>
                            <button
                                onClick={handleLearnMore}
                                className="group inline-flex items-center justify-center gap-3 px-8 py-4 bg-zinc-800 text-white rounded-full hover:bg-zinc-700 border border-zinc-600 transition-colors font-semibold text-lg"
                            >
                                <span>Learn More</span>
                            </button>
                        </div>
                    </div>
                </div>
            </section>
            
            {/* Section 2: What is Raone? */}
            <section id="what-is-raone" className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 overflow-hidden border-t-8 border-black animated-cubes-bg">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] max-w-4xl max-h-4xl bg-purple-600/20 rounded-full filter blur-3xl animate-background-blob opacity-60"></div>
                <div className="relative z-10 max-w-4xl mx-auto">
                    <h2 className="text-5xl md:text-6xl font-bold tracking-tight scroll-animate">What is Raone?</h2>
                    <p className="mt-8 font-code text-lg md:text-xl text-white/90 leading-relaxed max-w-3xl mx-auto scroll-animate" style={{ transitionDelay: '100ms' }}>
                        Raone is your AI development partner, translating ideas into complete, well-structured applications. It handles the boilerplate, freeing you to focus on creating.
                    </p>
                </div>
            </section>

            {/* Section 3: Why Choose Raone? */}
            <section className="relative min-h-screen flex flex-col items-center justify-center text-black py-24 md:py-32 px-6 overflow-hidden border-t-8 border-black">
                <div className="absolute inset-0 z-0 animated-grid-bg"></div>
                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="text-center">
                        <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white scroll-animate">A radically faster workflow.</h2>
                        <p className="mt-4 max-w-3xl mx-auto text-lg text-zinc-300 scroll-animate" style={{ transitionDelay: '100ms' }}>
                            Stop wrestling with boilerplate and start creating. Raone handles the heavy lifting so you can focus on your vision.
                        </p>
                    </div>
                    <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
                        <FeatureCard icon={SparklesIcon} title="AI Development" delay={200}>
                            Describe your app in plain English. Raone's AI understands your vision and generates the complete codebase, from components to styling.
                        </FeatureCard>
                        <FeatureCard icon={DesktopIcon} title="Live Previews" delay={300}>
                            See your application come to life in real-time. Every change is instantly reflected in a live, interactive preview environment.
                        </FeatureCard>
                        <FeatureCard icon={DownloadIcon} title="One-Click Export" delay={400}>
                            Get production-ready code, not a prototype. Export your entire project as a standard Vite + React application, ready to deploy.
                        </FeatureCard>
                    </div>
                </div>
            </section>

            {/* Section 4: How to Use Raone? (Redesigned) */}
            <section className="relative min-h-screen flex flex-col items-center justify-center py-24 md:py-32 px-6 overflow-hidden border-t-8 border-black animated-lines-bg">
                <div className="max-w-7xl mx-auto relative z-20">
                    <div className="text-center">
                        <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white scroll-animate">Just three simple steps.</h2>
                        <p className="mt-4 max-w-2xl mx-auto text-lg text-zinc-400 scroll-animate" style={{ transitionDelay: '100ms' }}>
                            From a simple prompt to a fully functional application, your development process has never been this streamlined.
                        </p>
                    </div>
                    
                    <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-16">
                        <div className="relative">
                           <HowToStepCard icon={WandSparklesIcon} number="01" title="Describe Vision" delay={200}>
                                Start with a prompt, screenshot, or sketch. Tell Raone what you want to build, from a component to a complex dashboard.
                           </HowToStepCard>
                           <div className="hidden md:block absolute top-1/2 left-full w-full h-px -translate-y-1/2 scroll-animate" style={{ transitionDelay: '300ms' }}>
                               <div className="w-0 h-full border-t-2 border-dashed border-white/20 animate-draw-connector"></div>
                           </div>
                        </div>
                         <div className="relative">
                           <HowToStepCard icon={EyeIcon} number="02" title="Iterate in Real-Time" delay={400}>
                                Watch as Raone builds your app in the live preview. Ask for changes, tweak the design, and refine functionality with natural language.
                           </HowToStepCard>
                           <div className="hidden md:block absolute top-1/2 left-full w-full h-px -translate-y-1/2 scroll-animate" style={{ transitionDelay: '500ms' }}>
                               <div className="w-0 h-full border-t-2 border-dashed border-white/20 animate-draw-connector"></div>
                           </div>
                        </div>
                        <HowToStepCard icon={RocketIcon} number="03" title="Export & Deploy" delay={600}>
                            When you're ready, export the project. You get clean, production-grade Vite, React, and Tailwind code to deploy anywhere.
                        </HowToStepCard>
                    </div>
                </div>
            </section>
        </div>

        {/* Footer */}
        <footer className="relative z-10 w-full border-t-8 border-black bg-black overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-full z-0">
                <div className="absolute top-[-20%] left-[-15%] w-[50vw] h-[50vw] bg-pink-500/10 rounded-full filter blur-3xl animate-background-blob opacity-80"></div>
                <div className="absolute top-[10%] right-[-20%] w-[60vw] h-[60vw] bg-purple-600/10 rounded-full filter blur-3xl animate-background-blob animation-delay-4000 opacity-70"></div>
            </div>
            <div className="relative max-w-7xl mx-auto px-6 py-16">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                    {/* Brand and Newsletter */}
                    <div className="md:col-span-4">
                        <div className="flex items-center gap-2">
                           <h3 className="text-2xl font-bold text-white font-logo">Raone</h3>
                        </div>
                        <p className="mt-4 text-zinc-400 text-sm max-w-xs">The AI workspace for building production-ready web applications.</p>
                        <form className="mt-6 space-y-3" onSubmit={(e) => e.preventDefault()}>
                            <label className="text-sm font-semibold text-white">Stay updated</label>
                            <div className="flex gap-2">
                                <input type="email" placeholder="Enter your email" className="flex-grow p-2 bg-zinc-900 border border-zinc-700 rounded-md text-sm placeholder:text-zinc-500 focus:ring-1 focus:ring-white outline-none" />
                                <button type="submit" className="p-2 bg-white text-black rounded-md hover:bg-zinc-200"><ArrowRightIcon className="w-5 h-5"/></button>
                            </div>
                        </form>
                    </div>

                    {/* Links */}
                    <div className="md:col-span-8 grid grid-cols-2 sm:grid-cols-3 gap-8">
                        <div>
                            <h4 className="text-sm font-semibold text-white tracking-wider uppercase">Product</h4>
                            <ul className="mt-4 space-y-3">
                                <li><a href="#" className="text-zinc-400 hover:text-white transition-colors">Features</a></li>
                                <li><a href="#" className="text-zinc-400 hover:text-white transition-colors">Pricing</a></li>
                                <li><a href="#" className="text-zinc-400 hover:text-white transition-colors">Workspace</a></li>
                                <li><a href="#" className="text-zinc-400 hover:text-white transition-colors">Demo</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-sm font-semibold text-white tracking-wider uppercase">Resources</h4>
                            <ul className="mt-4 space-y-3">
                                <li><a href="#" className="text-zinc-400 hover:text-white transition-colors">Documentation</a></li>
                                <li><a href="#" className="text-zinc-400 hover:text-white transition-colors">Help Center</a></li>
                                <li><a href="#" className="text-zinc-400 hover:text-white transition-colors">Blog</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-sm font-semibold text-white tracking-wider uppercase">Company</h4>
                            <ul className="mt-4 space-y-3">
                                <li><a href="#" className="text-zinc-400 hover:text-white transition-colors">About Us</a></li>
                                <li><a href="#" className="text-zinc-400 hover:text-white transition-colors">Contact</a></li>
                                <li><a href="#" className="text-zinc-400 hover:text-white transition-colors">Careers</a></li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-16 border-t border-white/10 pt-8 flex flex-col sm:flex-row justify-between items-center gap-6">
                     <p className="text-zinc-500 text-sm order-2 sm:order-1">
                        &copy; {new Date().getFullYear()} Raone. All rights reserved.
                    </p>
                    <div className="flex items-center gap-6 order-1 sm:order-2">
                        <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-white transition-colors">
                            <GithubIcon className="w-6 h-6" />
                        </a>
                        <a href="https://x.com" target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-white transition-colors">
                            <TwitterIcon className="w-6 h-6" />
                        </a>
                    </div>
                </div>
            </div>
        </footer>
      
      {isAuthOpen && <AuthPage onClose={() => setIsAuthOpen(false)} onTryDemo={handleLaunchDemo} />}
    </div>
  );
};
