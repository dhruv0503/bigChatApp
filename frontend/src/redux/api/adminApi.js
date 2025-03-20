import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

const adminApi = createApi({
    reducerPath: "api",
    baseQuery: fetchBaseQuery({
        baseUrl: `${import.meta.env.VITE_SERVER}/api/admin`
    }),
    tagTypes: ["chat", "user", "message"],
    endpoints: (builder) => ({
        adminLogin: builder.mutation({
            query: (data) => ({
                url: '/login',
                method: 'POST',
                body: data,
                credentials: 'include'
            })
        }),
        adminLogout: builder.mutation({
            query: () => ({
                url: '/logout',
                method: 'POST',
                credentials: 'include'
            })
        }),
        getUsers: builder.query({
            query: () => ({
                url: '/users',
                method: 'GET',
                credentials: 'include'
            })
        }),
        getDashboard: builder.query({
            query: () => ({
                url: '/dashboard',
                method: 'GET',
                credentials: 'include'
            })
        }),
        getChats: builder.query({
            query: () => ({
                url: '/chats',
                method: 'GET',
                credentials: 'include'
            })
        }),
        getMessages: builder.query({
            query: () => ({
                url: '/messages',
                method: 'GET',
                credentials: 'include'
            })
        }),
    })
})

export default adminApi;
export const {
    useAdminLoginMutation,
    useAdminLogoutMutation,
    useGetUsersQuery,
    useGetDashboardQuery,
    useGetChatsQuery,
    useGetMessagesQuery
} = adminApi