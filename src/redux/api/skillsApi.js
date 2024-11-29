// frontend/src/features/skillsApi.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const skillsApi = createApi({
    reducerPath: 'skillsApi',
    baseQuery: fetchBaseQuery({
        baseUrl: 'http://localhost:8000/api/skills',
        credentials: 'include',
    }),
    endpoints: (builder) => ({
        getAllSkills: builder.query({
            query: () => '/',
        }),
        createSkill: builder.mutation({
            query: (newSkill) => ({
                url: '/',
                method: 'POST',
                body: newSkill,
            }),
            async onQueryStarted(newSkill, { dispatch, queryFulfilled }) {
                // Optimistically update the cache
                const patchResult = dispatch(
                    skillsApi.util.updateQueryData('getAllSkills', undefined, (draft) => {
                        draft.push(newSkill); // Add the new skill to the draft
                    })
                );

                try {
                    await queryFulfilled; // Wait for the mutation to finish
                } catch {
                    // Rollback the optimistic update on an error
                    patchResult.undo();
                }
            },
        }),
        deleteSkill: builder.mutation({
            query: (id) => ({
                url: `/${id}`,
                method: 'DELETE',
            }),
            async onQueryStarted(id, { dispatch, queryFulfilled }) {
                // Optimistically update the cache
                const patchResult = dispatch(
                    skillsApi.util.updateQueryData('getAllSkills', undefined, (draft) => {
                        // Remove the skill from the draft
                        return draft.filter((skill) => skill._id !== id);
                    })
                );

                try {
                    await queryFulfilled; // Wait for the mutation to finish
                } catch {
                    // Rollback the optimistic update on an error
                    patchResult.undo();
                }
            },
        }),
    }),
});

export const { useGetAllSkillsQuery, useCreateSkillMutation, useDeleteSkillMutation } = skillsApi;