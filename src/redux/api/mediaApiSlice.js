// mediaApiSlice.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const mediaApiSlice = createApi({
    reducerPath: 'mediaApi',
    baseQuery: fetchBaseQuery({ baseUrl: 'https://codewithbeka.onrender.com/api' ,credentials: 'include',}), // Adjust the base URL as needed
    endpoints: (builder) => ({
        uploadMedia: builder.mutation({
            query: (formData) => ({
                url: '/upload', // Adjust the endpoint as necessary
                method: 'POST',
                body: formData,
            }),
        }),
        deleteMedia: builder.mutation({
            query: ({ publicId, resourceType }) => ({
                url: `/upload/delete/${publicId}?resource_type=${resourceType}`, // Adjust the endpoint as necessary
                method: 'DELETE',
            }),
        }),
    }),
});

// Export hooks for usage in functional components
export const { useUploadMediaMutation, useDeleteMediaMutation } = mediaApiSlice;
export default mediaApiSlice;