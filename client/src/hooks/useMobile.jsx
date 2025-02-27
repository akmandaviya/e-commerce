import { useEffect, useState } from "react"

//getting the mobile width to know if mobile or desktop screen !!
export const useMobile = (breakPoint = 768) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < breakPoint)

  const handleScreenResize = () => {
    const check = window.innerWidth < breakPoint
    setIsMobile(check)
  }
  
  useEffect(() => {
    handleScreenResize()
    window.addEventListener('resize', handleScreenResize)

    return() => { 
      window.removeEventListener('resize', handleScreenResize)
    }

  }, [])

  return [isMobile]
}