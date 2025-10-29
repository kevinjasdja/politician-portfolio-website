import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api = axios.create({
	baseURL: API_URL,
	headers: {
		"Content-Type": "application/json",
	},
});

// Add auth token to requests if available
api.interceptors.request.use(
	(config) => {
		const token = localStorage.getItem("adminToken");
		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}
		return config;
	},
	(error) => {
		return Promise.reject(error);
	}
);

// Admin API
export const adminAPI = {
	login: (credentials) => api.post("/admin/login", credentials),
	getProfile: () => api.get("/admin/profile"),
	initAdmin: () => api.post("/admin/init"),
};

// Contact API
export const contactAPI = {
	create: (data) => api.post("/contact", data),
	getAll: () => api.get("/contact"),
	markAsRead: (id) => api.put(`/contact/${id}/read`),
	delete: (id) => api.delete(`/contact/${id}`),
};

// Team API
export const teamAPI = {
	getAll: () => api.get("/team"),
	create: (formData) =>
		api.post("/team", formData, {
			headers: { "Content-Type": "multipart/form-data" },
		}),
	update: (id, formData) =>
		api.put(`/team/${id}`, formData, {
			headers: { "Content-Type": "multipart/form-data" },
		}),
	delete: (id) => api.delete(`/team/${id}`),
};

// Beneficiary API
export const beneficiaryAPI = {
	create: (formData) =>
		api.post("/beneficiary", formData, {
			headers: { "Content-Type": "multipart/form-data" },
		}),
	verify: (data) => api.post("/beneficiary/verify", data),
	getAll: () => api.get("/beneficiary"),
	delete: (id) => api.delete(`/beneficiary/${id}`),
};

// Hero Content API
export const heroAPI = {
	get: () => api.get("/hero"),
	update: (formData) =>
		api.put("/hero", formData, {
			headers: { "Content-Type": "multipart/form-data" },
		}),
};

// Gallery API
export const galleryAPI = {
	getAll: () => api.get("/gallery"),
	getById: (id) => api.get(`/gallery/${id}`),
	create: (formData) =>
		api.post("/gallery", formData, {
			headers: { "Content-Type": "multipart/form-data" },
		}),
	update: (id, formData) =>
		api.put(`/gallery/${id}`, formData, {
			headers: { "Content-Type": "multipart/form-data" },
		}),
	delete: (id) => api.delete(`/gallery/${id}`),
};

export default api;
