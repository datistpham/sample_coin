// ** React Imports
import { useEffect } from 'react'

// ** Next Import
import { useRouter } from 'next/router'
import useAuth from 'src/hooks2/useAuth'

// ** Hooks Import
// import { useAuth } from 'src/hooks/useAuth'

const AuthGuard = props => {
  const { children, fallback } = props
  const auth = useAuth()
  const router = useRouter()
  console.log("auth: ", auth)
  useEffect(
    () => {
      if (!router.isReady) {
      }
      else if (typeof window !== 'undefined') {
        if (auth.user === null && !window.localStorage.getItem('userData')) {
          if (router.asPath !== '/') {
            router.replace({
              pathname: '/dashboards/crm/',
              query: { returnUrl: router.asPath }
            })
          } else {
            router.replace('/dashboards/crm/')
          }
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [router.route]
  )
  if (auth.loading || auth.user === null) {
    return fallback
  }

  return <>{children}</>
}

export default AuthGuard
