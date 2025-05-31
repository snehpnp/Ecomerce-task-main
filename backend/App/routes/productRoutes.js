const router = require("express").Router();
const {
  deleteProduct,
  updateProduct,
  getProductById,
  getAllProducts,
  addProduct,
  PaymentFunction,
  handlePaymentSuccess,
  handlePaymentCancel,
} = require("../controllers/admin/productControllers");

const {
  getPaymentsByUserId,
  getAllPayments,
} = require("../controllers/admin/paymentControllers");

router.post("/add-product", addProduct);
router.get("/get-all-products", getAllProducts);
router.post("/get-product-byId", getProductById);
router.post("/update-product", updateProduct);
router.post("/delete-product", deleteProduct);

router.post("/create-order", PaymentFunction);

router.get("/success", handlePaymentSuccess);
router.get("/cancel", handlePaymentCancel);

router.get("/getall/payment", getAllPayments);

router.get("/payment/:userId", getPaymentsByUserId);

module.exports = router;
