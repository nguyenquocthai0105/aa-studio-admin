// src/pages/CreateSlider/CreateSlider.jsx
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, UploadCloud, X, ArrowUpDown, Save } from "lucide-react";
import Button from "../../components/common/Button/Button";
import styles from "./CreateSlider.module.css";
import { sliderService } from "../../services/sliderService";
import imageCompression from "browser-image-compression";

function CreateSlider() {
  const navigate = useNavigate();
  const [sliders, setSliders] = useState([]); // Mảng các slider hiện có (tối đa 6)
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showToast, setShowToast] = useState("");

  // Load danh sách Slider hiện tại khi vào trang
  useEffect(() => {
    fetchExistingSliders();
  }, []);

  const fetchExistingSliders = async () => {
    try {
      setLoading(true);
      const data = await sliderService.getAll();
      // Chuẩn hóa sắp xếp theo order
      const sorted = (data || []).sort((a, b) => a.order - b.order);
      setSliders(sorted);
    } catch (err) {
      setError("Không thể tải danh sách Slider!");
    } finally {
      setLoading(false);
    }
  };

  // 1. NGHIỆP VỤ ĐỔI THỨ TỰ (REORDER TẠI VỊ TRÍ CLIENT)
  // Hàm reorder ở FE
const handleReorder = (currentIndex, targetOrder) => {
  const targetIndex = targetOrder - 1;
  if (currentIndex === targetIndex) return;

  const updated = [...sliders];
  const [movedItem] = updated.splice(currentIndex, 1);
  updated.splice(targetIndex, 0, movedItem);

  // ĐẶC BIỆT: Đánh lại order từ 1 -> N dựa trên index thực tế
  const reordered = updated.map((item, idx) => ({
    ...item,
    order: idx + 1,
  }));

  setSliders(reordered);
};

  // 2. NGHIỆP VỤ THÊM ÁNH MỚI VÀO VỊ TRÍ TIẾP THEO (TỐI ĐA 6)
  const handleAddNewImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (sliders.length >= 6) {
      return setError("Đã đạt giới hạn tối đa 6 Slider! Hãy xóa bớt trước khi thêm mới.");
    }

    try {
      setLoading(true);
      setError("");

      const compressionOptions = {
        maxSizeMB: 2.0,
        maxWidthOrHeight: 2560,
        useWebWorker: true,
      };

      const compressedFile = await imageCompression(file, compressionOptions);
      const formData = new FormData();
      formData.append("image", compressedFile);
      formData.append("order", sliders.length + 1); // Đặt ở vị trí cuối cùng

      const response = await sliderService.create(formData);
      if (response.success) {
        setShowToast("Thêm ảnh Slider thành công!");
        fetchExistingSliders();
        setTimeout(() => setShowToast(""), 2000);
      }
    } catch (err) {
      setError("Lỗi khi đăng ảnh Slider mới!");
    } finally {
      setLoading(false);
    }
  };

  // 3. NGHIỆP VỤ XÓA & TỰ ĐỘNG DỒN SỐ THỨ TỰ
  const handleDeleteSlider = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa ảnh Slider này?")) return;

    try {
      setLoading(true);
      const res = await sliderService.delete(id);
      if (res.success) {
        setShowToast("Đã xóa và tự động cập nhật lại thứ tự!");
        fetchExistingSliders(); // Gọi lại API để nạp lại danh sách đã được Backend dồn số
        setTimeout(() => setShowToast(""), 2000);
      }
    } catch (err) {
      setError("Xóa Slider thất bại!");
    } finally {
      setLoading(false);
    }
  };

  // 4. NÚT CẬP NHẬT TOÀN BỘ THỨ TỰ VỀ SERVER
  const handleSaveOrders = async () => {
    try {
      setLoading(true);
      const itemsToUpdate = sliders.map((item) => ({
        _id: item._id,
        order: item.order,
      }));

      const res = await sliderService.updateOrders(itemsToUpdate);
      if (res.success) {
        setShowToast("Đã cập nhật thứ tự toàn bộ Slider thành công! 🎉");
        setTimeout(() => {
          setShowToast("");
          navigate("/dashboard");
        }, 1500);
      }
    } catch (err) {
      setError("Cập nhật thứ tự thất bại!");
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
        <h1>Quản Lý 6 Slide Hero ({sliders.length}/6)</h1>
        <p>Hệ thống hỗ trợ tối đa 6 slider. Khi xóa 1 ảnh, thứ tự các ảnh còn lại sẽ tự động dồn lại mượt mà.</p>
      </div>

      <div className={styles.formStructure}>
        {error && <div className={styles.errorBanner}>{error}</div>}

        {/* DANH SÁCH SLIDER HIỆN CÓ */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '32px' }}>
          {sliders.map((item, index) => (
            <div
              key={item._id}
              style={{
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid rgba(34, 211, 238, 0.2)',
                borderRadius: '16px',
                padding: '16px',
                position: 'relative',
              }}
            >
              {/* HEADER SLOT: SỐ THỨ TỰ & THUỘC TÍNH REORDER */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ fontWeight: '800', color: 'var(--color-primary)', fontSize: '14px' }}>
                  VỊ TRÍ #{item.order}
                </span>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <ArrowUpDown size={14} color="var(--color-text-soft)" />
                  <select
                    value={item.order}
                    onChange={(e) => handleReorder(index, Number(e.target.value))}
                    style={{
                      background: '#09111a',
                      color: '#fff',
                      border: '1px solid rgba(255,255,255,0.2)',
                      borderRadius: '6px',
                      padding: '4px 8px',
                      fontSize: '12px',
                      cursor: 'pointer',
                    }}
                  >
                    {sliders.map((_, idx) => (
                      <option key={idx + 1} value={idx + 1}>
                        Chuyển đến vị trí {idx + 1}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* HÌNH ẢNH SLIDER */}
              <div className={styles.imageCard} style={{ maxHeight: '180px', marginBottom: '12px' }}>
                <img src={item.imageUrl} alt={`Slider ${item.order}`} style={{ maxHeight: '180px', width: '100%', objectFit: 'cover', borderRadius: '8px' }} />
                <button
                  type="button"
                  className={styles.removeBtn}
                  onClick={() => handleDeleteSlider(item._id)}
                  title="Xóa slider này"
                >
                  <X size={12} />
                </button>
              </div>
            </div>
          ))}

          {/* Ô THÊM MỚI (CHỈ HIỆN KHI CHƯA ĐỦ 6 SLIDER) */}
          {sliders.length < 6 && (
            <div
              style={{
                border: '2px dashed rgba(34, 211, 238, 0.3)',
                borderRadius: '16px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '220px',
                background: 'rgba(255,255,255,0.01)',
              }}
            >
              <label className={styles.uploadTrigger} style={{ cursor: 'pointer', textAlign: 'center', padding: '20px' }}>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAddNewImage}
                  className={styles.hiddenInput}
                  disabled={loading}
                />
                <UploadCloud size={32} className={styles.uploadIcon} />
                <span className={styles.uploadText}>Thêm Slider #{sliders.length + 1}</span>
                <span className={styles.uploadSubText}>(Tối đa {6 - sliders.length} ảnh nữa)</span>
              </label>
            </div>
          )}
        </div>

        {/* NÚT CẬP NHẬT TỔNG THỨ TỰ */}
        <div className={styles.actionRow}>
          <Button type="button" size="lg" disabled={loading} onClick={handleSaveOrders}>
            <Save size={18} style={{ marginRight: '8px' }} />
            {loading ? "Đang xử lý..." : "Cập Nhật Thứ Tự Slider"}
          </Button>
        </div>
      </div>

      {/* TOAST NOTIFICATION */}
      {showToast && (
        <div className={styles.toastContainer}>
          <div className={styles.toastContent}>{showToast}</div>
        </div>
      )}
    </div>
  );
}

export default CreateSlider;