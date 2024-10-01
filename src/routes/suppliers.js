const { validateSupplier, Supplier } = require("../models/supplier");
const express = require("express");
const router = express.Router();
const authService = require("../services/AuthService");

router.get("/all", async (req, res) => {
  const supplier = await Supplier.find().sort("name");
  res.send(supplier);
});

// activte supplier
router.post(
  "/acctivate/:id",
  [authService.protect, authService.allowedTo("admin", "manager")],
  async (req, res) => {
    const supplierID = req.params.id;

    if (!supplierID)
      return res.status(404).send("Please enter the supplier id !");

    const supplier = await Supplier.findById(supplierID);

    if (!supplier) return res.status(404).send("Supplier not found !");

    supplier.isActive = true;

    result = await supplier.save();

    res.send(result);
  }
);

// disactivte supplier
router.post(
  "/disacctivate/:id",
  [authService.protect, authService.allowedTo("admin", "manager")],
  async (req, res) => {
    const supplierID = req.params.id;

    if (!supplierID)
      return res.status(404).send("Please enter the supplier id !");

    const supplier = await Supplier.findById(supplierID);

    if (!supplier) return res.status(404).send("Supplier not found !");

    supplier.isActive = false;

    result = await supplier.save();

    res.send(result);
  }
);

router.post(
  "/",
  [authService.protect, authService.allowedTo("admin", "manager")],
  async (req, res) => {
    const { error } = validateSupplier(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let supplier = new Supplier({
      name: req.body.name,
      email: req.body.email,
      phoneNumber: req.body.phoneNumber,
      contactPerson: req.body.contactPerson,
      address: req.body.address,
      isActive: req.body.isActive,
    });

    result = await supplier.save();

    res.send(result);
  }
);

router.put(
  "/:id",
  [authService.protect, authService.allowedTo("admin", "manager")],
  async (req, res) => {
    const { error } = validateSupplier(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let supplier = await Supplier.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        email: req.body.email,
        phoneNumber: req.body.phoneNumber,
        contactPerson: req.body.contactPerson,
        address: req.body.address,
        isActive: req.body.isActive,
      },
      {
        new: true,
      }
    );

    if (!supplier)
      return res
        .status(404)
        .send("The supplier with the given ID was not found.");

    res.send(supplier);
  }
);

router.delete(
  "/:id",
  [authService.protect, authService.allowedTo("admin", "manager")],
  async (req, res) => {
    const supplier = await Supplier.findByIdAndRemove(req.params.id);

    if (!supplier)
      return res
        .status(404)
        .send("The supplier with the given ID was not found.");

    res.send(supplier);
  }
);

router.get(
  "/:id",
  [authService.protect, authService.allowedTo("admin", "manager")],
  async (req, res) => {
    const supplier = await Supplier.findById(req.params.id);

    if (!supplier)
      return res
        .status(404)
        .send("The supplier with the given ID was not found.");

    res.send(supplier);
  }
);

module.exports = router;
