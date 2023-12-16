import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
} from "@reduxjs/toolkit";
import { RootState } from "../store/store";
import { IresJobsData, Job, statusBar } from "../types";
import { fetchSkill } from "./SkillSlice";

const jobsAdapter = createEntityAdapter<Job>();
const initialState = jobsAdapter.getInitialState({
  status: statusBar.idle,
  error: "",
});
export const searchJobs = createAsyncThunk<IresJobsData, string>(
  "searchJobs",
  async (querySearch: string, { dispatch }): Promise<IresJobsData> => {
    try {
      const response = await fetch(
        `https://skills-api-zeta.vercel.app/jobs/search?query=${querySearch}`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok.");
      }
      const result: any = await response.json();
      if (result.data.jobs.length !== 0) {
        result.data.jobs.forEach((element: Job) => {
          element.relationships.skills.forEach((skill) => {
            dispatch(fetchSkill(skill.id));
          });
        });
      }
      return result.data;
    } catch (error: any) {
      throw new Error("Error fetching jobs:", error);
    }
  }
);

const SearchSlice = createSlice({
  name: "searchJobs",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(searchJobs.pending, (state, action) => {
      state.status = statusBar.loading;
    });
    builder.addCase(searchJobs.fulfilled, (state, { payload }) => {
      state.status = statusBar.success;
      if (payload?.jobs) {
        jobsAdapter.upsertMany(state, payload?.jobs);
      }
    });
    builder.addCase(searchJobs.rejected, (state, action) => {
      state.status = statusBar.error;
      state.error = action.error.message || "";
    });
  },
});

// export const { increment, decrement } = counterSlice.actions;

export default SearchSlice.reducer;
export const {
  selectAll: selectAllSearchedJobs,
  selectIds: selectSearchedJobIds,
  selectById: selectedSearchedJobsById,
} = jobsAdapter.getSelectors<RootState>((state) => state.searchJobs);
