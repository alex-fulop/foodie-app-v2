import create from "zustand";
import { persist } from "zustand/middleware";
import { BASE_URL } from "../util";
import axios from "axios";

const authStore = (set: any) => ({
  userProfile: { image: "" },
  allUsers: [],

  addUser: (user: any) => set({ userProfile: user }),
  removeUser: () => set({ userProfile: null }),

  fetchAllUsers: async () => {
    const response = await axios.get(`${BASE_URL}/api/users`);
    set({ allUsers: response.data });
  },
});

const useAuthStore = create(
  persist(authStore, {
    name: "auth",
  })
);

export default useAuthStore;
