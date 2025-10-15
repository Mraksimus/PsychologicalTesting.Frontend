
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'

// 🎨 Обязательно добавь эти стили:
import '@mantine/core/styles.css'
import '@mantine/notifications/styles.css'

import { MantineProvider } from '@mantine/core'

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <MantineProvider theme={{}}>
            <App />
        </MantineProvider>
    </React.StrictMode>
)
