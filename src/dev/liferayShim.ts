declare global {
  interface Window {
    Liferay?: {
      authToken?: string;
      Util?: {
        fetch?: typeof fetch;
      };
      ThemeDisplay?: {
        isSignedIn?: () => boolean;
      };
    };
  }
}

export function installDevLiferayShim() {
  if (!import.meta.env.DEV || window.Liferay?.Util?.fetch) {
    return;
  }

  window.Liferay = {
    authToken: "",
    Util: {
      fetch: (url, init = {}) =>
        fetch(url, {
          ...init,
          credentials: "include",
        }),
    },
    ThemeDisplay: {
      isSignedIn: () => true,
    },
  };
}

installDevLiferayShim();
