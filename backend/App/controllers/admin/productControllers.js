const db = require("../../models");

const Stripe = require("stripe");
const Product = db.product;
const PaymentModel = db.payment;

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

class ProductController {
  async addProduct(req, res) {
    const { name, description, price, image_url, offer_price } = req.body;

    if (
      !name ||
      !description ||
      !price ||
      !offer_price ||
      image_url.length == 0
    ) {
      return res.send({
        status: false,
        data: [],
        message: "All fields are required",
      });
    }

    try {
      const newProduct = new Product({
        name,
        description,
        price,
        image_url,
        offer_price,
      });

      await newProduct.save();
      return res.send({
        status: true,
        message: "Product added successfully",
        data: newProduct,
      });
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: "Error adding product",
        error: error.message,
      });
    }
  }

  async getAllProducts(req, res) {
    try {
      const products = await Product.find()
        .populate("name")
        .sort({ createdAt: -1 })
        .lean();

      if (products.length === 0) {
        return res.send({
          status: false,
          data: [],
          message: "No products found",
        });
      }

      return res.send({
        status: true,
        data: products,
        message: "Products fetched successfully",
      });
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: "Error fetching products",
        error: error.message,
      });
    }
  }

  async getProductById(req, res) {
    const { id } = req.body;

    try {
      const product = await Product.findById(id).populate(
        "category_id",
        "name"
      );
      if (!product) {
        return res.send({
          status: false,
          data: [],
          message: "Product not found",
        });
      }
      return res.send({
        status: true,
        data: product,
        message: "Product fetched successfully",
      });
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: "Error fetching product",
        error: error.message,
      });
    }
  }

  async updateProduct(req, res) {
    const { _id, name, description, price, image_url, stock } = req.body;

    try {
      const product = await Product.findById(_id);
      if (!product) {
        return res.send({
          status: false,
          data: [],
          message: "Product not found",
        });
      }

      const updatedProduct = await Product.findByIdAndUpdate(
        _id,
        {
          name,
          description,
          price,
          stock,
          image_url,
        },
        { new: true }
      );

      return res.send({
        status: true,
        data: updatedProduct,
        message: "Product updated successfully",
      });
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: "Error updating product",
        error: error.message,
      });
    }
  }

  async deleteProduct(req, res) {
    const { _id } = req.body;
    try {
      const product = await Product.findById(_id);
      if (!product) {
        return res.send({
          status: false,
          data: [],
          message: "Product not found",
        });
      }

      await Product.findByIdAndDelete(_id);
      return res.send({
        status: true,
        data: [],
        message: "Product deleted successfully",
      });
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: "Error deleting product",
        error: error.message,
      });
    }
  }

  async PaymentFunction(req, res) {
    try {
      const { items } = req.body;

      let user_id1 = items.user_id;

      const product = await Product.findById(items.id);
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }

      const totalAmount = product.price * items.quantity;

      const validatedItems = [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: product.name, 
            },
            unit_amount: product.price * 100,
          },
          quantity: items.quantity,
        },
      ];

      const paymentData = new PaymentModel({
        user_id: user_id1,
        order_id: null,
        product_id: product._id, 
        quantity: items.quantity, 
        amount: totalAmount,
        payment_method: "credit_card",
        status: "pending",
      });
      await paymentData.save();

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: validatedItems,
        mode: "payment",
        success_url: `http://localhost:8080/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `http://localhost:8080/cancel`,
        metadata: {
          payment_id: paymentData._id.toString(),
          user_id: user_id1.toString(),
          product_id: product._id.toString(),
        },
      });

      res.json({ id: session.id, payment_id: paymentData._id });
    } catch (error) {
      console.error("Stripe Payment Error", error);
      res.status(500).json({ error: "Payment initialization failed" });
    }
  }

  async handlePaymentSuccess(req, res) {
    try {
      const session_id = req.query.session_id;

      if (!session_id) {
        return res
          .status(400)
          .json({ success: false, message: "Missing session_id" });
      }
      const session = await stripe.checkout.sessions.retrieve(session_id);
      console.log(session.metadata);

      const paymentId = session.metadata.payment_id;

      console.log("Session retrieved:", session);

      const payment = await PaymentModel.findById(paymentId);
      if (!payment) {
        return res
          .status(404)
          .json({ success: false, message: "Payment not found" });
      }

      payment.status = "completed";
      payment.order_id = session.id; 
      await payment.save();

      res.redirect("http://localhost:5173/#/success?payment_id=" + payment._id);
    } catch (error) {
      console.error("Success handler error:", error);
      res
        .status(500)
        .json({ success: false, message: "Internal Server Error" });
    }
  }

  async handlePaymentCancel(req, res) {
    res.send({
      success: false,
      message: "Payment cancelled by user",
    });
  }
}
module.exports = new ProductController();
