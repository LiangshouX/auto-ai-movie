import React from 'react'
import ReactDOM from 'react-dom/client'
import {RouterProvider} from 'react-router-dom'
import './index.css'
import 'antd/dist/reset.css'
import router from './router'
import {AppThemeProvider, bootstrapThemeMode} from './theme-provider'

bootstrapThemeMode()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AppThemeProvider>
      <RouterProvider router={router}/>
    </AppThemeProvider>
  </React.StrictMode>,
)
