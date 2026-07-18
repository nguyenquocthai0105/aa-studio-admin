import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Shirt,
  Plus,
  FolderHeart,
  TrendingUp,
  Calendar,
  Edit3,
  Trash2,
  AlertTriangle,
  X,
} from "lucide-react";
import styles from "./Dashboard.module.css";
import albumService from "../../services/albumService";
import costumeService from "../../services/costumeService";

function Dashboard() {
  const [albums, setAlbums] = useState([]);
  const [costumes, setCostumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [stats, setStats] = useState({
    totalAlbums: 0,
    totalCostumes: 0,
    bookingsToday: 3,
    revenueMonth: "45.000.000 đ",
  });

  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    id: null,
    name: "",
    type: "",
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        const [albumsData, costumesData] = await Promise.all([
          albumService.getAllAlbums(),
          costumeService.getAllCostumes(),
        ]);

        const fetchedAlbums = albumsData || [];
        const fetchedCostumes = costumesData || [];

        setAlbums(fetchedAlbums);
        setCostumes(fetchedCostumes);

        setStats((prev) => ({
          ...prev,
          totalAlbums: fetchedAlbums.length,
          totalCostumes: fetchedCostumes.length,
        }));
      } catch (err) {
        console.error("Lỗi tải dữ liệu Dashboard:", err);
        setError("Không thể đồng bộ dữ liệu từ Server Backend!");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const openDeleteModal = (id, name, type) => {
    setDeleteModal({
      isOpen: true,
      id,
      name,
      type,
    });
  };

  const closeDeleteModal = () => {
    setDeleteModal({ isOpen: false, id: null, name: "", type: "" });
  };

  const handleConfirmDelete = async () => {
    const { id, type } = deleteModal;

    try {
      if (type === "album") {
        const data = await albumService.deleteAlbum(id);
        if (data.success) {
          setAlbums((prev) => prev.filter((album) => album._id !== id));
          setStats((prev) => ({
            ...prev,
            totalAlbums: prev.totalAlbums - 1,
          }));
        }
      } else if (type === "costume") {
        const data = await costumeService.deleteCostume(id);
        if (data.success) {
          setCostumes((prev) => prev.filter((item) => item._id !== id));
          setStats((prev) => ({
            ...prev,
            totalCostumes: prev.totalCostumes - 1,
          }));
        }
      }

      closeDeleteModal();
    } catch (err) {
      console.error(`Lỗi khi xóa ${type}:`, err);
      alert("Xóa thất bại, vui lòng thử lại!");
    }
  };

  if (loading) {
    return (
      <div className={styles.loadingScreen}>
        <div className={styles.loadingGlow}></div>
        <div className={styles.loadingText}>Đang tải không gian quản trị...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.dashboardContainer}>
        <div className={styles.errorBanner}>{error}</div>
      </div>
    );
  }

  return (
    <div className={styles.dashboardContainer}>
      <header className={styles.header}>
        <div className={styles.welcomeZone}>
          <h1>Á À Studio</h1>
          <p>Không gian quản trị nội bộ • Xin chào, Quốc Thái</p>
        </div>

        <div className={styles.dateBadge}>
          <Calendar size={16} />
          <span>Hôm nay: {new Date().toLocaleDateString("vi-VN")}</span>
        </div>
      </header>

      <section className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={`${styles.statIcon} ${styles.iconGold}`}>
            <FolderHeart size={22} />
          </div>
          <div className={styles.statInfo}>
            <span className={styles.statLabel}>Tổng số Album</span>
            <span className={styles.statValue}>{stats.totalAlbums}</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={`${styles.statIcon} ${styles.iconBrown}`}>
            <Shirt size={22} />
          </div>
          <div className={styles.statInfo}>
            <span className={styles.statLabel}>Tổng số Trang phục</span>
            <span className={styles.statValue}>{stats.totalCostumes}</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={`${styles.statIcon} ${styles.iconGreen}`}>
            <Calendar size={22} />
          </div>
          <div className={styles.statInfo}>
            <span className={styles.statLabel}>Lịch chụp hôm nay</span>
            <span className={styles.statValue}>{stats.bookingsToday}</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={`${styles.statIcon} ${styles.iconPurple}`}>
            <TrendingUp size={22} />
          </div>
          <div className={styles.statInfo}>
            <span className={styles.statLabel}>Doanh thu tháng này</span>
            <span className={styles.statValue}>{stats.revenueMonth}</span>
          </div>
        </div>
      </section>

      <div className={styles.mainContent}>
        <div className={styles.sectionCard}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionTitle}>
              <h3>Quản lý Album Ảnh</h3>
              <p>Hiển thị trên Web User • Tối đa 15 ảnh/album</p>
            </div>

            <Link to="/albums/new" className={styles.btnPrimary}>
              <Plus size={16} />
              <span>Tạo Album mới</span>
            </Link>
          </div>

          <div className={styles.listContainer}>
            {albums.length === 0 ? (
              <p className={styles.emptyText}>Chưa có album nào được tạo.</p>
            ) : (
              albums.map((album) => {
                const coverImage =
                  album.images && album.images.length > 0 ? album.images[0] : "";

                return (
                  <div key={album._id} className={styles.listItem}>
                    <div className={styles.itemMain}>
                      <div className={styles.imagePreview}>
                        {coverImage ? (
                          <img src={coverImage} alt={album.name} loading="lazy" />
                        ) : (
                          <div className={styles.fallbackThumb}>No image</div>
                        )}
                      </div>

                      <div className={styles.itemDetails}>
                        <span className={styles.itemName}>{album.name}</span>
                        <span className={styles.itemMeta}>
                          {album.photosCount || 0}/15 ảnh • Trạng thái: Sẵn sàng hiển thị
                        </span>
                      </div>
                    </div>

                    <div className={styles.itemActions}>
                      <Link
                        to={`/albums/edit/${album._id}`}
                        className={styles.btnAction}
                        title="Sửa tên & bộ ảnh"
                      >
                        <Edit3 size={16} />
                      </Link>

                      <button
                        className={`${styles.btnAction} ${styles.btnDelete}`}
                        title="Xóa"
                        onClick={() => openDeleteModal(album._id, album.name, "album")}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        <div className={styles.sectionCard}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionTitle}>
              <h3>Quản lý Trang phục</h3>
              <p>Ảnh chứa sẵn thông tin chi tiết đồ, mã QR và bảng giá</p>
            </div>

            <Link to="/costumes/new" className={styles.btnPrimary}>
              <Plus size={16} />
              <span>Thêm trang phục</span>
            </Link>
          </div>

          <div className={styles.listContainer}>
            {costumes.length === 0 ? (
              <p className={styles.emptyText}>Chưa có trang phục nào trong kho.</p>
            ) : (
              costumes.map((costume) => {
                const costumeImage = costume.imageUrl || "";
                const formattedPrice = new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(costume.price || 0);

                return (
                  <div key={costume._id} className={styles.listItem}>
                    <div className={styles.itemMain}>
                      <div className={`${styles.imagePreview} ${styles.imageCostume}`}>
                        {costumeImage ? (
                          <img src={costumeImage} alt={costume.name} loading="lazy" />
                        ) : (
                          <div className={styles.fallbackThumb}>No image</div>
                        )}
                      </div>

                      <div className={styles.itemDetails}>
                        <span className={styles.itemName}>{costume.name}</span>
                        <span className={styles.itemMeta}>
                          Giá thuê:{" "}
                          <strong className={styles.priceHighlight}>
                            {formattedPrice}
                          </strong>
                        </span>
                      </div>
                    </div>

                    <div className={styles.itemActions}>
                      <Link
                        to={`/costumes/edit/${costume._id}`}
                        className={styles.btnAction}
                        title="Sửa thông tin giá & ảnh"
                      >
                        <Edit3 size={16} />
                      </Link>

                      <button
                        className={`${styles.btnAction} ${styles.btnDelete}`}
                        title="Xóa đồ"
                        onClick={() =>
                          openDeleteModal(costume._id, costume.name, "costume")
                        }
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {deleteModal.isOpen && (
        <div className={styles.modalOverlay} onClick={closeDeleteModal}>
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <button className={styles.modalCloseBtn} onClick={closeDeleteModal}>
              <X size={18} />
            </button>

            <div className={styles.modalHeader}>
              <div className={styles.warningIconZone}>
                <AlertTriangle size={28} color="#ff5d73" />
              </div>
              <h3>Xác nhận xóa vĩnh viễn</h3>
            </div>

            <div className={styles.modalBody}>
              <p>
                Bạn có chắc chắn muốn xóa vĩnh viễn{" "}
                {deleteModal.type === "album" ? "album ảnh" : "trang phục"}:
              </p>
              <div className={styles.targetName}>"{deleteModal.name}"</div>
              <p className={styles.warningText}>
                Hành động này không thể hoàn tác và dữ liệu sẽ mất hoàn toàn khỏi
                database.
              </p>
            </div>

            <div className={styles.modalActions}>
              <button className={styles.btnCancel} onClick={closeDeleteModal}>
                Hủy bỏ
              </button>
              <button
                className={styles.btnConfirmDanger}
                onClick={handleConfirmDelete}
              >
                Xác nhận xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
