import React from 'react'
import { cn } from '@/lib/utils'
export const Input=React.forwardRef(({className,type='text',...props},ref)=><input ref={ref} type={type} className={cn('flex h-10 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/30 outline-none focus:border-cobalt',className)} {...props}/>); Input.displayName='Input'
