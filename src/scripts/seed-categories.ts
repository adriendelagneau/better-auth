import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const categoryNames = [
    "Cars and Vehicles",
    "Technology and Gadgets",
    "Health and Wellness",
    "Food and Cooking",
    "Sports and Fitness",
    "Travel and Adventure",
    "Fashion and Beauty",
    "Science and Nature",
    "Education and Learning",
    "Movies and Entertainment",
    "Music and Instruments",
    "Gaming and Esports",
    "Business and Finance",
    "Home and Gardening",
    "Pets and Animals"
];

async function main() {
    console.log("Seeding categories...");

    try {
        await prisma.category.createMany({
            data: categoryNames.map((name) => ({
                name,
                description: `Video related to ${name.toLowerCase()}`
            })),
            skipDuplicates: true, // Prevents errors if categories already exist
        });

        console.log("Categories seeded successfully!");
    } catch (err) {
        console.error("Error seeding categories:", err);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

main();
