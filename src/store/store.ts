import { configureStore } from "@reduxjs/toolkit";
import JobsReducer from "../redux/JobsSlice";
import SearchReducer from "../redux/SearchSlice";
import SkillReducer from "../redux/SkillSlice";
const store = configureStore({
  reducer: {
    jobs: JobsReducer,
    skills: SkillReducer,
    searchJobs: SearchReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
