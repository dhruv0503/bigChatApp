import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

const api = createApi({
    reducerPath: "api",
    baseQuery: fetchBaseQuery({
        baseUrl: `${import.meta.env.VITE_SERVER}/api`
    }),
    tagTypes: ["chats", "user", "message"],
    endpoints: (builder) => ({
        getChats: builder.query({
            query: () => ({
                url: "/chat",
                method: "GET",
                credentials: "include"
            }),
            providesTags: ["chats"]
        }),
        searchUser: builder.query({
            query: (username) => ({
                url: `/user/search?username=${username}`,
                method: "GET",
                credentials: "include"
            }),
            providesTags: ["user"]
        }),
        getNotifications: builder.query({
            query: () => ({
                url: '/user/notifications',
                method: 'GET',
                credentials: 'include'
            }),
            keepUnusedDataFor: 0
        }),
        getChatDetails: builder.query({
            query: ({ chatId, populate = false }) => {
                let url = `/chat/${chatId}`
                if (populate) url += "?populate=true"
                return {
                    url,
                    method: "GET",
                    credentials: "include"
                }
            },
            providesTags: ["chats"]
        }),
        getChatMessages: builder.query({
            query: ({ chatId, page = 1 }) => ({
                url: `/message/${chatId}?page=${page}`,
                credentials: "include"

            }),
            providesTags: ["message"]
        }),
        sendAttachments: builder.mutation({
            query: (data) => ({
                url: `/message/attachment`,
                method : "POST",
                credentials: "include",
                body : data

            }),
        }),
        sendFriendeRequest: builder.mutation({
            query: (data) => ({
                url: '/request',
                method: 'POST',
                body: data,
                credentials: 'include'
            }),
            invalidatesTags: ["user"]
        }),
        acceptFriendeRequest: builder.mutation({
            query: (data) => ({
                url: '/request',
                method: 'PATCH',
                body: data,
                credentials: 'include'
            }),
            invalidatesTags: ["user", "chats"]
        }),

    })
})
export default api;
export const {
    useGetChatsQuery,
    useLazySearchUserQuery,
    useSendFriendeRequestMutation,
    useGetNotificationsQuery,
    useAcceptFriendeRequestMutation,
    useGetChatDetailsQuery,
    useGetChatMessagesQuery,
    useSendAttachmentsMutation
} = api