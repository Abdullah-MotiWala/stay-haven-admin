import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import './assets/css/folders.css'
import './assets/css/responsive.css'
import './assets/css/style-web.css'
import './assets/css/styles.css'
import { store, persistor } from './redux/store';
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react';


                
const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
    <PersistGate loading={null} persistor={persistor}>
      <Provider store={store}>
        <App />
      </Provider>
    </PersistGate>
);

reportWebVitals();
