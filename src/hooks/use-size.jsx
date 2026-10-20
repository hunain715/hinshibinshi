import * as React from 'react'
export function useSize(ref){const [size,setSize]=React.useState(null);React.useEffect(()=>{if(!ref?.current)return;const ro=new ResizeObserver(e=>setSize(e[0].contentRect));ro.observe(ref.current);return()=>ro.disconnect()},[ref]);return size}
export default useSize
