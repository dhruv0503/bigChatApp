import { Search as SearchIcon } from "@mui/icons-material";
import {
  Dialog,
  DialogTitle,
  InputAdornment,
  List,
  Stack,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLazySearchUserQuery, useSendFriendeRequestMutation } from "../../redux/api/api";
import { setIsSearch } from "../../redux/reducers/miscSlice";
import UserItem from "../shared/UserItem";
import { useAsyncMutation } from "../hooks/hooks";

const Search = () => {
  const { isSearch } = useSelector(state => state.misc)
  const [searchText, setSearchText] = useState("");
  const [users, setUsers] = useState([]);

  const [searchUser] = useLazySearchUserQuery();
  const [sendFriendRequest, isLoadingSendFriendRequest] = useAsyncMutation(useSendFriendeRequestMutation);

  const dispatch = useDispatch();

  const addFriendLoader = async (_id) => {
    await sendFriendRequest("Sending Friend Request...", { userId: _id })
  }


  useEffect(() => {

    const timeOutId = setTimeout(() => {
      searchUser(searchText)
        .then(({ data }) => {
          setUsers(data?.updatedSearchList)
        })
        .catch((err) => console.log(err))
    }, 1000)

    return () => {
      clearTimeout(timeOutId)
    }

  }, [searchText])

  return (
    <Dialog open={isSearch} onClose={() => dispatch(setIsSearch(false))}>
      <Stack p={"2rem"} direction={"column"} width={"25rem"}>
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
            users?.map((user, idx) => {
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
