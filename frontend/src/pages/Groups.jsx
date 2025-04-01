/* eslint-disable react/display-name */
import {
    Add as AddIcon,
    Delete as DeleteIcon,
    Done as DoneIcon,
    Edit as EditIcon,
    KeyboardBackspace as KeyboardBackSpaceIcon,
    Menu as MenuIcon,
} from "@mui/icons-material";
import {
    Backdrop,
    Box,
    Button,
    CircularProgress,
    Drawer,
    Grid2,
    IconButton,
    Stack,
    TextField,
    Tooltip,
    Typography,
} from "@mui/material";
import {motion} from "framer-motion";
import {lazy, memo, Suspense, useCallback, useEffect, useRef, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {useNavigate, useSearchParams, useLocation} from "react-router-dom";
import {useAsyncMutation, useErrors, useSocketEvents} from "../components/hooks/hooks";
import {LayoutLoader} from "../components/layout/Loaders";
import AvatarCard from "../components/shared/AvatarCard";
import UserItem from "../components/shared/UserItem";
import {StyledLink} from "../components/styles/StyledComponent";
import {bgGradient, grayColor} from "../constants/color";
import {
    useDeleteChatMutation,
    useGetChatDetailsQuery,
    useGetGroupsQuery,
    useRemoveMemberMutation,
    useRenameGroupMutation,
} from "../redux/api/api";
import {setIsAddMember, setIsMobile} from "../redux/reducers/miscSlice";
import {ADD_MEMBER, DELETE_GROUP, LEAVE_GROUP, NEW_GROUP, REMOVE_MEMBER} from "../constants/events.js";
import {getSocket} from "../Socket.jsx";

const ConfirmDeleteDialog = lazy(() =>
    import("../components/dialogs/ConfirmDeleteDialog")
);
const AddMemberDialog = lazy(() =>
    import("../components/dialogs/AddMemberDialog")
);

const Groups = () => {
    const socket = getSocket()
    const location = useLocation();
    const chatId = useSearchParams()[0].get("group");
    const dispatch = useDispatch();
    const {isAddMember} = useSelector((state) => state.misc);
    const {user} = useSelector((state) => state.auth);

    const myGroups = useGetGroupsQuery();
    const groupDetails = useGetChatDetailsQuery(
        {chatId, populate: true},
        {
            skip: !chatId,
        }
    );
    const [updateGroup, isLoadingGroupName] = useAsyncMutation(
        useRenameGroupMutation
    );
    const [deleteGroup, isLoadingDeleteGroup] = useAsyncMutation(
        useDeleteChatMutation
    );
    const [removeMember, isLoadingRemoveMember] = useAsyncMutation(
        useRemoveMemberMutation
    );


    const navigate = useNavigate();
    const navigateBack = () => {
        navigate("/");
        dispatch(setIsMobile(false));

    };
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [groupName, setGroupName] = useState("");
    const [groupNameUpdatedValue, setGroupNameUpdatedValue] = useState("");
    const [confirmDeleteDialog, setConfirmDeleteDialog] = useState(false);
    const [members, setMembers] = useState([]);
    const inputRef = useRef(null);

    const errors = [
        {isError: myGroups.isError, error: myGroups.error},
        {isError: groupDetails.isError, error: groupDetails.error},
    ];

    useEffect(() => {
        myGroups.refetch();``
    }, []);

    const newGroupListener = useCallback(() => {
        myGroups.refetch();
    }, [])

    const newMemberAddedListener = useCallback(({userId}) => {
        if(userId === user?._id) myGroups.refetch();
        groupDetails.refetch();
    }, [user?._id])

    const memberRemovedListener = useCallback((data) => {
        if(data.userId === user?._id && location.pathname.split('/').pop() === "groups"){
            myGroups.refetch();
            navigate('/groups')
        }
        else if(chatId === data.chatId) groupDetails.refetch();
    })

    const memberLeftGroupListener = useCallback((data) => {
        if(chatId === data.chatId) groupDetails.refetch();
    }, [chatId])

    const deleteGroupListener = useCallback((data) => {
        if(chatId === data.chatId) navigate('/groups');
        myGroups.refetch();
    }, [chatId, navigate])

    useEffect(() => {
        const groupData = groupDetails?.data?.chat;
        if (groupData) {
            setGroupName(groupData.name);
            setGroupNameUpdatedValue(groupData.name);
            setMembers(groupData.members);
        }

        return () => {
            setGroupName("");
            setGroupNameUpdatedValue("");
            setMembers([]);
            setIsEdit(false);
        };
    }, [groupDetails.data]);

    const deleteHandler = async () => {
        await deleteGroup("Deleting Group", chatId);
        navigate("/groups");
        closeConfirmDeleteHandler();
    };

    const handleMobile = () => {
        setIsMobileMenuOpen((prev) => !prev);
    };
    const handleMobileClose = () => setIsMobileMenuOpen(false);

    const updateGroupNameHandler = useCallback(async () => {
        setIsEdit(false);
        await updateGroup("Updating Group Name", {chatId, name: groupNameUpdatedValue});
    }, [chatId, groupNameUpdatedValue]);

    const openConfirmDeleteHandler = () => {
        setConfirmDeleteDialog(true);
    };

    const closeConfirmDeleteHandler = () => {
        setConfirmDeleteDialog(false);
    };

    const openAddMemberHandler = () => {
        dispatch(setIsAddMember(true));
    };

    const removeMemberHandler = async (userId) => {
        await removeMember("Removing Member", {chatId, userId});
    };

    const eventHandler = {
        [NEW_GROUP]: newGroupListener,
        [ADD_MEMBER] : newMemberAddedListener,
        [REMOVE_MEMBER] : memberRemovedListener,
        [LEAVE_GROUP] : memberLeftGroupListener,
        [DELETE_GROUP] : deleteGroupListener,
    }

    useSocketEvents(socket, eventHandler)
    useErrors(errors);


    const ButtonGroup = () => {
        return (
            <Stack
                direction={{
                    xs: "column-reverse",
                    sm: "row",
                }}
                spacing={"1rem"}
                padding={{
                    xs: "unset",
                    md: "1rem 3rem",
                }}
                margin={{
                    xs: "2rem 0",
                    // md: "3rem 0",
                }}
                maxWidth={{xs: "90%"}}
            >
                <Button
                    size="large"
                    variant="contained"
                    color="error"
                    startIcon={<DeleteIcon/>}
                    onClick={openConfirmDeleteHandler}
                    // disabled={isLoadingDeleteGroup}
                >
                    Delete Group
                </Button>
                <Button
                    size="large"
                    variant="contained"
                    startIcon={<AddIcon/>}
                    onClick={openAddMemberHandler}
                >
                    Add Member
                </Button>
            </Stack>
        );
    };

    const GroupName = () => {
        return (
            <Stack
                direction={"row"}
                alignItems={"center"}
                justifyContent={"center"}
                spacing={"1rem"}
                padding={"1rem 3rem "}
            >
                {isEdit ? (
                    <>
                        <TextField
                            value={groupNameUpdatedValue}
                            onChange={(e) => setGroupNameUpdatedValue(e.target.value)}
                            autoFocus
                            inputRef={inputRef}
                            onKeyDown={async (e) => {
                                if (e.key === "Enter") {
                                    await updateGroupNameHandler();
                                }
                            }}
                        />
                        <IconButton
                            onClick={updateGroupNameHandler}
                            disabled={isLoadingGroupName}
                        >
                            <DoneIcon/>
                        </IconButton>
                    </>
                ) : (
                    <>
                        <Typography
                            variant="h4"
                            sx={{
                                display: "-webkit-box",
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: "vertical",
                                overflow: "hidden",
                            }}
                        >
                            {groupName}
                        </Typography>
                        <IconButton
                            onClick={() => setIsEdit(true)}
                            disabled={isLoadingGroupName}
                        >
                            <EditIcon/>
                        </IconButton>
                    </>
                )}
            </Stack>
        );
    };
    const IconBtns = () => {
        return (
            <>
                <Box
                    sx={{
                        display: {
                            xs: "block",
                            md: "none",
                        },
                        position: "absolute",
                        right: "1.5rem",
                        top: "1.5rem",
                    }}
                >
                    <IconButton onClick={handleMobile}>
                        <MenuIcon/>
                    </IconButton>
                </Box>
                <Tooltip title="back">
                    <IconButton
                        sx={{
                            position: "absolute",
                            top: {xs: "2rem", sm: "1rem", md : "-4rem"},
                            left: "2rem",
                            background: "rgba(0,0,0,0.8)",
                            color: "white",
                            "&:hover": {
                                background: "rgba(0,0,0,0.7)",
                            },
                        }}
                        onClick={navigateBack}
                    >
                        <KeyboardBackSpaceIcon/>
                    </IconButton>
                </Tooltip>
            </>
        );
    };

    return myGroups.isLoading ? (
        <LayoutLoader/>
    ) : (
        <Grid2
            container
            sx={{
                height: "100vh",
                display: "flex",
                flexDirection: "row",
                width: "100%",
                alignItems: "center",
                justifyContent: "center",
                bgcolor: grayColor,
            }}
        >
            <Box sx={{display: {xs: "block", md: "none"}}}>
                <IconBtns/>
            </Box>
            <Grid2
                sm={4}
                sx={{
                    display: {
                        xs: "none",
                        sm: "block",
                    },
                    flexGrow: 1,
                    maxWidth: "30%",
                    boxSizing: "border-box",
                    backgroundImage: bgGradient,
                }}
            >
                <GroupList myGroups={myGroups?.data?.groups} chatId={chatId}/>
            </Grid2>
            <Grid2
                xs={12}
                sm={8}
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    position: "relative",
                    padding: "1rem 3rem",
                    flexGrow: 2,
                    maxWidth: {
                        xs: "100%",
                        sm: "70%",
                    },
                }}
            >
                <Box sx={{display: {xs: "none", md: "block"}}}>
                    <IconBtns/>
                </Box>


                {groupDetails?.data?.chat?._id === chatId && groupName && (
                    <>
                        <GroupName/>
                        <Typography
                            margin={"0.5rem 2rem"}
                            alignSelf={"center"}
                            variant="body1"
                        >
                            Members
                        </Typography>
                        <Stack
                            maxWidth={{
                                xs: "90%",
                                sm: "80%",
                            }}
                            width={"100%"}
                            boxSizing={"border-box"}
                            padding={{
                                xs: "0",
                                sm: "1rem",
                                md: "1rem 3rem",
                            }}
                            spacing={"2rem"}
                            sx={{
                                height: {
                                    xs: "50vh",
                                    // sm : "60vh"
                                },
                                overflow: "auto",
                            }}
                        >
                            {isLoadingRemoveMember ? (
                                <CircularProgress/>
                            ) : (
                                members?.map((user) => {
                                    return (
                                        <UserItem
                                            user={user}
                                            key={user._id}
                                            isAdded
                                            styling={{
                                                boxShadow: "0 0 0.5rem rgba(0,0,0,0.2)",
                                                padding: "1rem 2rem",
                                                borderRadius: "1rem",
                                                bgcolor: "rgba(255,255,255,0.5)",
                                            }}
                                            handler={async () => {
                                                await removeMemberHandler(user._id);
                                            }}
                                            disabled={isLoadingRemoveMember}
                                            creator={groupDetails?.data?.chat?.creator}
                                        />
                                    );
                                })
                            )}
                        </Stack>
                        <ButtonGroup/>
                    </>
                )}
            </Grid2>
            {isAddMember && (
                <Suspense fallback={<Backdrop open/>}>
                    <AddMemberDialog
                        chatId={chatId}
                        groupMembers={groupDetails?.data?.chat.members.map(
                            (member) => member._id
                        )}
                    />
                </Suspense>
            )}

            {confirmDeleteDialog && (
                <Suspense fallback={<Backdrop open/>}>
                    <ConfirmDeleteDialog
                        open={confirmDeleteDialog}
                        handleClose={closeConfirmDeleteHandler}
                        deleteHandler={deleteHandler}
                    />
                </Suspense>
            )}

            <Drawer
                sx={{
                    display: {
                        xs: "block",
                        md: "none",
                    },
                }}
                anchor="right"
                open={isMobileMenuOpen}
                onClick={handleMobileClose}
            >
                <GroupList myGroups={myGroups?.data?.groups} chatId={chatId}/>
            </Drawer>
        </Grid2>
    );
};

