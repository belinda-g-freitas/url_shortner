import express, { Request, Response } from "express";
const router = express.Router();
import { nanoid } from "nanoid";
import { PrismaClient, Prisma } from "@prisma/client";
const prisma = new PrismaClient();

// POST route to create a short URL
router.route("/shorten").post(async (req: Request, res: Response) => {
  const { original_url } = req.body;
  const baseUrl = `http://localhost:${process.env.PORT}`;

  if (!original_url) {
    return res.status(400).json("Invalid request: original_url is required");
  }

  // Generate URL code
  const urlCode = nanoid(9);

  try {
    // Check if URL already exists
    let url = await prisma.url.findFirst({
      where: { originalUrl: original_url },
    });

    if (url) {
      return res.json(url);
    }

    // Create the short URL
    const shortUrl = `${baseUrl}/${urlCode}`;

    url = await prisma.url.create({
      data: {
        originalUrl: original_url,
        shortUrl: shortUrl,
        urlCode: urlCode,
      },
    });

    res.json(url);
  } catch (err) {
    console.error(err);
    res.status(500).json("Server error");
  }
});

// GET route to redirect to the original URL
router.route("/:code").get(async (req: Request, res: Response) => {
  try {
    const url = await prisma.url.findFirst({
      where: { urlCode: req.params.code },
    });

    if (url) {
      return res.redirect(url.originalUrl);
    }

    res.status(404).json("No URL found");
  } catch (err) {
    console.error(err);
    res.status(500).json("Server error");
  }
});
