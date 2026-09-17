import axiosClient from "./axiosClient";

/**
 * Feedback Management API client using the shared axiosClient.
 */
export class ApiError extends Error {
  constructor(message, { status, fieldErrors, flaggedWords } = {}) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.fieldErrors = fieldErrors ?? {};
    this.flaggedWords = flaggedWords ?? [];
  }
}

// Helper to handle Axios errors uniformly
async function handleRequest(requestPromise) {
  try {
    const response = await requestPromise;
    return response.data;
  } catch (error) {
    if (error.response) {
      const data = error.response.data;
      throw new ApiError(data?.message ?? "Something went wrong. Try again.", {
        status: error.response.status,
        fieldErrors: data?.fieldErrors,
        flaggedWords: data?.flaggedWords,
      });
    } else if (error.request) {
      throw new ApiError("Can't reach the server. Check that the backend is running on port 8080.");
    } else {
      throw new ApiError(error.message);
    }
  }
}

function query(params) {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") search.append(key, value);
  });
  const qs = search.toString();
  return qs ? `?${qs}` : "";
}

export const feedbackApi = {
  reviewableTrips: (customerId) => handleRequest(axiosClient.get(`/feedback/reviewable/${customerId}`)),

  submit: ({ bookingId, customerId, rating, comment }) =>
    handleRequest(axiosClient.post("/feedback", { bookingId, customerId, rating, comment })),

  update: (feedbackId, { customerId, rating, comment }) =>
    handleRequest(axiosClient.put(`/feedback/${feedbackId}`, { customerId, rating, comment })),

  remove: (feedbackId, customerId) =>
    handleRequest(axiosClient.delete(`/feedback/${feedbackId}${query({ customerId })}`)),

  getOne: (feedbackId) => handleRequest(axiosClient.get(`/feedback/${feedbackId}`)),

  byCustomer: (customerId) => handleRequest(axiosClient.get(`/feedback/customer/${customerId}`)),

  byTrip: (tripId) => handleRequest(axiosClient.get(`/feedback/trip/${tripId}`)),

  tripSummary: (tripId) => handleRequest(axiosClient.get(`/feedback/trip/${tripId}/summary`)),

  search: (filters = {}) => handleRequest(axiosClient.get(`/feedback${query(filters)}`)),
};

export default feedbackApi;