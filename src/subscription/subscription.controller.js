const prisma = require("../../config/db");
const razorpay  = require("../../utils/razorpay");

const createOrder = async (req, res) => {
  const { planId } = req.body;
  const userId = req.user.id;

  if (!planId || !userId) {
    return res.status(400).json({ error: "Plan ID and User ID are required" });
  }

  try {
    const plan = await prisma.plan.findUnique({
      where: { id: planId },
    });

    if (!plan) {
      return res
        .status(404)
        .json({ status: "Error", message: "Plan not found" });
    }

    if (plan.price === 0) {
      return res.status(400).json({
        status: "failed",
        message: "FREE plan does not require payment",
      });
    }

    const order = await razorpay.orders.create({
      amount: plan.price * 100,
      currency: "INR",
      receipt: `receipt_${req.user.username}_${Date.now()}`,
      notes: {
        userId,
        planId,
      },
    });

    res.status(201).json({
      status: "success",
      message: "Order created successfully",
      data: {
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        plan: plan.name
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "Error",
      message: "Internal Server Error",
      errorMessage: error.message,
      error:error
    });
  }
};

module.exports = {
  createOrder,
};
