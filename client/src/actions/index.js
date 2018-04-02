import axios from "axios";

import { FETCH_USER } from "./types";

export const fetchUser = () => async dispatch => {
  const res = await axios.get("/api/current_user");
  dispatch({ type: FETCH_USER, payload: res.data });
};

// note: this is the same as above
// export const fetchUser = () => {
//   return async dispatch => {
//     const res = await axios.get("/api/current_user");
//     dispatch({ type: FETCH_USER, payload: res.data });
//   };
// }
