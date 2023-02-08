const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const APIFeature = require("../utils/apiFeatures");

// * Get One
exports.getOne = (Model, popOptions) =>
  catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);
    if (popOptions) query = query.populate(popOptions);
    const doc = await query;

    if (!doc) return next(new AppError("No document found with that ID.", 404));

    res.status(200).json({ status: "success", data: doc });
  });

// * Create One
exports.createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const newDoc = await Model.create(req.body);

    res.status(201).json({ status: "sucess", data: newDoc });
  });

// * Update One
exports.updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!doc) return next(new AppError("No document found with that ID.", 404));

    res.status(200).json({
      message: "success",
      data: doc,
    });
  });

// * Delete One
exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete({ _id: req.params.id });

    if (!doc) return next(new AppError("No document found with that ID.", 404));

    res.status(204).json({
      message: "success",
      data: null,
    });
  });

// * Get All
exports.getAll = (Model) =>
  catchAsync(async (req, res, next) => {
    // ? To allowed for nested GET reviews on tour (hack)
    let filter = {};
    if (req.params.tourId) filter = { tour: req.params.tourId };

    // ? EXECUTE QUERY
    const features = new APIFeature(Model.find(filter), req.query)
      .search("name")
      .filter()
      .sort()
      .limitFields()
      .pagination();
    // const doc = await features.query.explain();
    const doc = await features.query;

    // const query = Tour.find().where("duration").equals(5).where("difficulty").equals("easy");

    // * RESPONSE
    res.status(200).json({ status: "success", result: doc.length, data: doc });
  });
