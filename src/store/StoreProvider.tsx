'use client'

import { Provider } from 'react-redux'
import { store } from './index'

interface StoreProviderProps {
  children: React.ReactNode
}

export default function StoreProvider({ children }: StoreProviderProps) {
  return <Provider store={store}>{children}</Provider>
} 