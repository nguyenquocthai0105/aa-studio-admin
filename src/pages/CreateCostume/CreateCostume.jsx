import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Shirt, DollarSign, X, ArrowLeft, UploadCloud } from "lucide-react";
import Button from "../../components/common/Button/Button";
import Input from "../../components/common/Input/Input";
import styles from "./CreateCostume.module.css";

function CreateCostume() {
  const navigate = useNavigate();
  const [costumeName, setCostumeName] = useState("");
  const [price, setPrice] = useState(""); // Lưu giá trị đã được format để hiển thị (VD: 2,500,000 VND)
  const [image, setImage] = useState(null);
  const [error, setError] = useState("");

  // --- HÀM TỰ ĐỘNG FORMAT TIỀN KHI GÕ ---
  const handlePriceChange = (e) => {
    setError("");
    let value = e.target.value;

    // 1. Chỉ giữ lại các chữ số, loại bỏ chữ VND cũ và dấu phẩy cũ
    const rawValue = value.replace(/\D/g, "");

    // Nếu người dùng xóa hết số thì trả về chuỗi rỗng
    if (!rawValue) {
      setPrice("");
      return;
    }

    // 2. Định dạng dấu phẩy hàng nghìn
    const formattedNumber = new Intl.NumberFormat("en-US").format(rawValue);

    // 3. Nối thêm đuôi VND vào để hiển thị trực quan
    setPrice(`${formattedNumber} VND`);
  };

  const handleImageChange = (e) => {
    setError("");
    const file = e.target.files[0];
    if (!file) return;

    setImage({
      file,
      previewUrl: URL.createObjectURL(file),
    });
  };

  const handleRemoveImage = () => {
    if (image) URL.revokeObjectURL(image.previewUrl);
    setImage(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!costumeName.trim()) {
      setError("Vui lòng nhập tên trang phục");
      return;
    }
    if (!price.trim()) {
      setError("Vui lòng nhập giá thuê công khai");
      return;
    }
    if (!image) {
      setError("Vui lòng tải lên ảnh thẻ trang phục");
      return;
    }

    // MẸO: Tách lấy chuỗi số nguyên thuần túy gửi lên Database (VD: "2500000")
    const rawPriceValue = price.replace(/\D/g, "");

    const formData = {
      name: costumeName,
      price: rawPriceValue, // Gửi số thuần túy lên backend cho dễ tính toán
      file: image.file
    };

    console.log("Dữ liệu trang phục mới gửi lên hệ thống Á À Studio:", formData);
    alert(`Đã thêm thành công trang phục: ${costumeName}!`);
    navigate("/dashboard");
  };

  return (
    <div className={styles.container}>
      <Link to="/dashboard" className={styles.backLink}>
        <ArrowLeft size={16} />
        <span>Quay lại Bàn làm việc</span>
      </Link>

      <div className={styles.pageHeader}>
        <h1>Thêm Trang Phục Mới</h1>
        <p>Tải lên hình ảnh thiết kế chứa sẵn đồ, mã QR định danh và bảng giá chi tiết.</p>
      </div>

      <form onSubmit={handleSubmit} className={styles.formStructure}>
        {error && <div className={styles.errorBanner}>{error}</div>}

        <div className={styles.fieldsGroup}>
          <Input
            id="costumeName"
            label="Tên Trang Phục"
            type="text"
            placeholder="Ví dụ: Váy Cưới Cúp Ngực Taffeta"
            value={costumeName}
            onChange={(e) => setCostumeName(e.target.value)}
            icon={<Shirt size={18} />}
          />

          {/* Ô NHẬP GIÁ ĐÃ ĐƯỢC CẤP NHẬT LOGIC FORMAT */}
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
                <span className={styles.uploadSubText}>Ảnh định dạng đứng (chứa QR & Giá sẵn)</span>
              </label>
            ) : (
              <div className={styles.imageCard}>
                <img src={image.previewUrl} alt="Costume Preview" />
                <button
                  type="button"
                  className={styles.removeBtn}
                  onClick={handleRemoveImage}
                  title="Xóa ảnh và chọn lại"
                >
                  <X size={12} />
                </button>
              </div>
            )}
          </div>
        </div>

        <div className={styles.actionRow}>
          <Button type="submit" size="lg">Kích hoạt Trang phục</Button>
        </div>
      </form>
    </div>
  );
}

export default CreateCostume;