// src/features/testimonialsApi.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';


export const testimonialsApi = createApi({
  reducerPath: 'testimonialsApi',
    baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:8000/api/testimonials' , credentials: 'include',}),
  tagTypes: ['Testimonial'],
  endpoints: (builder) => ({
    getAllTestimonials: builder.query({
      query: () => '/',
      providesTags: ['Testimonial'],
    }),
    createTestimonial: builder.mutation({
      query: (newTestimonial) => ({
        url: '/',
        method: 'POST',
        body: newTestimonial,
      }),
      // Optimistic update: add the new testimonial to the cache before the server responds
      async onQueryStarted(newTestimonial, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          testimonialsApi.util.updateQueryData('getAllTestimonials', undefined, (draft) => {
            draft.push(newTestimonial); // Add the new testimonial to the draft
          })
        );
        try {
          await queryFulfilled; // Wait for the mutation to complete
        } catch {
          patchResult.undo(); // Undo the optimistic update if the request fails
        }
      },
      invalidatesTags: ['Testimonial'],
    }),
    updateTestimonial: builder.mutation({
      query: ({ id, ...updatedData }) => ({
        url: `/${id}`,
        method: 'PUT',
        body: updatedData,
      }),
      async onQueryStarted({ id, ...updatedData }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          testimonialsApi.util.updateQueryData('getAllTestimonials', undefined, (draft) => {
            const index = draft.findIndex((testimonial) => testimonial._id === id);
            if (index !== -1) {
              draft[index] = { ...draft[index], ...updatedData }; // Update the testimonial in the draft
            }
          })
        );
        try {
          await queryFulfilled; // Wait for the mutation to complete
        } catch {
          patchResult.undo(); // Undo the optimistic update if the request fails
        }
      },
      invalidatesTags: ['Testimonial'],
    }),
    deleteTestimonial: builder.mutation({
      query: (id) => ({
        url: `/${id}`,
        method: 'DELETE',
      }),
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          testimonialsApi.util.updateQueryData('getAllTestimonials', undefined, (draft) => {
            const index = draft.findIndex((testimonial) => testimonial._id === id);
            if (index !== -1) {
              draft.splice(index, 1); // Remove the testimonial from the draft
            }
          })
        );
        try {
          await queryFulfilled; // Wait for the mutation to complete
        } catch {
          patchResult.undo(); // Undo the optimistic update if the request fails
        }
      },
      invalidatesTags: ['Testimonial'],
    }),
  }),
});

// Export hooks for usage in functional components
export const {
  useGetAllTestimonialsQuery,
  useCreateTestimonialMutation,
  useUpdateTestimonialMutation,
  useDeleteTestimonialMutation,
} = testimonialsApi;

// Export the reducer to be included in the store
export default testimonialsApi.reducer;