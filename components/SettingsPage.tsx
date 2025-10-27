import React, { useState, useEffect } from 'react';
import { 
    CloseIcon,
    CreditCardIcon,
    UserCircleIcon,
} from './icons';
import { 
    SettingsAccountIcon,
    SettingsMemoryIcon,
} from './icons/settings-icons';
import type { SettingsTab } from '../types';

interface SettingsPageProps {
  onClose: () => void;
  onClearChat: () => boolean;
  onUpgradeClick: () => void;
  initialTab?: SettingsTab;
  onSignOut: () => void;
}

const SettingsHeader: React.FC<{ title: string; description: string }> = ({ title, description }) => (
    <div className="pb-6">
        <h2 className="text-xl font-semibold text-white">{title}</h2>
        <p className="mt-1 text-sm text-zinc-400">{description}</p>
    </div>
);

const SettingsRow: React.FC<{ title: string, description: string, children: React.ReactNode }> = ({ title, description, children }) => (
    <div className="py-5 border-t border-zinc-700 grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
        <div className="md:col-span-1">
            <h3 className="font-medium text-white">{title}</h3>
            <p className="text-sm text-zinc-400">{description}</p>
        </div>
        <div className="md:col-span-2">{children}</div>
    </div>
);

export const SettingsPage: React.FC<SettingsPageProps> = ({
  onClose,
  onClearChat,
  onUpgradeClick,
  onSignOut,
  initialTab = 'account',
}) => {
  const [activeTab, setActiveTab] = useState<SettingsTab>(initialTab);

  const settingsTabs: { id: SettingsTab; label: string; icon: React.FC<{className?: string}> }[] = [
    { id: 'account', label: 'Account', icon: SettingsAccountIcon },
    { id: 'subscription', label: 'Subscription', icon: CreditCardIcon },
    { id: 'memory', label: 'Memory', icon: SettingsMemoryIcon },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'account':
        return (
            <>
                <SettingsHeader title="Account" description="Manage your account details and session." />
                <SettingsRow title="Account Status" description="Your work is not saved in demo mode. Please log in to store your projects.">
                    <div className="p-6 bg-zinc-950 rounded-lg space-y-4 flex flex-col items-center text-center border border-zinc-800">
                        <UserCircleIcon className="w-12 h-12 text-zinc-500" />
                        <div>
                            <p className="font-semibold text-lg text-white">Demo Account</p>
                            <p className="text-sm text-zinc-400 mt-1">
                                You are currently in a temporary session.
                            </p>
                        </div>
                        <button 
                            onClick={onSignOut}
                            className="w-full max-w-xs px-4 py-2.5 text-sm font-semibold bg-white hover:bg-zinc-200 text-black rounded-md transition-colors"
                        >
                            Login to Store Your Work
                        </button>
                    </div>
                </SettingsRow>
            </>
        );
      case 'memory':
        return (
            <>
                <SettingsHeader title="Memory" description="Manage chat history and context." />
                <SettingsRow title="Chat History" description="Clearing history will remove all messages from the current session.">
                    <button 
                        onClick={() => {
                            if (onClearChat()) {
                                alert('Chat history has been cleared.');
                            }
                        }}
                        className="px-4 py-2 text-sm font-medium bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors"
                    >
                        Clear Chat History
                    </button>
                </SettingsRow>
            </>
        );
      case 'subscription':
        return (
             <>
                <SettingsHeader title="Subscription" description="Manage your billing information and plan." />
                <SettingsRow title="Current Plan" description="You are currently on the Free plan.">
                    <div className="p-4 bg-zinc-950 flex items-center justify-between rounded-lg">
                        <div>
                            <p className="font-semibold text-lg text-white">Free</p>
                        </div>
                        <button onClick={onUpgradeClick} className="px-4 py-2 font-medium text-black bg-white hover:bg-zinc-200 rounded-md transition-colors">
                            Upgrade Plan
                        </button>
                    </div>
                </SettingsRow>
            </>
        );
      default:
        return null;
    }
  };

  return (
    <div 
        role="dialog"
        aria-modal="true"
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
    >
        <div 
            className="w-full max-w-4xl h-full max-h-[80vh] bg-black text-white shadow-2xl rounded-lg flex flex-col overflow-hidden border border-zinc-700"
            onClick={(e) => e.stopPropagation()}
        >
            <header className="flex-shrink-0 p-4 border-b border-zinc-700 flex items-center justify-between">
                <h1 className="text-xl font-semibold">Settings</h1>
                <button onClick={onClose} className="p-1.5 rounded-full hover:bg-zinc-800">
                    <CloseIcon className="h-5 w-5 text-zinc-400" />
                </button>
            </header>

            <div className="flex-1 flex overflow-hidden">
                <aside className="w-60 flex-shrink-0 border-r border-zinc-700 p-4">
                    <nav className="flex flex-col space-y-1">
                        {settingsTabs.map(tab => (
                            <button 
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-left rounded-md transition-colors ${activeTab === tab.id ? 'bg-white text-black' : 'text-zinc-400 hover:bg-zinc-900 hover:text-white'}`}
                            >
                                <tab.icon className={`w-5 h-5 flex-shrink-0 ${activeTab === tab.id ? '' : 'text-zinc-500'}`} />
                                <span>{tab.label}</span>
                            </button>
                        ))}
                    </nav>
                </aside>

                <main className="flex-1 overflow-y-auto">
                    <div className="p-8">
                        {renderContent()}
                    </div>
                </main>
            </div>
        </div>
    </div>
  );
};