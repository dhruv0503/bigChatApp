import {useDispatch, useSelector} from 'react-redux';
import {lazy, Suspense, useEffect} from "react";
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import ProtectRoute from "./components/auth/ProtectRoute.jsx";
import {HelmetProvider} from "react-helmet-async";
import {LayoutLoader} from "./components/layout/Loaders.jsx";
// import {setIsLogin} from './redux/reducers/authSlice.js';
import {Toaster} from 'react-hot-toast';
import axios from 'axios';

const Home = lazy(() => import("./pages/Home.jsx"));
const Login = lazy(() => import("./pages/Login.jsx"));
const Chat = lazy(() => import("./pages/Chat.jsx"));
const Groups = lazy(() => import("./pages/Groups.jsx"));
const NotFound = lazy(() => import("./pages/NotFound.jsx"));
const AdminLogin = lazy(() => import("./pages/admin/AdminLogin.jsx"));
const Dashboard = lazy(() => import("./pages/admin/Dashboard.jsx"));
const ChatManager = lazy(() => import("./pages/admin/ChatManager.jsx"));
const MessageManager = lazy(() => import("./pages/admin/MessageManager.jsx"));
const UserManager = lazy(() => import("./pages/admin/UserManager.jsx"));

import {updateUser} from './redux/reducers/authSlice';

import {SocketProvider} from './Socket.jsx';

const App = () => {

    // const {isLogin, loader} = useSelector((state) => state.auth);
    const {user, loader} = useSelector((state) => state.auth);

    const dispatch = useDispatch();

    const getProfile = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_SERVER}/api/user/profile`, {
                withCredentials: true
            })
            return res;
        } catch (err) {
            // dispatch(setIsLogin(false))
            return null;
        }
    }

    useEffect(() => {
        const getData = async () => {
            const response = await getProfile();
            // dispatch(setIsLogin(!!response))
            dispatch(updateUser(!!response?.data?.user))
            if (response) dispatch(updateUser(response.data.user))
        }

        getData();

    // }, [dispatch, isLogin])
}, [dispatch])

    return loader ? (
        <LayoutLoader/>
    ) : (
        <HelmetProvider>
            <Router>
                <Suspense fallback={<LayoutLoader/>}>
                    <Routes>
                        <Route element={
                            <SocketProvider>
                                <ProtectRoute user={user}/>
                            </SocketProvider>
                        }>
                            <Route path="/" element={<Home/>}/>
                            <Route path="/chat/:chatId" element={<Chat/>}/>
                            <Route path="/groups" element={<Groups/>}/>
                        </Route>
                        <Route
                            path="/login"
                            element={
                                <ProtectRoute user={!user} redirect="/">
                                    <Login/>
                                </ProtectRoute>
                            }
                        />

                        <Route path="admin" element={<AdminLogin/>}/>
                        <Route path="admin/dashboard" element={<Dashboard/>}/>
                        <Route path="admin/chats" element={<ChatManager/>}/>
                        <Route path="admin/users" element={<UserManager/>}/>
                        <Route path="admin/messages" element={<MessageManager/>}/>

                        <Route path="*" element={<NotFound/>}/>
                    </Routes>
                </Suspense>
                <Toaster position='bottom-center'/>
            </Router>
        </HelmetProvider>
    );
};

export default App;
