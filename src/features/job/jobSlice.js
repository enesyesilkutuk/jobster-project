import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import customFetch, { checkForUnauthorizedResponse } from "../../utils/axios";
import { getUserFromLocalStorage } from "../../utils/localStorage";
import { changePage, getAllJobs, hideLoading, showLoading } from "../allJobs/allJobsSlice";

const initialState = {
  isLoading: false,
  position: "",
  company: "",
  jobLocation: "",
  jobTypeOptions: ["full-time", "part-time", "remote", "internship"],
  jobType: "full-time",
  statusOptions: ["interview", "declined", "pending"],
  status: "pending",
  isEditing: false,
  editJobId: "",
};

export const createJob = createAsyncThunk(
  "job/createJob",
  async (job, thunkAPI) => {
    try {
      const res = await customFetch.post("/jobs", job, {
        headers: {
          Authorization: `Bearer ${thunkAPI.getState().user.user.token}`,
        },
      });
      thunkAPI.dispatch(clearValues());
      thunkAPI.dispatch(changePage(1));
      return res.data;
    } catch (error) {
     return checkForUnauthorizedResponse(error, thunkAPI);
    }
  }
);

export const deleteJob = createAsyncThunk("job/deleteJob", async (jobId, thunkAPI) => {
  thunkAPI.dispatch(showLoading());
  try {
    const res = await customFetch.delete(`jobs/${jobId}`, {
      headers: {
        Authorization: `Bearer ${thunkAPI.getState().user.user.token}`,
      }
    });
    thunkAPI.dispatch(getAllJobs());
    return res.data;
  } catch (error) {
      thunkAPI.dispatch(hideLoading());
      return checkForUnauthorizedResponse(error, thunkAPI);
  }
});

export const editJob = createAsyncThunk("job/editJob", async ({jobId, job}, thunkAPI) => {
  try {
    const res = await customFetch.patch(`/jobs/${jobId}`, job, {
      headers: {
        Authorization: `Bearer ${thunkAPI.getState().user.user.token}`
      }
    });
    thunkAPI.dispatch(clearValues());
    return res.data;
  } catch (error) {
    return checkForUnauthorizedResponse(error, thunkAPI);
  }
});

const jobSlice = createSlice({
  name: "job",
  initialState,
  reducers: {
    handleChange: (state, { payload: { name, value } }) => {
      state[name] = value;
    },
    clearValues: () => {
      return {...initialState, jobLocation: getUserFromLocalStorage()?.location || ""};
    },
    setEditJob: (state, {payload}) => {
      return {...state, isEditing: true, ...payload }
    },
  },
  extraReducers: (builder) => {
    builder
    .addCase(createJob.pending, (state) => {
        state.isLoading = true;
    })
    .addCase(createJob.fulfilled, (state) => {
        state.isLoading = false;
        toast.success('Job created');
    })
    .addCase(createJob.rejected, (state, {payload}) => {
        state.isLoading = false;
        toast.error(payload);
    })
    .addCase(deleteJob.fulfilled, (_, {payload}) => {
      toast.success(payload.msg);
    })
    .addCase(deleteJob.rejected, (_, {payload}) => {
      toast.error(payload);
    })
    .addCase(editJob.pending, (state) => {
      state.isLoading = true;
    })
    .addCase(editJob.fulfilled, (state) => {
      state.isLoading = false;
      toast.success('Job modified...');
    })
    .addCase(editJob.rejected, (state, {payload}) => {
      state.isLoading = false;
      toast.error(payload);
    })
  }
});

export default jobSlice.reducer;
export const { handleChange, clearValues, setEditJob } = jobSlice.actions;
