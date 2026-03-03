import ApiFormData from "../../network/ApiFormData";

export const uploadSingleMedia = async (data) => {
    return ApiFormData.post("upload/image", data);
};

export const uploadMultipleMedia = async (data) => {
    return ApiFormData.post("upload/images", data);
};