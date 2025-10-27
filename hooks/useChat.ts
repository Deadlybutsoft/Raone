

"use client"

import type React from "react"

import { useState, useCallback, useRef } from "react"
import type { Message, AiStatus, FileSystem, FileChange, FileData } from "../types"
import { GoogleGenAI, type Content, type Part } from "@google/genai"

const AI_SYSTEM_PROMPT = `You are "Raone," an AI expert specializing in web development. Your main instruction is to use a **Vite-based stack with React, TypeScript, and Tailwind CSS** to build applications. You are an expert web developer and UI/UX designer, focused on creating clean, functional, and beautiful self-contained, single-page web experiences.

### Core Mandate: Scalable File Structure

You **MUST** adhere to the following scalable and reliable Vite project structure for all web applications. Do not deviate.

project-root/
├── public/                     # Static assets (images, favicon) - place user-uploaded images here.
├── src/
│   ├── components/             # Reusable UI components
│   │   ├── ui/                 # Atomic design: Button, Input, Card, etc.
│   │   └── layout/             # Larger structures: Navbar, Sidebar, Footer.
│   ├── pages/                  # Route-level components (e.g., Home.tsx, About.tsx)
│   ├── hooks/                  # Custom React hooks (e.g., useApi.ts)
│   ├── lib/                    # Utilities, helpers, constants (e.g., utils.ts)
│   ├── styles/                 # Global styles, Tailwind base configurations.
│   │   └── globals.css         # Main global stylesheet.
│   ├── types/                  # TypeScript type definitions.
│   │   └── index.ts            # Main types file.
│   ├── App.tsx                 # Root application component, routing logic.
│   └── main.tsx                # Application entry point (renders App.tsx).
├── index.html                  # Main HTML shell.
├── package.json                # Project dependencies and scripts.
├── tailwind.config.js          # Tailwind CSS configuration.
├── postcss.config.js           # PostCSS configuration.
├── tsconfig.json               # TypeScript configuration.
└── vite.config.ts              # Vite build configuration.

### Core Philosophy:

1.  **Modern Stack & Completeness**: You build complete, working prototypes using a modern frontend stack based on Vite principles.
    *   **React & TypeScript**: The main entry point is \`src/main.tsx\`. The root component is \`src/App.tsx\`. All imports from external packages in \`.tsx\` files **MUST use standard bare module specifiers**, e.g., \`import React from 'react';\`. Dependencies are managed in \`package.json\`.
    *   **Preview Environment & Dependencies**: The live preview environment can automatically resolve the following external libraries: \`react\`, \`react-dom\`, and \`react-router-dom\`. For any other external libraries (e.g., charting libraries, utility libraries), the live preview may fail. Stick to these supported libraries for maximum compatibility.
    *   **Tailwind CSS**: All styling must be done with Tailwind CSS. A \`src/styles/globals.css\` should be set up for base styles and imported into \`src/main.tsx\`. The \`tailwind.config.js\` and \`postcss.config.js\` files must be configured correctly.
    *   **File Organization**: Strictly follow the structure outlined in the "Core Mandate".

2.  **Proactive Design & Aesthetics**: This is your most important directive. You must build with extreme precision and a keen eye for modern, beautiful design. Always build complete, aesthetically pleasing components.
    *   **Inspiration from the Greats**: You must draw direct inspiration from the best modern websites. When a user's request is general (e.g., 'build a landing page'), you should emulate the structure, layout, and feel of one of the following sites. Announce which site you're using as your primary inspiration.
        *   **Vercel.com**: For developer tools, documentation sites, and sleek, dark-mode UIs.
        *   **Stripe.com**: For polished, professional marketing pages and financial tech products. Known for its gradients and clean component design.
        *   **Linear.app**: For highly functional, dense, and fast productivity applications. Masterclass in keyboard shortcuts and efficiency.
        *   **Clerk.com**: For beautiful, user-friendly authentication and user management pages.
        *   **Resend.com**: For modern, minimalist API product landing pages.
    *   **Build Complete Components**: Infer user intent and build what they *mean*, not just what they say. A "login form" implies labels, styled inputs, validation feedback, a submit button, and proper accessibility. 
    *   **Technical Excellence**: Use modern layouts (Flexbox, Grid), harmonious and accessible color palettes, excellent fonts (like 'Inter' or a suitable alternative), and subtle, interactive elements (hover effects, transitions).

3.  **Accessibility First**: All generated code must be accessible. Use semantic HTML in your components, provide \`alt\` text for images, associate labels with form controls, and use ARIA attributes when necessary.

4.  **Clean Code**:
    *   **HTML**: Write a minimal, clean HTML5 shell in \`index.html\`. It should include a root element (\`<div id="root"></div>\`) and a module script tag to load \`/src/main.tsx\`.
    *   **TypeScript/React**: Write clean, modern React code with TypeScript. Use functional components and hooks.
    *   **Configuration**: Always create the necessary config files (\`vite.config.ts\`, \`tsconfig.json\`, \`tailwind.config.js\`, \`postcss.config.js\`, \`package.json\`).
    *   **Quote Handling**: Pay close attention to quotes in generated code. In JSX, if a string attribute contains an apostrophe (e.g., "What's on your mind?"), you **MUST** enclose the attribute value in double quotes (\`placeholder="What's on your mind?"\`). Using single quotes in this case (\`placeholder='What's on your mind?'\`) will cause a syntax error. Always produce syntactically correct code.

5.  **Image Handling**:
    *   **User Image Upload Workflow**:
        1.  Acknowledge image receipt.
        2.  Create the image file in the \`public/\` directory (e.g., \`public/user-upload.png\`) using a \`CREATE\` operation.
        3.  The \`content\` for this operation **MUST** be the exact placeholder string: \`[USE_UPLOADED_IMAGE]\`. The system will replace this.
        4.  Update the code (e.g., in a component in \`src/components/\`) to use this new image via its root-relative path (e.g., \`<img src="/user-upload.png" ... />\`).

### Responding to Edits and Iteration

When a user asks you to change something, you will be provided with the complete current file system state. Your primary goal is to **make incremental and targeted changes** to the existing files.

-   **Analyze the Context**: Before writing any code, carefully review the provided file system content to understand the current state of the application.
-   **Modify, Don't Replace**: Instead of rewriting entire files from scratch, identify the specific lines or sections that need to be changed and apply updates only where necessary.
-   **Preserve Existing Logic**: Respect the user's previous work. If a file contains logic or components not related to the current request, you must preserve them.
-   **Be Consistent**: Maintain the existing coding style, component structure, and design patterns present in the files. The goal is to evolve the application, not to create a completely different one with every prompt.
-   **Use \`UPDATE\`**: For modifications to existing files, use the \`UPDATE\` operation. Use \`CREATE\` for new files and \`DELETE\` for removing files.

### Execution Flow: Plan then Execute

For every request to build or edit, you **MUST** follow a two-step process.

**Step 1: Create a Detailed Plan**
First, in your conversational response, you will outline a detailed plan. This plan must be comprehensive and cover:
*   **Objective**: A brief summary of what you are about to build or modify.
*   **Design Inspiration**: Explicitly state which of the inspirational sites you've chosen and why it fits the user's request.
*   **Component Breakdown**: List the new components you will create and their locations (e.g., \`src/components/layout/Navbar.tsx\`).
*   **Feature Implementation**: Detail the features and content you will add (e.g., "Hero section with a call-to-action," "Product grid with 3 placeholder items," "Contact form in the footer").
*   **File Changes**: Briefly list which files will be created or modified.

The plan must be presented clearly using markdown (e.g., bullet points, bold text).

**Step 2: Execute the Plan with Code**
Immediately after presenting the plan, you will provide the \`[CODE_CHANGES]\` block that fully implements the plan. The code must be complete and adhere to all other instructions in this prompt.

### STRICT RESPONSE FORMAT

Your response MUST be in two parts, separated by the \`[CODE_CHANGES]\` block.

**Part 1: Conversational Text & Plan**
- This comes FIRST. Contains your friendly explanation AND the detailed plan as described in the 'Execution Flow' section.
- **ABSOLUTELY NO CODE SNIPPETS OR FILE CONTENTS HERE.**

**Part 2: Code Block**
- This comes SECOND, starting with \`[CODE_CHANGES]\` and ending with \`[CODE_CHANGES_END]\`.
- Inside is a single, valid JSON object with a "files" array.
- Each object in the array must have "operation", "path", and a user-friendly "description".
- For "CREATE" or "UPDATE", you MUST include a "content" field with the complete, properly escaped source code as a string.

---
### EXAMPLE of a PERFECT response:

Of course! I'll build a simple counter application. First, here is my plan.

**Plan**

*   **Objective**: Create a functional, well-designed counter application using React and Tailwind CSS.
*   **Design Inspiration**: I'll draw inspiration from **Linear.app** for this utility. The design will be minimal, sharp, and focused on clarity and function, with high-contrast elements.
*   **Component Breakdown**:
    *   \`src/components/ui/Counter.tsx\`: A reusable component for the counter's UI and logic.
    *   \`src/App.tsx\`: The main app component that will host and center the counter.
*   **Feature Implementation**:
    *   Display the current count.
    *   Include two buttons: one to increment and one to decrement the count.
    *   Style the component with a clean, card-based layout and clear typography.
*   **File Changes**:
    *   **UPDATE**: \`index.html\` (to set up the app shell).
    *   **CREATE**: \`package.json\`, \`vite.config.ts\`, \`tsconfig.json\`, \`tailwind.config.js\`, \`postcss.config.js\`.
    *   **CREATE**: \`src/main.tsx\`, \`src/styles/globals.css\`, \`src/App.tsx\`.
    *   **CREATE**: \`src/components/ui/Counter.tsx\`.

Now, I'll generate the code to implement this plan.
[CODE_CHANGES]
{
  "files": [
    {
      "operation": "UPDATE",
      "path": "index.html",
      "description": "Updates the HTML host page to load the React application from src/main.tsx.",
      "content": "<!DOCTYPE html>\\n<html lang=\\"en\\">\\n<head>\\n  <meta charset=\\"UTF-8\\">\\n  <meta name=\\"viewport\\" content=\\"width=device-width, initial-scale=1.0\\">\\n  <title>React Counter</title>\\n</head>\\n<body>\\n  <div id=\\"root\\"></div>\\n  <script type=\\"module\\" src=\\"/src/main.tsx\\"></script>\\n</body>\\n</html>"
    },
    {
      "operation": "CREATE",
      "path": "src/main.tsx",
      "description": "Creates the application entry point, imports global styles, and renders the App component.",
      "content": "import React from 'react';\\nimport ReactDOM from 'react-dom/client';\\nimport App from './App.tsx';\\nimport './styles/globals.css';\\n\\nReactDOM.createRoot(document.getElementById('root')!).render(\\n  <React.StrictMode>\\n    <App />\\n  </React.StrictMode>\\n);"
    },
    {
      "operation": "CREATE",
      "path": "src/App.tsx",
      "description": "Creates the root App component that will host the counter.",
      "content": "import React from 'react';\\nimport Counter from './components/ui/Counter.tsx';\\n\\nfunction App() {\\n  return (\\n    <div className=\\"min-h-screen bg-slate-900 text-white flex items-center justify-center\\">\\n      <Counter />\\n    </div>\\n  );\\n}\\n\\nexport default App;"
    },
    {
      "operation": "CREATE",
      "path": "src/components/ui/Counter.tsx",
      "description": "Creates the modular Counter component with its own state and logic.",
      "content": "import React, { useState } from 'react';\\n\\nconst Counter = () => {\\n  const [count, setCount] = useState(0);\\n\\n  return (\\n    <div className=\\"bg-slate-800 p-8 rounded-lg shadow-lg text-center\\">\\n      <h1 className=\\"text-4xl font-bold text-white\\">Counter</h1>\\n      <span className=\\"text-7xl font-bold text-sky-400 my-6 block\\">{count}</span>\\n      <div className=\\"flex space-x-4\\">\\n        <button onClick={() => setCount(count - 1)} className=\\"px-6 py-2 bg-slate-700 text-white rounded-md text-2xl font-bold hover:bg-slate-600 transition-colors\\">-</button>\\n        <button onClick={() => setCount(count + 1)} className=\\"px-6 py-2 bg-sky-500 text-white rounded-md text-2xl font-bold hover:bg-sky-400 transition-colors\\">+</button>\\n      </div>\\n    </div>\\n  );\\n};\\n\\nexport default Counter;"
    },
    {
      "operation": "CREATE",
      "path": "src/styles/globals.css",
      "description": "Sets up the base Tailwind CSS directives (for build process).",
      "content": "@tailwind base;\\n@tailwind components;\\n@tailwind utilities;"
    },
    {
      "operation": "CREATE",
      "path": "package.json",
      "description": "Creates a basic package.json file for the project.",
      "content": "{\\n  \\"name\\": \\"vite-project\\",\\n  \\"private\\": true,\\n  \\"version\\": \\"0.0.0\\",\\n  \\"type\\": \\"module\\",\\n  \\"scripts\\": {\\n    \\"dev\\": \\"vite\\",\\n    \\"build\\": \\"tsc && vite build\\",\\n    \\"preview\\": \\"vite preview\\"\\n  }\\n}"
    },
    {
      "operation": "CREATE",
      "path": "vite.config.ts",
      "description": "Creates the Vite configuration file.",
      "content": "import { defineConfig } from 'vite'\\nimport react from '@vitejs/plugin-react'\\n\\n// https://vitejs.dev/config/\\nexport default defineConfig({\\n  plugins: [react()],\\n})"
    },
    {
      "operation": "CREATE",
      "path": "tsconfig.json",
      "description": "Creates the TypeScript configuration file.",
      "content": "{\\n  \\"compilerOptions\\": {\\n    \\"target\\": \\"ESNext\\",\\n    \\"useDefineForClassFields\\": true,\\n    \\"lib\\": [\\"DOM\\", \\"DOM.Iterable\\", \\"ESNext\\"],\\n    \\"allowJs\\": false,\\n    \\"skipLibCheck\\": true,\\n    \\"esModuleInterop\\": false,\\n    \\"allowSyntheticDefaultImports\\": true,\\n    \\"strict\\": true,\\n    \\"forceConsistentCasingInFileNames\\": true,\\n    \\"module\\": \\"ESNext\\",\\n    \\"moduleResolution\\": \\"Node\\",\\n    \\"resolveJsonModule\\": true,\\n    \\"isolatedModules\\": true,\\n    \\"noEmit\\": true,\\n    \\"jsx\\": \\"react-jsx\\"\\n  },\\n  \\"include\\": [\\"src\\"],\\n  \\"references\\": [{ \\"path\\": \\"./tsconfig.node.json\\" }]\\n}"
    },
    {
      "operation": "CREATE",
      "path": "tailwind.config.js",
      "description": "Configures Tailwind CSS to scan source files.",
      "content": "/** @type {import('tailwindcss').Config} */\\nexport default {\\n  content: [\\n    \\"./index.html\\",\\n    \\"./src/**/*.{js,ts,jsx,tsx}\\",\\n  ],\\n  theme: {\\n    extend: {},\\n  },\\n  plugins: [],\\n}"
    },
    {
      "operation": "CREATE",
      "path": "postcss.config.js",
      "description": "Sets up PostCSS with Tailwind CSS and Autoprefixer.",
      "content": "export default {\\n  plugins: {\\n    tailwindcss: {},\\n    autoprefixer: {},\\n  },\\n}"
    }
  ]
}
[CODE_CHANGES_END]
---
Now, analyze the user's request and the current file system. Generate your response following these strict instructions.
`

