/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare module "react-quill" {
  import type { ComponentType } from "react";
  const ReactQuill: ComponentType<{
    value: string;
    onChange: (content: string) => void;
    theme?: string;
    modules?: Record<string, unknown>;
    className?: string;
  }>;
  export default ReactQuill;
}
