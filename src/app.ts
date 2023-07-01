import cors from "cors";
import express from "express";
import morgan from "morgan";
import { PORT } from "./config";
import authRoutes from "./routes/auth.routes";
import deanRoutes from "./routes/dean.routes";
import peopleRoutes from "./routes/people.routes";
import resourceRoutes from "./routes/resource.routes";
import scheduleRoutes from "./routes/schedule.routes";
import userRoutes from "./routes/user.routes";
import reportRoutes from "./routes/report.routes";
import accountRoutes from "./routes/account.routes";

export class App {
  private app: express.Application;

  constructor(private port: number | string) {
    this.app = express();
    this.settings();
    this.middlewares();
    this.routes();
  }

  settings() {
    this.app.set("port", this.port || PORT || 3000);
  }

  middlewares() {
    this.app.use(morgan("dev"));
    this.app.use(express.json());
    this.app.use(cors());
  }

  routes() {
    this.app.use("/api/auth", authRoutes);
    this.app.use("/api/account", accountRoutes);
    this.app.use("/api/users", userRoutes);
    this.app.use("/api/people", peopleRoutes);
    this.app.use("/api/schedule", scheduleRoutes);
    this.app.use("/api/resource", resourceRoutes);
    this.app.use("/api/deans", deanRoutes);
    this.app.use("/api/reports", reportRoutes);
  }

  listen() {
    this.app.listen(this.app.get("port"));
    console.info("Server running on port", this.app.get("port"));
  }
}