const convertImageToBase64 = (imageFile: File): Promise<{ data: string; mimeType: string }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onloadend = () => {
      if (typeof reader.result !== "string") {
        return reject(new Error("Failed to read file as data URL."))
      }
      const base64Data = reader.result.split(",")[1]
      if (!base64Data) {
        return reject(new Error("Could not extract base64 data from file."))
      }
      resolve({ data: base64Data, mimeType: imageFile.type })
    }
    reader.onerror = (error) => reject(error)
    reader.readAsDataURL(imageFile)
  })
}

const isQuotaError = (error: any): boolean => {
  try {
    if (error?.error?.code === 429) {
      return true
    }
    let errorJsonString = ""
    if (error instanceof Error) {
      errorJsonString = error.message
    } else if (typeof error === "string") {
      errorJsonString = error
    } else if (typeof error === "object" && error !== null) {
      errorJsonString = JSON.stringify(error)
    }
    const jsonMatch = errorJsonString.match(/{.*}/s)
    if (jsonMatch) {
      const parsedError = JSON.parse(jsonMatch[0])
      if (parsedError?.error?.code === 429) {
        return true
      }
    }
  } catch (e) {
    /* Ignore parsing errors */
  }
  return false
}

const getFriendlyErrorMessage = (error: any, context: 'api' | 'parsing'): string => {
    if (context === 'parsing') {
        console.error("Parsing error details:", error);
        return "I had trouble formatting the code changes. The code might be incomplete. Please review it, and if something is wrong, ask me to try again.";
    }

    if (isQuotaError(error)) {
        return "You've reached your usage limit for the AI model. Please check your plan and billing details.";
    }
    
    if (error instanceof Error && error.name === 'AbortError') {
        return "The request timed out. There might be a network issue or a problem with the AI service. Please try again later.";
    }

    const errorString = (error instanceof Error ? error.message : String(error)).toLowerCase();

    if (errorString.includes('api key') || errorString.includes('401')) {
        return "The API key is invalid or missing. Please check your settings and provide a valid key for the selected model.";
    }

    if (errorString.includes('failed to fetch') || errorString.includes('network')) {
        return "Connection to the AI service failed. Please check your internet connection and try again.";
    }
    
    // Default fallback
    console.error("Unhandled API error:", error);
    return "An unexpected error occurred with the AI service. Please check your connection and try again.";
};

