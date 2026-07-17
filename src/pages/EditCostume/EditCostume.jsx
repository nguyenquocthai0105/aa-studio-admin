import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Shirt, DollarSign, X, ArrowLeft, UploadCloud, Save } from "lucide-react";
import Button from "../../components/common/Button/Button";
import Input from "../../components/common/Input/Input";
import styles from "./EditCostume.module.css";

function EditCostume() {
  const { id } = useParams(); // Lấy ID trang phục từ URL
  const navigate = useNavigate();

  const [costumeName, setCostumeName] = useState("");
  const [price, setPrice] = useState(""); 
  const [image, setImage] = useState(null);
  const [error, setError] = useState("");

  // Hàm helper dùng để format số tiền có dấu phẩy và đuôi VND
  const formatMoney = (numberString) => {
    const rawValue = numberString.replace(/\D/g, "");
    if (!rawValue) return "";
    const formattedNumber = new Intl.NumberFormat("en-US").format(rawValue);
    return `${formattedNumber} VND`;
  };

  // Giả lập lấy dữ liệu cũ của trang phục từ database lên dựa vào ID
  useEffect(() => {
    const mockCostumeData = {
      id: id,
      name: "Váy Cưới Cúp Ngực Taffeta (Cũ)",
      price: "2500000", // Giá số nguyên thuần túy từ DB
      previewUrl: "https://images.unsplash.com/photo-1594552072238-b8a33785b261?w=500"
    };

    setCostumeName(mockCostumeData.name);
    setPrice(formatMoney(mockCostumeData.price)); // Định dạng ngay khi load dữ liệu lên
    setImage({
      previewUrl: mockCostumeData.previewUrl,
      isExisting: true // Đánh dấu ảnh cũ đã có trên hệ thống
    });
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
    if (image && !image.isExisting) {
      URL.revokeObjectURL(image.previewUrl);
    }
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

    // Tách lấy số nguyên thuần túy để gửi lên server cập nhật
    const rawPriceValue = price.replace(/\D/g, "");

    const formData = {
      costumeId: id,
      name: costumeName,
      price: rawPriceValue,
      image: image.isExisting ? "existing" : image.file
    };

    console.log("Cập nhật thông tin đồ thành công lên hệ thống Á À Studio:", formData);
    alert("Đã lưu mọi thay đổi của trang phục!");
    navigate("/dashboard");
  };

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
                  <X size={12} />
                </button>
              </div>
            )}
          </div>
        </div>

        <div className={styles.actionRow}>
          <Button type="submit" size="lg">
            <Save size={16} style={{ marginRight: "8px", verticalAlign: "middle" }} />
            Lưu thay đổi
          </Button>
        </div>
      </form>
    </div>
  );
}

export default EditCostume;