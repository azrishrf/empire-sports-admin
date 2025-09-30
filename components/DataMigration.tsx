"use client";

import { useAuth } from "@/contexts/AuthContext";
import { productsData } from "@/data/products";
import { db } from "@/lib/firebase";
import { collection, doc, setDoc, Timestamp } from "firebase/firestore";
import { useState } from "react";

export default function DataMigration() {
  const [isMigrating, setIsMigrating] = useState(false);
  const [migrationStatus, setMigrationStatus] = useState<string>("");
  const { user } = useAuth();

  const migrateProductsToFirestore = async () => {
    if (!user) {
      setMigrationStatus("❌ Please log in first to migrate data");
      return;
    }

    setIsMigrating(true);
    setMigrationStatus("Starting migration...");

    try {
      // Get all products from all categories
      const allProducts = [
        ...productsData.running,
        ...productsData.sneakers,
        ...productsData.clothing,
        ...productsData.sandals,
        ...productsData.basketball,
      ];

      setMigrationStatus(`Migrating ${allProducts.length} products...`);

      // Migrate each product to Firestore
      for (let i = 0; i < allProducts.length; i++) {
        const product = allProducts[i];
        const productRef = doc(collection(db, "products"), product.id);

        await setDoc(productRef, {
          ...product,
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now(),
        });

        setMigrationStatus(`Migrated ${i + 1}/${allProducts.length} products`);
      }

      setMigrationStatus(`✅ Successfully migrated ${allProducts.length} products to Firestore!`);
    } catch (error) {
      console.error("Migration failed:", error);
      setMigrationStatus(`❌ Migration failed: ${error}`);
    } finally {
      setIsMigrating(false);
    }
  };

  return (
    <div className="rounded-lg bg-white p-6 shadow-md">
      <h2 className="mb-4 text-xl font-bold text-gray-900">Data Migration</h2>
      <p className="mb-4 text-sm text-gray-600">
        This will migrate all products from the local JSON data to Firestore database.
      </p>

      {!user && (
        <div className="mb-4 rounded-lg border border-yellow-200 bg-yellow-50 p-3">
          <p className="text-sm text-yellow-800">⚠️ You need to be logged in to perform data migration.</p>
        </div>
      )}

      <button
        onClick={migrateProductsToFirestore}
        disabled={isMigrating || !user}
        className={`rounded-lg px-6 py-3 font-medium text-white transition-colors ${
          isMigrating || !user ? "cursor-not-allowed bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {isMigrating ? "Migrating..." : "Migrate Products to Firestore"}
      </button>

      {migrationStatus && (
        <div className="mt-4 rounded-lg bg-gray-50 p-3">
          <p className="text-sm font-medium text-gray-700">{migrationStatus}</p>
        </div>
      )}
    </div>
  );
}
