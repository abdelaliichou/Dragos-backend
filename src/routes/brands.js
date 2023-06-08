const { validateBrand, Brand } = require("../models/brand");
const express = require("express");
const router = express.Router();

router.get("/all", async (req, res) => {
  const brand = await Brand.find().sort("name");
  res.send(brand);
});

router.post("/", async (req, res) => {
  const { error } = validateBrand(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let brand = new Brand({
    name: req.body.name,
    logo: req.body.logo,
  });

  result = await brand.save();

  res.send(result);
});

router.put("/:id", async (req, res) => {
  const { error } = validateBrand(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let brand = await Brand.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      logo: req.body.logo,
    },
    {
      new: true,
    }
  );

  if (!brand)
    return res.status(404).send("The brand with the given ID was not found.");

  res.send(brand);
});

router.delete("/:id", async (req, res) => {
  const brand = await Brand.findByIdAndRemove(req.params.id);

  if (!brand)
    return res.status(404).send("The brand with the given ID was not found.");

  res.send(brand);
});

router.get("/:id", async (req, res) => {
  const brand = await Brand.findById(req.params.id);

  if (!brand)
    return res.status(404).send("The brand with the given ID was not found.");

  res.send(brand);
});

module.exports = router;
