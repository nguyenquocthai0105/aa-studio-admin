import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Image as ImageIcon, X, ArrowLeft, UploadCloud, Save } from "lucide-react";
import Button from "../../components/common/Button/Button";
import Input from "../../components/common/Input/Input";
import styles from "./EditAlbum.module.css";
import axiosClient from "../../services/api";
import imageCompression from "browser-image-compression";

function EditAlbum() {
  const { id } = useParams(); 
  const navigate = useNavigate();

  const [albumName, setAlbumName] = useState("");
  const [images, setImages] = useState([]); 
  const [error, setError] = useState("");
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  
  // Trạng thái hiển thị Custom Toast Notification
  const [showToast, setShowToast] = useState(false);

  // 1. Đọc dữ liệu thật của Album từ MongoDB lên Form
  useEffect(() => {
    const fetchAlbumDetails = async () => {
      try {
        setFetching(true);
        const response = await axiosClient.get(`/albums`);
        // Tìm đúng album cụ thể dựa vào ID trên thanh URL
        const currentAlbum = response.data.find(item => item._id === id);
        
        if (currentAlbum) {
          setAlbumName(currentAlbum.name);
          // Định dạng các đường link ảnh cũ thành cấu trúc quản lý chung của Component
          const formattedImages = currentAlbum.images.map((url, idx) => ({
            id: `old-${idx}-${Date.now()}`,
            previewUrl: url, // Link ảnh online có sẵn từ Cloudinary
            file: null       // Đánh dấu đây là ảnh cũ, không cần nén/upload lại
          }));
          setImages(formattedImages);
        } else {
          setError("Không tìm thấy dữ liệu album cần chỉnh sửa!");
        }
      } catch (err) {
        console.error("Lỗi lấy chi tiết album:", err);
        setError("Không thể tải thông tin chi tiết album từ server.");
      } finally {
        setFetching(false);
      }
    };

    fetchAlbumDetails();
  }, [id]);

  // Chọn thêm ảnh mới từ máy tính vào bộ ảnh cũ
  const handleImageChange = (e) => {
    setError("");
    const files = Array.from(e.target.files);
    
    if (images.length + files.length > 15) {
      setError("Một album chỉ được phép chứa tối đa 15 hình ảnh!");
      return;
    }

    const newImages = files.map((file) => ({
      id: `new-${Math.random().toString(36).substr(2, 9)}`,
      file,
      previewUrl: URL.createObjectURL(file), // Tạo link blob tạm thời hiển thị ảnh xem trước
    }));

    setImages((prevImages) => [...prevImages, ...newImages]);
  };

  // Gỡ bỏ ảnh ra khỏi danh sách hiển thị
  const handleRemoveImage = (indexToRemove) => {
    setImages((prevImages) => {
      if (prevImages[indexToRemove].file) {
        URL.revokeObjectURL(prevImages[indexToRemove].previewUrl);
      }
      return prevImages.filter((_, index) => index !== indexToRemove);
    });
    setError("");
  };

  // --- HTML5 DRAG & DROP LOGIC ---
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

  // 2. Gửi dữ liệu cập nhật đồng bộ lên Server
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    if (!albumName.trim()) return setError("Tên Album không được để trống");
    if (images.length === 0) return setError("Album phải có ít nhất 1 hình ảnh trưng bày");

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("name", albumName);

      // Cấu hình chuẩn nén ảnh máy cơ xuống 1.5MB siêu tốc
      const compressionOptions = {
        maxSizeMB: 1.5,
        maxWidthOrHeight: 2000,
        useWebWorker: true,
      };

      // Duyệt thứ tự mảng images sau khi kéo thả
      for (const img of images) {
        if (img.file) {
          // Bối cảnh A: Đây là file ảnh MỚI chèn vào -> Nén ngầm rồi append vào key "images"
          console.log(`Tiến hành nén ảnh mới thêm: ${img.file.name}`);
          const compressedFile = await imageCompression(img.file, compressionOptions);
          formData.append("images", compressedFile);
        } else {
          // Bối cảnh B: Đây là link ảnh CŨ muốn giữ lại -> Gửi chuỗi URL văn bản vào key "existingImages"
          formData.append("existingImages", img.previewUrl);
        }
      }

      // Gửi request cập nhật PUT lên Backend
      const response = await axiosClient.put(`/albums/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data.success) {
        // Kích hoạt hiển thị Custom Toast
        setShowToast(true);
        
        // Thu hồi các URL blob tạm để giải phóng ram trình duyệt
        images.forEach((img) => { if (img.file) URL.revokeObjectURL(img.previewUrl); });

        // Tạo độ trễ 2 giây để admin nhìn thấy Toast rồi mới điều hướng về Dashboard
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

  if (fetching) return <div style={{ padding: "2rem", textAlign: "center", color: "#fff" }}>Đang đồng bộ dữ liệu gốc album...</div>;

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
            {images.map((img, index) => (
              <div 
                key={img.id || index} 
                className={`${styles.imageCard} ${draggedIndex === index ? styles.dragging : ""}`}
                draggable
                onDragStart={() => handleDragStart(index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDragEnd={handleDragEnd}
              >
                <span className={styles.indexNumber}>{index + 1}</span>
                <img src={img.previewUrl} alt={`Album pic ${index}`} />
                {index === 0 && <span className={styles.coverBadge}>BÌA</span>}
                
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
            <Save size={16} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
            {loading ? "Đang cập nhật mây..." : "Lưu thay đổi"}
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
          <div className={styles.toastContent}>Đã lưu mọi thay đổi của Album thành công! 🎉</div>
        </div>
      )}
    </div>
  );
}

export default EditAlbum;