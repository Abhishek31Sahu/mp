import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "./models/user.js";
import LandProperty from "./models/landProperty.js";

const MONGO_URI = "mongodb://127.0.0.1:27017/landRegistry";

mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB connection error:", err));

const seed = async () => {
  try {
    // Clear existing data
    await User.deleteMany({});
    await LandProperty.deleteMany({});

    // 🔹 Create Users
    const users = [
      {
        fullName: "Akhil Kumar",
        email: "akhil@example.com",
        phone: "9876543210",
        aadhaarNumber: "999911112222",
        passwordHash: await bcrypt.hash("Akhil@123", 10),
        role: "user",
        kycStatus: "verified",
        verifiedPhone: "verified",
      },
      {
        fullName: "Rohit Sharma",
        email: "rohit@example.com",
        phone: "9876543211",
        aadhaarNumber: "999911113333",
        passwordHash: await bcrypt.hash("Rohit@123", 10),
        role: "user",
        kycStatus: "pending",
        verifiedPhone: "pending",
      },
      {
        fullName: "Neha Verma",
        email: "neha@example.com",
        phone: "9876543212",
        aadhaarNumber: "999911114444",
        passwordHash: await bcrypt.hash("Neha@123", 10),
        role: "user",
        kycStatus: "verified",
        verifiedPhone: "verified",
      },
      {
        fullName: "Admin One",
        email: "admin@example.com",
        phone: "9998887777",
        aadhaarNumber: "000011112222",
        passwordHash: await bcrypt.hash("Admin@123", 10),
        role: "admin",
        kycStatus: "verified",
        verifiedPhone: "verified",
      },
    ];

    const createdUsers = await User.insertMany(users);
    console.log(
      "Users created:",
      createdUsers.map((u) => u.fullName)
    );

    // 🔹 Generate 20+ dummy properties
    const propertyTypes = [
      "Residential",
      "Commercial",
      "Agricultural",
      "Industrial",
    ];
    const ownershipTypes = ["Freehold", "Leasehold"];
    const areas = [500, 800, 1000, 1200, 1500, 2000, 2500];
    const locations = [
      "Village X, Tehsil Y, Kanpur Nagar, UP",
      "Sector 5, Noida, UP",
      "Bandra West, Mumbai, Maharashtra",
      "Whitefield, Bangalore, Karnataka",
      "Indiranagar, Bangalore, Karnataka",
      "MG Road, Pune, Maharashtra",
      "Sector 21, Gurgaon, Haryana",
      "Connaught Place, Delhi",
      "Sector 11, Chandigarh",
      "Sector 12, Jaipur, Rajasthan",
    ];

    const properties = [];

    for (let i = 1; i <= 25; i++) {
      const owner =
        createdUsers[Math.floor(Math.random() * (createdUsers.length - 1))]; // random user, not admin
      const landType =
        propertyTypes[Math.floor(Math.random() * propertyTypes.length)];
      const ownershipType =
        ownershipTypes[Math.floor(Math.random() * ownershipTypes.length)];
      const area = areas[Math.floor(Math.random() * areas.length)];
      const location = locations[Math.floor(Math.random() * locations.length)];

      properties.push({
        landId: `LAND${i.toString().padStart(4, "0")}`,
        titleNumber: `TN-${100000 + i}`,
        landType,
        ownershipType,
        owner: owner.aadhaarNumber,
        ownerName: owner.fullName,
        area,
        unit: "sq.ft",
        surveyNumber: `SV-${9000 + i}`,
        mutationNumber: `MUT-${8000 + i}`,
        location,
        coordinates: `${26 + Math.random()},${80 + Math.random()}`,
        boundary: {
          north: "Road",
          south: "River",
          east: "Plot " + (i + 1),
          west: "Canal",
        },
        marketValue: area * 3000 + Math.floor(Math.random() * 1000000),
        registrationDate: new Date(2015 + (i % 5), i % 12, i),
        legalStatus: "REGISTERED",
        currentStatus: "owned",
        docHash: `sha256:${Math.random().toString(36).substring(2, 15)}`,
        previousOwners: [
          {
            owner: `99991111${i.toString().padStart(4, "0")}`,
            from: new Date(2010, 0, 1),
            to: new Date(2015, 0, 1),
          },
        ],
        history: [
          {
            txId: `TX${i.toString().padStart(3, "0")}`,
            action: "CREATED",
            by: "Registrar_001",
            timestamp: new Date(2015, i % 12, i),
          },
        ],
        lastUpdated: new Date(),
      });
    }

    const createdProperties = await LandProperty.insertMany(properties);
    console.log(
      "Properties created:",
      createdProperties.map((p) => p.landId)
    );

    console.log("Database seeding completed!");
    process.exit();
  } catch (err) {
    console.error("Seeding error:", err);
    process.exit(1);
  }
};

seed();
