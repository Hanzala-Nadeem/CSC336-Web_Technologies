// ============================================================
// SEED SCRIPT — Run with: node seed.js
// Seeds: Categories → Products (with ObjectId refs) → Users
// ============================================================

require("dotenv").config();
const mongoose = require("mongoose");
const Product = require("./models/Product");
const Category = require("./models/Category");
const User = require("./models/User");

// ============================================================
// SEED FUNCTION
// ============================================================
async function seedDB() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB for seeding...");

        // Clear existing data and drop indexes to avoid stale conflicts
        await Product.deleteMany({});
        await Category.deleteMany({});
        await User.deleteMany({});
        // Drop old indexes to prevent conflicts with new schema
        try { await mongoose.connection.collection("products").dropIndexes(); } catch(e) {}
        try { await mongoose.connection.collection("categories").dropIndexes(); } catch(e) {}
        try { await mongoose.connection.collection("users").dropIndexes(); } catch(e) {}
        console.log("Cleared existing data.");

        // =================== CREATE CATEGORIES ===================
        const shoes = await Category.create({ name: "Shoes", description: "Athletic and lifestyle footwear" });
        const clothing = await Category.create({ name: "Clothing", description: "Apparel and sportswear" });
        const accessories = await Category.create({ name: "Accessories", description: "Bags, caps, socks and more" });
        const sportsEquipment = await Category.create({ name: "Sports Equipment", description: "Balls, gloves, guards and gear" });

        console.log("Created 4 categories.");

        // =================== CREATE PRODUCTS ===================
        const products = [
            // ===================== SHOES (12 items) =====================
            {
                name: "Samba OG Shoes",
                price: 120,
                category: shoes._id,
                rating: 4.8,
                stock: 45,
                image: "images/shoes 1.avif",
                description: "The iconic Samba silhouette with premium leather upper and gum rubber outsole.",
                collection: "Originals"
            },
            {
                name: "Handball Spezial Shoes",
                price: 110,
                category: shoes._id,
                rating: 4.7,
                stock: 38,
                image: "images/shoes 2.avif",
                description: "A court classic reborn for the streets. Suede upper with signature T-toe.",
                collection: "Originals"
            },
            {
                name: "Gazelle Bold Shoes",
                price: 130,
                category: shoes._id,
                rating: 4.6,
                stock: 52,
                image: "images/shoes 3.avif",
                description: "The Gazelle gets a bold platform lift with a stacked midsole.",
                collection: "Originals"
            },
            {
                name: "SL 72 OG Shoes",
                price: 100,
                category: shoes._id,
                rating: 4.5,
                stock: 60,
                image: "images/shoes 4.avif",
                description: "Retro running design from the 1972 Olympics, faithfully recreated.",
                collection: "Originals"
            },
            {
                name: "Superstar Shoes",
                price: 110,
                category: shoes._id,
                rating: 4.9,
                stock: 70,
                image: "images/shoes 5.avif",
                description: "The shell-toe icon. Leather upper with the legendary rubber toe cap.",
                collection: "Originals"
            },
            {
                name: "Campus 00s Shoes",
                price: 120,
                category: shoes._id,
                rating: 4.4,
                stock: 33,
                image: "images/shoes 6.avif",
                description: "A suede upper with oversized tongue and fat laces for a retro vibe.",
                collection: "Originals"
            },
            {
                name: "Ultraboost 5 Running Shoes",
                price: 190,
                category: shoes._id,
                rating: 4.8,
                stock: 25,
                image: "images/shoes 7.avif",
                description: "Maximum energy return with BOOST midsole and Primeknit upper.",
                collection: "Sportswear"
            },
            {
                name: "Adizero Adios Pro 4",
                price: 250,
                category: shoes._id,
                rating: 4.9,
                stock: 15,
                image: "images/shoes 8.avif",
                description: "Elite marathon racing shoe with ENERGYRODS 2.0 and LIGHTSTRIKE PRO.",
                collection: "Performance"
            },
            {
                name: "NMD_R1 Shoes",
                price: 140,
                category: shoes._id,
                rating: 4.3,
                stock: 42,
                image: "images/shoes 9.avif",
                description: "Streetwear meets tech. BOOST cushioning with a sleek knit upper.",
                collection: "Originals"
            },
            {
                name: "Terrex Free Hiker 2 GORE-TEX",
                price: 230,
                category: shoes._id,
                rating: 4.7,
                stock: 18,
                image: "images/shoees 10.avif",
                description: "Waterproof hiking shoe with Continental rubber and BOOST midsole.",
                collection: "Terrex"
            },
            {
                name: "Stan Smith Shoes",
                price: 100,
                category: shoes._id,
                rating: 4.6,
                stock: 55,
                image: "images/shoes 11.avif",
                description: "Clean, minimal tennis-inspired sneaker with a smooth leather upper.",
                collection: "Originals"
            },
            {
                name: "Supernova Rise Running Shoes",
                price: 140,
                category: shoes._id,
                rating: 4.5,
                stock: 30,
                image: "images/shoes 12.avif",
                description: "Designed for daily runs. DREAMSTRIKE+ midsole for soft cushioning.",
                collection: "Sportswear"
            },

            // =================== CLOTHING (10 items) ===================
            {
                name: "Adicolor Classics 3-Stripes Tee",
                price: 35,
                category: clothing._id,
                rating: 4.4,
                stock: 80,
                image: "images/clothing 1.avif",
                description: "Soft cotton tee with the iconic three stripes on the sleeves.",
                collection: "Originals"
            },
            {
                name: "Tiro 24 Training Pants",
                price: 55,
                category: clothing._id,
                rating: 4.6,
                stock: 65,
                image: "images/clothing 2.avif",
                description: "Slim-fit training pants with AEROREADY moisture-wicking technology.",
                collection: "Sportswear"
            },
            {
                name: "Essentials 3-Stripes Hoodie",
                price: 65,
                category: clothing._id,
                rating: 4.5,
                stock: 48,
                image: "images/cothing 3.avif",
                description: "Cozy fleece hoodie with kangaroo pocket and embroidered Trefoil logo.",
                collection: "Sportswear"
            },
            {
                name: "Firebird Track Jacket",
                price: 85,
                category: clothing._id,
                rating: 4.7,
                stock: 35,
                image: "images/adidas_x_entire_studios_D4T_Training_Tank_Burgundy_KR7842_000_plp_model.avif",
                description: "The legendary Firebird jacket with full zip and stand-up collar.",
                collection: "Originals"
            },
            {
                name: "Adizero Running Singlet",
                price: 40,
                category: clothing._id,
                rating: 4.3,
                stock: 50,
                image: "images/adidas_x_entire_studios_D4T_Training_Tank_Grey_KD6623_000_plp_model.avif",
                description: "Lightweight race-day singlet with moisture-wicking AEROREADY fabric.",
                collection: "Performance"
            },
            {
                name: "Z.N.E. Premium Full-Zip Hoodie",
                price: 120,
                category: clothing._id,
                rating: 4.8,
                stock: 22,
                image: "images/clothing 1.avif",
                description: "Premium double-knit hoodie designed for the zone between sport and life.",
                collection: "Sportswear"
            },
            {
                name: "Terrex Multi Wind Jacket",
                price: 95,
                category: clothing._id,
                rating: 4.4,
                stock: 28,
                image: "images/clothing 2.avif",
                description: "Windproof and water-repellent trail jacket for unpredictable conditions.",
                collection: "Terrex"
            },
            {
                name: "Own The Run Shorts",
                price: 35,
                category: clothing._id,
                rating: 4.2,
                stock: 90,
                image: "images/adidas_x_entire_studios_D4T_Training_2in1_Shorts_Burgundy_KR7843_000_plp_model.avif",
                description: "Lightweight running shorts with built-in brief and reflective details.",
                collection: "Sportswear"
            },
            {
                name: "Yoga Training 7/8 Leggings",
                price: 60,
                category: clothing._id,
                rating: 4.6,
                stock: 40,
                image: "images/adidas_x_entire_studios_Optime_Short_Training_Leggings_Burgundy_KE7345_000_plp_model.avif",
                description: "High-waist 7/8 length leggings with buttery-soft Techfit fabric.",
                collection: "Sportswear"
            },
            {
                name: "Adicolor Classics Firebird Track Pants",
                price: 75,
                category: clothing._id,
                rating: 4.5,
                stock: 55,
                image: "images/adidas_x_entire_studios_Uniform_Heavy_Drop_Shorts_Brown_KR7848_000_plp_model.avif",
                description: "Classic track pants with tapered leg and iconic 3-Stripes.",
                collection: "Originals"
            },

            // ================= ACCESSORIES (5 items) =================
            {
                name: "Classic 3-Stripes Backpack",
                price: 45,
                category: accessories._id,
                rating: 4.5,
                stock: 60,
                image: "images/adidas_x_entire_studios_Gym_Bag_Black_KE5530_27_model.avif",
                description: "Durable backpack with padded laptop compartment and 3-Stripes branding.",
                collection: "Sportswear"
            },
            {
                name: "Adilette Comfort Slides",
                price: 35,
                category: accessories._id,
                rating: 4.3,
                stock: 75,
                image: "images/Virginia_Adistar_Jellyfish_by_Pharrell_Green_JP9263_00_plp_standard.avif",
                description: "Cloudfoam cushioned slides for post-workout recovery or casual wear.",
                collection: "Sportswear"
            },
            {
                name: "Trefoil Baseball Cap",
                price: 25,
                category: accessories._id,
                rating: 4.4,
                stock: 100,
                image: "images/BAPE_CAMO_GLOVE_Black_JY8237_27_model.avif",
                description: "Six-panel cotton cap with embroidered Trefoil logo and adjustable strap.",
                collection: "Originals"
            },
            {
                name: "Defender IV Large Duffel Bag",
                price: 55,
                category: accessories._id,
                rating: 4.6,
                stock: 30,
                image: "images/Position6_Training_Accessories_600x900_Tiro_Washkit_Bag_2_Copy_2_b62e39bb7f.avif",
                description: "Spacious duffel with base padding and multiple zippered pockets.",
                collection: "Sportswear"
            },
            {
                name: "Adidas Training Crew Socks 6-Pack",
                price: 22,
                category: accessories._id,
                rating: 4.2,
                stock: 120,
                image: "images/Virginia_Adistar_Jellyfish_by_Pharrell_Grey_KJ3841_00_plp_standard.avif",
                description: "Cushioned athletic crew socks with arch compression for a secure fit.",
                collection: "Sportswear"
            },

            // ============= SPORTS EQUIPMENT (3 items) =============
            {
                name: "UCL Pro Istanbul Match Ball",
                price: 165,
                category: sportsEquipment._id,
                rating: 4.9,
                stock: 12,
                image: "images/global_ucl_budapest_oslo_finals_omb_football_ss26_launch_hp_ucl_budapest_banner_hero_1_m_399224e12f.avif",
                description: "Official UEFA Champions League match ball with seamless surface.",
                collection: "Performance"
            },
            {
                name: "Predator Training Goalkeeper Gloves",
                price: 40,
                category: sportsEquipment._id,
                rating: 4.3,
                stock: 35,
                image: "images/BAPE_CAMO_GLOVE_Black_JY8237_27_model.avif",
                description: "Training gloves with soft grip latex palm and comfortable fit.",
                collection: "Performance"
            },
            {
                name: "Tiro League Shin Guards",
                price: 18,
                category: sportsEquipment._id,
                rating: 4.1,
                stock: 50,
                image: "images/global_main_pack_1_born_for_goals_football_ss26_launch_hp_nh_horizontal_navigation_header_2_d_77926428c0.avif",
                description: "Lightweight EVA-backed shin guards with ankle sock sleeve.",
                collection: "Performance"
            }
        ];

        // Save products one by one to trigger pre-save hooks (slug generation)
        const inserted = [];
        for (const productData of products) {
            const product = new Product(productData);
            await product.save();
            inserted.push(product);
        }
        console.log(`Seeded ${inserted.length} products successfully!`);

        // Show summary
        const catCounts = {};
        for (const p of inserted) {
            const catName = p.category.equals(shoes._id) ? "Shoes" :
                           p.category.equals(clothing._id) ? "Clothing" :
                           p.category.equals(accessories._id) ? "Accessories" : "Sports Equipment";
            catCounts[catName] = (catCounts[catName] || 0) + 1;
        }
        console.log("\nBreakdown by category:");
        Object.entries(catCounts).forEach(([cat, count]) => {
            console.log(`  ${cat}: ${count} products`);
        });

        // =================== CREATE USERS ===================
        // Note: passwords are hashed automatically by the User model's pre-save hook
        const adminUser = new User({
            name: "Admin User",
            email: "admin@adidas.com",
            password: "admin123",
            role: "admin"
        });
        await adminUser.save();

        const customerUser = new User({
            name: "Test Customer",
            email: "user@adidas.com",
            password: "user123",
            role: "customer"
        });
        await customerUser.save();

        console.log("\nCreated 2 users:");
        console.log("  Admin:    admin@adidas.com / admin123");
        console.log("  Customer: user@adidas.com  / user123");

    } catch (error) {
        console.error("Seeding error:", error.message);
    } finally {
        await mongoose.connection.close();
        console.log("\nDatabase connection closed.");
    }
}

seedDB();
