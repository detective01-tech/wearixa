const Product = require('../models/Product');
const cloudinary = require('../config/cloudinary');

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
    const pageSize = Number(req.query.pageSize) || 12;
    const page = Number(req.query.pageNumber) || 1;

    const keyword = req.query.keyword
        ? { title: { $regex: req.query.keyword, $options: 'i' } }
        : {};

    const mongoose = require('mongoose');
    let categoryFilter = {};
    if (req.query.category) {
        if (mongoose.Types.ObjectId.isValid(req.query.category)) {
            categoryFilter = { category: req.query.category };
        } else {
            // Handle special cases or filter by category name
            const Category = require('../models/Category');
            const cat = await Category.findOne({ name: { $regex: req.query.category, $options: 'i' } });
            if (cat) {
                categoryFilter = { category: cat._id };
            }
        }
    }

    const priceFilter = req.query.minPrice || req.query.maxPrice
        ? { price: { $gte: Number(req.query.minPrice) || 0, $lte: Number(req.query.maxPrice) || 99999 } }
        : {};

    const filter = { ...keyword, ...categoryFilter, ...priceFilter };

    const count = await Product.countDocuments(filter);
    const products = await Product.find(filter)
        .populate('category', 'name')
        .limit(pageSize)
        .skip(pageSize * (page - 1))
        .sort({ createdAt: -1 });

    res.json({ products, page, pages: Math.ceil(count / pageSize), total: count });
};

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
    const product = await Product.findById(req.params.id).populate('category', 'name');

    if (product) {
        res.json(product);
    } else {
        res.status(404);
        throw new Error('Product not found');
    }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req, res) => {
    const { title, description, price, discountPrice, brand, category, stock } = req.body;

    let imageUrls = [];

    if (req.files && req.files.length > 0) {
        for (const file of req.files) {
            const result = await cloudinary.uploader.upload(file.path, {
                folder: 'wearixa/products',
            });
            imageUrls.push(result.secure_url);
        }
    } else if (req.body.images) {
        imageUrls = Array.isArray(req.body.images) ? req.body.images : [req.body.images];
    } else {
        imageUrls = ['https://placehold.co/600x800?text=Wearixa'];
    }

    const product = new Product({
        title,
        images: imageUrls,
        description,
        price,
        discountPrice: discountPrice ? Number(discountPrice) : 0,
        brand,
        category,
        stock,
        user: req.user._id,
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = async (req, res) => {
    const { title, description, price, discountPrice, brand, category, stock, images } = req.body;

    const product = await Product.findById(req.params.id);

    if (product) {
        product.title = title || product.title;
        product.description = description || product.description;
        product.price = price !== undefined ? price : product.price;
        product.discountPrice = discountPrice !== undefined ? Number(discountPrice) : product.discountPrice;
        product.brand = brand || product.brand;
        product.category = category || product.category;
        product.stock = stock !== undefined ? stock : product.stock;
        if (images) product.images = Array.isArray(images) ? images : [images];

        if (req.files && req.files.length > 0) {
            const imageUrls = [];
            for (const file of req.files) {
                const result = await cloudinary.uploader.upload(file.path, {
                    folder: 'wearixa/products',
                });
                imageUrls.push(result.secure_url);
            }
            product.images = imageUrls;
        }

        const updatedProduct = await product.save();
        res.json(updatedProduct);
    } else {
        res.status(404);
        throw new Error('Product not found');
    }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res) => {
    const product = await Product.findById(req.params.id);

    if (product) {
        await product.deleteOne();
        res.json({ message: 'Product removed' });
    } else {
        res.status(404);
        throw new Error('Product not found');
    }
};

// @desc    Create new review
// @route   POST /api/products/:id/reviews
// @access  Private
const createProductReview = async (req, res) => {
    const { rating, comment } = req.body;

    const product = await Product.findById(req.params.id);

    if (product) {
        const alreadyReviewed = product.reviews.find(
            (r) => r.user.toString() === req.user._id.toString()
        );

        if (alreadyReviewed) {
            res.status(400);
            throw new Error('Product already reviewed');
        }

        const review = {
            name: req.user.name,
            rating: Number(rating),
            comment,
            user: req.user._id,
        };

        product.reviews.push(review);
        product.numReviews = product.reviews.length;
        product.rating =
            product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length;

        await product.save();
        res.status(201).json({ message: 'Review added' });
    } else {
        res.status(404);
        throw new Error('Product not found');
    }
};

module.exports = { getProducts, getProductById, createProduct, updateProduct, deleteProduct, createProductReview };
