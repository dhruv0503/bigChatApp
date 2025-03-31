import { Avatar, Skeleton } from "@mui/material";
import { useEffect, useState } from "react";
import { useErrors } from "../../components/hooks/hooks";
import AdminLayout from "../../components/layout/AdminLayout";
import Table from "../../components/shared/Table";
import { transformImage } from "../../lib/features";
import { useGetAdminUsersQuery } from "../../redux/api/adminApi";

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
      <Avatar
        alt={params.row.name}
        src={params.row.avatar}
        sx={{ marginTop: "0.3rem" }}
      />
    ),
  },
  {
    field: "name",
    headerName: "Name",
    headerClassName: "table-header",
    width: 200,
  },
  {
    field: "username",
    headerName: "Username",
    headerClassName: "table-header",
    width: 200,
  },
  {
    field: "friends",
    headerName: "Friends",
    headerClassName: "table-header",
    width: 200,
  },
  {
    field: "groups",
    headerName: "Groups",
    headerClassName: "table-header",
    width: 150,
  },
];

const UserManager = () => {
  const [rows, setRows] = useState([]);
  const { data, isError, error, isLoading } = useGetAdminUsersQuery();
  useEffect(() => {
    console.log(data);
    setRows(
      data?.users?.map((user) => {
        return {
          ...user,
          id: user._id,
          avatar: transformImage(user.avatar, 50),
          friends: user.singleChats,
          groups: user.groupChats,
        };
      })
    );
  }, [data]);

  useErrors([{ isError, error }]);

  return (
    <AdminLayout>
      {isLoading ? (
        <Skeleton height={"100vh"}/>
      ) : (
        <Table rows={rows} columns={columns} heading={"All Users"} />
      )}
    </AdminLayout>
  );
};

export default UserManager;
