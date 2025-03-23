import { Avatar, Stack } from "@mui/material";
import { useEffect, useState } from "react";
import { useErrors } from "../../components/hooks/hooks";
import AdminLayout from "../../components/layout/AdminLayout";
import AvatarCard from "../../components/shared/AvatarCard";
import Table from "../../components/shared/Table";
import { transformImage } from "../../lib/features";
import { useGetAdminChatsQuery } from "../../redux/api/adminApi";

const columns = [
  {
    field: "id",
    headerName: "ID",
    headerClassName: "table-header",
    width: 124,
  },
  {
    field: "avatar",
    headerName: "Avatar",
    headerClassName: "table-header",
    width: 150,
    renderCell: (params) => (
      <AvatarCard avatar={params.row.avatar} sx={{ marginTop: "0.3rem" }} />
    ),
  },
  {
    field: "name",
    headerName: "Name",
    headerClassName: "table-header",
    width: 300,
  },
  {
    field: "totalMembers",
    headerName: "Total Members",
    headerClassName: "table-header",
    width: 120,
  },
  {
    field: "members",
    headerName: "Members",
    headerClassName: "table-header",
    width: 400,
    renderCell: (params) => (
      <AvatarCard max={100} avatar={params.row.members} />
    ),
  },
  {
    field: "totalMessages",
    headerName: "Total Messages",
    headerClassName: "table-header",
    width: 120,
  },
  {
    field: "creator",
    headerName: "Created By",
    headerClassName: "table-header",
    width: 250,
    renderCell: (params) => (
      <Stack direction={"row"} alignItems={"center"} spacing={"1rem"}>
        <Avatar
          alt={params.row.creator?.name}
          src={params.row.creator?.avatar}
        />
        <span>{params.row.creator?.name}</span>
      </Stack>
    ),
  },
];

const ChatManager = () => {
  const [rows, setRows] = useState([]);
  const { data, isError, error, isLoading } = useGetAdminChatsQuery();

  useEffect(() => {
    setRows(
      data?.chats.map((chat) => {
        return {
          ...chat,
          id: chat._id,
          avatar: chat?.avatar?.map((av) => transformImage(av, 50)),
          members: chat?.members?.avatar?.map((av) =>
            transformImage(av.avatar, 50)
          ),
          creator: {
            ...chat.creator,
            avatar: transformImage(chat.creator.avatar, 50),
          },
        };
      })
    );
  }, [data?.chats]);

  useErrors([{ isError, error }]);

  return (
    <AdminLayout>
      <Table rows={rows} columns={columns} heading={"All Chats"} />
    </AdminLayout>
  );
};

export default ChatManager;