const GroupList = ({myGroups = [], chatId}) => {
    return (
        <Stack width={"100%"} sx={{backgroundImage: bgGradient}} height={"100vh"}>
            {myGroups.length > 0 ? (
                myGroups.map((group) => {
                    return (
                        <GroupListItem group={group} chatId={chatId} key={group._id}/>
                    );
                })
            ) : (
                <Typography textAlign={"center"} padding={"1rem"}>
                    {" "}
                    No Groups{" "}
                </Typography>
            )}
        </Stack>
    );
};

const GroupListItem = memo(({group, chatId}) => {
    const {name, avatar, _id} = group;
    return (
        <StyledLink
            to={`?group=${_id}`}
            onClick={(e) => {
                if (chatId === _id) e.preventDefault();
            }}
        >
            <motion.div
                initial={{opacity: 0, y: "-100%"}}
                whileInView={{opacity: 1, y: 0}}
                transition={{duration: 0.5}}
            >
                <Stack
                    direction={"row"}
                    spacing={"0.5rem"}
                    alignItems={"center"}
                    sx={{
                        padding: "0.5rem",
                        gap: "1rem",
                        cursor: "pointer",
                    }}
                >
                    {/* <Box display={{xs : "none", sm : "block"}}> */}
                    <AvatarCard avatar={avatar}/>
                    {/* </Box> */}
                    <Typography
                        sx={{
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                        }}
                    >{name}</Typography>
                </Stack>
            </motion.div>
        </StyledLink>
    );
});

export default Groups;
