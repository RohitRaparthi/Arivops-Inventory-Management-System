import React, { useEffect, useState } from "react";
import "./Invoices.css";

function Invoices() {

  const API_URL =
    "http://localhost:5000/api/invoices";

  const [invoices, setInvoices] =
    useState([]);

  const [search, setSearch] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {

    fetchInvoices();

  }, []);

  // =====================
  // Fetch Invoices
  // =====================

  const fetchInvoices = async () => {

    try {

      const token =
        localStorage.getItem("token");

      const response =
        await fetch(API_URL, {

          headers: {

            Authorization:
              `Bearer ${token}`,

          },

        });

      const data =
        await response.json();

      setInvoices(data);

    } catch (error) {

      console.error(error);

    } finally {

      setLoading(false);

    }

  };

  // =====================
  // Export Excel
  // =====================

  const exportExcel = async () => {

    try {

      const token =
        localStorage.getItem("token");

      const response =
        await fetch(
          "http://localhost:5000/api/export/invoices",
          {

            headers: {

              Authorization:
                `Bearer ${token}`,

            },

          }
        );

      const blob =
        await response.blob();

      const url =
        window.URL.createObjectURL(blob);

      const link =
        document.createElement("a");

      link.href = url;

      link.download =
        "Invoices.xlsx";

      link.click();

    } catch (error) {

      console.error(error);

    }

  };

  // =====================
  // Download PDF
  // =====================

  const downloadPDF = async (id) => {

    try {

      const token =
        localStorage.getItem("token");

      const response =
        await fetch(

          `${API_URL}/${id}/pdf`,

          {

            headers: {

              Authorization:
                `Bearer ${token}`,

            },

          }

        );

      const blob =
        await response.blob();

      const url =
        window.URL.createObjectURL(blob);

      const link =
        document.createElement("a");

      link.href = url;

      link.download =
        "Invoice.pdf";

      link.click();

    } catch (error) {

      console.error(error);

    }

  };

  // =====================
  // Search
  // =====================

  const filteredInvoices =
    invoices.filter((invoice) => {

      const text =
        search.toLowerCase();

      return (

        invoice.invoiceNumber
          .toLowerCase()
          .includes(text)

        ||

        invoice.order.customer.customerName
          .toLowerCase()
          .includes(text)

      );

    });
      // =====================
  // Update Payment Status
  // =====================

  const updatePayment = async (invoice) => {

    const value = prompt(
      "Enter Paid Amount",
      invoice.paidAmount
    );

    if (value === null) return;

    const paidAmount = Number(value);

    if (isNaN(paidAmount) || paidAmount < 0) {
      alert("Invalid amount");
      return;
    }

    try {

      const token =
        localStorage.getItem("token");

      await fetch(
        `${API_URL}/${invoice._id}`,
        {

          method: "PUT",

          headers: {

            "Content-Type":
              "application/json",

            Authorization:
              `Bearer ${token}`,

          },

          body: JSON.stringify({
            paidAmount,
          }),

        }
      );

      fetchInvoices();

    } catch (error) {

      console.error(error);

    }

  };

  // =====================
  // Status Badge
  // =====================

  const getStatusClass = (status) => {

    switch (status) {

      case "Paid":
        return "status-paid";

      case "Partially Paid":
        return "status-partial";

      default:
        return "status-pending";

    }

  };
  return (
  <div className="invoices-page">

    <div className="invoices-header">

      <div>
        <h2>Invoices</h2>
        <p>Manage Customer Invoices</p>
      </div>

      <div className="invoices-actions">

        <input
          type="text"
          placeholder="Search Invoice..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
        />

        <button
          className="excel-btn"
          onClick={exportExcel}
        >
          Export Excel
        </button>

      </div>

    </div>

    <div className="invoices-table-container">

      <table className="invoices-table">

        <thead>

          <tr>

            <th>Invoice No</th>

            <th>Order No</th>

            <th>Customer</th>

            <th>Total</th>

            <th>Paid</th>

            <th>Due</th>

            <th>Status</th>

            <th>Date</th>

            <th>Actions</th>

          </tr>

        </thead>

        <tbody>

          {loading ? (

            <tr>

              <td
                colSpan="9"
                className="no-data"
              >
                Loading...
              </td>

            </tr>

          ) : filteredInvoices.length === 0 ? (

            <tr>

              <td
                colSpan="9"
                className="no-data"
              >
                No Invoices Found
              </td>

            </tr>

          ) : (

            filteredInvoices.map(
              (invoice) => (

                <tr
                  key={invoice._id}
                >

                  <td>
                    {invoice.invoiceNumber}
                  </td>

                  <td>
                    {invoice.order?.orderNumber}
                  </td>

                  <td>
                    {
                      invoice.order?.customer
                        ?.customerName
                    }
                  </td>

                  <td>
                    ₹
                    {invoice.order?.grandTotal?.toFixed(
                      2
                    )}
                  </td>

                  <td>
                    ₹
                    {invoice.paidAmount.toFixed(
                      2
                    )}
                  </td>

                  <td>
                    ₹
                    {invoice.dueAmount.toFixed(
                      2
                    )}
                  </td>

                  <td>

                    <span
                      className={getStatusClass(
                        invoice.paymentStatus
                      )}
                    >
                      {
                        invoice.paymentStatus
                      }
                    </span>

                  </td>

                  <td>

                    {new Date(
                      invoice.invoiceDate
                    ).toLocaleDateString()}

                  </td>

                  <td className="action-buttons">

                    <button
                      className="pay-btn"
                      onClick={() =>
                        updatePayment(
                          invoice
                        )
                      }
                    >
                      Update
                    </button>

                    <button
                      className="pdf-btn"
                      onClick={() =>
                        downloadPDF(
                          invoice._id
                        )
                      }
                    >
                      PDF
                    </button>

                  </td>

                </tr>

              )
            )

          )}

        </tbody>

      </table>

    </div>

  </div>
);
}

export default Invoices;