/// <reference types="vite/client" />

interface Window {
  Liferay?: {
    Util?: {
      fetch?: typeof fetch;
    };
    ThemeDisplay?: {
      isSignedIn?: () => boolean;
    };
    authToken?: string;
  };
}
