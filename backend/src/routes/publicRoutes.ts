import { Router } from "express";
import rateLimit from "express-rate-limit";
import * as heroController from "../controllers/heroController.js";
import * as aboutController from "../controllers/aboutController.js";
import * as projectController from "../controllers/projectController.js";
import * as postController from "../controllers/postController.js";
import * as messageController from "../controllers/messageController.js";

const router = Router();

const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
});

router.get("/hero", heroController.getHero);
router.get("/about", aboutController.getAbout);
router.get("/projects", projectController.listProjects);
router.get("/projects/:slug", projectController.getProjectBySlug);
router.get("/posts", postController.listPublishedPosts);
router.get("/posts/:slug", postController.getPostBySlug);
router.post(
  "/contact",
  contactLimiter,
  messageController.contactValidators,
  messageController.submitContact
);

export default router;
