import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Shirt,
  Plus,
  FolderHeart,
  TrendingUp,
  Calendar,
  Edit3,
  Trash2,
} from "lucide-react";
import styles from "./Dashboard.module.css";

function Dashboard() {
  const [stats] = useState({
    totalAlbums: 12,
    totalCostumes: 48,
    bookingsToday: 3,
    revenueMonth: "45.000.000 đ",
  });

  // Giả lập dữ liệu Album chứa mảng hình ảnh (Lấy ảnh đầu tiên làm đại diện)
  const [recentAlbums] = useState([
    {
      id: 1,
      name: "Concept Nắng Thủy Tinh",
      images: [
        "https://images.unsplash.com/photo-1519741497674-611481863552?w=150&auto=format&fit=crop&q=60", // Ảnh đầu tiên hiển thị
        "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=150&auto=format&fit=crop&q=60",
      ],
      photosCount: 12,
      updated: "2 giờ trước",
    },
    {
      id: 2,
      name: "Pre-Wedding Đà Lạt Mộng Mơ",
      images: [
        "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=150&auto=format&fit=crop&q=60",
        "https://images.unsplash.com/photo-1532712938310-34cb3982ef74?w=150&auto=format&fit=crop&q=60",
      ],
      photosCount: 15,
      updated: "Hôm qua",
    },
    {
      id: 3,
      name: "Minimalist Studio Lookbook",
      images: [
        "https://images.unsplash.com/photo-1519225495810-7512c696505a?w=150&auto=format&fit=crop&q=60",
      ],
      photosCount: 8,
      updated: "3 ngày trước",
    },
  ]);

  // Giả lập dữ liệu Trang phục (Ảnh đầu tiên chứa thông tin đồ, giá, QR đã tích hợp sẵn trên ảnh)
  const [recentCostumes] = useState([
    {
      id: 1,
      name: "Váy Cưới Cúp Ngực Taffeta",
      images: [
        "https://images.unsplash.com/photo-1594552072238-b8a33785b261?w=150&auto=format&fit=crop&q=60",
      ],
      price: "2.500.000 đ",
      status: "Sẵn sàng",
    },
    {
      id: 2,
      name: "Vest Nam Classic Espresso",
      images: [
        "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=150&auto=format&fit=crop&q=60",
      ],
      price: "1.200.000 đ",
      status: "Đang thuê",
    },
    {
      id: 3,
      name: "Cổ Phục Nhật Bình Gấm",
      images: [
        "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=150&auto=format&fit=crop&q=60",
      ],
      price: "900.000 đ",
      status: "Sẵn sàng",
    },
  ]);

  return (
    <div className={styles.dashboardContainer}>
      {/* HEADER */}
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

      {/* STATS GRID */}
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

      {/* MAIN WORKSPACE */}
      <div className={styles.mainContent}>
        {/* KHỐI ALBUM */}
        <div className={styles.sectionCard}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionTitle}>
              <h3>Quản lý Album Ảnh</h3>
              <p>Hiển thị trên Web User (Tối đa 15 ảnh/album)</p>
            </div>
            <Link to="/albums/new" className={styles.btnPrimary}>
              <Plus size={16} />
              <span>Tạo Album mới</span>
            </Link>
          </div>

          <div className={styles.listContainer}>
            {recentAlbums.map((album) => {
              // Lấy hình ảnh đầu tiên từ mảng làm ảnh bìa
              const coverImage =
                album.images && album.images.length > 0
                  ? album.images[0]
                  : "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=150"; // Backup ảnh lỗi

              return (
                <div key={album.id} className={styles.listItem}>
                  <div className={styles.itemMain}>
                    <div className={styles.imagePreview}>
                      <img src={coverImage} alt={album.name} loading="lazy" />
                    </div>
                    <div className={styles.itemDetails}>
                      <span className={styles.itemName}>{album.name}</span>
                      <span className={styles.itemMeta}>
                        {album.photosCount}/15 ảnh • Kích hoạt: {album.updated}
                      </span>
                    </div>
                  </div>
                  <div className={styles.itemActions}>
                    <button
                      className={styles.btnAction}
                      title="Sửa tên & bộ ảnh"
                    >
                      <Edit3 size={16} />
                    </button>
                    <button
                      className={`${styles.btnAction} ${styles.btnDelete}`}
                      title="Xóa"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* KHỐI TRANG PHỤC */}
        <div className={styles.sectionCard}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionTitle}>
              <h3>Quản lý Trang phục</h3>
              <p>Ảnh chứa sẵn thông tin chi tiết đồ, mã QR và bảng giá</p>
            </div>
            <button className={styles.btnPrimary}>
              <Plus size={16} />
              <span>Thêm đồ</span>
            </button>
          </div>

          <div className={styles.listContainer}>
            {recentCostumes.map((costume) => {
              // Lấy hình ảnh đầu tiên làm ảnh đại diện trang phục
              const costumeImage =
                costume.images && costume.images.length > 0
                  ? costume.images[0]
                  : "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=150";

              return (
                <div key={costume.id} className={styles.listItem}>
                  <div className={styles.itemMain}>
                    <div
                      className={`${styles.imagePreview} ${styles.imageCostume}`}
                    >
                      <img
                        src={costumeImage}
                        alt={costume.name}
                        loading="lazy"
                      />
                    </div>
                    <div className={styles.itemDetails}>
                      <span className={styles.itemName}>{costume.name}</span>
                      <span className={styles.itemMeta}>
                        Giá thuê công khai:{" "}
                        <strong className={styles.priceHighlight}>
                          {costume.price}
                        </strong>
                      </span>
                    </div>
                  </div>
                  <div className={styles.itemActions}>
                    <button
                      className={styles.btnAction}
                      title="Sửa thông tin giá & ảnh"
                    >
                      <Edit3 size={16} />
                    </button>
                    <button
                      className={`${styles.btnAction} ${styles.btnDelete}`}
                      title="Xóa đồ"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
