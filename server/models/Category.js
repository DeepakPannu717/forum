const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  parentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    default: null
  },
  // Topics directly in this category
  topics: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Topic'
  }]
}, {
  timestamps: true,
  // This allows us to populate virtual fields
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for subcategories
categorySchema.virtual('subcategories', {
  ref: 'Category',
  localField: '_id',
  foreignField: 'parentId'
});

// Method to check if a category has subcategories
categorySchema.methods.hasSubcategories = async function() {
  return await mongoose.model('Category').exists({ parentId: this._id });
};

// Method to get category depth (how many levels deep it is)
categorySchema.methods.getDepth = async function() {
  let depth = 0;
  let currentCategory = this;
  
  while (currentCategory.parentId) {
    depth++;
    currentCategory = await mongoose.model('Category').findById(currentCategory.parentId);
    if (!currentCategory) break;
    
    // Prevent infinite loops in case of circular references
    if (depth > 10) break;
  }
  
  return depth;
};

// Pre-save hook to validate category depth
categorySchema.pre('save', async function(next) {
  if (this.isModified('parentId') && this.parentId) {
    const depth = await this.getDepth();
    if (depth >= 3) {
      next(new Error('Maximum category nesting depth (3) exceeded'));
    }
  }
  next();
});

// Add indexes for faster lookups
categorySchema.index({ parentId: 1 });
categorySchema.index({ parentId: 1, name: 1 }, { unique: true }); // Ensure unique names within same parent

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;