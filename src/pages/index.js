// ** React Imports
import { useEffect } from 'react'

// ** Next Import
import { useRouter } from 'next/router'

// ** Spinner Import
import Spinner from 'src/@core/components/spinner'
import useAuth from 'src/hooks2/useAuth'

// ** Hook Imports
// import { useAuth } from 'src/hooks/useAuth'

/**
 *  Set Home URL based on User Roles
 */
export const getHomeRoute = role => {
  // if (role === 'client') return '/acl'
  // else return '/dashboards/crm'
}

const Home = () => {
  // ** Hooks
  const auth = useAuth()
  const router = useRouter()
  useEffect(()=> {
    if(auth?.isAuthenticated=== true) {
      router.push("/dashboards/crm")

    }
    else {
      router.push("/login")
    }
  }, [router, auth?.isAuthenticated])

  return <Spinner sx={{ height: '100%' }} />
}

export default Home
