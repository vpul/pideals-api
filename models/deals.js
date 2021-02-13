const mongoose = require('mongoose');
const createError = require('http-errors');
// const CategoriesModel = require('./categories');
const categories = require('../constants/categories');
const User = require('./users');
const Votes = require('./votes');

const findByIdWithDetails = require('./methods/deals/findByIdWithDetails');
const findAndOrderByDays = require('./methods/deals/findAndOrderByDays');

const dealSchema = mongoose.Schema(
  {
    dealLink: { type: String, trim: true, default: null },
    previewImage: { type: String, trim: true, default: null },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true }, // deal description in brief eg. 50
    category: { type: String, required: true },
    dealExpires: { type: Date, default: null },
    dealType: {
      type: String,
      enum: ['freebie', 'discount', 'cashback', 'bonus', 'other'],
    }, // can be one of: "freebie", "discount", "cashback", "bonus", "other" (deal is other stuff like 50% topup bonus, buy 1 get 1 free, etc)
    percentOff: { type: Number, default: null },
    originalPrice: { type: Number, default: null },
    dealPrice: { type: Number, default: null },
    expired: { type: Boolean, default: false },
    postedBy: { type: mongoose.Schema.Types.ObjectId, ref: User },
  },
  { timestamps: true },
);

dealSchema.index({
  title: 'text',
  categories: 'text',
});

// ensure that the categories for a deal is valid
dealSchema.pre('save', async function (next) {
  // const matchedCategories = await CategoriesModel.find()
  //   .where('name')
  //   .in(this.categories); // where().in() because this.categories is an array

  // if (matchedCategories.length === 0) {
  //   return next(createError(400, 'Invalid category'));
  // }

  // const categoryNamesArray = matchedCategories.map((category) => category.name); // turns [{name: 'abc'}] to ['abc']
  // this.categories = categoryNamesArray; // overwrite with matched categories to remove bogus categories

  if (!categories.includes(this.category)) {
    return next(createError(400, 'Invalid category'));
  }
  return next();
});

// submited deals automatically upvoted
dealSchema.post('save', async (deal, next) => {
  try {
    const isAlreadyVoted = await Votes.findOne({
      postId: deal._id,
      userId: deal.postedBy,
    });
    if (!isAlreadyVoted) {
      await Votes.create({
        postId: deal._id,
        userId: deal.postedBy,
        type: 1, // +1 or -1
      });
    }

    return next();
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      return next(error);
    }
  }
});

dealSchema.static('findAndOrderByDays', findAndOrderByDays);
dealSchema.static('findByIdWithDetails', findByIdWithDetails);

dealSchema.static('findByCategory', function (category) {
  return this.find({ categories: category });
});

// Error handler
dealSchema.post('findOne', (err, res, next) => {
  if (err.name === 'CastError' && err.path === '_id') {
    next(createError(404, 'Deal not found'));
  }
  next();
});

module.exports = mongoose.model('Deal', dealSchema);
