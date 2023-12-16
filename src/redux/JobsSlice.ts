import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
} from "@reduxjs/toolkit";
import { RootState } from "../store/store";
import { IresJobsData, Job, Meta, statusBar } from "../types";
import { fetchSkill } from "./SkillSlice";

const jobsAdapter = createEntityAdapter<Job>();
const initialState = jobsAdapter.getInitialState({
  status: statusBar.idle,
  error: "",
  meta: { next: 12 } as Meta,
});
export const fetchJobs = createAsyncThunk<any, Meta>(
  "fetchJobs",
  async (meta: Meta, thunkApi): Promise<IresJobsData> => {
    const stateJob: RootState = thunkApi.getState() as RootState;
    if (!meta.count || stateJob?.jobs?.ids.length < meta?.count) {
      try {
        const response = await fetch(
          `https://skills-api-zeta.vercel.app/${
            meta?.id
              ? `job/${meta?.id}`
              : `jobs/?cursor=${meta?.next}&limit=${12}`
          }`
        );
        if (!response.ok) {
          throw new Error("Network response was not ok.");
        }
        const result: any = await response.json();

        // to stop fetching api if he get the last list
        if (!meta?.id) {
          if (result.data.jobs.length > 0) {
            result.data.jobs.forEach((element: Job) => {
              element.relationships.skills.forEach(async (skill) => {
                await thunkApi.dispatch(fetchSkill(skill.id));
              });
            });
          }
        }

        return result.data;
      } catch (error: any) {
        throw new Error("Error fetching jobs:", error);
      }
    } else return {} as IresJobsData;
  }
);

const jobsSlice = createSlice({
  name: "jobs",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(fetchJobs.pending, (state) => {
      state.status = statusBar.loading;
    });
    builder.addCase(fetchJobs.fulfilled, (state, action) => {
      state.status = statusBar.success; 

      // i have 2 api response one {jobs, meta} and other {job}
      // this if for select any one of them and store it in normarization form
      if (Object.keys(action.payload).length === 1) {
        jobsAdapter.upsertOne(state, action?.payload?.job);
      } else if (action?.payload?.jobs) {
        jobsAdapter.upsertMany(state, action?.payload?.jobs);
        state.meta = action.payload.meta;
      }
    });
    builder.addCase(fetchJobs.rejected, (state, action) => {
      state.status = statusBar.error;
      state.error = action.error.message || "";
    });
  },
});

// export const { increment, decrement } = counterSlice.actions;

export default jobsSlice.reducer;
export const {
  selectAll: selectAllJobs,
  selectById: selectJobById,
  selectIds: selectJobIds,
} = jobsAdapter.getSelectors<RootState>((state) => state.jobs);
