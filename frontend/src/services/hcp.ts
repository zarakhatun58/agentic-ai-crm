import { api } from "./api";

export const getHCPs = async () => {
  const { data } = await api.get("/hcp");
  return data;
};

export const createHCP = async (body: any) => {
  const { data } = await api.post("/hcp", body);
  return data;
};