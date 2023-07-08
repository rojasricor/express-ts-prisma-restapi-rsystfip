import cors from "cors";
import express from "express";
import morgan from "morgan";
import { PORT } from "./config";
import accountRoutes from "./routes/account.routes";
import authRoutes from "./routes/auth.routes";
import deanRoutes from "./routes/dean.routes";
import peopleRoutes from "./routes/people.routes";
import reportRoutes from "./routes/report.routes";
import resourceRoutes from "./routes/resource.routes";
import scheduleRoutes from "./routes/schedule.routes";
import statisticRoutes from "./routes/statistic.routes";
import userRoutes from "./routes/user.routes";
import authMiddleware from "./middlewares/auth.middleware";
import sessionRoutes from "./routes/session.routes";
import roleMiddleware from "./middlewares/role.middleware";

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
        this.app.use("/api/auth", authRoutes); // No middlewares
        this.app.use("/api/session", sessionRoutes); // No middlewares
        this.app.use("/api/account", accountRoutes); // Handle middlewares independient
        this.app.use(
            "/api/users",
            [authMiddleware(), roleMiddleware()],
            userRoutes
        );
        this.app.use(
            "/api/people",
            [authMiddleware(), roleMiddleware()],
            peopleRoutes
        );
        this.app.use(
            "/api/schedule",
            [authMiddleware(), roleMiddleware()],
            scheduleRoutes
        );
        this.app.use(
            "/api/resource",
            [authMiddleware(), roleMiddleware()],
            resourceRoutes
        );
        this.app.use(
            "/api/deans",
            [authMiddleware(), roleMiddleware()],
            deanRoutes
        );
        this.app.use(
            "/api/reports",
            [authMiddleware(), roleMiddleware()],
            reportRoutes
        );
        this.app.use(
            "/api/statistics",
            [authMiddleware(), roleMiddleware()],
            statisticRoutes
        );
    }

    listen() {
        this.app.listen(this.app.get("port"));
        console.info("Server running on port", this.app.get("port"));
    }
}
