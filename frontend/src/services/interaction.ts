import { api } from "./api";

export const getInteractions = async () => {
  const { data } = await api.get("/interactions");
  return data;
};

export const createInteraction = async (body:any) => {
  const { data } = await api.post("/interactions", body);
  return data;
};

export const updateInteraction = async (id:string, body:any) => {
  const { data } = await api.put(`/interactions/${id}`, body);
  return data;
};

export const deleteInteraction = async (id:string) => {
  await api.delete(`/interactions/${id}`);
};