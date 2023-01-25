import customFetch from "../../utils/axios";
import { logoutUser } from "./userSlice";

export const registerUserThunk = async (url,user, thunkAPI) => {
    try {
        const res = await customFetch.post(url, user);
        return res.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data.msg);
    }
};

export const loginUserThunk = async (url, user, thunkAPI)=> {
    try {
        const res = await customFetch.post(url, user);
        return res.data;
      } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data.msg);
      }
};

export const updateUserThunk = async (url, user, thunkAPI) => {
    try {
        const res = await customFetch.patch(url, user, {
          headers: {
            Authorization: `Bearer ${thunkAPI.getState().user.user.token}`,
          },
        });
        return res.data;
      } catch (error) {
        if (error.response.status === 401) {
          thunkAPI.dispatch(logoutUser());
        }
        return thunkAPI.rejectWithValue(error.response.data.msg);
      }
};

