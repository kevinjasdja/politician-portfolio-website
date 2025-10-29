import { useRef, useState } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import {
  Download,
  Share2,
  Facebook,
  Instagram,
  MessageCircle,
} from "lucide-react";
import { getServerURL } from "../utils/constants";

const BeneficiaryCardDisplay = ({ beneficiary }) => {
  const frontCardRef = useRef(null);
  const backCardRef = useRef(null);
  const [isSharing, setIsSharing] = useState(false);

  const imageUrl = beneficiary.photo?.startsWith("http")
    ? beneficiary.photo
    : `${getServerURL()}${beneficiary.photo}`;

  const palette = {
    orange: "#ea580c",
    green: "#15803d",
    gray300: "#d1d5db",
    gray600: "#4b5563",
    gray700: "#374151",
    gray800: "#1f2937",
    gray900: "#111827",
    white: "#ffffff",
  };

  const cardShadow = "0 24px 48px rgba(15, 23, 42, 0.35)";
  const surfaceShadow = "0 20px 40px rgba(15, 23, 42, 0.25)";

  // Standard ID card dimensions (85.6mm x 53.98mm - ISO/IEC 7810 ID-1)
  const cardWidth = "352px"; // 340
  const cardHeight = "224px"; // 214

  const sanitizeForCanvas = (element) => {
    if (!element) return [];
    const modifications = [];
    const nodes = [element, ...element.querySelectorAll("*")];

    nodes.forEach((node) => {
      const computed = window.getComputedStyle(node);

      const applyFallback = (styleProp, cssProp, fallback) => {
        const value = computed.getPropertyValue(cssProp);
        if (value && value.includes("oklch")) {
          modifications.push({
            node,
            prop: styleProp,
            previous: node.style[styleProp],
          });
          node.style[styleProp] = fallback;
        }
      };

      applyFallback("color", "color", palette.gray800);
      applyFallback("backgroundColor", "background-color", palette.white);
      applyFallback("borderColor", "border-color", palette.gray300);

      const backgroundImage = computed.getPropertyValue("background-image");
      if (backgroundImage && backgroundImage.includes("oklch")) {
        modifications.push({
          node,
          prop: "backgroundImage",
          previous: node.style.backgroundImage,
        });
        node.style.backgroundImage = "none";
        if (!computed.getPropertyValue("background-color")) {
          modifications.push({
            node,
            prop: "backgroundColor",
            previous: node.style.backgroundColor,
          });
          node.style.backgroundColor = palette.white;
        }
      }
    });

    return modifications;
  };

  const restoreSanitizedStyles = (modifications) => {
    const toKebabCase = (prop) =>
      prop.replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`);
    modifications.forEach(({ node, prop, previous }) => {
      if (previous) {
        node.style[prop] = previous;
      } else {
        node.style.removeProperty(toKebabCase(prop));
      }
    });
  };

  const composeCardImage = async (frontDataUrl, backDataUrl) => {
    const width = parseInt(cardWidth, 10);
    const height = parseInt(cardHeight, 10);
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height * 2;

    const loadImage = (src) =>
      new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = src;
      });

    const [frontImg, backImg] = await Promise.all([
      loadImage(frontDataUrl),
      loadImage(backDataUrl),
    ]);

    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(frontImg, 0, 0, width, height);
    ctx.drawImage(backImg, 0, height, width, height);

    return canvas.toDataURL("image/png", 1.0);
  };

  const captureCard = async (element) => {
    const originalStyles = {
      width: element.style.width,
      height: element.style.height,
      display: element.style.display,
    };

    // Set explicit dimensions for capture
    element.style.width = cardWidth;
    element.style.height = cardHeight;
    element.style.display = "block";

    const modifications = sanitizeForCanvas(element);

    try {
      const canvas = await html2canvas(element, {
        scale: 3,
        backgroundColor: "#ffffff",
        logging: false,
        useCORS: true,
        allowTaint: true,
        width: parseInt(cardWidth),
        height: parseInt(cardHeight),
        windowWidth: parseInt(cardWidth) + 50,
        windowHeight: parseInt(cardHeight) + 50,
        onclone: (clonedDoc, element) => {
          const textElements = element.querySelectorAll(
            "p, span, h1, h2, h3, h4, h5, h6"
          );
          textElements.forEach((el) => {
            el.style.whiteSpace = "nowrap";
            el.style.overflow = "visible";
            el.style.textOverflow = "clip";
          });
        },
      });

      return canvas.toDataURL("image/png", 1.0);
    } catch (error) {
      console.error("Error capturing card:", error);
      throw error;
    } finally {
      // Restore original styles
      element.style.width = originalStyles.width;
      element.style.height = originalStyles.height;
      element.style.display = originalStyles.display;
      restoreSanitizedStyles(modifications);
    }
  };

  const downloadCard = async (format = "image") => {
    try {
      if (format === "image") {
        const [frontImageData, backImageData] = await Promise.all([
          captureCard(frontCardRef.current),
          captureCard(backCardRef.current),
        ]);
        const combinedImage = await composeCardImage(
          frontImageData,
          backImageData
        );
        const link = document.createElement("a");
        link.download = `somgarh-card-${beneficiary.uniqueId}.png`;
        link.href = combinedImage;
        link.click();
      } else if (format === "pdf") {
        // Capture both cards separately
        const frontImageData = await captureCard(frontCardRef.current);
        const backImageData = await captureCard(backCardRef.current);

        // Create PDF with exact ID card dimensions
        const pdf = new jsPDF({
          orientation: "landscape",
          unit: "mm",
          format: [85.6 + 0.53, 53.98 + 0.53], // Exact ID card size
        });

        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();

        // Add front card
        pdf.addImage(frontImageData, "PNG", 0, 0, pdfWidth, pdfHeight);

        // Add back card as new page
        pdf.addPage();
        pdf.addImage(backImageData, "PNG", 0, 0, pdfWidth, pdfHeight);

        pdf.save(`somgarh-card-${beneficiary.uniqueId}.pdf`);
      }
    } catch (error) {
      console.error("Error downloading card:", error);
      alert("Error downloading card. Please try again.");
    }
  };

  // Generate card image for sharing
  const generateCardImageForShare = async () => {
    try {
      const [frontImageData, backImageData] = await Promise.all([
        captureCard(frontCardRef.current),
        captureCard(backCardRef.current),
      ]);
      const combinedImage = await composeCardImage(
        frontImageData,
        backImageData
      );
      return combinedImage;
    } catch (error) {
      console.error("Error generating card image:", error);
      throw error;
    }
  };

  // Share caption text
  const getShareCaption = () => {
    const websiteUrl = window.location.origin;
    return `मैंने अपना सोमगढ़ समृद्ध कार्ड बना लिया, आप भी अपना कार्ड बनाएं और 15+ योजनाओं का प्रमाणपत्र पाएं।\n\n हमारा परिवार  इस बार वोट विकास के लिए अभिषेक सर्राफ को देगा \n\n✨ अपना कार्ड बनाएं: ${websiteUrl}/beneficiary`;
  };

  // WhatsApp Share
  const shareToWhatsApp = async () => {
    setIsSharing(true);
    try {
      const caption = getShareCaption();
      const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(caption)}`;
      window.open(whatsappUrl, "_blank");
    } catch (error) {
      console.error("Error sharing to WhatsApp:", error);
      alert("Error sharing to WhatsApp. Please try again.");
    } finally {
      setIsSharing(false);
    }
  };

  // Facebook Share
  const shareToFacebook = async () => {
    setIsSharing(true);
    try {
      const imageDataUrl = await generateCardImageForShare();

      // Convert data URL to Blob
      const response = await fetch(imageDataUrl);
      const blob = await response.blob();
      const file = new File(
        [blob],
        `beneficiary-card-${beneficiary.uniqueId}.png`,
        {
          type: "image/png",
        }
      );

      // Check if Web Share API with files is supported
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: "मेरा लाभार्थी कार्ड",
          text: getShareCaption(),
        });
      } else {
        // Fallback: Open Facebook with just the link
        const websiteUrl = window.location.origin;
        const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
          websiteUrl + "/beneficiary"
        )}`;
        window.open(fbUrl, "_blank");
      }
    } catch (error) {
      console.error("Error sharing to Facebook:", error);
      // Fallback to opening Facebook share dialog
      const websiteUrl = window.location.origin;
      const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        websiteUrl + "/beneficiary"
      )}`;
      window.open(fbUrl, "_blank");
    } finally {
      setIsSharing(false);
    }
  };

  // Instagram Share
  const shareToInstagram = async () => {
    setIsSharing(true);
    try {
      const imageDataUrl = await generateCardImageForShare();

      // Convert data URL to Blob
      const response = await fetch(imageDataUrl);
      const blob = await response.blob();
      const file = new File(
        [blob],
        `beneficiary-card-${beneficiary.uniqueId}.png`,
        {
          type: "image/png",
        }
      );

      // Check if Web Share API with files is supported
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: "मेरा लाभार्थी कार्ड",
          text: getShareCaption(),
        });
      } else {
        // For Instagram, download the image and show instructions
        const link = document.createElement("a");
        link.download = `beneficiary-card-${beneficiary.uniqueId}.png`;
        link.href = imageDataUrl;
        link.click();

        alert(
          "Image downloaded! Please upload it to Instagram manually.\n\nसुझाया गया कैप्शन:\n" +
            getShareCaption()
        );
      }
    } catch (error) {
      console.error("Error sharing to Instagram:", error);
      alert("Error sharing to Instagram. Please try again.");
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <div className="space-y-6 p-4">
      {/* Card Preview Block (front + back) */}
      <div className="flex flex-col items-center justify-center">
        <div
          className="w-full flex flex-col items-center justify-center space-y-6"
          style={{ maxWidth: cardWidth }}
        >
          {/* Front Side - Fixed Size Card */}
          <div
            ref={frontCardRef}
            className="rounded-2xl overflow-hidden"
            style={{
              width: cardWidth,
              height: cardHeight,
              backgroundImage:
                "linear-gradient(135deg, #f97316 0%, #ffffff 55%, #22c55e 100%)",
              backgroundColor: "#ffffff",
              boxShadow: cardShadow,
              position: "relative",
            }}
          >
            <div className="relative w-full h-full p-4 flex flex-col justify-between">
              {/* Background Pattern */}
              <div className="absolute inset-0 pointer-events-none">
                <div
                  className="absolute right-2 top-6 bottom-14 w-20 rounded-3xl overflow-hidden"
                  style={{
                    opacity: 0.8,
                    filter: "blur(0.15px)",
                    mixBlendMode: "multiply",
                  }}
                >
                  <img
                    src="https://res.cloudinary.com/dyv8xdud5/image/upload/v1761205661/Abhishek_img_without_bgpng_jwk32x.png"
                    alt="Abhishek Sarraf image"
                    className="w-full h-full object-cover"
                    crossOrigin="anonymous"
                  />
                  <div
                    className="absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(150deg, rgba(255,255,255,0.7) 0%, rgba(250,245,237,0.55) 40%, rgba(226,252,234,0.25) 100%)",
                    }}
                  />
                </div>
              </div>

              {/* Header */}
              <div className="text-center">
                <h2
                  className="text-lg font-bold mb-1"
                  style={{
                    color: palette.orange,
                    whiteSpace: "nowrap",
                    overflow: "visible",
                  }}
                >
                  सोमगढ़ समृद्ध कार्ड
                </h2>
                <p
                  className="text-xs font-semibold"
                  style={{
                    color: palette.green,
                    whiteSpace: "nowrap",
                    overflow: "visible",
                  }}
                >
                  Somgarh Samridh Card
                </p>
              </div>

              {/* Content */}
              <div className="flex items-start gap-3 pr-16">
                {/* Photo */}
                <div
                  className="w-16 h-16 rounded-xl overflow-hidden border-4 flex-shrink-0"
                  style={{ borderColor: palette.white }}
                >
                  <img
                    src={imageUrl}
                    alt={beneficiary.name}
                    className="w-full h-full object-cover"
                    crossOrigin="anonymous"
                    onError={(e) => {
                      e.target.src =
                        'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23ddd" width="100" height="100"/%3E%3C/svg%3E';
                    }}
                  />
                </div>

                {/* Details */}
                <div className="flex-1 space-y-1 min-w-0">
                  <div>
                    <p
                      className="text-xs"
                      style={{
                        color: palette.gray600,
                        whiteSpace: "nowrap",
                        overflow: "visible",
                      }}
                    >
                      Name / नाम
                    </p>
                    <p
                      className="text-sm font-bold"
                      style={{
                        color: palette.gray800,
                        whiteSpace: "nowrap",
                        overflow: "visible",
                        textOverflow: "clip",
                      }}
                    >
                      {beneficiary.name}
                    </p>
                  </div>
                  {beneficiary.fatherName && (
                    <div>
                      <p
                        className="text-xs"
                        style={{
                          color: palette.gray600,
                          whiteSpace: "nowrap",
                          overflow: "visible",
                        }}
                      >
                        Guardian / अभिभावक
                      </p>
                      <p
                        className="text-xs font-semibold"
                        style={{
                          color: palette.gray700,
                          whiteSpace: "nowrap",
                          overflow: "visible",
                          textOverflow: "clip",
                        }}
                      >
                        {beneficiary.fatherName}
                      </p>
                    </div>
                  )}
                  <div className="flex space-x-3">
                    <div className="flex-1 min-w-0">
                      <p
                        className="text-xs"
                        style={{
                          color: palette.gray600,
                          whiteSpace: "nowrap",
                          overflow: "visible",
                        }}
                      >
                        Ward / वार्ड
                      </p>
                      <p
                        className="text-xs font-semibold"
                        style={{
                          color: palette.gray700,
                          whiteSpace: "nowrap",
                          overflow: "visible",
                          textOverflow: "clip",
                        }}
                      >
                        {beneficiary.wardNo}
                      </p>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p
                        className="text-xs"
                        style={{
                          color: palette.gray600,
                          whiteSpace: "nowrap",
                          overflow: "visible",
                        }}
                      >
                        Village / गाँव
                      </p>
                      <p
                        className="text-xs font-semibold"
                        style={{
                          color: palette.gray700,
                          whiteSpace: "nowrap",
                          overflow: "visible",
                          textOverflow: "clip",
                        }}
                      >
                        {beneficiary.village}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="flex justify-between items-end">
                <div className="min-w-0">
                  <p
                    className="text-xs"
                    style={{
                      color: palette.gray600,
                      whiteSpace: "nowrap",
                      overflow: "visible",
                    }}
                  >
                    ID Number
                  </p>
                  <p
                    className="text-sm font-bold"
                    style={{
                      color: palette.orange,
                      whiteSpace: "nowrap",
                      overflow: "visible",
                      textOverflow: "clip",
                    }}
                  >
                    {beneficiary.uniqueId}
                  </p>
                </div>
                <div className="text-right min-w-0">
                  <p
                    className="text-sm font-bold"
                    style={{
                      color: palette.gray800,
                      whiteSpace: "nowrap",
                      overflow: "visible",
                      textOverflow: "clip",
                    }}
                  >
                    अभिषेक सर्राफ
                  </p>
                  <p
                    className="text-xs"
                    style={{
                      color: palette.gray600,
                      whiteSpace: "nowrap",
                      overflow: "visible",
                      textOverflow: "clip",
                    }}
                  >
                    मुखिया प्रत्याशी
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Card Back Info - Fixed Size */}
          <div
            ref={backCardRef}
            className="rounded-2xl p-4 text-center"
            style={{
              width: cardWidth,
              height: cardHeight,
              backgroundImage:
                "linear-gradient(135deg, #22c55e 0%, #ffffff 55%, #f97316 100%)",
              backgroundColor: "#ffffff",
              boxShadow: surfaceShadow,
            }}
          >
            <div className="h-full flex flex-col justify-center px-2">
              <h3
                className="text-base font-bold mb-2"
                style={{
                  color: palette.gray800,
                  whiteSpace: "nowrap",
                  overflow: "visible",
                }}
              >
                Vote for Vikas
              </h3>
              <p
                className="text-xs mb-2 italic"
                style={{
                  color: palette.gray700,
                  whiteSpace: "normal", // wrap text
                  overflow: "visible",
                  textAlign: "center",
                }}
              >
                "Hamara Sapna, Bihar ka No.1 Panchayat ho Apna"
              </p>

              {/* Additional Text */}
              <p
                className="text-[10px] mb-2"
                style={{
                  color: palette.gray800,
                  whiteSpace: "normal",
                  overflow: "visible",
                  textAlign: "center",
                }}
              >
                यह समृद्ध कार्ड इस बात की गारंटी देता है कि हमारी जीत आप सभी
                जनता जनार्दन की जीत होगी। मैं अपने 15+ संकल्पित कार्यों को जल्द
                से जल्द पूरा करूंगा।
              </p>
              <p
                className="text-[10px] mb-2"
                style={{
                  color: palette.gray600,
                  whiteSpace: "normal",
                  overflow: "visible",
                  textAlign: "center",
                }}
              >
                Note: इस कार्ड को खो जाने या मिलने पर Address: Abhishek Sarraf
                के office, Samhauta, West Champaran, 845449 पर भेजें।
              </p>

              <p
                className="text-sm font-bold mb-1"
                style={{
                  color: palette.orange,
                  whiteSpace: "nowrap",
                  overflow: "visible",
                }}
              >
                अभिषेक सर्राफ
              </p>
              <p
                className="text-xs"
                style={{
                  color: palette.gray600,
                  whiteSpace: "nowrap",
                  overflow: "visible",
                }}
              >
                📞 +91-9572740290
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Social Share Buttons */}
      <div className="flex flex-col items-center space-y-3">
        <h3 className="text-lg font-semibold text-gray-700 flex items-center space-x-2">
          <Share2 size={20} />
          <span>अपना कार्ड शेयर करें</span>
        </h3>
        <div className="flex justify-center items-center space-x-4">
          {/* WhatsApp Share */}
          <button
            onClick={shareToWhatsApp}
            disabled={isSharing}
            className="group flex flex-col items-center space-y-2 p-4 rounded-xl bg-green-50 hover:bg-green-100 transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            title="Share on WhatsApp"
          >
            <div className="bg-green-500 p-3 rounded-full group-hover:shadow-lg transition-shadow">
              <MessageCircle size={24} className="text-white" />
            </div>
            <span className="text-xs font-medium text-green-700">WhatsApp</span>
          </button>

          {/* Facebook Share */}
          <button
            onClick={shareToFacebook}
            disabled={isSharing}
            className="group flex flex-col items-center space-y-2 p-4 rounded-xl bg-blue-50 hover:bg-blue-100 transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            title="Share on Facebook"
          >
            <div className="bg-blue-600 p-3 rounded-full group-hover:shadow-lg transition-shadow">
              <Facebook size={24} className="text-white" />
            </div>
            <span className="text-xs font-medium text-blue-700">Facebook</span>
          </button>

          {/* Instagram Share */}
          <button
            onClick={shareToInstagram}
            disabled={isSharing}
            className="group flex flex-col items-center space-y-2 p-4 rounded-xl bg-pink-50 hover:bg-pink-100 transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            title="Share on Instagram"
          >
            <div className="bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500 p-3 rounded-full group-hover:shadow-lg transition-shadow">
              <Instagram size={24} className="text-white" />
            </div>
            <span className="text-xs font-medium text-pink-700">Instagram</span>
          </button>
        </div>
        {isSharing && (
          <p className="text-sm text-gray-500 animate-pulse">
            कृपया प्रतीक्षा करें...
          </p>
        )}
      </div>

      {/* Download Buttons */}
      <div className="flex flex-col sm:flex-row justify-center gap-4">
        <button
          onClick={() => downloadCard("image")}
          className="flex items-center justify-center space-x-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
        >
          <Download size={20} />
          <span>Download as Image</span>
        </button>
        <button
          onClick={() => downloadCard("pdf")}
          className="flex items-center justify-center space-x-2 bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
        >
          <Download size={20} />
          <span>Download as PDF</span>
        </button>
      </div>
    </div>
  );
};

export default BeneficiaryCardDisplay;
