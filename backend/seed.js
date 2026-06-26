const mongoose = require('mongoose');
require('dotenv').config();

const Product = require('./models/Product');
const StockMovement = require('./models/StockMovement');
const User = require('./models/User');

const dummyProducts = [
  {
    sku: 'ARVI-SUNFLOWER-001',
    productName: 'Sunflower Oil',
    variant: '1L Bottle',
    currentStock: 150,
    reorderLevel: 50,
    costPrice: 150,
    sellingPrice: 220,
  },
  {
    sku: 'ARVI-SUNFLOWER-002',
    productName: 'Sunflower Oil',
    variant: '5L Can',
    currentStock: 75,
    reorderLevel: 30,
    costPrice: 650,
    sellingPrice: 950,
  },
  {
    sku: 'ARVI-COCONUT-001',
    productName: 'Coconut Oil',
    variant: '500ML Bottle',
    currentStock: 200,
    reorderLevel: 60,
    costPrice: 200,
    sellingPrice: 320,
  },
  {
    sku: 'ARVI-COCONUT-002',
    productName: 'Coconut Oil',
    variant: '2L Can',
    currentStock: 45,
    reorderLevel: 25,
    costPrice: 700,
    sellingPrice: 1100,
  },
  {
    sku: 'ARVI-MUSTARD-001',
    productName: 'Mustard Oil',
    variant: '1L Bottle',
    currentStock: 0,
    reorderLevel: 40,
    costPrice: 120,
    sellingPrice: 180,
  },
  {
    sku: 'ARVI-SESAME-001',
    productName: 'Sesame Oil',
    variant: '500ML Bottle',
    currentStock: 30,
    reorderLevel: 50,
    costPrice: 280,
    sellingPrice: 420,
  },
  {
    sku: 'ARVI-GROUNDNUT-001',
    productName: 'Groundnut Oil',
    variant: '1L Bottle',
    currentStock: 120,
    reorderLevel: 35,
    costPrice: 180,
    sellingPrice: 270,
  },
  {
    sku: 'ARVI-OLIVE-001',
    productName: 'Extra Virgin Olive Oil',
    variant: '250ML Bottle',
    currentStock: 60,
    reorderLevel: 25,
    costPrice: 500,
    sellingPrice: 800,
  },
  {
    sku: 'ARVI-PALM-001',
    productName: 'Palm Oil',
    variant: '2L Can',
    currentStock: 90,
    reorderLevel: 40,
    costPrice: 400,
    sellingPrice: 650,
  },
  {
    sku: 'ARVI-RICE-001',
    productName: 'Rice Bran Oil',
    variant: '1L Bottle',
    currentStock: 25,
    reorderLevel: 30,
    costPrice: 220,
    sellingPrice: 350,
  },
];

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✓ MongoDB Connected');

    // Clear existing data
    await Product.deleteMany({});
    await StockMovement.deleteMany({});
    await User.deleteMany({});
    console.log('✓ Cleared existing data');

    // Insert dummy products
    const insertedProducts = await Product.insertMany(dummyProducts);
    console.log(`✓ Inserted ${insertedProducts.length} products`);

    // Create dummy stock movements
    const movements = [];
    
    for (const product of insertedProducts) {
      // Generate 3-5 random stock movements for each product
      const movementCount = Math.floor(Math.random() * 3) + 3;
      
      for (let i = 0; i < movementCount; i++) {
        const movementType = Math.random() > 0.6 ? 'OUT' : 'IN';
        const quantity = Math.floor(Math.random() * 50) + 10;
        const daysAgo = Math.floor(Math.random() * 30);
        
        movements.push({
          productId: product._id,
          movementType,
          quantity,
          notes: movementType === 'IN' 
            ? `Stock received from supplier (Batch #${Math.floor(Math.random() * 1000)})`
            : `Dispatch to customer order #${Math.floor(Math.random() * 5000)}`,
          runningBalance: product.currentStock,
          date: new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000),
          createdAt: new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000),
        });
      }
    }

    await StockMovement.insertMany(movements);
    console.log(`✓ Inserted ${movements.length} stock movements`);

    // Create default admin user
    console.log('Creating admin user...');
    const adminUser = new User({
      username: 'admin',
      email: 'admin@arviops.com',
      password: 'admin123',
      fullName: 'Admin User',
      role: 'admin',
    });
    await adminUser.save();
    console.log('✓ Created default admin user');

    console.log('\n✅ Database seeded successfully!');
    console.log(`\n📊 Summary:`);
    console.log(`   - Total Products: ${insertedProducts.length}`);
    console.log(`   - Total Stock Movements: ${movements.length}`);
    console.log(`   - Admin User Created`);
    console.log(`\n🔗 Connect to: ${process.env.MONGO_URI}`);
    console.log(`\n📝 Login Credentials:`);
    console.log(`   - Username: admin`);
    console.log(`   - Password: admin123`);

    await mongoose.connection.close();
    console.log('\n✓ Connection closed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
};

seedDatabase();
