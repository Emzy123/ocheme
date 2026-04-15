import { Router } from "express";
import { body } from "express-validator";
import rateLimit from "express-rate-limit";
import multer from "multer";
import * as authController from "../controllers/authController.js";
import * as heroController from "../controllers/heroController.js";
import * as aboutController from "../controllers/aboutController.js";
import * as projectController from "../controllers/projectController.js";
import * as postController from "../controllers/postController.js";
import * as messageController from "../controllers/messageController.js";
import * as uploadController from "../controllers/uploadController.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
});

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
});

router.post(
  "/login",
  loginLimiter,
  body("email").isEmail().normalizeEmail(),
  body("password").notEmpty(),
  authController.login
);

router.use(requireAuth);

router.put("/hero", heroController.updateHero);
router.put("/about", aboutController.updateAbout);

router.get("/projects", projectController.listProjects);
router.post("/projects", projectController.createProject);
router.put("/projects/reorder", projectController.reorderProjects);
router.put("/projects/:id", projectController.updateProject);
router.delete("/projects/:id", projectController.deleteProject);

router.get("/posts", postController.listAllPosts);
router.post("/posts", postController.createPost);
router.put("/posts/:id", postController.updatePost);
router.delete("/posts/:id", postController.deletePost);

router.get("/messages", messageController.listMessages);
router.put("/messages/:id", messageController.updateMessage);
router.delete("/messages/:id", messageController.deleteMessage);

router.post("/upload", upload.single("file"), uploadController.uploadImage);

export default router;
