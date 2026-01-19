import React from "react";
import successImg from "../../../assets/icons/successImg.png";
import successImg1 from "../../../assets/icons/successImg2.png";
import successImg2 from "../../../assets/icons/successPath.png";
import closeIcon from "../../../assets/icons/close.png";

const SuccessModal = ({
  open,
  onClose,
  title,
  description,
  statusImage = "success",
  closeImage = true, 
  showButton = false,
  buttonText = "OK",
  onButtonClick,
}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="relative w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
        {closeImage && (
          <button onClick={onClose} className="absolute right-4 top-4 p-1">
            <img src={closeIcon} alt="close" className="w-6 h-6" />
          </button>
        )}

        {statusImage && (
          <div className="relative flex justify-center mb-6">
            <img src={successImg} alt="success" className="w-48 h-48 z-10" />

            <img
              src={successImg1}
              alt="decoration"
              className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48"
            />

            <img
              src={successImg2}
              alt="decoration"
              className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-60"
            />
          </div>
        )}

        <h2 className="text-center text-xl font-bold text-gray-900">{title}</h2>

        {description && (
          <p className="mt-2 text-center text-sm text-gray-500">
            {description}
          </p>
        )}

        {showButton && (
          <button
            onClick={onButtonClick}
            className="mt-6 w-full rounded-xl bg-blue px-6 py-3 text-white font-semibold hover:opacity-90 transition"
          >
            {buttonText}
          </button>
        )}
      </div>
    </div>
  );
};

export default SuccessModal;
