declare global {
  interface Window {
    sdk: {
      context: any;
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
          close: boolean;
        }) => Promise<void>;
        showToast: (options: any) => Promise<void>;
        close: () => Promise<void>;
      };
    };
  }
}

export {};