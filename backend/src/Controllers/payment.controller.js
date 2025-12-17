import Razorpay from 'razorpay';

var razorpay = new Razorpay({
  key_id: 'rzp_test_Rro0eLVmnJ7EBr',
  key_secret: '2vZrRjgLca0Dmh69FCLoRq0i',
});

const createOrder = (req, res) => {
  const amount = req?.body?.amount;
  if (amount === undefined || amount === null) {
    return res.status(400).json({ message: 'Amount is missing' });
  }

  // Expect amount in RUPEES (number). Convert to paise for Razorpay.
  const amountRupees = Number(amount);
  if (Number.isNaN(amountRupees) || amountRupees <= 0) {
    return res.status(400).json({ message: 'Invalid amount' });
  }

  const amountPaise = Math.round(amountRupees * 100);

  const options = {
    amount: amountPaise, // Amount is in currency subunits (paise)
    currency: 'INR',
    receipt: `order_rcptid_${Date.now()}`
  };

  razorpay.orders.create(options, function (err, order) {
    if (err) {
      console.error('Razorpay order creation failed:', err);
      return res.status(500).json({ message: 'Failed to create order', details: err.message || err });
    }

    // Normalize response for frontend convenience
    return res.status(200).json({
      order_id: order.id,
      amount: order.amount,
      currency: order.currency,
      receipt: order.receipt,
      raw: order
    });
  });
}

import crypto from 'crypto';

const verifyPayment = (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return res.status(400).json({ status: 'error', message: 'Missing required fields' });
  }

  try {
    const secret = razorpay.key_secret;
    const generated_signature = crypto.createHmac('sha256', secret)
      .update(razorpay_order_id + '|' + razorpay_payment_id)
      .digest('hex');

    if (generated_signature === razorpay_signature) {
      console.log('Payment verification successful for order:', razorpay_order_id);
      return res.status(200).json({ status: 'ok' });
    } else {
      console.warn('Payment verification failed: signature mismatch');
      return res.status(400).json({ status: 'verification_failed' });
    }
  } catch (error) {
    console.error('Error verifying payment:', error);
    return res.status(500).json({ status: 'error', message: 'Error verifying payment' });
  }
}

export { createOrder, verifyPayment };
