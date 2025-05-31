const db = require("../../models");
const PaymentModel = db.payment;
const user = db.user;


const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

class PaymentController {
  // ✅ 1. Get all payments
  async getAllPayments(req, res) {
    try {
      const payments = await PaymentModel.find({});

      res.status(200).json({
        success: true,
        message: "All payments fetched successfully",
        data: payments,
      });
    } catch (error) {
      console.error("Error fetching payments:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch payments",
        error: error.message,
      });
    }
  }

  // ✅ 2. Get payments by user ID
  // ✅ 2. Get payments by user ID
async getPaymentsByUserId(req, res) {
  const { userId } = req.params;

  let UserRole = await user.findOne({ _id: userId }).select("role");


  let Match = {};
  if (UserRole.role === "ADMIN") {

    Match = {};
  }else{
    Match = { user_id: new ObjectId(userId) };
  }


  try {
const userPayments = await PaymentModel.aggregate([
  {
    $match: Match
  },
  {
    $sort: { createdAt: -1 }
  },
  {
    $lookup: {
      from: "products",             
      localField: "product_id",   
      foreignField: "_id",          
      as: "productDetails"
    }
  },
  {
    $unwind: "$productDetails"      
  },
   {
    $lookup: {
      from: "users",             
      localField: "user_id",   
      foreignField: "_id",          
      as: "usersDetails"
    }
  },
  {
    $unwind: "$usersDetails"      
  },
  {
    $project: {
      amount: 1,
      status: 1,
      payment_method: 1,
      createdAt: 1,
      "productDetails.name": 1  ,  
      "usersDetails.FullName": 1     
    }
  }
]);
   

    res.status(200).json({
      success: true,
      message: `Payments for user ID: ${userId}`,
      data: userPayments,
    });
  } catch (error) {
    console.error("Error fetching user payments:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch user payments",
      error: error.message,
    });
  }
}

}

module.exports = new PaymentController();
