import React from 'react'
import {cn} from '@/lib/utils'
export function Toast({className,...props}){return <div className={cn('relative rounded-lg border border-white/10 bg-obsidian p-4 text-white shadow-xl',className)} {...props}/>}
export function ToastViewport({className,...props}){return <div className={cn('fixed right-4 top-4 z-[200] flex w-[360px] max-w-[calc(100vw-2rem)] flex-col gap-2',className)} {...props}/>}
export function ToastTitle({className,...props}){return <div className={cn('font-semibold text-sm',className)} {...props}/>}
export function ToastDescription({className,...props}){return <div className={cn('mt-1 text-xs text-white/60',className)} {...props}/>}
export function ToastClose({className,...props}){return <button className={cn('absolute right-2 top-2 text-white/40 hover:text-white',className)} {...props}>×</button>}
