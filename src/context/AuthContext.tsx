// ** React Imports
import { createContext, useEffect, useState, ReactNode, useContext } from 'react'
import { useRouter } from 'next/router'
import axios from 'axios'
import authConfig from 'src/configs/auth'
import { RegisterParams, LoginParams, ErrCallbackType, UserDataType } from './types'

interface User{
  _id:string,
  name:string,
  lastName:string
  file:string
  ci:string
  // no es recomendable guardar la contraseña en el frontend
}
type AuthValuesType = {
  loading: boolean
  logout: () => void
  user: UserDataType | null
  setLoading: (value: boolean) => void
  setUser: (value: UserDataType | null) => void
  login: (params: LoginParams, errorCallback?: ErrCallbackType) => void
  register: (params: RegisterParams, errorCallback?: ErrCallbackType) => void
  users: User | null | undefined;
  accessToken:String | null

}
// ** Defaults
const defaultProvider: AuthValuesType = {
  user: null,
  loading: true,
  setUser: () => null,
  setLoading: () => Boolean,
  login: () => Promise.resolve(),
  logout: () => Promise.resolve(),
  register: () => Promise.resolve(),
  users: null,
  accessToken:null
}


const AuthContext = createContext(defaultProvider)

type Props = {
  children: ReactNode
}


export const useAuthContext = () => {
  const context = useContext(AuthContext);

  if (!context) throw new Error("Auth Provider is missing");
  return context;
}



const AuthProvider = ({ children }: Props) => {
  // ** States
  const router = useRouter()

//NEW CODE

  const [accessToken, setAccessToken] = useState<string>("")
  const [users, setUsers] = useState<User |undefined>()


  useEffect(() => {
      checkAuth();
  }, [router.asPath]);
  const checkAuth = async() => {

    let { id, token } = router.query;

    if(!id || !token){
      const dataIdToken =await obtenerIdYTokenDesdeURL(router.asPath);
      id=dataIdToken.id as string
      token=dataIdToken.token as string
    }

    const app = id
    if (id && token) {
      try {
        const res = await axios.post(`${process.env.NEXT_PUBLIC_URL_API_CENTRAL}`, { app, token },{
          headers:{ Authorization:`Bearer ${token}` }})

          if (res.status === 401 || res.status === 404) {
            router.push(`${process.env.NEXT_PUBLIC_URL_CENTRAL}/login`)
          }

          localStorage.setItem('token', res.data)
          router.replace('http://localhost:5002/home/')

          setAccessToken(res.data)
          saveSessionInfo(res.data)
      } catch (error:any) {
        alert(error.response.data.message)
        router.push(`${process.env.NEXT_PUBLIC_URL_CENTRAL}/login`)
      }
    }else{
      // console.log(id, token)
      const token = await localStorage.getItem("token")
      if(!token){
        router.replace(`${process.env.NEXT_PUBLIC_URL_CENTRAL}/login`)
      } else {
        await setAccessToken(token);
        await saveSessionInfo(token);
      }
    }
  }

  const saveSessionInfo = async(token: string) => {

      try {
         const res = await axios.post(`${process.env.NEXT_PUBLIC_URL_CENTRAL_DECO}auth/decoded`,{token})
        //const res = await axios.post(`http://10.10.214.151:3110/auth/decoded`,{token})
        const userInfo = await getUserInfo(res.data.idUser)
        setUsers(userInfo)
      } catch (error) {
        console.log(error)
      }

  }

  const getUserInfo = async(id:string) => {
     const res = await axios.get(`${process.env.NEXT_PUBLIC_URL_PERSONAL}api/personal/${id}`)
    //const res = await axios.get(`http://10.10.214.225:3110/user/}${id}`)

    return res.data
  }

  function obtenerIdYTokenDesdeURL(url:any) {
    const partes = url.split("?");

    if (partes.length === 2) {
      const queryString = partes[1];

      const queryParams = queryString.split("&");

      const parametros: { [key: string]: string } = {};

      for (const parametro of queryParams) {
        const [clave, valor] = parametro.split("=");
        parametros[clave] = valor;
      }

      return {
        id: parametros.id,
        token: parametros.token
      };
    } else {
      return {
        id: null,
        token: null
      };
    }
  }

//FINISHED CODE







  const [user, setUser] = useState<UserDataType | null>(defaultProvider.user)
  const [loading, setLoading] = useState<boolean>(defaultProvider.loading)


  // ** Hooks

  const handleLogin = (params: LoginParams, errorCallback?: ErrCallbackType) => {


  }

  const handleLogout = () => {
    setUser(null)
    localStorage.removeItem('token')
    window.localStorage.removeItem('userData')
    window.localStorage.removeItem(authConfig.storageTokenKeyName)
    // router.push('/login')
    router.push(`${process.env.NEXT_PUBLIC_URL_CENTRAL}/login`)
  }

  const handleRegister = (params: RegisterParams, errorCallback?: ErrCallbackType) => {
    axios
      .post(authConfig.registerEndpoint, params)
      .then(res => {
        if (res.data.error) {
          if (errorCallback) errorCallback(res.data.error)
        } else {
          handleLogin({ email: params.email, password: params.password })
        }
      })
      .catch((err: { [key: string]: string }) => (errorCallback ? errorCallback(err) : null))
  }

  const values = {
    user: {"id":1,"usepage":"use-page-frontend","fullName":"John Doe","username":"johndoe","email":"admin@materialize.com"} as any,
    loading:false,
    setUser,
    setLoading,
    login: handleLogin,
    logout: handleLogout,
    register: handleRegister,
    users,
    accessToken
  }

  return <AuthContext.Provider value={values}>
    {children}
    </AuthContext.Provider>
}

export { AuthContext, AuthProvider }
