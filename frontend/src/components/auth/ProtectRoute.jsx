    import {Navigate, Outlet, useNavigate} from 'react-router-dom'

    const ProtectRoute = ({children, user, redirect='/login'}) => {
        {
            if(!user){
                return <Navigate to={redirect} replace={true}/>
            }
            else return children ? children : <Outlet/>;
        }
    }

    export default ProtectRoute