const applyCodeChanges = (
  changes: FileChange[],
  setFileSystem: (updater: (fs: FileSystem) => FileSystem) => void,
  lastUploadedImage: { data: string; mimeType: string } | null,
  clearLastUploadedImage: () => void,
) => {
  setFileSystem((currentFs) => {
    const newFs = { ...currentFs }
    const changesToApply: { path: string; operation: FileChange["operation"]; fileData?: FileData }[] = []
    let imageUsed = false

    for (const change of changes) {
      if (change.operation === "CREATE" || change.operation === "UPDATE") {
        if (typeof change.content === "string") {
          let fileData: FileData
          if (change.content === "[USE_UPLOADED_IMAGE]") {
            if (lastUploadedImage) {
              fileData = {
                content: lastUploadedImage.data,
                type: lastUploadedImage.mimeType,
                isBinary: true,
              }
              imageUsed = true
            } else {
              console.warn(
                `AI requested an image with [USE_UPLOADED_IMAGE] but no image was available for path: ${change.path}`,
              )
              continue // Skip this change if the image is missing
            }
          } else {
            const extension = change.path.split(".").pop() || "tsx"
            fileData = {
              content: change.content,
              type: extension,
              isBinary: false,
            }
          }
          changesToApply.push({ path: change.path, operation: change.operation, fileData })
        }
      } else if (change.operation === "DELETE") {
        changesToApply.push({ path: change.path, operation: "DELETE" })
      }
    }

    if (changesToApply.length > 0) {
      changesToApply.forEach((change) => {
        if ((change.operation === "CREATE" || change.operation === "UPDATE") && change.fileData) {
          newFs[change.path] = change.fileData
        } else if (change.operation === "DELETE") {
          if (newFs[change.path]) {
            delete newFs[change.path]
          }
        }
      })
    }

    if (imageUsed) {
      clearLastUploadedImage()
    }
    
    return newFs
  })
}

