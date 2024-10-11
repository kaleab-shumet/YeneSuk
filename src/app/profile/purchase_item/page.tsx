"use client";
import React from "react";
import PurchaseForm from "../components/PurchaseForm";

function PurchaseItem() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800">Purchase Items</h1>
      <hr />

      <PurchaseForm />
    </div>
  );
}

export default PurchaseItem;
