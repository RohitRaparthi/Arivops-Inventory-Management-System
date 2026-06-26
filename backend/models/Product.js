const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    sku: {
      type: String,
      required: true,
      unique: true,
    },
    productName: {
      type: String,
      required: true,
    },
    variant: {
      type: String,
      required: true,
    },
    currentStock: {
      type: Number,
      required: true,
      default: 0,
    },
    reorderLevel: {
      type: Number,
      required: true,
    },
    costPrice: {
      type: Number,
      required: true,
    },
    sellingPrice: {
      type: Number,
      required: true,
    },
    stockHealth: {
      type: String,
      enum: ['green', 'amber', 'red'],
      default: 'green',
    },
  },
  { timestamps: true }
);

// Update stockHealth based on currentStock
productSchema.pre("save", async function () {
  if (this.currentStock === 0) {
    this.stockHealth = "red";
  } else if (this.currentStock <= this.reorderLevel) {
    this.stockHealth = "amber";
  } else {
    this.stockHealth = "green";
  }
});

module.exports = mongoose.model("Product", productSchema);