import axiosClient from "./axiosClient";

export async function processPayment(payload) {
  try {
    const response = await axiosClient.post("/payments/process", payload);
    return response.data;
  } catch (error) {
    throw formatPaymentError(error);
  }
}

export async function getPaymentHistory() {
  try {
    const response = await axiosClient.get("/payments/history");
    return response.data;
  } catch (error) {
    throw formatPaymentError(error);
  }
}

export async function getPaymentsByBooking(bookingId) {
  try {
    const response = await axiosClient.get(`/payments/booking/${bookingId}`);
    return response.data;
  } catch (error) {
    throw formatPaymentError(error);
  }
}

export async function getPaymentById(paymentId) {
  try {
    const response = await axiosClient.get(`/payments/${paymentId}`);
    return response.data;
  } catch (error) {
    throw formatPaymentError(error);
  }
}

export async function updatePayment(paymentId, payload) {
  try {
    const response = await axiosClient.put(`/payments/${paymentId}`, payload);
    return response.data;
  } catch (error) {
    throw formatPaymentError(error);
  }
}

export async function deletePaymentRecord(paymentId) {
  try {
    const response = await axiosClient.delete(`/payments/${paymentId}`);
    return response.data;
  } catch (error) {
    throw formatPaymentError(error);
  }
}

// Helper to keep error format consistent across all functions
export function formatPaymentError(error) {
  const body = error.response?.data;
  const fieldMessages = body?.fields && typeof body.fields === "object"
    ? Object.values(body.fields).filter(Boolean).join(" ")
    : "";
  const validationMessages = Array.isArray(body?.errors)
    ? body.errors
        .map((item) => typeof item === "string" ? item : item.defaultMessage || item.message)
        .filter(Boolean)
        .join(" ")
    : "";
  const err = new Error(
    body?.reason ||
    fieldMessages ||
    validationMessages ||
    body?.detail ||
    body?.message ||
    body?.error ||
    error.message
  );
  err.status = error.response?.status;
  err.body = body;
  return err;
}