const parseStreamedCodeChanges = (fullResponseText: string): FileChange[] | null => {
  const codeBlockRegex = /\[CODE_CHANGES\]([\s\S]*)/
  const match = fullResponseText.match(codeBlockRegex)

  if (!match || !match[1]) return null

  const codeJsonStr = match[1].trim()
  if (!codeJsonStr.startsWith('{"files":[')) return null

  const filesStr = codeJsonStr.substring('{"files":['.length)

  let braceDepth = 0
  let inString = false
  let lastValidSliceIndex = -1

  for (let i = 0; i < filesStr.length; i++) {
    const char = filesStr[i]

    if (char === '"') {
      let slashCount = 0
      for (let j = i - 1; j >= 0; j--) {
        if (filesStr[j] === "\\") {
          slashCount++
        } else {
          break
        }
      }
      if (slashCount % 2 === 0) {
        inString = !inString
      }
    }

    if (inString) continue

    switch (char) {
      case "{":
        braceDepth++
        break
      case "}":
        braceDepth--
        if (braceDepth === 0) {
          lastValidSliceIndex = i + 1
        }
        break
    }
  }

  if (lastValidSliceIndex === -1) {
    return null
  }

  let parsablePart = filesStr.substring(0, lastValidSliceIndex)

  parsablePart = parsablePart.trim()
  if (parsablePart.endsWith(",")) {
    parsablePart = parsablePart.slice(0, -1)
  }

  const jsonArrayToParse = `[${parsablePart}]`

  try {
    const parsed = JSON.parse(jsonArrayToParse)
    if (Array.isArray(parsed)) {
      return parsed
    }
    return null
  } catch (e) {
    return null
  }
}

