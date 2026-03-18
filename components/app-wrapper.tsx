'use client'
import { useUser } from '@/lib/userContext'
import { UserSelection } from './user-selection'
import { ReactNode } from 'react'

export function AppWrapper({ children }: { children: ReactNode }) {
  const { isSelected } = useUser()
  if (!isSelected) return <UserSelection />
  return <>{children}</>
}
