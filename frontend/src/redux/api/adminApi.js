import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

const adminApi = createApi({
    reducerPath: "adminApi",
    baseQuery: fetchBaseQuery({
        baseUrl: `${import.meta.env.VITE_SERVER}/api/admin`
    }),
    tagTypes: [],
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
        getAdminUsers: builder.query({
            query: () => ({
                url: '/users',
                method: 'GET',
                credentials: 'include'
            })
        }),
        getAdminDashboard: builder.query({
            query: () => ({
                url: '/dashboard',
                method: 'GET',
                credentials: 'include'
            })
        }),
        getAdminChats: builder.query({
            query: () => ({
                url: '/chats',
                method: 'GET',
                credentials: 'include'
            })
        }),
        getAdminMessages: builder.query({
            query: () => ({
                url: '/messages',
                method: 'GET',
                credentials: 'include'
            })
        }),
        getIsAdmin: builder.query({
            query: () => ({
                url: '/',
                method: 'GET',
                credentials: 'include'
            })
        })
    })
})

export default adminApi;
export const {
    useAdminLoginMutation,
    useAdminLogoutMutation,
    useGetIsAdminQuery,
    useGetAdminChatsQuery,
    useGetAdminDashboardQuery,
    useGetAdminMessagesQuery,
    useGetAdminUsersQuery
} = adminApi