const finalParseCodeChanges = (fullResponseText: string): { changes: FileChange[]; error: string | null } => {
  const codeBlockRegex = /\[CODE_CHANGES\]([\s\S]*?)\[CODE_CHANGES_END\]/
  const match = fullResponseText.match(codeBlockRegex)

  if (!match || !match[1]) {
    return { changes: [], error: null }
  }

  let codeJsonStr = match[1].trim()

  const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s
  const fenceMatch = codeJsonStr.match(fenceRegex)
  if (fenceMatch && fenceMatch[2]) {
    codeJsonStr = fenceMatch[2].trim()
  }

  const firstBrace = codeJsonStr.indexOf("{")
  const lastBrace = codeJsonStr.lastIndexOf("}")

  if (firstBrace === -1 || lastBrace === -1 || lastBrace < firstBrace) {
    return { changes: [], error: "Could not find a valid JSON object within the code block." }
  }

  codeJsonStr = codeJsonStr.substring(firstBrace, lastBrace + 1)

  try {
    const parsedCode = JSON.parse(codeJsonStr)
    if (!parsedCode.files || !Array.isArray(parsedCode.files)) {
      return { changes: [], error: "Invalid format: 'files' array not found in AI response." }
    }
    return { changes: parsedCode.files, error: null }
  } catch (e) {
    // Attempt to recover from a common AI error: invalid escape sequences
    if (e instanceof SyntaxError && e.message.includes("Bad escaped character")) {
      try {
        // This regex removes backslashes that are not part of a valid JSON escape sequence.
        const sanitizedJsonStr = codeJsonStr.replace(/\\(?!["\\/bfnrt]|u[0-9a-fA-F]{4})/g, "")
        const parsedCode = JSON.parse(sanitizedJsonStr)
        if (parsedCode.files && Array.isArray(parsedCode.files)) {
          return { changes: parsedCode.files, error: null }
        }
      } catch (e2) {
        console.error("JSON sanitization failed:", e2)
      }
    }

    const errorMessage = e instanceof Error ? e.message : String(e)
    console.error("Final parse failed:", e, "JSON string:", codeJsonStr)
    return { changes: [], error: `Failed to parse code changes: ${errorMessage}` }
  }
}

export const useChat = (
  messages: Message[],
  setMessages: (updater: Message[] | ((prev: Message[]) => Message[])) => void,
  fileSystem: FileSystem,
  setFileSystem: (updater: FileSystem | ((prev: FileSystem) => FileSystem)) => void,
  selectedSelectors: string[],
  setSelectedSelectors: React.Dispatch<React.SetStateAction<string[]>>,
) => {
  const [aiStatus, setAiStatus] = useState<AiStatus>("idle")
  const abortControllerRef = useRef<AbortController | null>(null)
  const lastUploadedImageRef = useRef<{ data: string; mimeType: string } | null>(null)

  const stopGeneration = useCallback(() => {
    if (abortControllerRef.current) {
        abortControllerRef.current.abort()
    }
  }, [])

  const clearLastUploadedImage = useCallback(() => {
    lastUploadedImageRef.current = null
  }, [])

  const buildGeminiHistory = (currentMessages: Message[]): Content[] => {
    const history: Content[] = []
    currentMessages.forEach((msg) => {
      if (!msg.isStreaming && !msg.error && (msg.role === "user" || msg.role === "ai")) {
        // The text from messages with images is crucial context.
        // The image data itself is handled separately for the current turn.
        const messageText = msg.text

        if (messageText) {
          history.push({
            role: msg.role === "user" ? "user" : "model",
            parts: [{ text: messageText }],
          })
        }
      }
    })
    return history
  }

  const sendMessage = useCallback(
    async (initialPrompt: string, images: File[]) => {
      abortControllerRef.current = new AbortController();
      const signal = abortControllerRef.current.signal;

      let finalPrompt = initialPrompt;
      if (selectedSelectors.length > 0) {
          const selectorsString = selectedSelectors.map(s => `\`${s}\``).join(', ');
          finalPrompt = `For the element(s) with CSS selector(s): ${selectorsString}, please do the following: ${initialPrompt}`;
          setSelectedSelectors([]); // Clear after using them in the prompt
      }

      setAiStatus("thinking")

      const userMessage: Message = { id: Date.now().toString(), role: "user", text: finalPrompt }
      
      let imagesForNextTurn: { data: string; mimeType: string }[] = [];
      if (images.length > 0) {
        try {
          const objectUrls = images.map(URL.createObjectURL);
          userMessage.imageUrls = objectUrls;

          imagesForNextTurn = await Promise.all(images.map(convertImageToBase64));
          // Only one image is supported for the [USE_UPLOADED_IMAGE] placeholder for simplicity
          if (imagesForNextTurn.length > 0) {
            lastUploadedImageRef.current = imagesForNextTurn[0];
          }

        } catch (error) {
          console.error("Error processing image upload:", error)
          const errorMsg: Message = {
            id: (Date.now() + 1).toString(),
            role: "ai",
            text: "Sorry, I failed to process one of the images you uploaded.",
            error: error instanceof Error ? error.message : "Unknown error",
          }
          setMessages((prev) => [...prev, userMessage, errorMsg])
          setAiStatus("idle")
          if (userMessage.imageUrls) userMessage.imageUrls.forEach(URL.revokeObjectURL);
          return
        }
      }

      setMessages((prev) => [...prev, userMessage]);
      
      const aiMessageId = (Date.now() + 2).toString()
      const fileSystemSnapshot = JSON.parse(JSON.stringify(fileSystem));
      const aiMessagePlaceholder: Message = { id: aiMessageId, role: "ai", text: "", isStreaming: true }
      setMessages((prev) => [...prev, aiMessagePlaceholder])
      setAiStatus("streaming")

      const fileContext = ['\n\n--- CURRENT FILE SYSTEM ---', ...Object.entries(fileSystem).map(([path, data]) => {
        if (!data.isBinary) {
          const lang = path.split('.').pop() || '';
          return `\n### \`${path}\`\n\`\`\`${lang}\n${data.content}\n\`\`\``;
        } else {
          return `\n### \`${path}\`\n[Binary file: ${data.type}]`;
        }
      })].join('\n');

      const textPromptContent = finalPrompt + fileContext;
      
      let fullResponseText = ""
      const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error('AbortError')), 60000));

      try {
        const streamPromise = (async () => {
            const ai = new GoogleGenAI({ apiKey: "AIzaSyB1HO26iQJFOEh4LT-HrPW0HtjIwFae4VU" })
            const chatHistory = buildGeminiHistory(messages)
            
            const promptParts: Part[] = imagesForNextTurn.map(image => ({
              inlineData: { mimeType: image.mimeType, data: image.data }
            }));
            promptParts.unshift({ text: textPromptContent });

            const chat = ai.chats.create({ model: 'gemini-2.5-flash', config: { systemInstruction: AI_SYSTEM_PROMPT }, history: chatHistory });
            const stream = await chat.sendMessageStream({ message: promptParts });
            
            for await (const chunk of stream) {
              if (signal.aborted) break;
              fullResponseText += chunk.text
              const conversationalPart = fullResponseText.split("[CODE_CHANGES]")[0]
              const isExpectingCodeChanges = fullResponseText.includes("[CODE_CHANGES]");
              const streamedChanges = parseStreamedCodeChanges(fullResponseText)
              setMessages((prev) => prev.map((m) => m.id === aiMessageId ? { ...m, text: conversationalPart, codeChanges: streamedChanges ?? m.codeChanges, isExpectingCodeChanges } : m));
            }
        })();

        await Promise.race([streamPromise, timeoutPromise]);
      } catch(error) {
          if (error instanceof Error && error.name === 'AbortError') {
              stopGeneration();
          }
          const userFriendlyError = getFriendlyErrorMessage(error, 'api');
          console.error(`AI streaming error:`, error)
          setMessages((prev) => prev.map((m) => m.id === aiMessageId ? { ...m, isStreaming: false, text: '', error: userFriendlyError } : m));
          setAiStatus("idle");
          return;
      }

      if (signal.aborted) {
        console.log("Generation stopped by user or timed out.")
      }
      
      const { changes: finalChanges, error: parseError } = finalParseCodeChanges(fullResponseText)

      if (finalChanges.length > 0) {
        applyCodeChanges(finalChanges, setFileSystem, lastUploadedImageRef.current, clearLastUploadedImage);
      }

      setMessages((prev) =>
        prev.map((m) => {
          if (m.id === aiMessageId) {
            let finalConversationalText = fullResponseText.replace(/\[CODE_CHANGES\][\s\S]*?\[CODE_CHANGES_END\]/g, "").trim();
            
            if (!finalConversationalText && finalChanges.length > 0) {
              finalConversationalText = "I've applied the requested code changes."
            }
            const finalError = parseError ? getFriendlyErrorMessage(parseError, 'parsing') : m.error;
            return {
              ...m,
              text: finalConversationalText,
              codeChanges: finalChanges.length > 0 ? finalChanges : m.codeChanges,
              isStreaming: false,
              isExpectingCodeChanges: false,
              error: finalError,
              ...(finalChanges.length > 0 && { previousFileSystem: fileSystemSnapshot }),
            }
          }
          return m
        }),
      )

      if (userMessage.imageUrls) {
        userMessage.imageUrls.forEach(URL.revokeObjectURL);
      }
      setAiStatus("idle")
    },
    [fileSystem, setFileSystem, messages, setMessages, clearLastUploadedImage, selectedSelectors, setSelectedSelectors],
  )

  return { messages, setMessages, sendMessage, aiStatus, stopGeneration }
}