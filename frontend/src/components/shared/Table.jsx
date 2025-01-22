import { Container, Paper, Typography } from '@mui/material'
import React from 'react'
import { DataGrid } from '@mui/x-data-grid'

const Table = ({ rows, columns, heading, rowHeight = 52 }) => {
    return (
        <Container sx={{height : "90%"}}>
            <Paper elevation={3} sx={{
                padding: "1rem 4rem",
                borderRadius: "1rem",
                width: "100%",
                height: "100%",
                margin : "3rem 0",
                overflow: "hidden",
                boxShadow : "none"
            }}>
                <Typography textAlign={"center"} variant='h4' sx={{ margin: "2rem", textTransform: "uppercase" }}>
                    {heading}
                </Typography>
                <DataGrid rows={rows} columns={columns} rowHeight={rowHeight} style={{
                    height: "80%"
                }} sx={{
                    border : "none",
                    ".table-header" : {
                        bgcolor : "black",
                        color : "white",

                    }
                }} />
            </Paper>
        </Container>
    )
}

export default Table