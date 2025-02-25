import {
    createOrderService,
    updatePaymentService,
    verifyPaymentService,
    handleWebhookService,
  } from '../services/paymentService.js';
  
  export const createOrder = async (req, res) => {
    try {
      const result = await createOrderService(req.body);
      res.json(result);
    } catch (error) {
      res.status(error.response?.status || 500).json({
        error: {
          message: error.response?.data?.message || error.message,
          type: error.response?.data?.type || 'unknown',
          code: error.response?.status || 500,
        },
      });
    }
  };
  
  export const updatePayment = async (req, res) => {
    try {
      const result = await updatePaymentService(req.params.orderId);
      res.json(result);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Internal Server Error",
        error: error.message,
      });
    }
  };
  
  export const verifyPayment = async (req, res) => {
    try {
      const result = await verifyPaymentService(req.params.orderId);
      res.json(result);
    } catch (error) {
      res.status(500).json({
        status: 'FAILED',
        message: 'Internal server error. Please try again later.',
      });
    }
  };
  
  export const handleWebhook = async (req, res) => {
    try {
      const result = await handleWebhookService(req.body); // Pass req.body to the service
      res.status(200).json(result); // Send the result back to the client
    } catch (error) {
      console.error("Webhook Error:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };