import {
  Dialog,
  Stack,
  DialogTitle,
  TextField,
  InputAdornment,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { useState } from "react";
import { Search as SearchIcon } from "@mui/icons-material";

const Search = () => {
  const [searchText, setSearchText] = useState("");
  const users = [1,2,3];
  return (
    <Dialog open>
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
          {users.map((user, idx) => (
            <ListItem key={idx}>
              <ListItemText />
            </ListItem>
          ))}
        </List>
      </Stack>
    </Dialog>
  );
};

export default Search;
