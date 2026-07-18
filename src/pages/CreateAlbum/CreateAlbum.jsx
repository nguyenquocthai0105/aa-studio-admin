import { useState } from "react";
import { Link } from "react-router-dom";
import { Image as ImageIcon, X, ArrowLeft, UploadCloud } from "lucide-react";
import Button from "../../components/common/Button/Button";
import Input from "../../components/common/Input/Input";
import styles from "./CreateAlbum.module.css";
import axiosClient from "../../services/api";
import imageCompression from "browser-image-compression";

function CreateAlbum() {
  const [albumName, setAlbumName] = useState("");
  const [images, setImages] = useState([]);
  const [error, setError] = useState("");
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // Trạng thái hiển thị Custom Toast Notification
  const [showToast, setShowToast] = useState(false);

  const handleImageChange = (e) => {
    setError("");
    const files = Array.from(e.target.files);

    if (images.length + files.length > 15) {
      setError("Một album chỉ được phép chứa tối đa 15 hình ảnh!");
      return;
    }

    const newImages = files.map((file) => ({
      file,
      previewUrl: URL.createObjectURL(file),
    }));

    setImages((prevImages) => [...prevImages, ...newImages]);
  };

  const handleRemoveImage = (indexToRemove) => {
    setImages((prevImages) => {
      URL.revokeObjectURL(prevImages[indexToRemove].previewUrl);
      return prevImages.filter((_, index) => index !== indexToRemove);
    });
    setError("");
  };

  // --- LOGIC KÉO THẢ ĐỔI VỊ TRÍ VÀ THỨ TỰ (DRAG & DROP) ---
  const handleDragStart = (index) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e, index) => {
    e.preventDefault(); // Bắt buộc phải có để kích hoạt thả
    if (draggedIndex === null || draggedIndex === index) return;

    // Tiến hành hoán đổi vị trí chèn trong mảng
    const updatedImages = [...images];
    const draggedItem = updatedImages[draggedIndex];

    // Xóa item cũ và chèn vào vị trí mới (Tự động đẩy các ảnh khác sang phải)
    updatedImages.splice(draggedIndex, 1);
    updatedImages.splice(index, 0, draggedItem);

    setDraggedIndex(index);
    setImages(updatedImages);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!albumName.trim()) return setError("Vui lòng nhập tên Album");
    if (images.length === 0)
      return setError("Vui lòng chọn ít nhất 1 hình ảnh");

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("name", albumName);

      // Cấu hình tiêu chuẩn nén ảnh máy cơ tại Frontend xuống tầm 1.5MB
      const compressionOptions = {
        maxSizeMB: 1.5,
        maxWidthOrHeight: 2000,
        useWebWorker: true,
      };

      // Duyệt qua mảng ảnh, nén từng file theo đúng thứ tự rồi mới append vào FormData
      for (const img of images) {
        console.log(
          `Dung lượng gốc của ${img.file.name}: ${(img.file.size / 1024 / 1024).toFixed(2)} MB`,
        );

        // Tiến hành nén ngầm trên trình duyệt
        const compressedFile = await imageCompression(
          img.file,
          compressionOptions,
        );

        console.log(
          `Dung lượng sau nén: ${(compressedFile.size / 1024 / 1024).toFixed(2)} MB`,
        );
        formData.append("images", compressedFile);
      }

      // Gọi API gửi đi như bình thường
      const response = await axiosClient.post("/albums", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data.success) {
        // Kích hoạt hiển thị Toast thông báo xịn sò
        setShowToast(true);

        // Reset trạng thái form
        setAlbumName("");
        images.forEach((img) => URL.revokeObjectURL(img.previewUrl));
        setImages([]);

        // Tự động ẩn toast sau 3 giây
        setTimeout(() => {
          setShowToast(false);
        }, 3000);
      }
    } catch (err) {
      console.error(err);
      setError("Lỗi trong quá trình xử lý hoặc upload ảnh máy cơ!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <Link to="/dashboard" className={styles.backLink}>
        <ArrowLeft size={16} />
        <span>Quay lại Bàn làm việc</span>
      </Link>

      <div className={styles.pageHeader}>
        <h1>Tạo Album Nghệ Thuật Mới</h1>
        <p>
          Thành phẩm hiển thị theo đúng thứ tự số đánh dấu từ trái sang phải.
        </p>
      </div>

      <form onSubmit={handleSubmit} className={styles.formStructure}>
        {error && <div className={styles.errorBanner}>{error}</div>}

        <div className={styles.inputSection}>
          <Input
            id="albumName"
            label="Tên Album Ảnh"
            type="text"
            placeholder="Ví dụ: Concept Nắng Thủy Tinh"
            value={albumName}
            onChange={(e) => setAlbumName(e.target.value)}
            icon={<ImageIcon size={18} />}
          />
        </div>

        <div className={styles.uploadSection}>
          <div className={styles.sectionLabel}>
            <span>Hình ảnh trưng bày ({images.length}/15)</span>
            <span className={styles.subLabel}>
              Giữ chuột vào ảnh để kéo thả thay đổi vị trí sắp xếp số thứ tự
            </span>
          </div>

          <div className={styles.gridContainer}>
            {/* Render các tấm ảnh có khả năng kéo thả */}
            {images.map((img, index) => (
              <div
                key={index}
                className={`${styles.imageCard} ${draggedIndex === index ? styles.dragging : ""}`}
                draggable
                onDragStart={() => handleDragStart(index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDragEnd={handleDragEnd}
              >
                {/* Số thứ tự đánh bên trái */}
                <span className={styles.indexNumber}>{index + 1}</span>

                <img src={img.previewUrl} alt={`Preview ${index}`} />

                {index === 0 && <span className={styles.coverBadge}>BÌA</span>}

                {/* Dấu X xóa bên phải */}
                <button
                  type="button"
                  className={styles.removeBtn}
                  onClick={() => handleRemoveImage(index)}
                  title="Xóa ảnh"
                >
                  <X size={12} />
                </button>
              </div>
            ))}

            {/* Khung bấm chọn file ảnh (Fix cứng kích thước 136x156px) */}
            {images.length < 15 && (
              <label className={styles.uploadTrigger}>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
                  className={styles.hiddenInput}
                />
                <UploadCloud size={24} className={styles.uploadIcon} />
                <span className={styles.uploadText}>Thêm ảnh</span>
              </label>
            )}
          </div>
        </div>

        <div className={styles.actionRow}>
          <Button type="submit" size="lg" disabled={loading}>
            {loading ? "Đang nén & xuất bản..." : "Xuất bản Album"}
          </Button>
        </div>
      </form>

      {/* --- CUSTOM TOAST NOTIFICATION --- */}
      {showToast && (
        <div className={styles.toastContainer}>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', background: 'rgba(34, 197, 94, 0.1)', padding: '6px', borderRadius: '50%' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </div>
          <div className={styles.toastContent}>Xuất bản Album thành công! 🎉</div>
        </div>
      )}
    </div>
  );
}

export default CreateAlbum;