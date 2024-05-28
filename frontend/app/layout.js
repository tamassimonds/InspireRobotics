"use client"
import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })
import {store} from "/lib/redux/store.js"

import {Provider} from "react-redux"

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
      <Provider store={store}>
        {children}
      </Provider></body>
    </html>
  )
}
