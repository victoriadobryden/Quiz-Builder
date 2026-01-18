const express = require("express");
const { Category } = require("../../models");

const router = express.Router();

/**
 * GET /categories
 * Get all categories
 */
router.get("/", async (_req, res) => {
  try {
    const categories = await Category.findAll({
      order: [["name", "ASC"]],
    });
    res.json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ message: "Failed to fetch categories" });
  }
});

module.exports = router;
