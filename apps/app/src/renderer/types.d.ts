declare global {
    interface Window {
        electronAPI: any; // Using any or specific type here. For consistency with global.d.ts, let's keep it simple.
    }
    const electronAPI: any;
}

export { };

