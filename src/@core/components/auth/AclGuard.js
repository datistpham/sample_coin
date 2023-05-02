// ** React Imports
import { useEffect, useState } from 'react'

// ** Next Import
import { useRouter } from 'next/router'

// ** Context Imports
import { AbilityContext } from 'src/layouts/components/acl/Can'

// ** Config Import
import { buildAbilityFor } from 'src/configs/acl'

// ** Component Import
import NotAuthorized from 'src/pages/401'
import BlankLayout from 'src/@core/layouts/BlankLayout'
import useAuth from 'src/hooks2/useAuth'
import LoginPage from 'src/pages/login'

// ** Hooks
// import { useAuth } from 'src/hooks/useAuth'

const AclGuard = props => {

  // ** Props
  const { aclAbilities, children, guestGuard } = props
  const [ability, setAbility] = useState(undefined)

  // ** Hooks
  const auth = useAuth()
  console.log(auth?.isAuthenticated)
  const router = useRouter()

  useEffect(()=> {
    if (auth.isAuthenticated=== true) {
      setAbility(buildAbilityFor("admin", aclAbilities.subject))
    }
  }, [auth])

  // If guestGuard is true and user is not logged in or its an error page, render the page without checking access


  if (router.route === '/404' || router.route === '/500' || router.route === '/') {

    return <>{children}</>
  }



  // User is logged in, build ability for the user based on his role

  // Check the access of current user and render pages
  if (auth.user) {
    return <AbilityContext.Provider value={ability}>{children}</AbilityContext.Provider>
  }
  if(router?.route === "/login") {
    return <LoginPage></LoginPage>
  }

  // if(auth?.isAuthenticated === false) {
  //   return router.push("/login")
  // }

  // Render Not Authorized component if the current user has limited access
  else if(auth.isAuthenticated=== false ) {
    return (
      <BlankLayout>
        <NotAuthorized />
      </BlankLayout>
    )
  }
}

export default AclGuard
