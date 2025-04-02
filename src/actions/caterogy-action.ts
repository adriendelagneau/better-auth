"use server";

import db from "@/lib/prisma";


export const GetCategory = async () => {
  try {
    const categories = await db.category.findMany(); // Get all categories
    return categories; // Return the result
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw new Error("Failed to fetch categories");
  }
};

