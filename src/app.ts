import express, { Express } from "express";
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";
import dotenv from "dotenv";

import swaggerUi from "swagger-ui-express";
import swaggerDocument from "../docs/swagger.json";
import router from "./routes";

dotenv.config();

const app: Express = express();

app.use(morgan("dev"));
app.use(helmet());
app.use(cors());
app.use(express.json());

app.use("/api/docs", swaggerUi.serve);
app.get("/api/docs", swaggerUi.setup(swaggerDocument));

app.use(router);

export default app;
