import { useState } from "react";
import { Link } from "react-router-dom";
import { Image as ImageIcon, X, ArrowLeft, UploadCloud } from "lucide-react";
import Button from "../../components/common/Button/Button";
import Input from "../../components/common/Input/Input";
import styles from "./CreateAlbum.module.css";

function CreateAlbum() {
  const [albumName, setAlbumName] = useState("");
  const [images, setImages] = useState([]); 
  const [error, setError] = useState("");
  const [draggedIndex, setDraggedIndex] = useState(null);

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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!albumName.trim()) {
      setError("Vui lòng nhập tên Album");
      return;
    }
    if (images.length === 0) {
      setError("Vui lòng chọn ít nhất 1 hình ảnh");
      return;
    }

    console.log("Thứ tự ảnh đã sắp xếp final:", images);
    alert(`Tạo thành công Album với thứ tự ảnh chuẩn studio!`);
  };

  return (
    <div className={styles.container}>
      <Link to="/dashboard" className={styles.backLink}>
        <ArrowLeft size={16} />
        <span>Quay lại Bàn làm việc</span>
      </Link>

      <div className={styles.pageHeader}>
        <h1>Tạo Album Nghệ Thuật Mới</h1>
        <p>Thành phẩm hiển thị theo đúng thứ tự số đánh dấu từ trái sang phải.</p>
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
            <span className={styles.subLabel}>Giữ chuột vào ảnh để kéo thả thay đổi vị trí sắp xếp số thứ tự</span>
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
          <Button type="submit" size="lg">Xuất bản Album</Button>
        </div>
      </form>
    </div>
  );
}

export default CreateAlbum;