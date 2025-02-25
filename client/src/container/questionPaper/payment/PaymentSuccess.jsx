import React, { useEffect } from 'react';

const PaymentStatus = () => {
  useEffect(() => {
  console.log("Payment is succesfull" )
  }, []);

  return (
    <div className="payment-status">
      <h1 className="payment-status__title">Payment Successful</h1>
      <p className="payment-status__message">Your payment was successful! Your download will start shortly.</p>
    </div>
  );
};

export default PaymentStatus;
