import { createRoot } from 'react-dom/client';
import App from './views/app';
import { DmxButtonsContextProvider } from './contexts/DmxButtonsContext';

const root = createRoot(document.body);
root.render(
    <DmxButtonsContextProvider>
        <App/>
    </DmxButtonsContextProvider>
);