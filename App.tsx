"use client"

import type React from "react"
import { useState, useCallback, useEffect } from "react"
import { Routes, Route, useNavigate } from "react-router-dom"
import { useAuth0 } from "@auth0/auth0-react"
import { Header } from "./components/Header"
import { SideDrawer } from "./components/SideDrawer"
import { ChatPanel } from "./components/ChatPanel"
import { ResizablePanel } from "./components/ResizablePanel"
import { useChat } from "./hooks/useChat"
import type { FileSystem, AppTheme, SettingsTab, Project, Message } from "./types"
import { HomePage } from "./components/HomePage"
import JSZip from "jszip"
import { SettingsPage } from "./components/SettingsPage"
import { PricingModal } from "./components/PricingModal"
import { MainDisplayPanel } from "./components/MainDisplayPanel"
import { ImageEditorModal } from "./components/ImageEditorModal"

const initialFileSystem: FileSystem = {
  'index.html': {
    content: `<!DOCTYPE html>
<html lang="en" class="dark">
<head>
  <meta charset="UTF-8" />
  <link rel="icon" type="image/svg+xml" href="/vite.svg" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Raone Project</title>
</head>
<body>
  <div id="root"></div>
  <script type="module" src="/src/main.tsx"></script>
</body>
</html>`,
    type: 'html'
  },
  'src/main.tsx': {
    content: `import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './styles/globals.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
`,
    type: 'tsx'
  },
  'src/App.tsx': {
    content: `import React from 'react';

function App() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center text-center p-4">
      <h1 className="text-5xl font-extrabold mb-4 text-white font-mono">Welcome to Raone</h1>
      <p className="text-lg text-zinc-400">This is a starter template. Ask me to build something!</p>
    </div>
  )
}

export default App;
`,
    type: 'tsx'
  },
  'src/styles/globals.css': {
    content: `@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  font-family: 'Inter', sans-serif;
  background-color: #020617; /* slate-950 */
}`,
    type: 'css'
  },
  'package.json': {
    content: `{
  "name": "raone-project",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.2.0",
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "autoprefixer": "^10.4.17",
    "postcss": "^8.4.35",
    "tailwindcss": "^3.4.1",
    "typescript": "^5.3.3",
    "vite": "^5.0.0"
  }
}`,
    type: 'json'
  },
  'vite.config.ts': {
    content: `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
})
`,
    type: 'ts'
  },
  'tsconfig.node.json': {
    content: `{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true
  },
  "include": ["vite.config.ts"]
}`,
    type: 'json'
  },
  'tsconfig.json': {
    content: `{
  "compilerOptions": {
    "target": "ESNext",
    "useDefineForClassFields": true,
    "lib": ["DOM", "DOM.Iterable", "ESNext"],
    "allowJs": false,
    "skipLibCheck": true,
    "esModuleInterop": false,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx"
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}`,
    type: 'json'
  },
  'tailwind.config.js': {
      content: `/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {},
  },
  plugins: [],
}`,
      type: 'js'
  },
  'postcss.config.js': {
      content: `export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}`,
      type: 'js'
  },
  'public/vite.svg': {
    content: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128"><path fill="#41d1ff" d="M112 20.1L64 3.4 16 20.1v31.8L28.1 42c1.2-2.8 4.1-4.8 7.3-4.8h11.2c3.2 0 6.1 2 7.3 4.8l10-3.3-15.9-24.9 20-6.6 20 6.6-15.9 24.9 10 3.3c1.2-2.8 4.1-4.8 7.3-4.8h11.2c3.2 0 6.1 2 7.3 4.8L112 51.9V20.1z"/><path fill="#bd34fe" d="M112 59.9v48L64 124.6l-48-16.7v-48l48 16.7z"/><path fill="#41d1ff" d="M64 76.6l48-16.7v-8l-48 16.7z"/><path fill="#bd34fe" d="M16 51.9v8l48 16.7V68.6z"/></svg>`,
    type: 'svg'
  }
};

const defaultProject: Project = {
  id: Date.now(),
  name: "Welcome",
  fileSystem: initialFileSystem,
  messages: [],
};

let initialPromptForWorkspace: string | undefined = undefined;
let initialImagesForWorkspace: File[] = [];

async function dataURLtoFile(dataurl: string, filename: string): Promise<File> {
    const res = await fetch(dataurl);
    const blob = await res.blob();
    return new File([blob], filename, { type: 'image/png' });
}

