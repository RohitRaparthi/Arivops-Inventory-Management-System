const ExcelJS = require("exceljs");
const Product = require("../models/Product");

// ===========================================
// Export Products to Excel
// ===========================================
const exportProducts = async (req, res) => {
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
        header: "Created Date",
        key: "createdAt",
        width: 20,
      },
    ];

    // ================= Header Style =================
    const headerRow = worksheet.getRow(1);

    headerRow.height = 24;

    headerRow.font = {
      bold: true,
      color: {
        argb: "FFFFFFFF",
      },
    };

    headerRow.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: {
        argb: "2563EB",
      },
    };

    headerRow.alignment = {
      horizontal: "center",
      vertical: "middle",
    };

    // ================= Data =================
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

    // ================= Currency Format =================
    worksheet.getColumn(6).numFmt = '₹#,##0.00';
    worksheet.getColumn(7).numFmt = '₹#,##0.00';

    // ================= Center Alignment =================
    worksheet.eachRow((row, rowNumber) => {
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

        if (rowNumber !== 1) {
          cell.alignment = {
            vertical: "middle",
            horizontal: "center",
          };
        }
      });
    });

    worksheet.views = [
      {
        state: "frozen",
        ySplit: 1,
      },
    ];

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

module.exports = {
  exportProducts,
};