"use client";
import { Modal, message } from "antd";
import React, { useEffect } from "react";
import Loader from "@/components/Loader";



interface CheckoutModalProps {
  showCheckoutModal: boolean;
  setShowCheckoutModal: any;
  total: number;
}

function CheckoutModal({
  showCheckoutModal,
  setShowCheckoutModal,
  total,
}: CheckoutModalProps) {
  const [loading, setLoading] = React.useState(false);
  
  const loadClientSecret = async () => {
    try {
      setLoading(true);
      
    } catch (error: any) {
      message.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadClientSecret();
  }, []);
  return (
    <Modal
      title={
        <div className="flex justify-between items-center font-bold text-xl">
          <span>Checkout</span>
          <span>Total: ${total}</span>
        </div>
      }
      open={showCheckoutModal}
      onCancel={() => setShowCheckoutModal(false)}
      centered
      closable={false}
      footer={false}
    >
      {loading && <Loader />}
      <hr className="my-5" />
      <div className="mt-5">
        
      </div>
    </Modal>
  );
}

export default CheckoutModal;
