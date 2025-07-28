import { BACKEND_URL } from "@/app/config";
// import useStore from "@/store";
// import { HTTP_STATUS_CODES, HTTP_STATUS_MESSAGES } from "@repo/http-status";
import axios from "axios";
// import refreshAccessToken from "./refreshAccessToken";
// import {
//     handleAccessTokenErrors,
//     handleRefreshTokenErrors,
// } from "./authTokenErrorHandler";

const axiosInstance = axios.create({
    baseURL: BACKEND_URL,
    headers: {
        Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjAyMzQ0YmJiLWQ0NzctNDBhYy1iN2VlLTBjZTllYzdlNjk4NCIsIm5hbWUiOiJKb2huIERvZSIsImVtYWlsIjoiSm9obiBEb2UiLCJpYXQiOjE3NTM2OTMwNDQsImV4cCI6MTc1Mzg2NTg0NH0.gT9n0UPTcsFRRFG8wnjQXEnFSJO3wV6674edQVnx3c8"
    },
    withCredentials: true,
});

// axiosInstance.interceptors.request.use(
//     (config) => {
//         const accessToken = useStore.getState().accessToken;

//         config.headers.Authorization = `Bearer ${accessToken}`;

//         return config;
//     },
//     (error: any) => {
//         console.log("Error in request ", error);

//         return Promise.reject(error);
//     },
// );

// axiosInstance.interceptors.response.use(
//     (response) => {
//         return response;
//     },
//     async (error: any) => {
//         console.log("Error in response ", error);

//         // handling invalid, expired not available access and refresh token
//         handleAccessTokenErrors(error);

//         const originalRequest = error.config;

//         // If Access Token has expired, attempt to refresh access token by validating the refresh token
//         if (
//             error.response.data.statusCode ===
//             HTTP_STATUS_CODES.EXPIRED_ACCESS_TOKEN &&
//             error.response.data.message ===
//             HTTP_STATUS_MESSAGES.EXPIRED_ACCESS_TOKEN &&
//             !originalRequest._retry
//         ) {
//             //Handle refreshing the refresh token logic and resending the request
//             originalRequest._retry = true;

//             try {
//                 const { userId, newAccessToken } = await refreshAccessToken();

//                 useStore.getState().updateUserDetails(userId, newAccessToken);

//                 originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

//                 return axiosInstance(originalRequest);
//             } catch (refreshError: any) {
//                 console.log("Refresh error = ", refreshError);

//                 handleRefreshTokenErrors(refreshError);

//                 return Promise.reject(refreshError);
//             }
//         }

//         return Promise.reject(error);
//     },
// );

export default axiosInstance;