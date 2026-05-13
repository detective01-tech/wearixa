const Category = require('../models/Category');

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
const getCategories = async (req, res) => {
    const categories = await Category.find({});
    res.json(categories);
};

// @desc    Create a category
// @route   POST /api/categories
// @access  Private/Admin
const createCategory = async (req, res) => {
    const { name, description, image } = req.body;

    const categoryExists = await Category.findOne({ name });
    if (categoryExists) {
        res.status(400);
        throw new Error('Category already exists');
    }

    const category = await Category.create({
        name,
        description,
        image: image || 'https://placehold.co/400x300?text=' + name,
    });

    res.status(201).json(category);
};

// @desc    Update a category
// @route   PUT /api/categories/:id
// @access  Private/Admin
const updateCategory = async (req, res) => {
    const category = await Category.findById(req.params.id);

    if (category) {
        category.name = req.body.name || category.name;
        category.description = req.body.description || category.description;
        category.image = req.body.image || category.image;

        const updated = await category.save();
        res.json(updated);
    } else {
        res.status(404);
        throw new Error('Category not found');
    }
};

// @desc    Delete a category
// @route   DELETE /api/categories/:id
// @access  Private/Admin
const deleteCategory = async (req, res) => {
    const category = await Category.findById(req.params.id);

    if (category) {
        await category.deleteOne();
        res.json({ message: 'Category removed' });
    } else {
        res.status(404);
        throw new Error('Category not found');
    }
};

module.exports = { getCategories, createCategory, updateCategory, deleteCategory };
