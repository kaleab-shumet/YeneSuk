"use client"
import React from 'react';
import PurchaseForm from '@/app/profile/components/PurchaseForm';

interface PurchasePageProps {
  params: {
    purchaseId: string;
  };
}

const PurchasePage: React.FC<PurchasePageProps> = ({ params }) => {
  const { purchaseId } = params;

  return (
    <div>
      <h1>Purchase Details</h1>
      <PurchaseForm purchaseId={purchaseId} />
    </div>
  );
};

export default PurchasePage;