import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Shirt, DollarSign, X, ArrowLeft, UploadCloud, Save } from "lucide-react";
import Button from "../../components/common/Button/Button";
import Input from "../../components/common/Input/Input";
import styles from "./EditCostume.module.css";
import costumeService from "../../services/costumeService"; // 🚨 ĐÃ THAY THẾ MOCK BẰNG SERVICE THẬT
import imageCompression from "browser-image-compression";

function EditCostume() {
  const { id } = useParams(); // Lấy ID trang phục từ URL
  const navigate = useNavigate();

  const [costumeName, setCostumeName] = useState("");
  const [price, setPrice] = useState(""); 
  const [image, setImage] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  // Trạng thái hiển thị Custom Toast Notification tone sáng
  const [showToast, setShowToast] = useState(false);

  // Hàm helper dùng để format số tiền có dấu phẩy và đuôi VND
  const formatMoney = (numberString) => {
    const rawValue = String(numberString).replace(/\D/g, "");
    if (!rawValue) return "";
    const formattedNumber = new Intl.NumberFormat("en-US").format(rawValue);
    return `${formattedNumber} VND`;
  };

  // 1. Đọc dữ liệu thật của trang phục từ MongoDB lên Form dựa vào ID
  useEffect(() => {
    const fetchCostumeDetails = async () => {
      try {
        setFetching(true);
        const response = await costumeService.getAllCostumes();
        // Tìm đúng trang phục cụ thể dựa vào ID trên thanh URL
        const currentCostume = response.find(item => item._id === id);
        
        if (currentCostume) {
          setCostumeName(currentCostume.name);
          setPrice(formatMoney(currentCostume.price)); // Định dạng ngay khi load dữ liệu lên
          setImage({
            previewUrl: currentCostume.imageUrl, // Link ảnh từ Cloudinary
            isExisting: true // Đánh dấu ảnh cũ đã có trên hệ thống
          });
        } else {
          setError("Không tìm thấy dữ liệu trang phục cần chỉnh sửa!");
        }
      } catch (err) {
        console.error("Lỗi lấy chi tiết trang phục:", err);
        setError("Không thể tải thông tin chi tiết trang phục từ server.");
      } finally {
        setFetching(false);
      }
    };

    fetchCostumeDetails();
  }, [id]);

  // Xử lý khi gõ giá thuê mới
  const handlePriceChange = (e) => {
    setError("");
    setPrice(formatMoney(e.target.value));
  };

  // Xử lý khi thay tấm ảnh thẻ QR mới
  const handleImageChange = (e) => {
    setError("");
    const file = e.target.files[0];
    if (!file) return;

    setImage({
      file,
      previewUrl: URL.createObjectURL(file),
      isExisting: false
    });
  };

  const handleRemoveImage = () => {
    if (image && !image.isExisting && image.file) {
      URL.revokeObjectURL(image.previewUrl);
    }
    setImage(null);
  };

  // 2. Gửi dữ liệu cập nhật đồng bộ lên Server
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!costumeName.trim()) return setError("Vui lòng nhập tên trang phục");
    if (!price.trim()) return setError("Vui lòng nhập giá thuê công khai");
    if (!image) return setError("Vui lòng tải lên ảnh thẻ trang phục");

    try {
      setLoading(true);
      setError("");

      // Tách lấy số nguyên thuần túy để gửi lên server cập nhật (VD: 2500000)
      const rawPriceValue = price.replace(/\D/g, "");

      const formData = new FormData();
      formData.append("name", costumeName);
      formData.append("price", rawPriceValue);

      if (!image.isExisting && image.file) {
        // Khối A: Admin tải lên ảnh MỚI -> Nén ngầm ngầm 1.5MB rồi append file
        const compressionOptions = {
          maxSizeMB: 1.5,
          maxWidthOrHeight: 2000,
          useWebWorker: true,
        };
        console.log(`Tiến hành nén ảnh mới thêm: ${image.file.name}`);
        const compressedFile = await imageCompression(image.file, compressionOptions);
        formData.append("image", compressedFile);
      } else {
        // Khối B: Giữ nguyên ảnh CŨ -> Gửi lại URL cũ cho Backend hứng
        formData.append("imageUrl", image.previewUrl);
      }

      // Gửi request cập nhật PUT lên Backend thông qua costumeService
      const data = await costumeService.updateCostume(id, formData);

      if (data.success) {
        // Kích hoạt Toast thông báo mượt mà
        setShowToast(true);

        if (!image.isExisting && image.file) {
          URL.revokeObjectURL(image.previewUrl);
        }

        // Tạo độ trễ 2 giây để Admin nhìn thấy Toast rồi mới điều hướng về Dashboard
        setTimeout(() => {
          setShowToast(false);
          navigate("/dashboard");
        }, 2000);
      }
    } catch (err) {
      console.error(err);
      setError("Cập nhật dữ liệu thất bại, vui lòng kiểm tra lại mạng hoặc file ảnh!");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <div style={{ padding: "2rem", textAlign: "center", color: "#3d322a", fontWeight: 600 }}>Đang đồng bộ dữ liệu gốc trang phục...</div>;

  return (
    <div className={styles.container}>
      <Link to="/dashboard" className={styles.backLink}>
        <ArrowLeft size={16} />
        <span>Quay lại Bàn làm việc</span>
      </Link>

      <div className={styles.pageHeader}>
        <h1>Chỉnh Sửa Trang Phục</h1>
        <p>Cập nhật lại tên bộ đồ, thay đổi giá thuê công khai hoặc cập nhật thiết kế ảnh QR mới.</p>
      </div>

      <form onSubmit={handleSubmit} className={styles.formStructure}>
        {error && <div className={styles.errorBanner}>{error}</div>}

        <div className={styles.fieldsGroup}>
          <Input
            id="costumeName"
            label="Tên Trang Phục"
            type="text"
            placeholder="Nhập tên trang phục"
            value={costumeName}
            onChange={(e) => setCostumeName(e.target.value)}
            icon={<Shirt size={18} />}
          />

          <Input
            id="costumePrice"
            label="Giá Thuê Công Khai"
            type="text"
            placeholder="Ví dụ: 2,500,000 VND"
            value={price}
            onChange={handlePriceChange}
            icon={<DollarSign size={18} />}
          />
        </div>

        <div className={styles.uploadSection}>
          <label className={styles.sectionLabel}>Hình ảnh thẻ trang phục</label>
          
          <div className={styles.uploadContainer}>
            {!image ? (
              <label className={styles.uploadTrigger}>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className={styles.hiddenInput}
                />
                <UploadCloud size={32} className={styles.uploadIcon} />
                <span className={styles.uploadText}>Tải ảnh đồ lên</span>
                <span className={styles.uploadSubText}>Ảnh đứng chứa mã QR mới</span>
              </label>
            ) : (
              <div className={styles.imageCard}>
                <img src={image.previewUrl} alt="Costume Preview" />
                <button
                  type="button"
                  className={styles.removeBtn}
                  onClick={handleRemoveImage}
                  title="Xóa và chọn ảnh khác"
                >
                  <X size={14} />
                </button>
              </div>
            )}
          </div>
        </div>

        <div className={styles.actionRow}>
          <Button type="submit" size="lg" disabled={loading}>
            <Save size={16} style={{ marginRight: "8px", verticalAlign: "middle" }} />
            {loading ? "Đang lưu trữ mây..." : "Lưu thay đổi"}
          </Button>
        </div>
      </form>

      {/* --- TIMING TOAST NOTIFICATION PHỐI MÀU SÁNG SANG TRỌNG --- */}
      {showToast && (
        <div className={styles.toastContainer}>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', background: 'rgba(34, 197, 94, 0.1)', padding: '6px', borderRadius: '50%' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </div>
          <div className={styles.toastContent}>Cập nhật thông tin trang phục thành công! 🎉</div>
        </div>
      )}
    </div>
  );
}

export default EditCostume;