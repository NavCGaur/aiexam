import React from 'react';

const PaymentFailure = () => {
  return (
    <div className="payment-status">
      <h1 className="payment-status__title">Payment Failed</h1>
      <p className="payment-status__message">There was an error processing your payment. Please try again.</p>
    </div>
  );
};

export default PaymentFailure;
