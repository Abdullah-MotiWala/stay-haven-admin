import React, { useState, useEffect, useRef } from "react";
import { Spin } from "antd";
import { Plus, Trash2, ImagePlus } from "lucide-react";
import { getSocialLinks, createSocialLink, updateSocialLink, deleteSocialLink } from "../../../services/socialLinks";
import { uploadSingleMedia } from "../../../services/uploads";
import { openNotification } from "../../../network/notification";

const inputCls = "w-full h-10 px-3 border border-gray-200 rounded-lg text-sm font-medium outline-none focus:border-blue transition-colors";
const labelCls = "text-xs font-semibold text-gray-500 mb-1 block";

const EMPTY_LINK = { id: null, platform: "", url: "", icon: "", sortOrder: 0 };

const SocialLinks = () => {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [uploadingIdx, setUploadingIdx] = useState(null);
  const fileRefs = useRef({});

  useEffect(() => { fetchLinks(); }, []);

  const fetchLinks = async () => {
    try {
      const res = await getSocialLinks();
      const data = res?.data?.data || res?.data || [];
      setLinks(Array.isArray(data) && data.length > 0 ? data : [{ ...EMPTY_LINK }]);
    } catch {
      openNotification("error", "Failed to load social links");
      setLinks([{ ...EMPTY_LINK }]);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (index, field, value) => {
    setLinks((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleIconUpload = async (index, file) => {
    if (!file) return;
    setUploadingIdx(index);
    try {
      const formData = new FormData();
      formData.append("image", file);
      const res = await uploadSingleMedia(formData);
      const url = res?.data?.data?.url;
      if (!url) throw new Error("No URL returned");
      handleChange(index, "icon", url);
    } catch {
      openNotification("error", "Failed to upload icon");
    } finally {
      setUploadingIdx(null);
      if (fileRefs.current[index]) fileRefs.current[index].value = "";
    }
  };

  const addLink = () => {
    setLinks((prev) => [...prev, { ...EMPTY_LINK, sortOrder: prev.length }]);
  };

  const removeLink = async (index) => {
    const item = links[index];
    if (item.id) {
      setDeletingId(item.id);
      try {
        await deleteSocialLink(item.id);
        openNotification("success", "Social link deleted");
      } catch {
        openNotification("error", "Failed to delete");
        setDeletingId(null);
        return;
      }
      setDeletingId(null);
    }
    setLinks((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    const invalid = links.find((l) => !l.platform.trim() || !l.url.trim());
    if (invalid) {
      openNotification("error", "Platform and URL are required for all entries");
      return;
    }
    setSaving(true);
    try {
      for (const item of links) {
        const payload = {
          platform: item.platform,
          url: item.url,
          icon: item.icon || "",
          sortOrder: Number(item.sortOrder) || 0,
        };
        if (item.id) {
          await updateSocialLink(item.id, payload);
        } else {
          const res = await createSocialLink(payload);
          item.id = res?.data?.data?.id || res?.data?.id;
        }
      }
      openNotification("success", "Social links saved successfully");
      fetchLinks();
    } catch {
      openNotification("error", "Failed to save social links");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="flex justify-center p-10"><Spin /></div>;

  return (
    <div>
      <h3 className="text-lg font-semibold mb-1">Social Links</h3>
      <p className="text-sm text-gray-400 mb-6">Manage your platform social media links shown publicly.</p>

      <div className="space-y-4">
        {links.map((item, index) => (
          <div key={index} className="flex flex-col md:flex-row gap-3 items-end p-4 bg-gray-50 rounded-xl border border-gray-100">
            <div className="flex-1 min-w-0">
              <label className={labelCls}>Platform *</label>
              <input
                className={inputCls}
                placeholder="e.g. Facebook"
                value={item.platform}
                onChange={(e) => handleChange(index, "platform", e.target.value)}
              />
            </div>

            <div className="flex-1 min-w-0">
              <label className={labelCls}>URL *</label>
              <input
                className={inputCls}
                placeholder="https://facebook.com/page"
                value={item.url}
                onChange={(e) => handleChange(index, "url", e.target.value)}
              />
            </div>

            {/* Icon upload */}
            <div className="w-40 flex-shrink-0">
              <label className={labelCls}>Icon</label>
              <div
                onClick={() => fileRefs.current[index]?.click()}
                className="flex items-center gap-2 h-10 px-3 m-0 border border-gray-200 rounded-lg bg-white cursor-pointer hover:border-blue transition-colors"
              >
                {uploadingIdx === index ? (
                  <Spin size="small" />
                ) : item.icon ? (
                  <img src={item.icon} alt="icon" className="w-6 h-6 object-contain bg-gray-300 rounded flex-shrink-0" />
                ) : (
                  <ImagePlus size={16} className="text-black flex-shrink-0" />
                )}
                <span className="text-sm text-black truncate">
                  {uploadingIdx === index ? "Uploading..." : item.icon ? "Change icon" : "Upload icon"}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  ref={(el) => (fileRefs.current[index] = el)}
                  onChange={(e) => handleIconUpload(index, e.target.files[0])}
                />
              </div>
            </div>

            <div className="w-28 flex-shrink-0">
              <label className={labelCls}>Sort Order</label>
              <input
                type="number"
                className={inputCls}
                placeholder="0"
                value={item.sortOrder}
                onChange={(e) => handleChange(index, "sortOrder", e.target.value)}
              />
            </div>

            <div className="flex items-end flex-shrink-0">
              <button
                type="button"
                onClick={() => removeLink(index)}
                disabled={deletingId === item.id}
                className="h-10 w-10 flex items-center justify-center rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition disabled:opacity-40"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between mt-6">
        <button
          type="button"
          onClick={addLink}
          className="flex items-center gap-2 px-4 py-2 border border-blue text-blue rounded-lg text-sm font-semibold hover:bg-blue hover:text-white transition"
        >
          <Plus size={16} /> Add More
        </button>

        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="px-8 py-2 bg-blue text-white rounded-lg text-sm font-semibold hover:opacity-90 transition disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Links"}
        </button>
      </div>
    </div>
  );
};

export default SocialLinks;
