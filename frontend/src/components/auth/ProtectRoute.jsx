import {Navigate, Outlet} from 'react-router-dom'

const ProtectRoute = ({children, user, redirect = '/login'}) => {
    {
        if (!user) {
            return <Navigate to={redirect} replace={true}/>
        } else return children ? children : <Outlet/>;
    }
}

export default ProtectRoute
