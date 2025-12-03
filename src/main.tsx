import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from '@/app/store';
import { BrowserRouter } from 'react-router-dom';
import App from '@/App';
import '@/index.css';
import { ThemeProvider, QueryProvider } from '@/app/providers';
import { Toaster } from 'react-hot-toast';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <QueryProvider>
      <ThemeProvider>
        <BrowserRouter>
          <App />
          <Toaster
            position="top-center"
            toastOptions={{
              style: {
                borderRadius: '8px',
                padding: '12px',
              },
            }}
          />
        </BrowserRouter>
      </ThemeProvider>
    </QueryProvider>
  </Provider>
);
