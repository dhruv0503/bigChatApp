import {Drawer, Grid2, Skeleton} from "@mui/material";
import {useEffect, useRef} from "react";
import {useDispatch, useSelector} from "react-redux";
import {
    NEW_MESSAGE_ALERT
} from "../../constants/events";
import {getOrSaveFromStorage} from "../../lib/features";
import {
    setAreOptionsOpen,
    setIsDeleteMenu,
    setSelectedDeleteChat
} from "../../redux/reducers/miscSlice";
import DeleteChatMenu from "../dialogs/DeleteChatMenu";
import {useAppLayoutLogic, useErrors} from "../hooks/hooks";
import Title from "../shared/Title";
import ChatList from "../specific/ChatList";
import OptionsSidebar from "../specific/OptionsSidebar";
import Profile from "../specific/Profile";
import Header from "./Header";


const AppLayout = ({WrappedContent, ...props}) => {
    const deleteMenuAnchor = useRef(null);
    const dispatch = useDispatch();
    const {user} = useSelector((state) => state.auth);
    const {isMobile, areOptionsOpen} = useSelector((state) => state.misc);
    const {newMessageAlert} = useSelector((state) => state.chat);

    const {chatId, myChats, myFriends, onlineFriends} = useAppLayoutLogic()


    const handleDeleteChat = (e, chatId, groupChat) => {
        dispatch(setIsDeleteMenu(true));
        dispatch(setSelectedDeleteChat({chatId, groupChat}));
        deleteMenuAnchor.current = e.currentTarget;
    };

    useEffect(() => {
        if (user && !myChats.data) {
            myChats.refetch();
        }
    }, [user, myChats.data, myChats.refetch, myChats]);

    useEffect(() => {
        getOrSaveFromStorage({key: NEW_MESSAGE_ALERT, value: newMessageAlert});
    }, [newMessageAlert]);


    useErrors([
        {isError: myChats.isError, error: myChats.error},
        {isError: myFriends.isError, error: myFriends.error}
    ]);

    return (
        <>
            <Title/>
            <Header/>
            <DeleteChatMenu dispatch={dispatch} deleteMenuAnchor={deleteMenuAnchor}/>
            {myChats.isLoading ? (
                <Skeleton height={"100vh"} variant={"rounded"}/>
            ) : (
                <Drawer anchor={"right"} open={areOptionsOpen} onClose={() => dispatch(setAreOptionsOpen(false))}>
                    <OptionsSidebar/>
                </Drawer>
            )}
            <Grid2
                container={true}
                sx={{
                    height: "calc(100vh - 6rem)",
                    display: "flex",
                    flexDirection: "row",
                    width: "100%",
                }}
            >
                <Grid2
                    xs={12}
                    sm={4}
                    md={3}
                    sx={{
                        flexGrow: "1",
                        maxWidth: {
                            xs: "100%",
                            sm: "32%",
                            md: "25%",
                        },
                        boxSizing: "border-box",
                        margin: {
                            xs: "1%",
                            sm: "0.5%"
                        },
                        borderRadius: "25px",
                        display: {
                            xs: isMobile ? "none" : "block",
                            sm: "block"
                        }
                    }}
                    height={"100%"}
                >
                    {myChats.isLoading ? (
                        <Skeleton height={"100%"} variant={"rounded"}/>
                    ) : (
                        <ChatList
                            chats={myChats.data?.chats}
                            chatId={chatId}
                            handleDeleteChat={handleDeleteChat}
                            newMessagesAlert={newMessageAlert}
                            onlineFriends={onlineFriends}
                        />
                    )}
                </Grid2>
                <Grid2
                    xs={0}
                    sm={8}
                    md={6}
                    height={"100%"}
                    display={{xs: isMobile ? "block" : "none", sm: "block"}}
                    sx={{
                        flexGrow: "2",
                        margin: {
                            xs: "1%",
                            sm: "0.5%"
                        },
                        borderRadius: "25px",
                        maxWidth: {
                            xs: "100%",
                            sm: "66%",
                            md: "50%",
                        },
                    }}
                >
                    <WrappedContent {...props} chatId={chatId} user={user}/>
                </Grid2>
                <Grid2
                    md={4}
                    lg={3}
                    sx={{
                        display: {xs: "none", md: "block"},
                        height: "100%",
                        backgroundColor: "rgba(0,0,0,0.7)",
                        flexGrow: "1",
                        maxWidth: "25%",
                        margin: "0.5%",
                        borderRadius: "25px",
                    }}
                >
                    <Profile/>
                </Grid2>
            </Grid2>
        </>
    );
};

export default AppLayout;
