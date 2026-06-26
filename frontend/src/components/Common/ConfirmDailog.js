import React from "react";
import { FaExclamationTriangle } from "react-icons/fa";
import "./ConfirmDialog.css";
import Button from "./Button";

const ConfirmDialog = ({
  open,
  title = "Confirm Action",
  message = "Are you sure?",
  confirmText = "Delete",
  cancelText = "Cancel",
  loading = false,
  onConfirm,
  onCancel,
}) => {
  if (!open) return null;

  return (
    <div className="confirm-overlay">
      <div className="confirm-dialog">

        <div className="confirm-icon">
          <FaExclamationTriangle />
        </div>

        <h2>{title}</h2>

        <p>{message}</p>

        <div className="confirm-actions">

          <Button
            variant="secondary"
            onClick={onCancel}
            disabled={loading}
          >
            {cancelText}
          </Button>

          <Button
            variant="danger"
            loading={loading}
            onClick={onConfirm}
          >
            {confirmText}
          </Button>

        </div>

      </div>
    </div>
  );
};

export default ConfirmDialog;