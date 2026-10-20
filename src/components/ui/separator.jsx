import React from 'react'; import {cn} from '@/lib/utils'
export const Separator=React.forwardRef(({className,orientation='horizontal',...props},ref)=><div ref={ref} role="separator" className={cn(orientation==='vertical'?'h-full w-px':'h-px w-full','bg-white/10',className)} {...props}/>); Separator.displayName='Separator'
