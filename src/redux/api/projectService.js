import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const projectApi = createApi({
    reducerPath: 'projectApi',
    baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:8000/api/projects' , credentials: 'include',}),
    tagTypes: ['Project'],
    endpoints: (builder) => ({
        getProjects: builder.query({
            query: () => '/',
            providesTags: ['Project'],
        }),
        getProjectById: builder.query({
            query: (id) => `/${id}`, // Fetching by ID
        }), 
        getAllProjects: builder.query({
        query: () => "/all", // Fetches all projects
        providesTags: ["Project"],
        }),
        createProject: builder.mutation({
            query: (newProject) => ({
                url: '/',
                method: 'POST',
                body: newProject,
            }),
            invalidatesTags: ['Project'],
            async onQueryStarted(newProject, { dispatch, queryFulfilled }) {
                try {
                    await queryFulfilled;
                } catch (error) {
                    dispatch(
                        projectApi.util.updateQueryData('getProjects', undefined, (draft) => {
                            draft.splice(0, 0, newProject);
                        })
                    );
                }
            },
        }),
        updateProject: builder.mutation({
            query: ({ id, ...project }) => ({
                url: `/${id}`,
                method: 'PUT',
                body: project,
            }),
            invalidatesTags: (result, error, { id }) => [{ type: 'Project', id }],
            async onQueryStarted({ id, ...project }, { dispatch, queryFulfilled }) {
                const patchResult = dispatch(
                    projectApi.util.updateQueryData('getProjects', undefined, (draft) => {
                        const index = draft.findIndex((p) => p.id === id);
                        if (index !== -1) {
                            draft[index] = { ...draft[index], ...project };
                        }
                    })
                );
                try {
                    await queryFulfilled;
                } catch (error) {
                    patchResult.undo();
                }
            },
        }),
        deleteProject: builder.mutation({
            query: (id) => ({
                url: `/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: (result, error, id) => [{ type: 'Project', id }],
            async onQueryStarted(id, { dispatch, queryFulfilled }) {
                const patchResult = dispatch(
                    projectApi.util.updateQueryData('getProjects', undefined, (draft) => {
                        const index = draft.findIndex((p) => p._id === id); // Ensure you're using the correct property
                        if (index !== -1) {
                            draft.splice(index, 1); // Remove the project from the draft
                        }
                    })
                );
                try {
                    await queryFulfilled; // Wait for the delete request to complete
                } catch (error) {
                    patchResult.undo(); // Rollback if the request fails
                }
            },
        }),
    }),
});

export const {
    useGetProjectsQuery,
    useCreateProjectMutation,
    useGetProjectByIdQuery,
    useUpdateProjectMutation,
    useDeleteProjectMutation,
    useGetAllProjectsQuery 
} = projectApi;