import {useCallback, useEffect, useMemo, useState} from "react"
import toast from "react-hot-toast";
import {getSocket} from "../../Socket.jsx";
import {incrementNotificationCount, setNewMessagesAlert} from "../../redux/reducers/chatSlice.js";
import {setOnlineUsers} from "../../redux/reducers/miscSlice.js";
import {NEW_MESSAGE_ALERT, NEW_REQUEST, ONLINE_USERS, REFETCH_CHATS} from "../../constants/events.js";
import {useDispatch, useSelector} from "react-redux";
import {useLocation, useNavigate, useParams} from "react-router-dom";
import {useGetChatsQuery, useGetFriendsQuery} from "../../redux/api/api.js";

const useErrors = (errors = []) => {
    useEffect(() => {
        errors.forEach(({ isError, error, fallback }) => {
            if (isError) {
                if (fallback) fallback();
                else toast.error(error?.data?.error?.message || "Something went wrong")
            }
        })
    }, [errors])
}

const useAsyncMutation = (mutationHook) => {
    const [isLoading, setIsLoading] = useState(false)
    const [data, setData] = useState(null)

    const [mutate] = mutationHook()
    const executeMutation = async (toastMessage, ...args) => {
        setIsLoading(true)
        const toastId = toast.loading(toastMessage || "Updating Data...")

        try {
            const res = await mutate(...args)
            if (res.data) {
                toast.success(res.data.message || "Updated Data Successfully", {
                    id: toastId
                })
                setData(res.data)
                return res.data;
            } else {
                toast.error(res?.error?.data?.error?.message || "Something Went Wrong", {
                    id: toastId
                })
            }
        } catch (error) {
            toast.error("Something Went Wrong", {
                id: toastId
            })
        } finally {
            setIsLoading(false)
        }
    }
    return [executeMutation, isLoading, data]
}

const useSocketEvents = (socket, handlers) => {
    useEffect(() => {
        Object.entries(handlers).forEach(([event, handler]) => {
            socket.on(event, handler)
        });

        return () => {
            Object.entries(handlers).forEach(([event, handler]) => {
                socket.off(event, handler);
            });
        };
    }, [socket, handlers]);
};

const useAppLayoutLogic = () => {
    const location = useLocation()
    const dispatch = useDispatch();
    const params = useParams();
    const navigate = useNavigate();

    const {user} = useSelector(state => state.auth);
    const {onlineUsers} = useSelector(state => state.misc)

    const chatId = params.chatId;
    const socket = getSocket();

    const myChats = useGetChatsQuery(undefined, {
        skip : !user
    });
    const myFriends = useGetFriendsQuery(undefined, {
        skip : !user
    });
    
    const onlineFriends = useMemo(() => {
        if (!myFriends?.data?.friends || !onlineUsers) return [];
        return myFriends?.data?.friends?.filter((friend) => onlineUsers?.includes(friend?._id))
    }, [myFriends?.data?.friends, onlineUsers])

    const newMessageAlertListener = useCallback(
        (data) => {
            if (data.chatId !== chatId) dispatch(setNewMessagesAlert(data));
        },
        [dispatch, chatId]
    );

    const newRequestListener = useCallback(({userId}) => {
        if (user._id === userId) dispatch(incrementNotificationCount());
    }, [dispatch, user?._id]);

    const refetchListener = useCallback(
        (data = {}) => {
            myChats.refetch();
            if (data?.users?.includes(user?._id) && location.pathname !== '/') navigate("/");
        },
        [myChats.refetch, navigate, user?._id]
    );

    const onlineUsersListener = useCallback(({onlineUsers}) => {
        dispatch(setOnlineUsers(onlineUsers))
    }, [dispatch, user]);

    const eventHandler = {
        [NEW_MESSAGE_ALERT]: newMessageAlertListener,
        [NEW_REQUEST]: newRequestListener,
        [REFETCH_CHATS]: refetchListener,
        [ONLINE_USERS]: onlineUsersListener

    };
    useSocketEvents(socket, eventHandler);

    return {socket, myChats, onlineFriends, myFriends, chatId}
}

export { useErrors, useAsyncMutation, useSocketEvents, useAppLayoutLogic };