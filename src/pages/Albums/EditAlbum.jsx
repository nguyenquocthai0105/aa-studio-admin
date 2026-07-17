import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Image as ImageIcon, X, ArrowLeft, UploadCloud, Save } from "lucide-react";
import Button from "../../components/common/Button/Button";
import Input from "../../components/common/Input/Input";
import styles from "./EditAlbum.module.css";

function EditAlbum() {
  const { id } = useParams(); // Lấy ID album từ URL để biết đang sửa album nào
  const navigate = useNavigate();

  const [albumName, setAlbumName] = useState("");
  const [images, setImages] = useState([]); 
  const [error, setError] = useState("");
  const [draggedIndex, setDraggedIndex] = useState(null);

  // Giả lập việc fetch dữ liệu cũ của Album từ Database lên dựa vào ID
  useEffect(() => {
    // Đây là dữ liệu mẫu mô phỏng dữ liệu cũ đã có của Á À Studio
    const mockAlbumData = {
      id: id,
      name: "Concept Nắng Thủy Tinh (Cũ)",
      existingImages: [
        { id: "img-1", previewUrl: "https://images.unsplash.com/photo-1519741497674-611481863552?w=500" },
        { id: "img-2", previewUrl: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=500" }
      ]
    };

    setAlbumName(mockAlbumData.name);
    setImages(mockAlbumData.existingImages);
  }, [id]);

  // Xử lý khi chọn thêm ảnh mới vào bộ sưu tập cũ
  const handleImageChange = (e) => {
    setError("");
    const files = Array.from(e.target.files);
    
    if (images.length + files.length > 15) {
      setError("Một album chỉ được phép chứa tối đa 15 hình ảnh!");
      return;
    }

    const newImages = files.map((file) => ({
      file,
      // Tạo URL tạm thời để hiển thị preview cho ảnh mới upload
      previewUrl: URL.createObjectURL(file),
    }));

    setImages((prevImages) => [...prevImages, ...newImages]);
  };

  // Xóa ảnh (Áp dụng cho cả ảnh cũ sẵn có lẫn ảnh mới thêm)
  const handleRemoveImage = (indexToRemove) => {
    setImages((prevImages) => {
      // Nếu là ảnh mới chọn (có file thực tế), thu hồi bộ nhớ URL preview
      if (prevImages[indexToRemove].file) {
        URL.revokeObjectURL(prevImages[indexToRemove].previewUrl);
      }
      return prevImages.filter((_, index) => index !== indexToRemove);
    });
    setError("");
  };

  // --- HTML5 DRAG & DROP LOGIC (Giữ nguyên trải nghiệm mượt mà bong bóng số) ---
  const handleDragStart = (index) => setDraggedIndex(index);

  const handleDragOver = (e, index) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const updatedImages = [...images];
    const draggedItem = updatedImages[draggedIndex];
    
    updatedImages.splice(draggedIndex, 1);
    updatedImages.splice(index, 0, draggedItem);
    
    setDraggedIndex(index);
    setImages(updatedImages);
  };

  const handleDragEnd = () => setDraggedIndex(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!albumName.trim()) {
      setError("Tên Album không được để trống");
      return;
    }
    if (images.length === 0) {
      setError("Album phải có ít nhất 1 hình ảnh trưng bày");
      return;
    }

    // Đóng gói dữ liệu chỉnh sửa bao gồm thứ tự ảnh mới để cập nhật Database
    console.log("Cập nhật Album thành công với thứ tự mới:", {
      albumId: id,
      name: albumName,
      images: images
    });

    alert("Đã lưu mọi thay đổi của Album thành công!");
    navigate("/dashboard");
  };

  return (
    <div className={styles.container}>
      <Link to="/dashboard" className={styles.backLink}>
        <ArrowLeft size={16} />
        <span>Quay lại Bàn làm việc</span>
      </Link>

      <div className={styles.pageHeader}>
        <h1>Chỉnh sửa Album</h1>
        <p>Thay đổi tên, sắp xếp lại thứ tự hoặc thêm/xóa ảnh trong bộ sưu tập.</p>
      </div>

      <form onSubmit={handleSubmit} className={styles.formStructure}>
        {error && <div className={styles.errorBanner}>{error}</div>}

        <div className={styles.inputSection}>
          <Input
            id="albumName"
            label="Tên Album Ảnh"
            type="text"
            placeholder="Nhập tên album"
            value={albumName}
            onChange={(e) => setAlbumName(e.target.value)}
            icon={<ImageIcon size={18} />}
          />
        </div>

        <div className={styles.uploadSection}>
          <div className={styles.sectionLabel}>
            <span>Hình ảnh trưng bày ({images.length}/15)</span>
            <span className={styles.subLabel}>Ảnh số 1 nằm góc trái luôn luôn mặc định làm ảnh bìa Album</span>
          </div>

          <div className={styles.gridContainer}>
            {/* Vòng lặp map hiển thị ảnh với hiệu ứng bong bóng số vị trí */}
            {images.map((img, index) => (
              <div 
                key={img.id || index} 
                className={`${styles.imageCard} ${draggedIndex === index ? styles.dragging : ""}`}
                draggable
                onDragStart={() => handleDragStart(index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDragEnd={handleDragEnd}
              >
                {/* Bong bóng số thứ tự bên trái */}
                <span className={styles.indexNumber}>{index + 1}</span>

                <img src={img.previewUrl} alt={`Album pic ${index}`} />
                
                {index === 0 && <span className={styles.coverBadge}>BÌA</span>}
                
                {/* Bong bóng dấu X xóa bên phải */}
                <button
                  type="button"
                  className={styles.removeBtn}
                  onClick={() => handleRemoveImage(index)}
                  title="Xóa ảnh khỏi album"
                >
                  <X size={12} />
                </button>
              </div>
            ))}

            {/* Ô thêm ảnh mới (nếu chưa chạm mốc 15) */}
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
          <Button type="submit" size="lg">
            <Save size={16} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
            Lưu thay đổi
          </Button>
        </div>
      </form>
    </div>
  );
}

export default EditAlbum;