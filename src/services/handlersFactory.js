const asyncHandler = require('express-async-handler');

exports.deleteOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const document = await Model.findByIdAndDelete(id);

    if (!document) {
      return next(console.log(`No document for this id ${id}`));
    }

    // Trigger "remove" event when update document
    document.remove();
    res.status(204).send();
  });

  // exports.updateOne = (Model) => (req, res, next) => {
  //   Model.findByIdAndUpdate(req.params.id, req.body, { new: true })
  //     .then((document) => {
  //       if (!document) {
  //         console.log(`No document for this id ${req.params.id}`);
  //         return next();
  //       }
  //       // Trigger "save" event when updating the document
  //       document.save();
  //       res.status(200).json(document);
  //     })
  //     .catch((error) => {
  //       console.error(error);
  //       next(error);
  //     });
  // };
  exports.updateOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const document = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!document) {
      return next(
        console.log(`No document for this id ${req.params.id}`)
      );
    }
    // Trigger "save" event when update document
    document.save();
    res.status(200).json(document);
  });

exports.getOne = (Model, populationOpt) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    // 1) Build query
    let query = Model.findById(id);
    if (populationOpt) {
      query = query.populate(populationOpt);
    }

    // 2) Execute query
    const document = await query;

    if (!document) {
      return next(onsole.log(`No document for this id ${id}`));
    }
    res.status(200).json({ data: document });
  });

exports.getAll = (Model, modelName = '') =>
  asyncHandler(async (req, res) => {
    let filter = {};
    if (req.filterObj) {
      filter = req.filterObj;
    }
    // Build query
    const documentsCounts = await Model.countDocuments();
    const apiFeatures = new ApiFeatures(Model.find(filter), req.query)
      .paginate(documentsCounts)
      .filter()
      .search(modelName)
      .limitFields()
      .sort();

    // Execute query
    const { mongooseQuery, paginationResult } = apiFeatures;
    const documents = await mongooseQuery;

    res
      .status(200)
      .json({ results: documents.length, paginationResult, data: documents });
  });