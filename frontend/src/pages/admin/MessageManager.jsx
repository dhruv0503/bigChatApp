import React, { useEffect, useState } from 'react'
import AdminLayout from '../../components/layout/AdminLayout'
import Table from '../../components/shared/Table'
import { Avatar, Stack } from '@mui/material'
import { dashboardData } from '../../constants/sampleData'
import { transformImage } from '../../lib/features'

const columns = [
  { field: 'id', headerName: 'ID', headerClassName: "table-header", width: 124 },
  {
    field: 'attachments', headerName: 'Attachments', headerClassName: "table-header", width: 400,
    renderCell: (params) => <Avatar alt={params.row.name} src={params.row.avatar} sx={{ marginTop: "0.3rem" }} />
  },
  { field: 'content', headerName: 'Content', headerClassName: "table-header", width: 200 },
  {
    field: 'sender', headerName: 'Sent By', headerClassName: "table-header", width: 200,
    renderCell: (params) => <Stack>
      <Avatar alt={params.row.sender?.name} src={params.row.sender?.avatar} sx={{ marginTop: "0.3rem" }} />
      <span>{params.row.sender?.name}</span>
    </Stack>
  },
  { field: 'chat', headerName: 'Chat', headerClassName: "table-header", width: 220 },
  { field: 'groupChat', headerName: 'Group Chat', headerClassName: "table-header", width: 100 },
  { field: 'createdAt', headerName: 'Created At', headerClassName: "table-header", width: 250 },
]

const MessageManager = () => {
  const [rows, setRows] = useState([])

  useEffect(() => {
    setRows(dashboardData.users.map((user) => {
      return { ...user, id: user._id, avatar: transformImage(user.avatar, 50) }
    }))
  }, [])

  return (
    <AdminLayout>
      <Table rows={rows} columns={columns} heading={"All Messages"} />
    </AdminLayout>
  )
}

export default MessageManager