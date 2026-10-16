import "dotenv/config";
import express, { Request, Response } from "express";
import cors from "cors";
import router from "./routes/index.js";

const app = express();
const port = process.env.PORT || 5000;

console.log("Port:", port);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/v1", router);

app.get("/health", (req, res) => {
  return res.status(200).json({
    message: "Server is healthy",
    app: "Agreem Leads Tracking Project",
    version: "1.0.0",
  });
});

// Global Error handler
app.use((err: any, req: Request, res: Response) => {
  console.log(err, "Error in Global Error Handler");
  return res.status(500).json({ error: "Internal Server Error" });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
