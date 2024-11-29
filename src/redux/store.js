import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query/react";
import { userApiSlice } from "./api/usersApiSlice";
import authReducer from "./features/authSlice";
import mediaApiSlice from "./api/mediaApiSlice";
import { categoryApi } from "./api/categoryService";
import { projectApi } from "./api/projectService";
import { skillsApi } from "./api/skillsApi";
import { messagesApi } from "./api/messagesApi";
import { testimonialsApi } from "./api/testimonialsApi";




const store = configureStore({
    reducer: {
        [userApiSlice.reducerPath]: userApiSlice.reducer,
        [mediaApiSlice.reducerPath]: mediaApiSlice.reducer,
        [categoryApi.reducerPath]: categoryApi.reducer,
        [projectApi.reducerPath]: projectApi.reducer,
        [skillsApi.reducerPath]: skillsApi.reducer,
        [messagesApi.reducerPath]: messagesApi.reducer,
        [testimonialsApi.reducerPath]: testimonialsApi.reducer,

        auth: authReducer,

    },
    
    middleware:(getDefaultMiddleware) =>
        getDefaultMiddleware().concat(
            userApiSlice.middleware,
            mediaApiSlice.middleware,
            categoryApi.middleware,
            projectApi.middleware,
            skillsApi.middleware,
            messagesApi.middleware,
            testimonialsApi.middleware,
        )

})



setupListeners(store.dispatch);
export default store;