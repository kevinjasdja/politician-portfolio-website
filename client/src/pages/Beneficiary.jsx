import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  CreditCard,
  Upload,
  Search,
  Loader2,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { beneficiaryAPI } from "../utils/api";
import BeneficiaryCardDisplay from "../components/BeneficiaryCardDisplay";
import { updatePageMeta, pageSEO } from "../utils/seo";

const Beneficiary = () => {
  const [activeTab, setActiveTab] = useState("make"); // 'make' or 'verify'

  useEffect(() => {
    // Update SEO meta tags for beneficiary page
    updatePageMeta({
      ...pageSEO.beneficiary,
      canonicalUrl: window.location.origin + "/beneficiary",
    });
  }, []);

  // Make Card State
  const [makeFormData, setMakeFormData] = useState({
    name: "",
    fatherName: "",
    wardNo: "",
    village: "",
    mobile: "",
    email: "",
    photo: null,
  });
  const [photoPreview, setPhotoPreview] = useState(null);
  const [makeLoading, setMakeLoading] = useState(false);
  const [makeSuccess, setMakeSuccess] = useState(false);
  const [makeError, setMakeError] = useState("");
  const [createdCard, setCreatedCard] = useState(null);

  // Verify Card State
  const [verifyFormData, setVerifyFormData] = useState({
    name: "",
    mobile: "",
  });
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [verifyError, setVerifyError] = useState("");
  const [verifiedCard, setVerifiedCard] = useState(null);

  // Handle Make Card Form
  const handleMakeChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "photo" && files && files[0]) {
      const file = files[0];
      setMakeFormData({ ...makeFormData, photo: file });

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setMakeFormData({ ...makeFormData, [name]: value });
    }
    setMakeError("");
  };

  const handleMakeSubmit = async (e) => {
    e.preventDefault();
    setMakeLoading(true);
    setMakeError("");

    if (!makeFormData.photo) {
      setMakeError("Please upload a photo before submitting.");
      setMakeLoading(false);
      return;
    }

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", makeFormData.name);
      formDataToSend.append("fatherName", makeFormData.fatherName);
      formDataToSend.append("wardNo", makeFormData.wardNo);
      formDataToSend.append("village", makeFormData.village);
      formDataToSend.append("mobile", makeFormData.mobile);
      if (makeFormData.email)
        formDataToSend.append("email", makeFormData.email);
      formDataToSend.append("photo", makeFormData.photo);

      const response = await beneficiaryAPI.create(formDataToSend);

      if (response.data.success) {
        setMakeSuccess(true);
        setCreatedCard(response.data.data);

        // Reset form
        setMakeFormData({
          name: "",
          fatherName: "",
          wardNo: "",
          village: "",
          mobile: "",
          email: "",
          photo: null,
        });
        setPhotoPreview(null);
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        "Failed to create card. Please try again.";

      setMakeError(errorMessage);

      if (err.response?.status === 409) {
        setActiveTab("verify");
        setVerifyFormData((prev) => ({
          ...prev,
          name: makeFormData.name,
          mobile: makeFormData.mobile,
        }));
      }
    } finally {
      setMakeLoading(false);
    }
  };

  // Handle Verify Card Form
  const handleVerifyChange = (e) => {
    setVerifyFormData({
      ...verifyFormData,
      [e.target.name]: e.target.value,
    });
    setVerifyError("");
  };

  const handleVerifySubmit = async (e) => {
    e.preventDefault();
    setVerifyLoading(true);
    setVerifyError("");
    setVerifiedCard(null);

    try {
      const response = await beneficiaryAPI.verify(verifyFormData);

      if (response.data.success) {
        setVerifiedCard(response.data.data);
      }
    } catch (err) {
      setVerifyError(
        err.response?.data?.message || "Beneficiary card not found."
      );
    } finally {
      setVerifyLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-orange-500 to-green-500 text-white py-12 sm:py-16">
        <div className="section-container text-center">
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex justify-center mb-4">
              <CreditCard size={48} />
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
              सोमगढ़ समृद्ध कार्ड
            </h1>
            <p className="text-lg sm:text-xl text-orange-50 max-w-2xl mx-auto">
              Somgarh Samridh Card - Your Gateway to Development
            </p>
            <div className="mt-6 h-1 w-24 bg-white mx-auto rounded-full" />
          </motion.div>
        </div>
      </section>

      {/* Tab Section */}
      <section className="py-12 sm:py-20">
        <div className="section-container">
          <div className="mx-auto max-w-4xl">
            {/* Tabs */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <button
                onClick={() => {
                  setActiveTab("make");
                  setMakeSuccess(false);
                  setCreatedCard(null);
                }}
                className={`flex-1 py-4 px-6 rounded-lg font-bold transition-all duration-300 flex items-center justify-center space-x-2 ${
                  activeTab === "make"
                    ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg"
                    : "bg-white text-gray-700 hover:bg-gray-50 shadow"
                }`}
              >
                <Upload size={20} />
                <span>Make Beneficiary Card</span>
              </button>
              <button
                onClick={() => {
                  setActiveTab("verify");
                  setVerifiedCard(null);
                }}
                className={`flex-1 py-4 px-6 rounded-lg font-bold transition-all duration-300 flex items-center justify-center space-x-2 ${
                  activeTab === "verify"
                    ? "bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg"
                    : "bg-white text-gray-700 hover:bg-gray-50 shadow"
                }`}
              >
                <Search size={20} />
                <span>Verify Beneficiary</span>
              </button>
            </div>

            {/* Make Card Form */}
            {activeTab === "make" && !createdCard && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="card-surface card-padding"
              >
                <h3 className="text-center text-red-500 font-bold text-lg">
                  कृपया सभी जानकारी सत्य/सही भरें, अन्यथा एडमिन द्वारा आपका
                  कार्ड हटा दिया जाएगा।
                </h3>
                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                  Create Your Beneficiary Card
                </h2>

                {makeError && (
                  <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded flex items-start">
                    <AlertCircle
                      className="text-red-500 mr-3 flex-shrink-0"
                      size={24}
                    />
                    <p className="text-red-800">{makeError}</p>
                  </div>
                )}

                <form onSubmit={handleMakeSubmit} className="space-y-6">
                  {/* Photo Upload */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      अपना फोटो अपलोड करें/Self Photo{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <div className="flex flex-col items-center space-y-4">
                      {photoPreview && (
                        <div className="w-32 h-32 rounded-lg overflow-hidden border-4 border-orange-200">
                          <img
                            src={photoPreview}
                            alt="Preview"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <label className="cursor-pointer bg-orange-50 border-2 border-dashed border-orange-300 rounded-lg p-6 w-full hover:bg-orange-100 transition-colors text-center">
                        <Upload
                          className="mx-auto text-orange-500 mb-2"
                          size={32}
                        />
                        <p className="text-sm text-gray-600">
                          Click to upload photo
                        </p>
                        <input
                          type="file"
                          name="photo"
                          accept="image/*"
                          onChange={handleMakeChange}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Name */}
                    <div className="sm:col-span-2">
                      <label
                        htmlFor="name"
                        className="block text-sm font-semibold text-gray-700 mb-2"
                      >
                        Name / नाम <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={makeFormData.name}
                        onChange={handleMakeChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                    </div>

                    {/* Father's Name */}
                    <div className="sm:col-span-2">
                      <label
                        htmlFor="fatherName"
                        className="block text-sm font-semibold text-gray-700 mb-2"
                      >
                        Father or Husband / पिता या पति का नाम
                      </label>
                      <input
                        type="text"
                        id="fatherName"
                        name="fatherName"
                        value={makeFormData.fatherName}
                        onChange={handleMakeChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                    </div>

                    {/* Ward No */}
                    <div>
                      <label
                        htmlFor="wardNo"
                        className="block text-sm font-semibold text-gray-700 mb-2"
                      >
                        Ward No / वार्ड नं{" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="wardNo"
                        name="wardNo"
                        value={makeFormData.wardNo}
                        onChange={handleMakeChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                    </div>

                    {/* Village */}
                    <div>
                      <label
                        htmlFor="village"
                        className="block text-sm font-semibold text-gray-700 mb-2"
                      >
                        Village / गाँव <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="village"
                        name="village"
                        value={makeFormData.village}
                        onChange={handleMakeChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                    </div>

                    {/* Mobile */}
                    <div>
                      <label
                        htmlFor="mobile"
                        className="block text-sm font-semibold text-gray-700 mb-2"
                      >
                        Mobile Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        id="mobile"
                        name="mobile"
                        value={makeFormData.mobile}
                        onChange={handleMakeChange}
                        required
                        pattern="[0-9]{10}"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-semibold text-gray-700 mb-2"
                      >
                        Email (Optional)
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={makeFormData.email}
                        onChange={handleMakeChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={makeLoading}
                    className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-4 rounded-lg font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center space-x-2"
                  >
                    {makeLoading ? (
                      <>
                        <Loader2 className="animate-spin" size={20} />
                        <span>Creating Card...</span>
                      </>
                    ) : (
                      <>
                        <CreditCard size={20} />
                        <span>Generate Card</span>
                      </>
                    )}
                  </button>
                </form>
              </motion.div>
            )}

            {/* Created Card Display */}
            {activeTab === "make" && createdCard && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="card-surface card-padding"
              >
                <div className="mb-6 bg-green-50 border-l-4 border-green-500 p-4 rounded flex items-start">
                  <CheckCircle
                    className="text-green-500 mr-3 flex-shrink-0"
                    size={24}
                  />
                  <div>
                    <p className="font-semibold text-green-800">
                      Card Created Successfully!
                    </p>
                    <p className="text-sm text-green-700">
                      Your Unique ID:{" "}
                      <span className="font-bold">{createdCard.uniqueId}</span>
                    </p>
                  </div>
                </div>

                <BeneficiaryCardDisplay beneficiary={createdCard} />

                <button
                  onClick={() => setCreatedCard(null)}
                  className="mt-6 w-full bg-gray-600 text-white py-3 rounded-lg font-semibold hover:bg-gray-700 transition-colors"
                >
                  Create Another Card
                </button>
              </motion.div>
            )}

            {/* Verify Card Form */}
            {activeTab === "verify" && !verifiedCard && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="card-surface card-padding"
              >
                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                  Verify Your Beneficiary Card
                </h2>

                {verifyError && (
                  <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded flex items-start">
                    <AlertCircle
                      className="text-red-500 mr-3 flex-shrink-0"
                      size={24}
                    />
                    <p className="text-red-800">{verifyError}</p>
                  </div>
                )}

                <form onSubmit={handleVerifySubmit} className="space-y-6">
                  <div>
                    <label
                      htmlFor="verify-name"
                      className="block text-sm font-semibold text-gray-700 mb-2"
                    >
                      Name / नाम <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="verify-name"
                      name="name"
                      value={verifyFormData.name}
                      onChange={handleVerifyChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Enter your name as on card"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="verify-mobile"
                      className="block text-sm font-semibold text-gray-700 mb-2"
                    >
                      Mobile Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      id="verify-mobile"
                      name="mobile"
                      value={verifyFormData.mobile}
                      onChange={handleVerifyChange}
                      required
                      pattern="[0-9]{10}"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="10-digit mobile number"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={verifyLoading}
                    className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-4 rounded-lg font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center space-x-2"
                  >
                    {verifyLoading ? (
                      <>
                        <Loader2 className="animate-spin" size={20} />
                        <span>Verifying...</span>
                      </>
                    ) : (
                      <>
                        <Search size={20} />
                        <span>Verify Card</span>
                      </>
                    )}
                  </button>
                </form>
              </motion.div>
            )}

            {/* Verified Card Display */}
            {activeTab === "verify" && verifiedCard && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="card-surface card-padding"
              >
                <div className="mb-6 bg-green-50 border-l-4 border-green-500 p-4 rounded flex items-start">
                  <CheckCircle
                    className="text-green-500 mr-3 flex-shrink-0"
                    size={24}
                  />
                  <div>
                    <p className="font-semibold text-green-800">
                      Card Verified Successfully!
                    </p>
                  </div>
                </div>

                <BeneficiaryCardDisplay beneficiary={verifiedCard} />

                <button
                  onClick={() => setVerifiedCard(null)}
                  className="mt-6 w-full bg-gray-600 text-white py-3 rounded-lg font-semibold hover:bg-gray-700 transition-colors"
                >
                  Verify Another Card
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Beneficiary;
