import axiosClient from "../api/axiosClient";

const BASE = "/admin/customers";

export const getAllCustomers = () =>
  axiosClient.get(BASE).then((res) => res.data);

export const searchCustomers = (query) =>
  axiosClient.get(`${BASE}/search`, { params: { query } }).then((res) => res.data);

export const getCustomerById = (id) =>
  axiosClient.get(`${BASE}/${id}`).then((res) => res.data);

export const addCustomer = (payload) =>
  axiosClient.post(BASE, payload).then((res) => res.data);

export const updateCustomer = (id, payload) =>
  axiosClient.put(`${BASE}/${id}`, payload).then((res) => res.data);

export const deleteCustomer = (id) =>
  axiosClient.delete(`${BASE}/${id}`);
