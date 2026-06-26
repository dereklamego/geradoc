import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

async function enableMocking() {
    // Disabled: real backend is the source of truth.
    // To re-enable for offline dev, set VITE_USE_MSW=true in .env.local
    if (!import.meta.env.DEV || import.meta.env.VITE_USE_MSW !== 'true') {
        return;
    }

    const { worker } = await import('./mocks/browser');
    return worker.start({ onUnhandledRequest: 'bypass' });
}

enableMocking().then(() => {
    createRoot(document.getElementById("root")!).render(<App />);
});
