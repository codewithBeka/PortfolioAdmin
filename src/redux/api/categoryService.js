import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const categoryApi = createApi({
    reducerPath: 'categoryApi',
    baseQuery: fetchBaseQuery({ baseUrl: 'https://codewithbeka.onrender.com/api/categories', credentials: 'include' }),
    endpoints: (builder) => ({
        getCategories: builder.query({
            query: () => '/',
            providesTags: (result) => 
                result ? 
                [...result.map(({ _id }) => ({ type: 'Category', id: _id })), { type: 'Category', id: 'LIST' }] 
                : [{ type: 'Category', id: 'LIST' }],
        }),
        getCategoryById: builder.query({
            query: (id) => `/${id}`,
        }),
        createCategory: builder.mutation({
            query: (newCategory) => ({
                url: '/',
                method: 'POST',
                body: newCategory,
            }),
            // Optimistic update
            async onQueryStarted(newCategory, { dispatch, queryFulfilled }) {
                const patchResult = dispatch(
                    categoryApi.util.updateQueryData('getCategories', undefined, (draft) => {
                        draft.push(newCategory);
                    })
                );
                try {
                    await queryFulfilled; // Wait for the mutation to complete
                } catch {
                    patchResult.undo(); // Roll back the optimistic update on error
                }
            },
        }),
        updateCategory: builder.mutation({
            query: ({ id, ...category }) => ({
                url: `/${id}`,
                method: 'PUT',
                body: category,
            }),
            // Optimistic update
            async onQueryStarted({ id, ...category }, { dispatch, queryFulfilled }) {
                const patchResult = dispatch(
                    categoryApi.util.updateQueryData('getCategories', undefined, (draft) => {
                        const index = draft.findIndex(cat => cat._id === id);
                        if (index !== -1) {
                            draft[index] = { ...draft[index], ...category }; // Update the specific category
                        }
                    })
                );
                try {
                    await queryFulfilled; // Wait for the mutation to complete
                } catch {
                    patchResult.undo(); // Roll back the optimistic update on error
                }
            },
        }),
        deleteCategory: builder.mutation({
            query: (id) => ({
                url: `/${id}`,
                method: 'DELETE',
            }),
            // Optimistic update
            async onQueryStarted(id, { dispatch, queryFulfilled }) {
                const patchResult = dispatch(
                    categoryApi.util.updateQueryData('getCategories', undefined, (draft) => {
                        const index = draft.findIndex(cat => cat._id === id);
                        if (index !== -1) {
                            draft.splice(index, 1); // Remove the deleted category
                        }
                    })
                );
                try {
                    await queryFulfilled; // Wait for the mutation to complete
                } catch {
                    patchResult.undo(); // Roll back the optimistic update on error
                }
            },
        }),
    }),
});

export const {
    useGetCategoriesQuery,
    useGetCategoryByIdQuery,
    useCreateCategoryMutation,
    useUpdateCategoryMutation,
    useDeleteCategoryMutation,
} = categoryApi;