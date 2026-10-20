import React from 'react'
export function TooltipProvider({children}){return <>{children}</>}
export function Tooltip({children}){return <>{children}</>}
export function TooltipTrigger({children,...props}){return React.isValidElement(children)?React.cloneElement(children,props):<span {...props}>{children}</span>}
export function TooltipContent({children}){return <div className="hidden">{children}</div>}
