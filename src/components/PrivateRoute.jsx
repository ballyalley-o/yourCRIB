import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStatus } from '../hooks/useAuthStatus'
import SpinnerAsset from './Spinner/SpinnerAsset'

const PrivateRoute = () => {
   const { loggedIn, checkingStatus} = useAuthStatus()

   if(checkingStatus) {
    return <SpinnerAsset />
   }

  return loggedIn ? <Outlet /> : <Navigate to='/sign-in' />
}

export default PrivateRoute