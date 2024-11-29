import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const messagesApi = createApi({
  reducerPath: 'messagesApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:8000/api/messages', credentials: 'include' }),
  endpoints: (builder) => ({
    getMessages: builder.query({
      query: () => '',
    }),
    sendMessage: builder.mutation({
      query: (newMessage) => ({
        url: '',
        method: 'POST',
        body: newMessage,
      }),
    }),
    markAsUnread: builder.mutation({
      query: (id) => ({
        url: `/${id}/mark-read`, // Ensure this matches your backend route
        method: 'PATCH',
      }),
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          messagesApi.util.updateQueryData('getMessages', undefined, (draft) => {
            const message = draft.find(msg => msg.id === id);
            if (message) {
              message.status = 'read'; // Optimistically update the message status
            }
          })
        );

        try {
          await queryFulfilled; // Wait for the API call to resolve
        } catch {
          patchResult.undo(); // Rollback if the API call fails
        }
      },
    }),
  }),
});

export const { useGetMessagesQuery, useSendMessageMutation, useMarkAsUnreadMutation } = messagesApi;