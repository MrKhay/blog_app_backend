import { Router } from "express";
import { PrismaClient } from "@prisma/client";
const router = Router();
const prisma = new PrismaClient();

// USer CRUD

// Create user
router.post("/", async (req, res) => {
  const { email, name, username } = req.body;

  try {
    const responce = await prisma.user.create({
      data: {
        email,
        name,
        username,
        bio: "Hello, I'm new on Twitter",
      },
    });

    res.json(responce);
  } catch (e) {
    res.status(400).json({ error: "username and email should be unique" });
  }
});

// list users
router.get("/", async (req, res) => {
  const allUsers = await prisma.user.findMany();
  res.json({ users: allUsers });
});

// get one user
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const responce = await prisma.user.findUnique({
      where: { id: Number(id) },
      include: { tweets: true },
    });

    if (!responce) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    res.json({ user: responce });
  } catch (error) {
    res.status(400).json({ error: "Something went wrong" });
  }
});

// update user
router.put("/:id", async (req, res) => {
  const { id } = req.params;

  const { bio, image, name } = req.body;

  try {
    const responce = await prisma.user.update({
      where: { id: Number(id) },
      data: { bio, name, image },
    });

    res.json({ responce });
  } catch (error) {
    res.status(501).json({ error: error });
  }
});

// delete user
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.user.delete({ where: { id: Number(id) } });

    res.status(200).json("Success");
  } catch (error) {
    res.status(400).json("User does not exist");
  }
});

export default router;
