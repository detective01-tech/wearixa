const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Product = require('./models/Product');
const Category = require('./models/Category');
const Order = require('./models/Order');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const categories = [
  { name: 'Collections', image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800', description: 'Curated sets for every season.' },
  { name: 'Women', image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800', description: 'Elegant and modern feminine styles.' },
  { name: 'Men', image: 'https://images.unsplash.com/photo-1490114538077-0a7f8cb49891?w=800', description: 'Sophisticated menswear for the modern man.' },
  { name: 'Accessories', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800', description: 'The perfect finishing touch.' },
];

const users = [
  { name: 'Admin User', email: 'admin@wearixa.com', password: 'admin123', role: 'admin' },
  { name: 'John Doe', email: 'user@wearixa.com', password: 'user123', role: 'user' },
];

const importData = async () => {
  try {
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();
    await Category.deleteMany();

    const createdCategories = await Category.insertMany(categories);
    
    // Hash passwords before inserting
    const hashedUsers = await Promise.all(users.map(async (user) => {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(user.password, salt);
      return { ...user, password: hashedPassword };
    }));

    const createdUsers = await User.insertMany(hashedUsers);
    const adminUser = createdUsers[0]._id;

    const sampleProducts = [
      {
        user: adminUser,
        title: 'Minimalist Silk Blouse',
        images: ['https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?w=800'],
        description: 'A luxurious silk blouse with a clean, minimalist silhouette. Perfect for office or evening wear.',
        brand: 'Wearixa Signature',
        category: createdCategories[1]._id,
        price: 129.99,
        stock: 15,
        rating: 4.5,
        numReviews: 8,
      },
      {
        user: adminUser,
        title: 'Classic Wool Overcoat',
        images: ['https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=800'],
        description: 'Premium wool blend overcoat designed for warmth and timeless style.',
        brand: 'Wearixa Essential',
        category: createdCategories[2]._id,
        price: 299.00,
        stock: 5,
        rating: 5,
        numReviews: 12,
      },
      {
        user: adminUser,
        title: 'Gold Accent Leather Tote',
        images: ['https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800'],
        description: 'Handcrafted leather tote featuring our signature gold-tone hardware.',
        brand: 'Wearixa Luxe',
        category: createdCategories[3]._id,
        price: 185.00,
        stock: 10,
        rating: 4.8,
        numReviews: 24,
      },
      {
        user: adminUser,
        title: 'Structured Linen Blazer',
        images: ['https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800'],
        description: 'Lightweight, breathable linen blazer with a modern structured fit.',
        brand: 'Wearixa Signature',
        category: createdCategories[0]._id,
        price: 210.00,
        stock: 8,
        rating: 4.7,
        numReviews: 15,
      },
      {
        user: adminUser,
        title: 'Satin Slip Dress',
        images: ['https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800'],
        description: 'Elegant satin slip dress with adjustable straps and a fluid silhouette.',
        brand: 'Wearixa Night',
        category: createdCategories[1]._id,
        price: 145.00,
        stock: 20,
        rating: 4.9,
        numReviews: 32,
      },
      {
        user: adminUser,
        title: 'Tapered Chino Trousers',
        images: ['https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=800'],
        description: 'Versatile chino trousers made from premium organic cotton with a hint of stretch.',
        brand: 'Wearixa Essential',
        category: createdCategories[2]._id,
        price: 89.00,
        stock: 25,
        rating: 4.4,
        numReviews: 18,
      }
    ];

    const createdProducts = await Product.insertMany(sampleProducts);

    const sampleOrder = new Order({
      user: createdUsers[1]._id, // John Doe
      orderItems: [
        {
          name: createdProducts[0].title,
          qty: 1,
          image: createdProducts[0].images[0],
          price: createdProducts[0].price,
          product: createdProducts[0]._id,
        },
      ],
      shippingAddress: {
        address: '123 Main St',
        city: 'New York',
        postalCode: '10001',
        country: 'USA',
      },
      paymentMethod: 'stripe',
      taxPrice: 10.40,
      shippingPrice: 0.00,
      totalPrice: 140.39,
      isPaid: true,
      paidAt: Date.now(),
    });

    await sampleOrder.save();

    console.log('Data Imported!');
    process.exit();
  } catch (error) {
    console.error(`${error}`);
    process.exit(1);
  }
};

importData();
