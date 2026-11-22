import https from "https";
import http from "http";

export const startKeepAlive = () => {
    // Only run in production on Render or if explicitly configured
    const backendUrl = process.env.BACKEND_URL || (process.env.NODE_ENV === "production" ? "https://job-portal-bzx9.onrender.com" : null);

    if (!backendUrl) {
        console.log("Keep-alive service disabled (local development).");
        return;
    }

    const intervalMinutes = 14; // Render free tier spins down after 15 mins of inactivity
    const client = backendUrl.startsWith("https") ? https : http;

    console.log(`🚀 Keep-alive service initialized. Pinging ${backendUrl}/health every ${intervalMinutes} minutes.`);

    setInterval(() => {
        client.get(`${backendUrl}/health`, (res) => {
            console.log(`[Keep-Alive] Ping sent to ${backendUrl}/health - Status: ${res.statusCode}`);
        }).on("error", (err) => {
            console.error("[Keep-Alive] Ping error:", err.message);
        });
    }, intervalMinutes * 60 * 1000);
};
