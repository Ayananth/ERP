import { useEffect, useMemo, useRef, useState } from "react";

import Alert from "../../components/common/Alert";
import { getCompanySettings, updateCompanySettings } from "../../api/companySettingsApi";

const normalizeImageUrl = (value) => {
  if (!value) return "";
  if (value.startsWith("blob:") || value.startsWith("data:")) return value;
  if (value.startsWith("http://") || value.startsWith("https://")) return value;
  const baseUrl = "http://localhost:8000/" || "";
  return `${baseUrl}${value}`;
};

export default function CompanySettingsPage() {
  const [companyName, setCompanyName] = useState("");
  const [headerImage, setHeaderImage] = useState("");
  const [footerImage, setFooterImage] = useState("");
  const [headerFile, setHeaderFile] = useState(null);
  const [footerFile, setFooterFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const headerObjectUrlRef = useRef("");
  const footerObjectUrlRef = useRef("");
  const headerInputRef = useRef(null);
  const footerInputRef = useRef(null);


useEffect(()=>{
  console.log("Header URL:", headerImage);
console.log("Footer URL:", footerImage);
}, [headerImage, footerImage])

  useEffect(() => {
    let cancelled = false;

    const loadSettings = async () => {
      try {
        const data = await getCompanySettings();
        if (cancelled) return;

        setCompanyName(data?.company_name ?? "");
        setHeaderImage(normalizeImageUrl(data?.header_image ?? ""));
        setFooterImage(normalizeImageUrl(data?.footer_image ?? ""));
      } catch (error) {
        if (cancelled) return;
        setMessage({
          type: "error",
          text: error?.response?.data?.message ?? "Failed to load company settings.",
        });
      }
    };

    loadSettings();

    return () => {
      cancelled = true;
      if (headerObjectUrlRef.current) {
        URL.revokeObjectURL(headerObjectUrlRef.current);
      }
      if (footerObjectUrlRef.current) {
        URL.revokeObjectURL(footerObjectUrlRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!message.text) return;
    const timer = setTimeout(() => setMessage({ type: "", text: "" }), 5000);
    return () => clearTimeout(timer);
  }, [message]);

  const selectedHeaderPreview = useMemo(() => headerImage, [headerImage]);
  const selectedFooterPreview = useMemo(() => footerImage, [footerImage]);

  const handleHeaderChange = (event) => {
    const file = event.target.files?.[0] ?? null;
    setHeaderFile(file);

    if (headerObjectUrlRef.current) {
      URL.revokeObjectURL(headerObjectUrlRef.current);
      headerObjectUrlRef.current = "";
    }

    if (file) {
      const objectUrl = URL.createObjectURL(file);
      headerObjectUrlRef.current = objectUrl;
      setHeaderImage(objectUrl);
    } else {
      setHeaderImage("");
    }
  };

  const handleFooterChange = (event) => {
    const file = event.target.files?.[0] ?? null;
    setFooterFile(file);

    if (footerObjectUrlRef.current) {
      URL.revokeObjectURL(footerObjectUrlRef.current);
      footerObjectUrlRef.current = "";
    }

    if (file) {
      const objectUrl = URL.createObjectURL(file);
      footerObjectUrlRef.current = objectUrl;
      setFooterImage(objectUrl);
    } else {
      setFooterImage("");
    }
  };

  const handleSave = async (event) => {
    event.preventDefault();
    if (saving) return;

    setSaving(true);
    setMessage({ type: "", text: "" });

    try {
      const formData = new FormData();
      formData.append("company_name", companyName);

      if (headerFile) {
        formData.append("header_image", headerFile);
      }

      if (footerFile) {
        formData.append("footer_image", footerFile);
      }

      const data = await updateCompanySettings(formData);
      if (headerObjectUrlRef.current) {
        URL.revokeObjectURL(headerObjectUrlRef.current);
        headerObjectUrlRef.current = "";
      }
      if (footerObjectUrlRef.current) {
        URL.revokeObjectURL(footerObjectUrlRef.current);
        footerObjectUrlRef.current = "";
      }
      setCompanyName(data?.company_name ?? "");
      setHeaderImage(normalizeImageUrl(data?.header_image ?? ""));
      setFooterImage(normalizeImageUrl(data?.footer_image ?? ""));
      setHeaderFile(null);
      setFooterFile(null);
      if (headerInputRef.current) headerInputRef.current.value = "";
      if (footerInputRef.current) footerInputRef.current.value = "";
      setMessage({
        type: "success",
        text: "Company settings saved successfully.",
      });
    } catch (error) {
      const backendMessage =
        error?.response?.data?.message ||
        error?.response?.data?.detail ||
        "Failed to save company settings.";
      setMessage({ type: "error", text: backendMessage });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl">
      <Alert
        type={message.type}
        message={message.text}
        onClose={() => setMessage({ type: "", text: "" })}
      />

      <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-6 py-4">
          <h1 className="text-xl font-semibold text-slate-900">Company Settings</h1>
          <p className="mt-1 text-sm text-slate-500">
            Manage the company name and the PDF header/footer images used in sales documents.
          </p>
        </div>

        <form onSubmit={handleSave} className="space-y-6 p-6">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Company Name
            </label>
            <input
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="h-11 w-full rounded-md border border-slate-200 px-3 text-sm outline-none transition focus:border-slate-400"
              placeholder="Enter company name"
            />
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">
                Header Image
              </label>
              <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-3">
                {selectedHeaderPreview ? (
                  <img
                    src={selectedHeaderPreview}
                    alt="Header preview"
                    className="max-h-40 w-full object-contain"
                  />
                ) : (
                  <div className="flex h-40 items-center justify-center text-sm text-slate-400">
                    No header image selected
                  </div>
                )}
              </div>
              <input
                ref={headerInputRef}
                type="file"
                accept="image/*"
                onChange={handleHeaderChange}
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">
                Footer Image
              </label>
              <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-3">
                {selectedFooterPreview ? (
                  <img
                    src={selectedFooterPreview}
                    alt="Footer preview"
                    className="max-h-40 w-full object-contain"
                  />
                ) : (
                  <div className="flex h-40 items-center justify-center text-sm text-slate-400">
                    No footer image selected
                  </div>
                )}
              </div>
              <input
                ref={footerInputRef}
                type="file"
                accept="image/*"
                onChange={handleFooterChange}
              />
            </div>
          </div>

          <div className="flex justify-end border-t border-slate-200 pt-4">
            <button
              type="submit"
              disabled={saving}
              className="rounded-md bg-emerald-500 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
