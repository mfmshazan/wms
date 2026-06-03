import { Modal } from "../ui/Modal";
import { Button } from "../ui/Button";

/**
 * DeleteConfirm — confirmation dialog before deleting a product.
 * Calls onConfirm() — does NOT touch CRUD directly.
 */
export function DeleteConfirm({ product, onConfirm, onClose }) {
  if (!product) return null;

  return (
    <Modal title="Delete Product" onClose={onClose}>
      <div className="flex flex-col gap-5">
        {/* Warning icon */}
        <div className="flex items-center justify-center">
          <div className="w-14 h-14 rounded-full bg-red-900/30 border border-red-800/40 flex items-center justify-center">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="w-7 h-7 text-wms-red"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
              />
            </svg>
          </div>
        </div>

        {/* Message */}
        <div className="text-center">
          <p className="text-sm text-wms-text font-sans">
            Are you sure you want to delete
          </p>
          <p className="font-mono font-bold text-wms-text mt-1">
            {product.name}
          </p>
          <p className="font-mono text-xs text-wms-muted mt-0.5">
            {product.sku}
          </p>
          <p className="text-xs text-wms-muted mt-3">
            This action cannot be undone.
          </p>
        </div>

        {/* Divider */}
        <div className="border-t border-wms-border" />

        {/* Actions */}
        <div className="flex items-center justify-end gap-3">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="danger" onClick={onConfirm} id="confirm-delete-btn">
            Delete
          </Button>
        </div>
      </div>
    </Modal>
  );
}
