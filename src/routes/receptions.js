const { validate, Reception } = require("../models/reception");
const express = require("express");
const router = express.Router();

const { Supplier } = require("../models/supplier");

router.get("/all", async (req, res) => {
  const reception = await Reception.find();
  res.send(reception);
});

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const supplier = await Supplier.findById(req.body.supplier_id);
  if (!supplier) return res.status(400).send("Invalid supplier ID !");

  let reception = new Reception({
    arrivalDate: req.body.arrivalDate,
    supplier_id: req.body.supplier_id,
    receivedItems: req.body.receivedItems,
    receivedQuantities: req.body.receivedQuantities,
    receivedPrices: req.body.receivedPrices,
    receivedTotal: req.body.receivedTotal,
    receivedValue: req.body.receivedValue,
    receivedBy: req.body.receivedBy,
    notes: req.body.notes,
  });

  result = await reception.save();

  res.send(result);
});

router.put("/:id", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const supplier = await Supplier.findById(req.body.supplier_id);
  if (!supplier) return res.status(400).send("Invalid supplier ID !");

  let reception = await Reception.findByIdAndUpdate(
    req.params.id,
    {
      arrivalDate: req.body.arrivalDate,
      supplier_id: req.body.supplier_id,
      receivedItems: req.body.receivedItems,
      receivedQuantities: req.body.receivedQuantities,
      receivedPrices: req.body.receivedPrices,
      receivedTotal: req.body.receivedTotal,
      receivedValue: req.body.receivedValue,
      receivedBy: req.body.receivedBy,
      notes: req.body.notes,
    },
    {
      new: true,
    }
  );

  if (!reception)
    return res
      .status(404)
      .send("The reception with the given ID was not found.");

  res.send(reception);
});

router.delete("/:id", async (req, res) => {
  const reception = await Reception.findByIdAndRemove(req.params.id);

  if (!reception)
    return res
      .status(404)
      .send("The reception with the given ID was not found.");

  res.send(reception);
});

router.get("/:id", async (req, res) => {
  const reception = await Reception.findById(req.params.id);

  if (!reception)
    return res
      .status(404)
      .send("The reception with the given ID was not found.");

  res.send(reception);
});

module.exports = router;
