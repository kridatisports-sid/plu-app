import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

// Capacitor core — must import before anything else on native
import { Capacitor } from '@capacitor/core'
import { SplashScreen } from '@capacitor/splash-screen'
import { StatusBar, Style } from '@capacitor/status-bar'
import { App as CapApp } from '@capacitor/app'

// Native-only initialisation
const initNative = async () => {
  if (!Capacitor.isNativePlatform()) return

  // Dark status bar matching app theme
  await StatusBar.setStyle({ style: Style.Dark })
  await StatusBar.setBackgroundColor({ color: '#0A0F1E' })

  // Hide splash screen after React mounts
  await SplashScreen.hide()

  // Handle Android hardware back button
  CapApp.addListener('backButton', ({ canGoBack }) => {
    if (!canGoBack) {
      CapApp.exitApp()
    } else {
      window.history.back()
    }
  })
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)

initNative()
