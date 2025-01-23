import React, { useEffect, useState } from 'react'
import AdminLayout from '../../components/layout/AdminLayout'
import Table from '../../components/shared/Table'
import { Avatar, Box, Stack } from '@mui/material'
import { dashboardData } from '../../constants/sampleData'
import { fileFormat, transformImage } from '../../lib/features'
import moment from 'moment'
import RenderAttachment from '../../components/shared/RenderAttachment'

const columns = [
  { field: 'id', headerName: 'ID', headerClassName: "table-header", width: 124 },
  {
    field: 'attachments', headerName: 'Attachments', headerClassName: "table-header", width: 400,
    renderCell: (params) => {
      const { attachments } = params.row;
      return attachments.length > 0 ? (
        attachments.map((attachment, idx) => {
          const url = attachment.url;
          const fileType = fileFormat(url);
          console.log(url, fileType)
          return <Box sx={{
            display : "flex",
            alignItems : "center",
            justifyContent : "center",
          }}>
            <a href="url" target='_blank' style={{color : "black"}} download key={idx}>
              <RenderAttachment file={fileType} url={url} />
            </a>
          </Box>

        })
      ) : "No Attachments";
    }
  },
  {
    field: 'content', 
    headerName: 'Content',
    headerClassName: "table-header",
    width: 200,
    renderCell : (params) => (params.row.content ? params.row.content : "None")},
  {
    field: 'sender', headerName: 'Sent By', headerClassName: "table-header", width: 200,
    renderCell: (params) => <Stack direction={"row"} spacing={"1rem"} alignItems={"center"}>
      <Avatar alt={params.row.sender?.name} src={params.row.sender?.avatar} sx={{ marginTop: "0.3rem" }} />
      <span>{params.row.sender?.name}</span>
    </Stack>
  },
  { field: 'chat', headerName: 'Chat', headerClassName: "table-header", width: 220 },
  { field: 'groupChat', headerName: 'Group Chat', headerClassName: "table-header", width: 100, renderCell: (params) => params.row.groupChat ? "Yes" : "No" },
  { field: 'createdAt', headerName: 'Created At', headerClassName: "table-header", width: 250 },
]

const MessageManager = () => {
  const [rows, setRows] = useState([])

  useEffect(() => {
    setRows(dashboardData.messages.map((msg) => {
      return {
        ...msg,
        id: msg._id,
        sender: { ...msg.sender, avatar: transformImage(msg.sender.avatar, 50) },
        createdAt: moment(msg.createdAt).format('MMMM Do YYYY, h:mm:ss a')
      }
    }))
  }, [])

  return (
    <AdminLayout>
      <Table rows={rows} columns={columns} heading={"All Messages"} rowHeight={160} />
    </AdminLayout>
  ) 
}

export default MessageManager