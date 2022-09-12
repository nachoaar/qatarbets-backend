const express = require("express");
const { validateToken } = require("../tokenController");

const router = express();

router.get("/", (req, res, next) => {
  try {
    const token = req.cookies.acces_token || "";
    if (token) {
      res.json(true);
    } else {
      res.json(false);
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get("/rol", (req, res, next) => {
  const token = validateToken(req.cookies.acces_token || "");
  if (token === "") {
    res.json("Usuario invalido");
  }
  try {
    if (token.rol === "admin") {
      return res.json(true);
    } else {
      return res.json(false);
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get("/logout", (req, res, next) => {
  try {
    res.cookie("acces_token", "", {
      maxAge: 1,
      sameSite: "none",
      secure: true,
      httpOnly: true,
    });
    res.send("Listo");
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
