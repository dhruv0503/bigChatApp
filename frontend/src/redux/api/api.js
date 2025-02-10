import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

const api = createApi({
    reducerPath: "api",
    baseQuery: fetchBaseQuery({
        baseUrl: `${import.meta.env.VITE_SERVER}/api`
    }),
    tagTypes: ["chats"],
    endpoints: (builder) => ({
        getChats: builder.query({
            query: () => ({
                url: "/chat",
                method: "GET",
                credentials: "include"
            }),
            providesTags : ["chats"]
        })
    })
})

export default api;
export const {
    useGetChatsQuery
} = api