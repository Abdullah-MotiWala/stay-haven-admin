import { Input } from "antd";

const NEEDS_REASON = ["inactive", "maintenance", "deactivate"];

export const needsReason = (status) =>
  NEEDS_REASON.includes(status?.toLowerCase());

const StatusReasonModal = ({ open, status, reason, onChange, onConfirm, onCancel, loading }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-xl">
        <h3 className="text-lg font-bold text-gray-900 mb-1 capitalize">
          Set Status: {status}
        </h3>
        <p className="text-sm text-gray-500 mb-5">
          Please provide a reason. The host will receive an email notification.
        </p>
        <Input.TextArea
          rows={3}
          placeholder="e.g. Violation of terms of service"
          value={reason}
          onChange={(e) => onChange(e.target.value)}
          className="mb-4"
        />
        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-6 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading || !reason.trim()}
            className="px-6 py-2 bg-red text-white rounded-lg text-sm font-medium hover:opacity-90 disabled:opacity-50"
          >
            {loading ? "Processing..." : "Confirm & Notify"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default StatusReasonModal;
