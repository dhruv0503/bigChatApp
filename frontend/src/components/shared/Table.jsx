import { Container, Paper, Typography } from '@mui/material'
import React from 'react'
import { DataGrid } from '@mui/x-data-grid'

const Table = ({ rows, columns, heading, rowHeight = 52 }) => {
    return (
        <Container sx={{
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
        }}>
            <Paper elevation={3} sx={{
                padding: "1rem 3rem",
                borderRadius: "1rem",
                width: "100%",
                height: "90vh",
                overflow: "hidden",
                boxShadow: "none",

            }}>
                <Typography textAlign={"center"} variant='h4' sx={{ margin: "1rem", textTransform: "uppercase" }}>
                    {heading}
                </Typography>
                <DataGrid rows={rows} columns={columns} rowHeight={rowHeight} style={{
                    height: "80%"
                }} sx={{
                    border: "none",
                    ".table-header": {
                        bgcolor: "black",
                        color: "white"

                    }
                }} />
            </Paper>
        </Container>
    )
}

export default Table