import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
} from "@reduxjs/toolkit";
import { RootState } from "../store/store";
import { IresSkillData, Skill, statusBar } from "../types";

const skillAdapter = createEntityAdapter<Skill>();
const initialState = skillAdapter.getInitialState({
  status: statusBar.idle,
  error: "",
});
export const fetchSkill = createAsyncThunk<IresSkillData, string>(
  "fetchSkill",
  async (id: string, thunkAPI): Promise<IresSkillData> => {
    const state: RootState = thunkAPI.getState() as RootState;

    if (
      skillAdapter
        .getSelectors()
        .selectIds(state.skills)
        .find((value) => value === id)
    ) {
      return {} as IresSkillData;
    } else {
      try {
        const response = await fetch(
          `https://skills-api-zeta.vercel.app/skill/${id}`
        );
        if (!response.ok) {
          throw new Error("Network response was not ok.");
        }
        const result: any = await response.json();
        return result.data;
      } catch (error: any) {
        throw new Error("Error fetching jobs:", error);
      }
    }
  }
);

const skillSlice = createSlice({
  name: "skills",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(fetchSkill.pending, (state, action) => {
      state.status = statusBar.loading;
    });
    builder.addCase(fetchSkill.fulfilled, (state, action) => {
      state.status = statusBar.success;
      if (action?.payload.skill) {
        skillAdapter.addOne(state, action?.payload.skill);
      }
    });
    builder.addCase(fetchSkill.rejected, (state, action) => {
      state.status = statusBar.error;
      state.error = action.error.message || "";
    });
  },
});

export default skillSlice.reducer;
export const {
  selectAll: selectAllSkills,
  selectById: selectSkillById,
  selectIds: selectSkillIds,
} = skillAdapter.getSelectors<RootState>((state) => state.skills);
