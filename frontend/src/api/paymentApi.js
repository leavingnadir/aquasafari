import axiosClient from "./axiosClient";

export async function processPayment(payload) {
  try {
    const response = await axiosClient.post("/payments/process", payload);
    return response.data;
  } catch (error) {
    // Standardize error handling to match your previous `handleResponse` structure
    const err = new Error(
      error.response?.data?.reason || 
      error.response?.data?.error || 
      error.response?.data?.message || 
      error.message
    );
    err.status = error.response?.status;
    err.body = error.response?.data;
    throw err;
  }
}

export async function getPaymentHistory() {
  try {
    const response = await axiosClient.get("/payments/history");
    return response.data;
  } catch (error) {
    throw formatError(error);
  }
}

export async function getPaymentsByBooking(bookingId) {
  try {
    const response = await axiosClient.get(`/payments/booking/${bookingId}`);
    return response.data;
  } catch (error) {
    throw formatError(error);
  }
}

export async function getPaymentById(paymentId) {
  try {
    const response = await axiosClient.get(`/payments/${paymentId}`);
    return response.data;
  } catch (error) {
    throw formatError(error);
  }
}

export async function updatePayment(paymentId, payload) {
  try {
    const response = await axiosClient.put(`/payments/${paymentId}`, payload);
    return response.data;
  } catch (error) {
    throw formatError(error);
  }
}

export async function deletePaymentRecord(paymentId) {
  try {
    const response = await axiosClient.delete(`/payments/${paymentId}`);
    return response.data;
  } catch (error) {
    throw formatError(error);
  }
}

// Helper to keep error format consistent across all functions
function formatError(error) {
  const err = new Error(
    error.response?.data?.reason || 
    error.response?.data?.error || 
    error.response?.data?.message || 
    error.message
  );
  err.status = error.response?.status;
  err.body = error.response?.data;
  return err;
}