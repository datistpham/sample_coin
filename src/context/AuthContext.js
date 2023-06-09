// ** React Imports
import {
  createContext,
  useEffect,
  useState
} from 'react'

// ** Next Import
import {
  useRouter
} from 'next/router'

// ** Axios
import axios from 'axios'

// ** Config
import authConfig from 'src/configs/auth'
import {
  login
} from 'src/apis/auth'

// ** Defaults
const defaultProvider = {
  user: null,
  loading: false,
  setUser: () => null,
  setLoading: () => Boolean,
  login: () => Promise.resolve(),
  logout: () => Promise.resolve(),
  register: () => Promise.resolve()
}
const AuthContext = createContext(defaultProvider)

const AuthProvider = ({
  children
}) => {
  // ** States
  const [user, setUser] = useState(defaultProvider.user)
  const [loading, setLoading] = useState(defaultProvider.loading)

  // ** Hooks
  const router = useRouter()

  useEffect(() => {
    const initAuth = async () => {
      if (typeof window !== 'undefined') {
        const storedToken = window.localStorage.getItem(authConfig.storageTokenKeyName)

      }
    }
    initAuth()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleLogin = async (params, errorCallback) => {
    const result = await login(params)
    console.log(result)
    if (typeof window !== 'undefined') {

      axios
        .post(authConfig.loginEndpoint, params)
        .then(async response => {
          params.rememberMe ?
            window.localStorage.setItem(authConfig.storageTokenKeyName, response.data.accessToken) :
            null
          const returnUrl = router.query.returnUrl
          setUser({
            ...response.data.userData
          })
          params.rememberMe ? window.localStorage.setItem('userData', JSON.stringify(response.data.userData)) : null
          const redirectURL = returnUrl && returnUrl !== '/' ? returnUrl : '/'
          router.replace(redirectURL)
        })
        .catch(err => {
          if (errorCallback) errorCallback(err)
        })
    }
  }

  const handleLogout = () => {
    setUser(null)
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem('userData')
      window.localStorage.removeItem(authConfig.storageTokenKeyName)
    }
    router.push('/login')
  }

  const handleRegister = (params, errorCallback) => {
    axios
      .post(authConfig.registerEndpoint, params)
      .then(res => {
        if (res.data.error) {
          if (errorCallback) errorCallback(res.data.error)
        } else {
          handleLogin({
            email: params.email,
            password: params.password
          })
        }
      })
      .catch(err => (errorCallback ? errorCallback(err) : null))
  }

  const values = {
    user,
    loading,
    setUser,
    setLoading,
    login: handleLogin,
    logout: handleLogout,
    register: handleRegister
  }

  return <AuthContext.Provider value = {
    values
  } > {
    children
  } </AuthContext.Provider>
}

export {
  AuthContext,
  AuthProvider
}