const Workspace: React.FC = () => {
  const navigate = useNavigate();
  const [isDrawerOpen, setDrawerOpen] = useState(false)
  const [isApiPanelHidden, setApiPanelHidden] = useState(false)
  const [isSettingsOpen, setSettingsOpen] = useState(false)
  const [isPricingModalOpen, setPricingModalOpen] = useState(false)
  const [initialSettingsTab, setInitialSettingsTab] = useState<SettingsTab>('account');

  const [projects, setProjects] = useState<Project[]>([defaultProject]);
  const [activeProjectId, setActiveProjectId] = useState<number>(defaultProject.id);
  const [activeFile, setActiveFile] = useState<string>('src/App.tsx');
  const activeProject = projects.find(p => p.id === activeProjectId) ?? projects[0];

  const [isSelectMode, setIsSelectMode] = useState(false);
  const [selectedSelectors, setSelectedSelectors] = useState<string[]>([]);
  
  const [screenshotTrigger, setScreenshotTrigger] = useState(0);
  const [imageToAttach, setImageToAttach] = useState<File | null>(null);

  const [isImageEditorOpen, setIsImageEditorOpen] = useState(false);
  const [imageForEditing, setImageForEditing] = useState<string | null>(null);

  const [isEntering, setIsEntering] = useState(false);

  useEffect(() => {
    // Animate workspace entrance
    const timer = setTimeout(() => setIsEntering(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // This effect ensures that the active file is always valid.
    // It runs when the project changes or its file system is updated.
    // If the current active file doesn't exist (e.g., project switch, file deletion),
    // it resets to a sensible default.
    if (activeProject && !activeProject.fileSystem[activeFile]) {
        const defaultFile = activeProject.fileSystem['src/App.tsx'] 
            ? 'src/App.tsx' 
            : Object.keys(activeProject.fileSystem)[0];
        setActiveFile(defaultFile || '');
    }
  }, [activeProject, activeFile]);

  const setActiveProjectMessages = (updater: Message[] | ((prev: Message[]) => Message[])) => {
    setProjects(currentProjects =>
      currentProjects.map(p => {
        if (p.id === activeProjectId) {
          const newMessages = typeof updater === 'function' ? updater(p.messages) : updater;
          return { ...p, messages: newMessages };
        }
        return p;
      })
    );
  };
  
  const setActiveProjectFileSystem = (updater: FileSystem | ((prev: FileSystem) => FileSystem)) => {
    setProjects(currentProjects =>
      currentProjects.map(p => {
        if (p.id === activeProjectId) {
            const newFileSystem = typeof updater === 'function' ? updater(p.fileSystem) : updater;
            return { ...p, fileSystem: newFileSystem };
        }
        return p;
      })
    );
  };

  const { messages, sendMessage, aiStatus, stopGeneration, setMessages } = useChat(
    activeProject.messages,
    setActiveProjectMessages,
    activeProject.fileSystem,
    setActiveProjectFileSystem,
    selectedSelectors,
    setSelectedSelectors
  );
  
  useEffect(() => {
    document.documentElement.classList.add('dark');
    document.body.className = 'dark';
  }, []);

  useEffect(() => {
    if (initialPromptForWorkspace || initialImagesForWorkspace.length > 0) {
      sendMessage(initialPromptForWorkspace || '', initialImagesForWorkspace)
      initialPromptForWorkspace = undefined;
      initialImagesForWorkspace = [];
    }
  }, [sendMessage]);

  const toggleDrawer = useCallback(() => setDrawerOpen(p => !p), []);
  const toggleApiPanel = useCallback(() => setApiPanelHidden(p => !p), []);
  const handleUpgradeClick = useCallback(() => { setPricingModalOpen(true); setDrawerOpen(false); setSettingsOpen(false); }, []);
  const handleOpenSettings = useCallback((tab: SettingsTab = 'account') => { setInitialSettingsTab(tab); setDrawerOpen(false); setSettingsOpen(true); }, []);
  
  const handleSignOut = useCallback(() => {
    setSettingsOpen(false);
    navigate('/');
  }, [navigate]);

  const handleClearChat = useCallback(() => {
    if (confirm('Are you sure you want to clear the chat history for this project?')) {
        setActiveProjectMessages([]);
        return true;
    }
    return false;
  }, [activeProjectId]);

  const handleCreateNewProject = useCallback((name: string) => {
    const newProject: Project = {
      id: Date.now(),
      name,
      fileSystem: JSON.parse(JSON.stringify(initialFileSystem)), // Deep copy
      messages: [],
    };
    setProjects(prev => [newProject, ...prev]);
    setActiveProjectId(newProject.id);
    setDrawerOpen(false);
  }, []);
  
  const handleSwitchProject = useCallback((id: number) => {
    if (id !== activeProjectId) {
      setActiveProjectId(id);
      setDrawerOpen(false);
    }
  }, [activeProjectId]);

  const handleDeleteProject = useCallback((id: number) => {
    if (projects.length <= 1) {
      alert("You cannot delete the only project. Create another project first.");
      return;
    }
    const remainingProjects = projects.filter(p => p.id !== id);
    setProjects(remainingProjects);
    if (activeProjectId === id) {
      setActiveProjectId(remainingProjects[0]?.id ?? null);
    }
  }, [projects, activeProjectId]);

  const handleRenameProject = useCallback((id: number, newName: string) => {
    setProjects(prev => prev.map(p => p.id === id ? { ...p, name: newName } : p));
  }, []);

  const handleRestoreFileSystem = useCallback((fs: FileSystem, messageId: string) => {
    setActiveProjectFileSystem(fs);
    setActiveProjectMessages(prev => {
        const messageIndex = prev.findIndex(m => m.id === messageId);
        if (messageIndex === -1) {
            // Fallback if message not found, though this shouldn't happen
            return [...prev, { id: Date.now().toString(), role: 'ai', text: 'I have restored the project to the selected checkpoint.' }];
        }
        
        // Truncate messages up to and including the one we're restoring
        const truncatedMessages = prev.slice(0, messageIndex + 1);

        return [
            ...truncatedMessages, 
            { 
                id: Date.now().toString(), 
                role: 'ai', 
                text: 'I have restored the project to this checkpoint and removed subsequent changes from our conversation.' 
            }
        ];
    });
  }, [activeProjectId]);

  const handleDownloadZip = useCallback(async () => {
    const zip = new JSZip();
    for (const path in activeProject.fileSystem) {
      zip.file(path, activeProject.fileSystem[path].content);
    }
    const blob = await zip.generateAsync({ type: "blob" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${activeProject.name.replace(/\s+/g, '_') || 'raone-project'}.zip`;
    link.click();
    URL.revokeObjectURL(link.href);
  }, [activeProject]);
  
  const handleFixRequest = useCallback((error: string) => {
    const prompt = `The application preview is showing an error. Please analyze the following error details and fix the code.\n\n--- ERROR DETAILS ---\n${error}`;
    sendMessage(prompt, []);
  }, [sendMessage]);

  const handleTakeSnapshot = useCallback(() => {
    setScreenshotTrigger(p => p + 1);
  }, []);

  const handleImageSelectedForEditing = (dataUrl: string) => {
    setImageForEditing(dataUrl);
    setIsImageEditorOpen(true);
  };

  const handleScreenshotTaken = useCallback(async (dataUrl: string) => {
    try {
        handleImageSelectedForEditing(dataUrl);
    } catch (error) {
        console.error("Failed to process snapshot:", error);
    }
  }, []);

  const handleAttachEditedImage = useCallback((file: File) => {
    setImageToAttach(file);
    setIsImageEditorOpen(false);
    setImageForEditing(null);
  }, []);

  const handleImageAttached = useCallback(() => {
    setImageToAttach(null);
  }, []);

  return (
    <>
      <div className={`relative h-screen w-screen bg-slate-50 dark:bg-zinc-950 text-slate-900 dark:text-white flex flex-col overflow-hidden transition-opacity duration-500 ${isEntering ? 'opacity-100' : 'opacity-0'}`}>
        <Header 
            projectName={activeProject.name}
            onMenuClick={toggleDrawer} 
            onUpgradeClick={handleUpgradeClick} 
            onDownloadZip={handleDownloadZip} 
        />
        <main className="flex-1 flex overflow-hidden pt-16">
          <Routes>
            <Route index element={
              <ResizablePanel isLeftPanelHidden={isApiPanelHidden}>
                <ChatPanel 
                  messages={messages} 
                  onSendMessage={sendMessage} 
                  aiStatus={aiStatus} 
                  stopGeneration={stopGeneration} 
                  onRestoreFileSystem={handleRestoreFileSystem} 
                  onClearChat={handleClearChat} 
                  isSelectMode={isSelectMode}
                  onToggleSelectMode={() => setIsSelectMode(p => !p)}
                  selectedSelectors={selectedSelectors}
                  onRemoveSelector={(selector) => setSelectedSelectors(p => p.filter(s => s !== selector))}
                  onTakeSnapshot={handleTakeSnapshot}
                  imageToAttach={imageToAttach}
                  onImageAttached={handleImageAttached}
                  onImageSelectedForEditing={handleImageSelectedForEditing}
                />
                <MainDisplayPanel 
                  fileSystem={activeProject.fileSystem} 
                  activeFile={activeFile} 
                  onActiveFileChange={setActiveFile} 
                  theme={'dark'} 
                  isPanelHidden={isApiPanelHidden} 
                  togglePanel={toggleApiPanel} 
                  onFixRequest={handleFixRequest}
                  isSelectMode={isSelectMode}
                  onElementSelected={(selector) => {
                    if (!selectedSelectors.includes(selector)) {
                      setSelectedSelectors(p => [...p, selector]);
                    }
                  }}
                  onExitSelectMode={() => setIsSelectMode(false)}
                  screenshotTrigger={screenshotTrigger}
                  onScreenshotTaken={handleScreenshotTaken}
                />
              </ResizablePanel>
            } />
          </Routes>
        </main>
        <SideDrawer isOpen={isDrawerOpen} onClose={toggleDrawer} onOpenSettings={handleOpenSettings} onUpgradeClick={handleUpgradeClick} projects={projects} activeProjectId={activeProjectId} onCreateNewProject={handleCreateNewProject} onDeleteProject={handleDeleteProject} onRenameProject={handleRenameProject} onSwitchProject={handleSwitchProject} />
        <PricingModal isOpen={isPricingModalOpen} onClose={() => setPricingModalOpen(false)} />
      </div>
      {isSettingsOpen && <SettingsPage onSignOut={handleSignOut} onClose={() => setSettingsOpen(false)} onClearChat={handleClearChat} onUpgradeClick={handleUpgradeClick} initialTab={initialSettingsTab} />}
      <ImageEditorModal 
        isOpen={isImageEditorOpen}
        onClose={() => setIsImageEditorOpen(false)}
        imageDataUrl={imageForEditing}
        onAttach={handleAttachEditedImage}
      />
    </>
  )
}

const App: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading, user, getAccessTokenSilently } = useAuth0();

  // Store authentication state in localStorage for faster recovery
  useEffect(() => {
    if (isAuthenticated && user) {
      localStorage.setItem('auth0_isAuthenticated', 'true');
      localStorage.setItem('auth0_user', JSON.stringify(user));
    } else if (!isLoading) {
      localStorage.removeItem('auth0_isAuthenticated');
      localStorage.removeItem('auth0_user');
    }
  }, [isAuthenticated, user, isLoading]);

  // Check for stored authentication on mount
  const [storedAuth, setStoredAuth] = useState<{isAuth: boolean, user: any}>({
    isAuth: JSON.parse(localStorage.getItem('auth0_isAuthenticated') || 'false'),
    user: JSON.parse(localStorage.getItem('auth0_user') || 'null')
  });

  useEffect(() => {
    // Use stored auth for immediate render, then update with Auth0 state
    if (!isLoading) {
      setStoredAuth({
        isAuth: isAuthenticated,
        user: user
      });
    }
  }, [isAuthenticated, user, isLoading]);

  useEffect(() => {
    // Only redirect if we have definitive auth state
    if (!isLoading) {
      // If authenticated and not on protected routes, redirect to build
      if (storedAuth.isAuth && !window.location.pathname.startsWith('/build')) {
        navigate('/build');
      }
      // If not authenticated and on protected routes, redirect to home
      else if (!storedAuth.isAuth && window.location.pathname.startsWith('/build')) {
        navigate('/home');
      }
    }
  }, [storedAuth.isAuth, isLoading, navigate]);

  const handleLaunchWorkspace = useCallback((prompt?: string, image?: File | null) => {
      if (storedAuth.isAuth) {
        initialPromptForWorkspace = prompt;
        initialImagesForWorkspace = image ? [image] : [];
        navigate('/build');
      }
  }, [storedAuth.isAuth, navigate]);

  const handleAuthSuccess = useCallback(() => {
    navigate('/build');
  }, [navigate]);

  // Use stored auth for faster rendering
  const shouldShowBuild = storedAuth.isAuth;

  return (
    <Routes>
      <Route path="/home" element={<HomePage onLaunchWorkspace={handleLaunchWorkspace} />} />
      <Route path="/build/*" element={shouldShowBuild ? <Workspace /> : <HomePage onLaunchWorkspace={() => navigate('/home')} />} />
      <Route path="/" element={<HomePage onLaunchWorkspace={handleLaunchWorkspace} />} />
    </Routes>
  );
};

export default App;
