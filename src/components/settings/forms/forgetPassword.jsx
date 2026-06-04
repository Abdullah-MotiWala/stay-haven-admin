import React, { useState } from "react";
import { Input, Button } from "antd";
import { openNotification } from "../../../network/notification";
import { changePasswordApi } from "../../../services/auth";

const ChangePassword = () => {
  const [loading, setLoading] = useState(false);
  const [fields, setFields] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!fields.currentPassword) newErrors.currentPassword = "Please enter current password";
    if (!fields.newPassword) newErrors.newPassword = "Please enter new password";
    if (!fields.confirmPassword) newErrors.confirmPassword = "Please confirm your password";
    if (fields.newPassword && fields.confirmPassword &&
      fields.newPassword.trim() !== fields.confirmPassword.trim()) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (key, value) => {
    setFields((prev) => ({ ...prev, [key]: value.trim() }));
    setErrors((prev) => ({ ...prev, [key]: "" }));
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setLoading(true);
    try {
      const res = await changePasswordApi({
        currentPassword: fields.currentPassword,
        newPassword: fields.newPassword,
        confirmPassword: fields.confirmPassword,
      });

      if (res?.status === 200 || res?.status === 201 || res?.data?.success) {
        openNotification("success", "Password changed successfully!");
        setFields({ currentPassword: "", newPassword: "", confirmPassword: "" });
        setErrors({});
      } else {
        const msg = res?.data?.message
          || res?.data?.meta?.message
          || res?.data?.error
          || "Failed to update password";
        openNotification("error", msg);
      }
    } catch (err) {
      openNotification("error", err?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h3 className="text-lg font-semibold mb-6">Change Password</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">Current Password</label>
          <Input.Password
            value={fields.currentPassword}
            onChange={(e) => handleChange("currentPassword", e.target.value)}
            placeholder="Enter current password"
            className="h-12"
          />
          {errors.currentPassword && <span className="text-red-500 text-xs">{errors.currentPassword}</span>}
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">New Password</label>
          <Input.Password
            value={fields.newPassword}
            onChange={(e) => handleChange("newPassword", e.target.value)}
            placeholder="Enter new password"
            className="h-12"
          />
          {errors.newPassword && <span className="text-red-500 text-xs">{errors.newPassword}</span>}
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">Confirm Password</label>
          <Input.Password
            value={fields.confirmPassword}
            onChange={(e) => handleChange("confirmPassword", e.target.value)}
            placeholder="Confirm new password"
            className="h-12"
          />
          {errors.confirmPassword && <span className="text-red-500 text-xs">{errors.confirmPassword}</span>}
        </div>

      </div>

      <Button
        type="primary"
        loading={loading}
        onClick={handleSubmit}
        className="bg-blue h-12 px-8 mt-4 hover:!bg-lightRed hover:!text-red transition-all"
      >
        Update Password
      </Button>
    </div>
  );
};

export default ChangePassword;