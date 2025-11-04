import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import arbitroRoutes from "./routes/arbitro.js";
import authRoutes from "./routes/auth.js";
import newsRoutes from "./routes/news.js";


import swaggerUi from "swagger-ui-express"; 
import swaggerSpec from "./swagger.js";     


import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json({ limit: "2mb" }));

app.use(express.urlencoded({ extended: true, limit: "2mb" }));

app.get("/", (_req, res) =>
  res.json({
    ok: true,
    name: "node-arbitro-api",
    version: "1.0.0",
  })
);

app.use("/api/auth", authRoutes);
app.use("/api/arbitro", arbitroRoutes);
app.use("/api/news", newsRoutes);


app.use("/assets", express.static(path.join(__dirname, "../public")));


app.use(
  "/api/docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    swaggerOptions: {
      persistAuthorization: true,       
      displayRequestDuration: true,
    },
    customJs: "/assets/swagger-pdf.js",
  })
);


app.use((req, res) => {
  res.status(404).json({
    ok: false,
    error: "Not Found",
    path: req.originalUrl,
  });
});


app.listen(PORT, () => {
  console.log(`[node-arbitro-api] Listening on http://localhost:${PORT}`);
  console.log(`Swagger UI disponible en http://localhost:${PORT}/api/docs`);
});
