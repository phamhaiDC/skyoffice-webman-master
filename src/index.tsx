import React from 'react'
import ReactDOM from 'react-dom/client'
import { QueryClient, QueryClientProvider } from 'react-query'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { message } from 'antd'
import './i18n'
import './styles'
import Auth from './pages/Auth'
import { checkBuildVersion } from './utils/check-build-version'
import App from './App'
import { HooksSetter } from './ExternalHooks'
import reportWebVitals from './reportWebVitals'

checkBuildVersion()

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      staleTime: 5000,
      keepPreviousData: true,
      refetchOnWindowFocus: false,
    },
  },
})

message.config({
  duration: 3,
})

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
root.render(
  // <React.StrictMode>
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <HooksSetter />
      <Routes>
        <Route path="auth/*" element={<Auth />} />
        <Route path="/*" element={<App />} />
      </Routes>
    </BrowserRouter>
  </QueryClientProvider>
  // </React.StrictMode>
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
