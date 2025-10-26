const express = require('express');
const router = express.Router();
const Category = require('../models/Category');
const Topic = require('../models/Topic');

// Get all categories with their subcategories
router.get('/categories', async (req, res) => {
  try {
    // Get root categories first
    const rootCategories = await Category.find({ parentId: null })
      .populate('topics');

    // Function to recursively populate subcategories
    async function populateSubcategories(categories) {
      for (let category of categories) {
        // Find direct subcategories
        const subcategories = await Category.find({ parentId: category._id })
          .populate('topics');
        
        if (subcategories.length > 0) {
          // Recursively populate their subcategories
          await populateSubcategories(subcategories);
          // Attach populated subcategories to parent
          category.subcategories = subcategories;
        } else {
          category.subcategories = [];
        }
      }
      return categories;
    }

    // Populate all levels of subcategories
    await populateSubcategories(rootCategories);
    
    res.json(rootCategories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new category or subcategory
router.post('/category', async (req, res) => {
  try {
    const { name, parentId } = req.body;
    
    // Validate parent category if parentId is provided
    if (parentId) {
      const parentCategory = await Category.findById(parentId);
      if (!parentCategory) {
        return res.status(400).json({ message: 'Parent category not found' });
      }
    }

    // Create the category
    const category = new Category({
      name,
      parentId: parentId || null
    });
    
    await category.save();
    
    // Populate the complete category hierarchy
    if (parentId) {
      await category.populate([
        'topics',
        {
          path: 'subcategories',
          populate: [
            { path: 'topics' },
            { path: 'subcategories' }
          ]
        }
      ]);
    }
    
    res.status(201).json({ category });
  } catch (error) {
    // Handle specific validation errors
    if (error.message.includes('Maximum category nesting depth')) {
      return res.status(400).json({ 
        message: 'Cannot create subcategory: Maximum nesting depth (3 levels) exceeded' 
      });
    }
    if (error.code === 11000) { // Duplicate key error
      return res.status(400).json({ 
        message: 'A category with this name already exists at this level' 
      });
    }
    res.status(400).json({ message: error.message });
  }
});

// Update a category
router.put('/category/:id', async (req, res) => {
  try {
    const { name } = req.body;
    const category = await Category.findById(req.params.id);
    
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    
    category.name = name;
    await category.save();
    
    res.json({ category });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a category and its subcategories
router.delete('/category/:id', async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    
    // Get all subcategory IDs recursively
    async function getAllSubcategoryIds(categoryId) {
      const subcats = await Category.find({ parentId: categoryId });
      let ids = [categoryId];
      for (const subcat of subcats) {
        ids = [...ids, ...(await getAllSubcategoryIds(subcat._id))];
      }
      return ids;
    }
    
    const categoryIds = await getAllSubcategoryIds(category._id);
    
    // Delete all topics in these categories
    await Topic.deleteMany({ categoryId: { $in: categoryIds } });
    
    // Delete all categories
    await Category.deleteMany({ _id: { $in: categoryIds } });
    
    res.json({ message: 'Category and all subcategories deleted' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;