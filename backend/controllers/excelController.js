const ExcelJS = require("exceljs");
const Product = require("../models/Product");

// ===========================================
// Export Products to Excel
// ===========================================
exports.exportProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({
      productName: 1,
    });

    const workbook = new ExcelJS.Workbook();

    workbook.creator = "ArviOps";
    workbook.company = "ArviOps Inventory Management";
    workbook.created = new Date();

    const worksheet = workbook.addWorksheet("Products");

    worksheet.columns = [
      {
        header: "SKU",
        key: "sku",
        width: 18,
      },
      {
        header: "Product Name",
        key: "productName",
        width: 30,
      },
      {
        header: "Variant",
        key: "variant",
        width: 20,
      },
      {
        header: "Current Stock",
        key: "currentStock",
        width: 18,
      },
      {
        header: "Reorder Level",
        key: "reorderLevel",
        width: 18,
      },
      {
        header: "Cost Price",
        key: "costPrice",
        width: 18,
      },
      {
        header: "Selling Price",
        key: "sellingPrice",
        width: 18,
      },
      {
        header: "Stock Health",
        key: "stockHealth",
        width: 18,
      },
      {
        header: "Created",
        key: "createdAt",
        width: 22,
      },
    ];

    // ==========================
    // Header Styling
    // ==========================
    worksheet.getRow(1).font = {
      bold: true,
      color: {
        argb: "FFFFFFFF",
      },
    };

    worksheet.getRow(1).fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: {
        argb: "2563EB",
      },
    };

    worksheet.getRow(1).alignment = {
      vertical: "middle",
      horizontal: "center",
    };

    // ==========================
    // Data Rows
    // ==========================
    products.forEach((product) => {
      worksheet.addRow({
        sku: product.sku,
        productName: product.productName,
        variant: product.variant,
        currentStock: product.currentStock,
        reorderLevel: product.reorderLevel,
        costPrice: product.costPrice,
        sellingPrice: product.sellingPrice,
        stockHealth:
          product.stockHealth.charAt(0).toUpperCase() +
          product.stockHealth.slice(1),
        createdAt: new Date(
          product.createdAt
        ).toLocaleDateString(),
      });
    });

    // ==========================
    // Borders
    // ==========================
    worksheet.eachRow((row) => {
      row.eachCell((cell) => {
        cell.border = {
          top: {
            style: "thin",
          },
          left: {
            style: "thin",
          },
          bottom: {
            style: "thin",
          },
          right: {
            style: "thin",
          },
        };
      });
    });

    // ==========================
    // Freeze Header
    // ==========================
    worksheet.views = [
      {
        state: "frozen",
        ySplit: 1,
      },
    ];

    // ==========================
    // Download
    // ==========================
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    res.setHeader(
      "Content-Disposition",
      'attachment; filename="products.xlsx"'
    );

    await workbook.xlsx.write(res);

    res.end();

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: error.message,
    });
  }
};