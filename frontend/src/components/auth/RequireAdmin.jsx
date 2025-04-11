import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";

const RequireAdmin = ({ children }) => {
    const { isAdmin } = useSelector((state) => state.auth);
    const location = useLocation();

    if (!isAdmin) {
        return <Navigate to="/admin" state={{ from: location }} replace />;
    }

    return children;
};

export default RequireAdmin;
