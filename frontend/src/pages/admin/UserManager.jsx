import React, { useEffect, useState } from 'react'
import AdminLayout from '../../components/layout/AdminLayout'
import Table from '../../components/shared/Table'
import { Avatar } from '@mui/material'
import { dashboardData } from '../../constants/sampleData'
import { transformImage } from '../../lib/features'

const columns = [
    { field: 'id', headerName: 'ID', headerClassName: "table-header", width: 124 },
    {
        field: 'avatar', headerName: 'Avatar', headerClassName: "table-header", width: 150,
        renderCell: (params) => <Avatar alt={params.row.name} src={params.row.avatar} sx={{marginTop : "0.3rem"}}/>
    },
    { field: 'name', headerName: 'Name', headerClassName: "table-header", width: 200 },
    { field: 'username', headerName: 'Username', headerClassName: "table-header", width: 200 },
    { field: 'friends', headerName: 'Friends', headerClassName: "table-header", width: 200 },
    { field: 'groups', headerName: 'Groups', headerClassName: "table-header", width: 150 },
]

const UserManager = () => {
    const [rows, setRows] = useState([])

    useEffect( () => {
        setRows(dashboardData.users.map((user) => {
            return {...user, id : user._id, avatar : transformImage(user.avatar, 50)}
        }))
    }, [])

    return (
        <AdminLayout>
            <Table rows={rows} columns={columns} heading={"All Users"} />
        </AdminLayout>
    )
}

export default UserManager