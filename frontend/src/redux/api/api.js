import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react'

const api = createApi({
    reducerPath: "api",
    baseQuery: fetchBaseQuery({
        baseUrl: `${import.meta.env.VITE_SERVER}/api`
    }),
    tagTypes: ["chat", "user", "message"],
    endpoints: (builder) => ({
        getChats: builder.query({
            query: () => ({
                url: "/chat",
                method: "GET",
                credentials: "include"
            }),
            providesTags: ["chat"]
        }),
        getUserProfile: builder.query({
            query: () => {
                return {
                    url: `/user/profile`,
                    method: "GET",
                    credentials: "include"
                }
            },
            providesTags: ["user"]
        }),
        getGroups: builder.query({
            query: () => ({
                url: "/chat/group",
                method: "GET",
                credentials: "include"
            }),
            providesTags: ["chat"]
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
            query: ({chatId, populate = false}) => {
                let url = `/chat/${chatId}`
                if (populate) url += "?populate=true"
                return {
                    url,
                    method: "GET",
                    credentials: "include"
                }
            },
            providesTags: ["chat"]
        }),
        getFriends: builder.query({
            query: (chatId) => {
                let url = `/user/friends`
                if (chatId) url += `?chatId=${chatId}`
                return {
                    url,
                    method: "GET",
                    credentials: "include"
                }
            },
            providesTags: ["chat"]
        }),
        getChatMessages: builder.query({
            query: ({id, page = 1}) => ({
                url: `/message/${id}?page=${page}`,
                credentials: "include"

            }),
            keepUnusedDataFor: 0
        }),
        login: builder.mutation({
            query: (data) => ({
                url: `/login`,
                method: "POST",
                credentials: "include",
                body: data
            }),
        }),
        register: builder.mutation({
            query: (data) => ({
                url: `/signup`,
                method: "POST",
                credentials: "include",
                body: data
            }),
        }),
        logout: builder.mutation({
            query: (data) => ({
                url: `/logout`,
                method: "POST",
                credentials: "include",
                body: data
            }),
            invalidatesTags: ["user", "chat", "message"]
        }),

        sendAttachments: builder.mutation({
            query: (data) => ({
                url: `/message/attachment`,
                method: "POST",
                credentials: "include",
                body: data
            }),
        }),
        createNewGroup: builder.mutation({
            query: ({name, members}) => ({
                url: `/chat/group/new`,
                method: "POST",
                credentials: "include",
                body: {name, members}
            }),
            invalidatesTags: ["chat"]
        }),
        sendFriendRequest: builder.mutation({
            query: (data) => ({
                url: '/request',
                method: 'POST',
                body: data,
                credentials: 'include'
            }),
            invalidatesTags: ["user"]
        }),
        acceptFriendRequest: builder.mutation({
            query: (data) => ({
                url: '/request',
                method: 'PATCH',
                body: data,
                credentials: 'include'
            }),
            invalidatesTags: ["user", "chat"]
        }),
        renameGroup: builder.mutation({
            query: ({chatId, name}) => ({
                url: `/chat/${chatId}`,
                method: 'PATCH',
                body: {name},
                credentials: 'include'
            }),
            invalidatesTags: ["chat"]
        }),
        removeMember: builder.mutation({
            query: ({chatId, userId}) => ({
                url: `/chat/group/remove`,
                method: 'PATCH',
                body: {chatId, userId},
                credentials: 'include'
            }),
            invalidatesTags: ["chat"]
        }),
        addMember: builder.mutation({
            query: ({chatId, members}) => ({
                url: `/chat/group/add`,
                method: 'PATCH',
                body: {chatId, newMembers: members},
                credentials: 'include'
            }),
            invalidatesTags: ["chat"]
        }),
        deleteChat: builder.mutation({
            query: (chatId) => ({
                url: `/chat/${chatId}`,
                method: 'DELETE',
                credentials: 'include'
            }),
            invalidatesTags: ["chat"]
        }),
        leaveGroup: builder.mutation({
            query: (chatId) => ({
                url: `/chat/group/leave/${chatId}`,
                method: 'PATCH',
                credentials: 'include'
            }),
            invalidatesTags: ["chat"]
        }),
    })
})
export default api;
export const {
    useGetChatsQuery,
    useLazySearchUserQuery,
    useSendFriendRequestMutation,
    useGetNotificationsQuery,
    useAcceptFriendRequestMutation,
    useGetChatDetailsQuery,
    useGetChatMessagesQuery,
    useSendAttachmentsMutation,
    useGetGroupsQuery,
    useGetFriendsQuery,
    useCreateNewGroupMutation,
    useRenameGroupMutation,
    useRemoveMemberMutation,
    useAddMemberMutation,
    useDeleteChatMutation,
    useLeaveGroupMutation,
    useLoginMutation,
    useRegisterMutation,
    useLogoutMutation,
    useGetUserProfileQuery,
} = api