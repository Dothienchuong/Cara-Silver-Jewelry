import React, { useState, useEffect, useMemo } from 'react';
import {
  FileSpreadsheet,
  ExternalLink,
  RefreshCw,
  UploadCloud,
  CheckCircle2,
  Clock,
  Truck,
  Package,
  AlertCircle,
  Search,
  Filter,
  LogOut,
  User as UserIcon,
  ShieldCheck,
  ChevronRight,
  Sparkles,
  Phone,
  MapPin,
  Calendar,
  X,
  PlusCircle,
  Layers,
  ArrowRight,
  Lock,
  KeyRound,
  Eye,
  EyeOff,
  Home,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { GoogleSignInButton } from '../components/GoogleSignInButton';
import {
  initAuth,
  googleSignIn,
  googleSignOut,
  getCurrentUser,
  getAccessToken,
} from '../services/googleAuthService';
import {
  findExistingSpreadsheet,
  createOrdersSpreadsheet,
  fetchOrdersFromSheet,
  appendOrderToSheet,
  updateOrderInSheet,
  getSavedSheetConfig,
  saveSheetConfig,
  clearSheetConfig,
  SheetConfig,
  SheetRowOrder,
  DEFAULT_SHEET_TITLE,
} from '../services/googleSheetsService';
import { useShop } from '../context/ShopContext';
import { formatVND } from '../utils/format';
import { User } from 'firebase/auth';

export const OrderManagementView: React.FC = () => {
  const { orders, setActiveTab } = useShop();

  // Admin Security Gate State (Requires password: Cara123)
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('cara_admin_authorized') === 'true';
  });
  const [adminPasswordInput, setAdminPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  // Auth & Sheets State
  const [currentUser, setCurrentUser] = useState<User | null>(getCurrentUser());
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Sheet Config State
  const [sheetConfig, setSheetConfig] = useState<SheetConfig | null>(getSavedSheetConfig());
  const [isInitializingSheet, setIsInitializingSheet] = useState(false);
  const [sheetOrders, setSheetOrders] = useState<SheetRowOrder[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string | null>(null);

  // Manual Sheet ID Modal
  const [isCustomSheetModalOpen, setIsCustomSheetModalOpen] = useState(false);
  const [customSheetInput, setCustomSheetInput] = useState('');

  // Status Update Confirmation Modal (MANDATORY per Workspace Skill guidelines)
  const [editingOrder, setEditingOrder] = useState<SheetRowOrder | null>(null);
  const [targetOrderStatus, setTargetOrderStatus] = useState<string>('Mới Tiếp Nhận');
  const [targetPaymentStatus, setTargetPaymentStatus] = useState<string>('Chưa Thanh Toán');
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [paymentFilter, setPaymentFilter] = useState<string>('all');

  // Initialize Auth state
  useEffect(() => {
    const unsubscribe = initAuth(
      (user, token) => {
        setCurrentUser(user);
        setAccessToken(token);
      },
      () => {
        // User logged out
        setCurrentUser(null);
        setAccessToken(null);
      }
    );
    return () => unsubscribe();
  }, []);

  // When token is available and sheetConfig is present, fetch orders
  useEffect(() => {
    if (accessToken && sheetConfig?.spreadsheetId) {
      loadOrdersFromSheet(accessToken, sheetConfig.spreadsheetId);
    }
  }, [accessToken, sheetConfig?.spreadsheetId]);

  // Handle Admin Security Login
  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifying(true);
    setPasswordError(null);

    setTimeout(() => {
      if (adminPasswordInput.trim() === 'Cara123') {
        sessionStorage.setItem('cara_admin_authorized', 'true');
        setIsAdminAuthenticated(true);
        setPasswordError(null);
        setAdminPasswordInput('');
      } else {
        setPasswordError('Mật khẩu quản trị viên không chính xác. Vui lòng kiểm tra lại!');
      }
      setIsVerifying(false);
    }, 250);
  };

  const handleAdminLogout = () => {
    sessionStorage.removeItem('cara_admin_authorized');
    setIsAdminAuthenticated(false);
    setAdminPasswordInput('');
    setPasswordError(null);
  };

  // Handle Google Login
  const handleGoogleLogin = async () => {
    setIsLoggingIn(true);
    setAuthError(null);
    try {
      const result = await googleSignIn();
      if (result) {
        setCurrentUser(result.user);
        setAccessToken(result.accessToken);

        // Auto-connect to existing sheet or create a new one
        await autoConnectOrCreateSheet(result.accessToken);
      }
    } catch (err: any) {
      console.error('Google Sign In failed:', err);
      setAuthError(err.message || 'Không thể đăng nhập Google. Vui lòng thử lại.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleGoogleLogout = async () => {
    await googleSignOut();
    setCurrentUser(null);
    setAccessToken(null);
    setSheetOrders([]);
  };

  // Find existing sheet or create a new one
  const autoConnectOrCreateSheet = async (token: string) => {
    setIsInitializingSheet(true);
    try {
      // 1. Check if we already have a saved sheet config
      const saved = getSavedSheetConfig();
      if (saved?.spreadsheetId) {
        setSheetConfig(saved);
        await loadOrdersFromSheet(token, saved.spreadsheetId);
        return;
      }

      // 2. Search user's Google Drive for existing sheet
      const existing = await findExistingSpreadsheet(token);
      if (existing) {
        const config: SheetConfig = {
          spreadsheetId: existing.id,
          spreadsheetTitle: existing.name,
          spreadsheetUrl: `https://docs.google.com/spreadsheets/d/${existing.id}/edit`,
          autoSync: true,
          lastSyncedAt: new Date().toISOString(),
        };
        saveSheetConfig(config);
        setSheetConfig(config);
        await loadOrdersFromSheet(token, existing.id);
        setActionSuccessMsg(`Đã kết nối với Google Sheet: "${existing.name}"`);
        return;
      }

      // 3. Create a brand new Google Sheet
      const created = await createOrdersSpreadsheet(token, DEFAULT_SHEET_TITLE);
      const config: SheetConfig = {
        spreadsheetId: created.id,
        spreadsheetTitle: created.title,
        spreadsheetUrl: created.url,
        autoSync: true,
        lastSyncedAt: new Date().toISOString(),
      };
      saveSheetConfig(config);
      setSheetConfig(config);
      setActionSuccessMsg('Đã tạo mới bảng tính Google Sheets thành công!');
    } catch (err: any) {
      console.error('Error connecting Google Sheet:', err);
      setAuthError(err.message || 'Không thể tạo hoặc kết nối Google Sheet.');
    } finally {
      setIsInitializingSheet(false);
    }
  };

  // Load orders from Google Sheet
  const loadOrdersFromSheet = async (token: string, spreadsheetId: string) => {
    setIsLoadingOrders(true);
    try {
      const data = await fetchOrdersFromSheet(token, spreadsheetId);
      setSheetOrders(data);
      if (sheetConfig) {
        const updated = { ...sheetConfig, lastSyncedAt: new Date().toISOString() };
        saveSheetConfig(updated);
        setSheetConfig(updated);
      }
    } catch (err: any) {
      console.error('Error loading orders from sheet:', err);
    } finally {
      setIsLoadingOrders(false);
    }
  };

  // Sync local orders to Google Sheet
  const handleSyncLocalOrders = async () => {
    if (!accessToken || !sheetConfig?.spreadsheetId) return;
    setIsSyncing(true);
    setActionSuccessMsg(null);
    try {
      // Find orders that are not in sheetOrders by ID
      const existingIds = new Set(sheetOrders.map((o) => o.orderId));
      const ordersToPush = orders.filter((o) => !existingIds.has(o.id));

      if (ordersToPush.length === 0) {
        setActionSuccessMsg('Tất cả đơn hàng hiện tại đã được đồng bộ trên Google Sheet!');
      } else {
        for (const ord of ordersToPush) {
          await appendOrderToSheet(accessToken, sheetConfig.spreadsheetId, ord);
        }
        setActionSuccessMsg(`Đã đồng bộ thành công ${ordersToPush.length} đơn hàng lên Google Sheets!`);
        await loadOrdersFromSheet(accessToken, sheetConfig.spreadsheetId);
      }
    } catch (err: any) {
      console.error('Sync failed:', err);
      setAuthError('Có lỗi xảy ra khi đồng bộ đơn hàng lên Google Sheets.');
    } finally {
      setIsSyncing(false);
    }
  };

  // Connect Custom Sheet ID/URL
  const handleSaveCustomSheet = async () => {
    if (!accessToken || !customSheetInput.trim()) return;

    let extractedId = customSheetInput.trim();
    const match = customSheetInput.match(/\/d\/([a-zA-Z0-9-_]+)/);
    if (match && match[1]) {
      extractedId = match[1];
    }

    try {
      setIsInitializingSheet(true);
      const config: SheetConfig = {
        spreadsheetId: extractedId,
        spreadsheetTitle: 'Bảng tính CARA tùy chỉnh',
        spreadsheetUrl: `https://docs.google.com/spreadsheets/d/${extractedId}/edit`,
        autoSync: true,
        lastSyncedAt: new Date().toISOString(),
      };
      saveSheetConfig(config);
      setSheetConfig(config);
      setIsCustomSheetModalOpen(false);
      setCustomSheetInput('');
      await loadOrdersFromSheet(accessToken, extractedId);
      setActionSuccessMsg('Đã kết nối thành công với Google Sheet tùy chỉnh!');
    } catch (err: any) {
      setAuthError('Không thể kết nối với ID Google Sheet này. Hãy đảm bảo bạn có quyền chỉnh sửa.');
    } finally {
      setIsInitializingSheet(false);
    }
  };

  // Open Status Edit Confirmation Dialog
  const openEditModal = (order: SheetRowOrder) => {
    setEditingOrder(order);
    setTargetOrderStatus(order.orderStatus);
    setTargetPaymentStatus(order.paymentStatus);
  };

  // Execute Status Update (with user confirmation)
  const handleConfirmStatusUpdate = async () => {
    if (!accessToken || !sheetConfig?.spreadsheetId || !editingOrder) return;
    setIsUpdatingStatus(true);
    try {
      const ok = await updateOrderInSheet(
        accessToken,
        sheetConfig.spreadsheetId,
        editingOrder.rowIndex,
        targetOrderStatus,
        targetPaymentStatus
      );

      if (ok) {
        setActionSuccessMsg(
          `Đã cập nhật trạng thái đơn ${editingOrder.orderId} thành "${targetOrderStatus}" trên Google Sheets!`
        );
        setEditingOrder(null);
        await loadOrdersFromSheet(accessToken, sheetConfig.spreadsheetId);
      } else {
        setAuthError('Cập nhật trạng thái thất bại. Vui lòng kiểm tra lại quyền.');
      }
    } catch (err: any) {
      console.error('Update order status error:', err);
      setAuthError(err.message || 'Lỗi khi cập nhật trạng thái lên Google Sheet.');
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  // Filtered orders list
  const filteredOrders = useMemo(() => {
    return sheetOrders.filter((order) => {
      const q = searchQuery.toLowerCase();
      const matchSearch =
        !q ||
        order.orderId.toLowerCase().includes(q) ||
        order.customerName.toLowerCase().includes(q) ||
        order.phone.toLowerCase().includes(q) ||
        order.itemsSummary.toLowerCase().includes(q);

      const matchStatus =
        statusFilter === 'all' ||
        (statusFilter === 'received' && order.orderStatus.includes('Tiếp Nhận')) ||
        (statusFilter === 'processing' && order.orderStatus.includes('Chuẩn Bị')) ||
        (statusFilter === 'shipping' && order.orderStatus.includes('Giao Hàng')) ||
        (statusFilter === 'delivered' && order.orderStatus.includes('Thành Công'));

      const matchPayment =
        paymentFilter === 'all' ||
        (paymentFilter === 'paid' && order.paymentStatus.includes('Đã Thanh Toán')) ||
        (paymentFilter === 'pending' && order.paymentStatus.includes('Chưa Thanh Toán'));

      return matchSearch && matchStatus && matchPayment;
    });
  }, [sheetOrders, searchQuery, statusFilter, paymentFilter]);

  // Summary Metrics
  const stats = useMemo(() => {
    const totalOrdersCount = sheetOrders.length;
    const newOrdersCount = sheetOrders.filter((o) => o.orderStatus.includes('Tiếp Nhận')).length;
    const shippingCount = sheetOrders.filter((o) => o.orderStatus.includes('Giao Hàng')).length;
    const completedRevenue = sheetOrders
      .filter((o) => o.paymentStatus.includes('Đã Thanh Toán'))
      .reduce((sum, o) => sum + o.total, 0);

    return { totalOrdersCount, newOrdersCount, shippingCount, completedRevenue };
  }, [sheetOrders]);

  // IF NOT AUTHENTICATED AS ADMIN: Show security password gate
  if (!isAdminAuthenticated) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="w-full max-w-md bg-gradient-to-b from-[#181820] to-[#111116] border border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-black/80 relative overflow-hidden"
        >
          {/* Subtle glow effect */}
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Header Icon */}
          <div className="relative text-center space-y-3">
            <div className="inline-flex p-3.5 rounded-2xl bg-zinc-900 border border-zinc-700/80 shadow-inner text-amber-400 mx-auto">
              <Lock className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold tracking-[0.25em] text-amber-400">
                CARA Silver Jewelry • Hệ Thống Nội Bộ
              </span>
              <h2 className="text-xl sm:text-2xl font-bold font-brand text-white">
                Cổng Quản Trị Viên (Admin)
              </h2>
              <p className="text-xs text-zinc-400 leading-relaxed max-w-xs mx-auto">
                Khu vực bảo mật dành cho quản lý cửa hàng để xử lý đơn hàng và kết nối Google Sheets.
              </p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleAdminLogin} className="mt-6 space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-300 block">
                Mật khẩu quản trị viên:
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500">
                  <KeyRound className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={adminPasswordInput}
                  onChange={(e) => {
                    setAdminPasswordInput(e.target.value);
                    if (passwordError) setPasswordError(null);
                  }}
                  placeholder="Nhập mật khẩu quản trị..."
                  autoFocus
                  required
                  className="w-full pl-10 pr-11 py-3 bg-zinc-950/80 border border-zinc-700 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition"
                  id="admin-password-input"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-zinc-400 hover:text-zinc-200 transition"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {passwordError && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-1.5 text-xs text-rose-400 pt-1"
                >
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{passwordError}</span>
                </motion.div>
              )}
            </div>

            <button
              type="submit"
              disabled={isVerifying || !adminPasswordInput}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-bold text-sm tracking-wide transition shadow-lg shadow-amber-950/40 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              id="admin-submit-btn"
            >
              {isVerifying ? (
                <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Xác Nhận & Mở Khóa</span>
                </>
              )}
            </button>
          </form>

          {/* Back to store navigation for normal customers */}
          <div className="mt-6 pt-5 border-t border-zinc-800/80 text-center">
            <button
              type="button"
              onClick={() => setActiveTab('home')}
              className="inline-flex items-center gap-2 text-xs text-zinc-400 hover:text-white transition font-medium"
            >
              <Home className="w-3.5 h-3.5" />
              <span>Quay lại trang mua sắm (Dành cho khách hàng)</span>
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Top Banner & Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-zinc-800">
        <div>
          <div className="flex items-center gap-2.5 mb-2">
            <span className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <FileSpreadsheet className="w-5 h-5" />
            </span>
            <span className="text-xs uppercase tracking-[0.25em] text-emerald-400 font-bold">
              Google Workspace Integration
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
              Admin Session Active
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-brand text-white">
            Xử Lý & Quản Lý Đơn Hàng Qua Google Sheets
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1 max-w-2xl leading-relaxed">
            Hệ thống nhận đơn tự động ghi trực tiếp vào Google Sheets theo thời gian thực. Hỗ trợ phân loại, cập nhật tiến độ giao hàng và đồng bộ 2 chiều tức thì.
          </p>
        </div>

        {/* Auth Info & Action */}
        <div className="flex items-center gap-3">
          {currentUser ? (
            <div className="flex items-center gap-3 p-2 pl-3 bg-zinc-900 rounded-2xl border border-zinc-800">
              {currentUser.photoURL ? (
                <img
                  src={currentUser.photoURL}
                  alt={currentUser.displayName || 'Google User'}
                  className="w-8 h-8 rounded-full border border-zinc-700"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-300">
                  <UserIcon className="w-4 h-4" />
                </div>
              )}
              <div className="text-left hidden sm:block">
                <div className="text-xs font-semibold text-white leading-tight">
                  {currentUser.displayName || 'Tài khoản Google'}
                </div>
                <div className="text-[10px] text-zinc-400 truncate max-w-[160px]">
                  {currentUser.email}
                </div>
              </div>
              <button
                type="button"
                onClick={handleGoogleLogout}
                className="p-2 text-zinc-400 hover:text-rose-400 hover:bg-zinc-800 rounded-xl transition"
                title="Đăng xuất Google"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <GoogleSignInButton
              onClick={handleGoogleLogin}
              loading={isLoggingIn}
              text="Đăng Nhập Google Sheets"
            />
          )}

          {/* Admin Lock / Logout button */}
          <button
            type="button"
            onClick={handleAdminLogout}
            className="px-3 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-amber-300 border border-zinc-800 hover:border-zinc-700 text-xs font-medium transition flex items-center gap-1.5 shrink-0"
            title="Khóa quyền quản trị viên"
            id="admin-logout-lock-btn"
          >
            <Lock className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Khóa Admin</span>
          </button>
        </div>
      </div>

      {/* Notifications / Alerts */}
      <AnimatePresence>
        {authError && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-200 text-xs flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{authError}</span>
            </div>
            <button
              type="button"
              onClick={() => setAuthError(null)}
              className="text-zinc-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}

        {actionSuccessMsg && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-200 text-xs flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{actionSuccessMsg}</span>
            </div>
            <button
              type="button"
              onClick={() => setActionSuccessMsg(null)}
              className="text-zinc-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* If Not Authenticated Banner */}
      {!currentUser && (
        <div className="bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-950 rounded-2xl border border-zinc-800 p-8 sm:p-12 text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center">
            <FileSpreadsheet className="w-8 h-8" />
          </div>
          <div className="max-w-xl mx-auto space-y-2">
            <h2 className="text-xl sm:text-2xl font-bold font-brand text-white">
              Kết Nối Google Sheets Để Nhận Đơn Hàng Tự Động
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
              Mỗi khi khách hàng đặt hàng trên CARA Jewelry, dữ liệu đầy đủ bao gồm Họ tên, Số điện thoại, Địa chỉ giao hàng, Chi tiết mẫu mã, Size tay, Số tiền và Phương thức thanh toán sẽ được lưu trữ an toàn trên Google Drive của bạn.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto text-left pt-2">
            <div className="p-4 rounded-xl bg-zinc-950/60 border border-zinc-800/80 space-y-1.5">
              <div className="flex items-center gap-2 text-white font-semibold text-xs">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Không Lo Mất Đơn</span>
              </div>
              <p className="text-[11px] text-zinc-400">
                Ghi nhận đơn 24/7 trực tiếp vào bảng tính, xem trên điện thoại hoặc máy tính dễ dàng.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-zinc-950/60 border border-zinc-800/80 space-y-1.5">
              <div className="flex items-center gap-2 text-white font-semibold text-xs">
                <Truck className="w-4 h-4 text-blue-400" />
                <span>Đổi Trạng Thái 1 Chạm</span>
              </div>
              <p className="text-[11px] text-zinc-400">
                Đổi trạng thái Chuẩn bị hàng, Đang giao, Đã giao ngay trên trang web hoặc trên Sheets.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-zinc-950/60 border border-zinc-800/80 space-y-1.5">
              <div className="flex items-center gap-2 text-white font-semibold text-xs">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Bảo Mật Google 1P</span>
              </div>
              <p className="text-[11px] text-zinc-400">
                Chỉ tài khoản Google của bạn mới có quyền truy cập và chỉnh sửa bảng tính.
              </p>
            </div>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            <GoogleSignInButton
              onClick={handleGoogleLogin}
              loading={isLoggingIn}
              text="Đăng Nhập Bằng Google Để Kích Hoạt"
            />
          </div>
        </div>
      )}

      {/* If Authenticated: Spreadsheet Controls & Metrics */}
      {currentUser && (
        <div className="space-y-6">
          {/* Active Sheet Card */}
          <div className="bg-zinc-900/80 rounded-2xl border border-zinc-800 p-5 sm:p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-5 shadow-lg">
            <div className="flex items-start sm:items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                <FileSpreadsheet className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-base font-bold text-white tracking-wide">
                    {sheetConfig?.spreadsheetTitle || DEFAULT_SHEET_TITLE}
                  </h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Đã Kết Nối Trực Tiếp
                  </span>
                </div>
                <div className="text-xs text-zinc-400 flex items-center gap-3 flex-wrap">
                  <span>
                    Bảng tính: <strong className="text-zinc-300 font-mono">Đơn Hàng</strong>
                  </span>
                  <span>•</span>
                  <span>
                    Cập nhật lần cuối:{' '}
                    <strong className="text-zinc-300">
                      {sheetConfig?.lastSyncedAt
                        ? new Date(sheetConfig.lastSyncedAt).toLocaleTimeString('vi-VN')
                        : 'Vừa xong'}
                    </strong>
                  </span>
                </div>
              </div>
            </div>

            {/* Actions: Open in Google Sheets, Refresh, Sync local */}
            <div className="flex items-center gap-2.5 flex-wrap">
              {sheetConfig?.spreadsheetUrl && (
                <a
                  href={sheetConfig.spreadsheetUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-medium transition flex items-center gap-1.5 border border-zinc-700"
                >
                  <span>Mở Google Sheets</span>
                  <ExternalLink className="w-3.5 h-3.5 text-zinc-400" />
                </a>
              )}

              <button
                type="button"
                onClick={() =>
                  accessToken && sheetConfig?.spreadsheetId && loadOrdersFromSheet(accessToken, sheetConfig.spreadsheetId)
                }
                disabled={isLoadingOrders}
                className="px-3.5 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium transition flex items-center gap-1.5 border border-zinc-700 disabled:opacity-50"
                title="Tải lại đơn hàng từ Google Sheets"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoadingOrders ? 'animate-spin' : ''}`} />
                <span>{isLoadingOrders ? 'Đang tải...' : 'Làm mới'}</span>
              </button>

              <button
                type="button"
                onClick={handleSyncLocalOrders}
                disabled={isSyncing}
                className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition flex items-center gap-1.5 shadow-md shadow-emerald-950/50 disabled:opacity-50"
                title="Đồng bộ tất cả đơn hàng nội bộ sang Google Sheets"
              >
                <UploadCloud className={`w-3.5 h-3.5 ${isSyncing ? 'animate-bounce' : ''}`} />
                <span>{isSyncing ? 'Đang đẩy đơn...' : 'Đẩy đơn lên Sheets'}</span>
              </button>

              <button
                type="button"
                onClick={() => setIsCustomSheetModalOpen(true)}
                className="px-3 py-2 rounded-xl bg-zinc-950 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 text-xs transition border border-zinc-800"
                title="Đổi ID bảng tính khác"
              >
                Tùy chọn
              </button>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-1">
              <span className="text-[11px] uppercase tracking-wider text-zinc-400 font-medium">
                Tổng đơn trên Sheets
              </span>
              <div className="text-2xl font-bold font-mono text-white">
                {stats.totalOrdersCount}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-1">
              <span className="text-[11px] uppercase tracking-wider text-amber-400 font-medium flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> Mới tiếp nhận
              </span>
              <div className="text-2xl font-bold font-mono text-amber-300">
                {stats.newOrdersCount}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-1">
              <span className="text-[11px] uppercase tracking-wider text-blue-400 font-medium flex items-center gap-1">
                <Truck className="w-3.5 h-3.5" /> Đang giao hàng
              </span>
              <div className="text-2xl font-bold font-mono text-blue-300">
                {stats.shippingCount}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-1">
              <span className="text-[11px] uppercase tracking-wider text-emerald-400 font-medium">
                Doanh thu đã thu
              </span>
              <div className="text-2xl font-bold font-mono text-emerald-400">
                {formatVND(stats.completedRevenue)}
              </div>
            </div>
          </div>

          {/* Filters & Search Toolbar */}
          <div className="p-4 bg-zinc-900/60 rounded-xl border border-zinc-800 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm mã đơn, tên khách, số điện thoại, sản phẩm..."
                className="w-full pl-9 pr-4 py-2 bg-zinc-950 border border-zinc-700/80 rounded-lg text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-500"
              />
            </div>

            <div className="flex items-center gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-zinc-950 border border-zinc-700/80 rounded-lg px-3 py-2 text-xs text-zinc-300 focus:outline-none focus:border-zinc-500"
              >
                <option value="all">Mọi trạng thái đơn</option>
                <option value="received">Mới tiếp nhận</option>
                <option value="processing">Đang chuẩn bị hàng</option>
                <option value="shipping">Đang giao hàng</option>
                <option value="delivered">Giao thành công</option>
              </select>

              <select
                value={paymentFilter}
                onChange={(e) => setPaymentFilter(e.target.value)}
                className="bg-zinc-950 border border-zinc-700/80 rounded-lg px-3 py-2 text-xs text-zinc-300 focus:outline-none focus:border-zinc-500"
              >
                <option value="all">Mọi thanh toán</option>
                <option value="paid">Đã thanh toán</option>
                <option value="pending">Chưa thanh toán</option>
              </select>
            </div>
          </div>

          {/* Orders Table & List */}
          <div className="bg-zinc-900/60 rounded-2xl border border-zinc-800 overflow-hidden shadow-xl">
            {filteredOrders.length === 0 ? (
              <div className="p-12 text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-zinc-800 mx-auto flex items-center justify-center text-zinc-500">
                  <Package className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-white">Chưa có đơn hàng nào trên Sheets</p>
                  <p className="text-xs text-zinc-400">
                    Bấm "Đẩy đơn lên Sheets" để chuyển toàn bộ các đơn hàng hiện có vào Google Sheets.
                  </p>
                </div>
                {orders.length > 0 && (
                  <button
                    type="button"
                    onClick={handleSyncLocalOrders}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition"
                  >
                    Đẩy ngay {orders.length} đơn hàng lên Sheets
                  </button>
                )}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-zinc-950/80 border-b border-zinc-800 text-[11px] uppercase tracking-wider text-zinc-400">
                    <tr>
                      <th className="py-3.5 px-4 font-semibold">Mã Đơn / Thời Gian</th>
                      <th className="py-3.5 px-4 font-semibold">Khách Hàng & Liên Hệ</th>
                      <th className="py-3.5 px-4 font-semibold">Sản Phẩm & Size</th>
                      <th className="py-3.5 px-4 font-semibold">Tổng Tiền</th>
                      <th className="py-3.5 px-4 font-semibold">Thanh Toán</th>
                      <th className="py-3.5 px-4 font-semibold">Trạng Thái Đơn</th>
                      <th className="py-3.5 px-4 font-semibold text-right">Xử Lý Đơn</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
                    {filteredOrders.map((ord) => (
                      <tr key={ord.orderId} className="hover:bg-zinc-800/30 transition">
                        {/* Order ID & Time */}
                        <td className="py-4 px-4 align-top">
                          <span className="font-mono font-bold text-white block">
                            {ord.orderId}
                          </span>
                          <span className="text-[10px] text-zinc-500 block mt-0.5">
                            {ord.orderDate}
                          </span>
                        </td>

                        {/* Customer Info */}
                        <td className="py-4 px-4 align-top max-w-[200px]">
                          <div className="font-medium text-white">{ord.customerName}</div>
                          <a
                            href={`tel:${ord.phone}`}
                            className="text-amber-400 hover:underline font-mono text-[11px] flex items-center gap-1 mt-0.5"
                          >
                            <Phone className="w-3 h-3" />
                            {ord.phone}
                          </a>
                          <div className="text-[11px] text-zinc-400 truncate mt-1" title={`${ord.address}, ${ord.district}, ${ord.city}`}>
                            {ord.address}, {ord.city}
                          </div>
                        </td>

                        {/* Items */}
                        <td className="py-4 px-4 align-top max-w-[240px]">
                          <div className="text-zinc-200 text-[11px] whitespace-pre-line line-clamp-2" title={ord.itemsSummary}>
                            {ord.itemsSummary}
                          </div>
                          {ord.note && (
                            <div className="mt-1 text-[10px] text-amber-300/90 italic">
                              Ghi chú: {ord.note}
                            </div>
                          )}
                        </td>

                        {/* Total */}
                        <td className="py-4 px-4 align-top">
                          <div className="font-bold text-emerald-400 font-mono text-sm">
                            {formatVND(ord.total)}
                          </div>
                          <div className="text-[10px] text-zinc-500">
                            {ord.totalQuantity} sản phẩm
                          </div>
                        </td>

                        {/* Payment */}
                        <td className="py-4 px-4 align-top">
                          <span
                            className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                              ord.paymentStatus.includes('Đã Thanh Toán')
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            }`}
                          >
                            {ord.paymentStatus}
                          </span>
                          <div className="text-[10px] text-zinc-400 mt-1">
                            {ord.paymentMethod}
                          </div>
                        </td>

                        {/* Order Status */}
                        <td className="py-4 px-4 align-top">
                          <span
                            className={`inline-block px-2.5 py-1 rounded-full text-[11px] font-semibold ${
                              ord.orderStatus.includes('Thành Công')
                                ? 'bg-emerald-500/20 text-emerald-300'
                                : ord.orderStatus.includes('Giao Hàng')
                                ? 'bg-blue-500/20 text-blue-300'
                                : ord.orderStatus.includes('Chuẩn Bị')
                                ? 'bg-purple-500/20 text-purple-300'
                                : 'bg-zinc-800 text-zinc-300'
                            }`}
                          >
                            {ord.orderStatus}
                          </span>
                        </td>

                        {/* Action: Open confirmation edit modal */}
                        <td className="py-4 px-4 align-top text-right">
                          <button
                            type="button"
                            onClick={() => openEditModal(ord)}
                            className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white font-medium text-xs transition border border-zinc-700"
                          >
                            Cập nhật
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MANDATORY CONFIRMATION MODAL for updating Google Sheets (Destructive/Mutating Operation) */}
      <AnimatePresence>
        {editingOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-zinc-900 border border-zinc-700 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-5"
            >
              <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
                <div className="flex items-center gap-2 text-amber-400 font-bold text-sm uppercase tracking-wide">
                  <FileSpreadsheet className="w-4 h-4" />
                  <span>Xác Nhận Cập Nhật Google Sheets</span>
                </div>
                <button
                  type="button"
                  onClick={() => setEditingOrder(null)}
                  className="text-zinc-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="text-xs text-zinc-300 space-y-2 bg-zinc-950 p-3.5 rounded-xl border border-zinc-800">
                <div className="flex justify-between">
                  <span className="text-zinc-400">Mã đơn hàng:</span>
                  <strong className="text-white font-mono">{editingOrder.orderId}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Khách hàng:</span>
                  <span className="text-white font-medium">{editingOrder.customerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Dòng trong Google Sheet:</span>
                  <span className="text-zinc-400 font-mono">Dòng {editingOrder.rowIndex}</span>
                </div>
              </div>

              {/* Form to select new statuses */}
              <div className="space-y-4 text-xs">
                <div className="space-y-1.5">
                  <label className="text-zinc-300 font-semibold block">
                    Tiến độ đơn hàng mới:
                  </label>
                  <select
                    value={targetOrderStatus}
                    onChange={(e) => setTargetOrderStatus(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-zinc-500"
                  >
                    <option value="Mới Tiếp Nhận">Mới Tiếp Nhận</option>
                    <option value="Đang Chuẩn Bị Hàng">Đang Chuẩn Bị Hàng</option>
                    <option value="Đang Giao Hàng">Đang Giao Hàng</option>
                    <option value="Giao Thành Công">Giao Thành Công</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-zinc-300 font-semibold block">
                    Trạng thái thanh toán:
                  </label>
                  <select
                    value={targetPaymentStatus}
                    onChange={(e) => setTargetPaymentStatus(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-zinc-500"
                  >
                    <option value="Chưa Thanh Toán">Chưa Thanh Toán</option>
                    <option value="Đã Thanh Toán">Đã Thanh Toán</option>
                  </select>
                </div>

                <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-[11px] text-amber-200/90 leading-relaxed">
                  * Thao tác này sẽ ghi đè trực tiếp các ô tương ứng trên Google Sheets được lưu trữ tại tài khoản của bạn.
                </div>
              </div>

              {/* Buttons */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingOrder(null)}
                  disabled={isUpdatingStatus}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-semibold transition"
                >
                  Hủy Bỏ
                </button>
                <button
                  type="button"
                  onClick={handleConfirmStatusUpdate}
                  disabled={isUpdatingStatus}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-md shadow-emerald-950/60 disabled:opacity-50"
                >
                  {isUpdatingStatus ? (
                    <span>Đang lưu...</span>
                  ) : (
                    <span>Xác Nhận Lưu</span>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal to configure custom sheet */}
      <AnimatePresence>
        {isCustomSheetModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-zinc-900 border border-zinc-700 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
                <h3 className="text-sm font-bold text-white">Kết Nối Bảng Tính Google Sheets Khác</h3>
                <button
                  type="button"
                  onClick={() => setIsCustomSheetModalOpen(false)}
                  className="text-zinc-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <p className="text-xs text-zinc-400 leading-relaxed">
                Dán đường link đầy đủ của Google Sheets hoặc Spreadsheet ID mà bạn muốn sử dụng để nhận đơn hàng:
              </p>

              <input
                type="text"
                value={customSheetInput}
                onChange={(e) => setCustomSheetInput(e.target.value)}
                placeholder="https://docs.google.com/spreadsheets/d/1a2b3c.../edit"
                className="w-full bg-zinc-950 border border-zinc-700 rounded-xl p-3 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-500"
              />

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCustomSheetModalOpen(false)}
                  className="flex-1 py-2 px-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-semibold transition"
                >
                  Đóng
                </button>
                <button
                  type="button"
                  onClick={handleSaveCustomSheet}
                  disabled={!customSheetInput.trim()}
                  className="flex-1 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition disabled:opacity-50"
                >
                  Lưu & Kết Nối
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
