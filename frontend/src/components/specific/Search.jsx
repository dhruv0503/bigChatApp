  import { Search as SearchIcon } from "@mui/icons-material";
  import {
    Dialog,
    DialogTitle,
    InputAdornment,
    List,
    Stack,
    TextField,
  } from "@mui/material";
  import { useEffect, useState, useCallback } from "react";
  import { useDispatch, useSelector } from "react-redux";
  import { useLazySearchUserQuery, useSendFriendRequestMutation } from "../../redux/api/api";
  import { setIsSearch } from "../../redux/reducers/miscSlice";
  import UserItem from "../shared/UserItem";
  import { useAsyncMutation } from "../hooks/hooks";

  const Search = () => {
    const { isSearch } = useSelector(state => state.misc)
    const [searchText, setSearchText] = useState("");
    const [users, setUsers] = useState([]);

    const [searchUser] = useLazySearchUserQuery();
    const [sendFriendRequest, isLoadingSendFriendRequest] = useAsyncMutation(useSendFriendRequestMutation);

    const dispatch = useDispatch();

    const searchUserFunction = useCallback(async() => {
      await searchUser(searchText)
          .then(({ data }) => {
            if(JSON.stringify(data?.updatedSearchList) !== JSON.stringify(users ))  setUsers(data?.updatedSearchList)
          })
          .catch((err) => console.log(err))
    }, [searchText, searchUser, users])

    useEffect(() => {
      const timeOutId = setTimeout(searchUserFunction, 1000)
      return () => {
        clearTimeout(timeOutId)
      }

    }, [searchText, searchUserFunction])

    const addFriendLoader = async (_id) => {
      await sendFriendRequest("Sending Friend Request...", { userId: _id })
      await searchUserFunction()
    }

    return (
      <Dialog width={"25rem"} open={isSearch} onClose={() => dispatch(setIsSearch(false))}>
        <Stack p={"2rem"} direction={"column"} >
          <DialogTitle textAlign={"center"}>Find People</DialogTitle>
          <TextField
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            variant="outlined"
            size="small"
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              },
            }}
          />
          <List>
            {
              users?.map((user) => {
                return <UserItem
                  user={user}
                  key={user._id}
                  handler={() => addFriendLoader(user._id)}
                  handlerIsLoading={isLoadingSendFriendRequest}
                />
              }
              )}
          </List>
        </Stack>
      </Dialog>
    );
  };

  export default Search;
