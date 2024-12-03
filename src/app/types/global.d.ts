declare global {
  interface Window {
    sdk: {
      events: {
        on: (event: string, callback: () => void) => void;
        off: (event: string, callback: () => void) => void;
      };
      actions: {
        ready: () => Promise<void>;
        setPrimaryButton: (options: {
          text: string;
          enabled: boolean;
        }) => Promise<void>;
        openUrl: (options: {
          url: string;
          close?: boolean;
        }) => Promise<void>;
        close: () => Promise<void>;
      };
      context: {
        user: any;
      };
    };
  }
}

export {};