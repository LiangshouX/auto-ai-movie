import React from 'react'
import ReactDOM from 'react-dom/client'
import {RouterProvider} from 'react-router-dom'
import {ThemeProvider} from '@emotion/react'
import './index.css'
import 'antd/dist/reset.css'
import router from './router'
import {appTheme} from './theme'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider theme={appTheme}>
      <RouterProvider router={router}/>
    </ThemeProvider>
  </React.StrictMode>,
)
