import { Avatar, Box, Skeleton, Stack, Typography } from "@mui/material";
import moment from "moment";
import  { useEffect, useState } from "react";
import { useErrors } from "../../components/hooks/hooks";
import AdminLayout from "../../components/layout/AdminLayout";
import RenderAttachment from "../../components/shared/RenderAttachment";
import Table from "../../components/shared/Table";
import { fileFormat, transformImage } from "../../lib/features";
import { useGetAdminMessagesQuery } from "../../redux/api/adminApi";
const columns = [
  {
    field: "id",
    headerName: "ID",
    headerClassName: "table-header",
    width: 124,
    headerAlign: "center",
  },
  {
    field: "attachments",
    headerName: "Attachments",
    headerClassName: "table-header",
    width: 300,
    headerAlign: "center",
    renderCell: (params) => {
      const { attachments } = params.row;
      return (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {attachments?.length > 0 ? (
            attachments.map((url, idx) => {
              const file = fileFormat(url);
              return (
                <a
                  href={url}
                  download
                  target="_blank"
                  style={{
                    color: "black",
                  }}
                  key={idx}
                >
                  {RenderAttachment(file, url)}
                </a>
              );
            })
          ) : (
            <Box display={"flex"} justifyContent={"center"} alignItems={"center"}>
              <Typography textAlign={"center"}>No Attachments</Typography>
            </Box>
          )}
        </Box>
      );
    },
  },
  {
    field: "content",
    headerName: "Content",
    headerClassName: "table-header",
    width: 200,
    headerAlign: "center",
    renderCell: (params) => (params.row.content ? params.row.content : "None"),
  },
  {
    field: "sender",
    headerName: "Sent By",
    headerClassName: "table-header",
    width: 200,
    headerAlign: "center",
    renderCell: (params) => (
      <Stack direction={"row"} spacing={"1rem"} alignItems={"center"}>
        <Avatar
          alt={params.row.sender?.username}
          src={params.row.sender?.avatar}
          sx={{ marginTop: "0.3rem" }}
        />
        <span>{params.row.sender?.username}</span>
      </Stack>
    ),
  },
  {
    field: "chat",
    headerName: "Chat",
    headerClassName: "table-header",
    width: 220,
    headerAlign: "center",
  },
  {
    field: "groupChat",
    headerName: "Group Chat",
    headerClassName: "table-header",
    width: 100,
    headerAlign: "center",
    renderCell: (params) => (params.row.groupChat ? "Yes" : "No"),
  },
  {
    field: "createdAt",
    headerName: "Created At",
    headerClassName: "table-header",
    width: 250,
    headerAlign: "center",
  },
];

const MessageManager = () => {
  const [rows, setRows] = useState([]);
  const { data, error, isError, isLoading } = useGetAdminMessagesQuery();
  useErrors([{ error, isError }]);
  useEffect(() => {
    setRows(
      data?.messages.map((msg) => {
        return {
          ...msg,
          chat: msg.chat,
          id: msg._id,
          sender: {
            ...msg.sender,
            avatar: transformImage(msg.sender.avatar, 100),
          },
          createdAt: moment(msg.createdAt).format("MMMM Do YYYY, h:mm:ss a"),
        };
      })
    );
  }, [data]);

  return (
    <AdminLayout>
      {isLoading ? (
        <Skeleton sx={{ height: "100vh" }} />
      ) : (
        <Table
          rows={rows}
          columns={columns}
          heading={"All Messages"}
          rowHeight={160}
        />
      )}
    </AdminLayout>
  );
};

export default MessageManager;
