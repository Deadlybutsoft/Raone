import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MenuIcon, DownloadIcon, IntegrationsIcon } from './icons/index';
import { INTEGRATIONS } from './integrations';

interface HeaderProps {
  projectName: string;
  onMenuClick: () => void;
  onUpgradeClick: () => void;
  onDownloadZip: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  projectName,
  onMenuClick,
  onUpgradeClick,
  onDownloadZip,
}) => {
  const [isDownloadMenuOpen, setDownloadMenuOpen] = useState(false);
  const [isIntegrationsMenuOpen, setIntegrationsMenuOpen] = useState(false);
  const downloadMenuRef = useRef<HTMLDivElement>(null);
  const integrationsMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (downloadMenuRef.current && !downloadMenuRef.current.contains(event.target as Node)) {
        setDownloadMenuOpen(false);
      }
      if (integrationsMenuRef.current && !integrationsMenuRef.current.contains(event.target as Node)) {
        setIntegrationsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className="absolute top-0 left-0 right-0 flex items-center justify-between px-4 h-16 z-30 bg-black border-b border-zinc-700">
      <div className="flex items-center gap-3">
        <Link to="/" className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-white select-none font-logo">Raone</h1>
        </Link>
        <span className="text-zinc-700 select-none">/</span>
        <span className="text-lg font-medium text-zinc-400 select-none">{projectName}</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="relative" ref={integrationsMenuRef}>
            <button
                onClick={() => setIntegrationsMenuOpen(prev => !prev)}
                title="Integrations"
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium bg-black text-zinc-300 hover:text-white border border-zinc-600 hover:border-zinc-500 transition-colors rounded-md"
            >
                <IntegrationsIcon className="h-5 w-5 text-zinc-400" />
                <span>Integrations</span>
            </button>
            {isIntegrationsMenuOpen && (
                <div className="absolute top-full left-0 mt-2 w-80 bg-black border border-zinc-600 shadow-xl z-20 p-2 rounded-lg">
                    <div className="space-y-2">
                        {INTEGRATIONS.map(integration => (
                            <div
                                key={integration.id}
                                className="p-3 text-sm rounded-md hover:bg-zinc-900 transition-colors cursor-pointer"
                            >
                                <p className="font-medium text-slate-200">{integration.name}</p>
                                <p className="text-xs text-zinc-400 mt-1">{integration.description}</p>
                                <a
                                    href={integration.docsUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 mt-2"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    View Documentation
                                </a>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>

        <div className="relative" ref={downloadMenuRef}>
            <button
                onClick={() => setDownloadMenuOpen(prev => !prev)}
                title="Download"
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium bg-black text-zinc-300 hover:text-white border border-zinc-600 hover:border-zinc-500 transition-colors rounded-md"
            >
                <DownloadIcon className="h-5 w-5 text-zinc-400" />
                <span>Export</span>
            </button>
            {isDownloadMenuOpen && (
                <div className="absolute top-full right-0 mt-2 w-64 bg-black border border-zinc-600 shadow-xl z-20 p-2 rounded-lg">
                    <div className="space-y-1">
                        <button 
                            onClick={() => { onDownloadZip(); setDownloadMenuOpen(false); }}
                            className="w-full flex items-center gap-3 p-2 text-sm text-left rounded-md hover:bg-zinc-900 transition-colors"
                        >
                            <DownloadIcon className="w-5 h-5 text-slate-300" />
                            <span className="font-medium text-slate-200">Download Project (.zip)</span>
                        </button>
                    </div>
                </div>
            )}
        </div>

        <button
          onClick={onUpgradeClick}
          className="text-sm font-semibold bg-yellow-300 text-black px-5 py-2 rounded-md hover:bg-yellow-400 transition-colors"
        >
          Upgrade
        </button>
        
        <div className="h-6 w-px bg-zinc-700/50 mx-1"></div>
        
        <button
          onClick={onMenuClick}
          className="p-2 rounded-md hover:bg-zinc-900 transition-colors"
          aria-label="Open menu"
        >
          <MenuIcon className="h-6 w-6 text-zinc-300" />
        </button>
      </div>
    </header>
  );
};
