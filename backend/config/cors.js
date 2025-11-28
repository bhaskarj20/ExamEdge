// backend/config/cors.js
const allowedOrigins = [
  "http://localhost:3000",
  "https://yourapp.vercel.app",
  "https://examedge.in",
  // Add your deployed frontend URLs later
];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
};

module.exports = corsOptions;