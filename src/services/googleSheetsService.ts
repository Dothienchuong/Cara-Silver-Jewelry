import { Order } from '../types';
import { formatVND, formatDate } from '../utils/format';

export interface SheetRowOrder {
  rowIndex: number; // 2-indexed row in Google Sheet
  orderId: string;
  orderDate: string;
  customerName: string;
  phone: string;
  address: string;
  city: string;
  district: string;
  itemsSummary: string;
  totalQuantity: number;
  subtotal: number;
  shippingFee: number;
  discount: number;
  total: number;
  paymentMethod: string;
  paymentStatus: string;
  orderStatus: string;
  note: string;
}

export const SHEET_NAME = 'Đơn Hàng';
export const DEFAULT_SHEET_TITLE = 'CARA Jewelry - Quản Lý Đơn Hàng';
export const SHEET_STORAGE_KEY = 'cara_google_sheet_config';

export interface SheetConfig {
  spreadsheetId: string;
  spreadsheetTitle: string;
  spreadsheetUrl: string;
  autoSync: boolean;
  lastSyncedAt?: string;
}

export const getSavedSheetConfig = (): SheetConfig | null => {
  try {
    const raw = localStorage.getItem(SHEET_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const saveSheetConfig = (config: SheetConfig) => {
  localStorage.setItem(SHEET_STORAGE_KEY, JSON.stringify(config));
};

export const clearSheetConfig = () => {
  localStorage.removeItem(SHEET_STORAGE_KEY);
};

// Headers schema for Google Sheets
export const SHEET_HEADERS = [
  'Mã Đơn Hàng',
  'Thời Gian Đặt',
  'Tên Khách Hàng',
  'Số Điện Thoại',
  'Địa Chỉ Giao Hàng',
  'Tỉnh / Thành Phố',
  'Quận / Huyện',
  'Chi Tiết Sản Phẩm & Size',
  'Số Lượng Món',
  'Tạm Tính (VNĐ)',
  'Phí Ship (VNĐ)',
  'Giảm Giá (VNĐ)',
  'Tổng Thanh Toán (VNĐ)',
  'Phương Thức TT',
  'Trạng Thái TT',
  'Trạng Thái Đơn Hàng',
  'Ghi Chú Đơn Hàng',
];

/**
 * Searches user's Google Drive for an existing CARA Orders spreadsheet
 */
export const findExistingSpreadsheet = async (token: string): Promise<{ id: string; name: string } | null> => {
  try {
    const query = encodeURIComponent(`name='${DEFAULT_SHEET_TITLE}' and mimeType='application/vnd.google-apps.spreadsheet' and trashed=false`);
    const res = await fetch(`https://www.googleapis.com/drive/v3/files?q=${query}&fields=files(id,name,webViewLink)`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) {
      console.warn('Drive search failed, proceeding to create new sheet', res.statusText);
      return null;
    }

    const data = await res.json();
    if (data.files && data.files.length > 0) {
      return { id: data.files[0].id, name: data.files[0].name };
    }
    return null;
  } catch (err) {
    console.warn('Error querying Google Drive files:', err);
    return null;
  }
};

/**
 * Create a new spreadsheet in Google Sheets and format headers
 */
export const createOrdersSpreadsheet = async (
  token: string,
  customTitle = DEFAULT_SHEET_TITLE
): Promise<{ id: string; title: string; url: string }> => {
  const payload = {
    properties: {
      title: customTitle,
    },
    sheets: [
      {
        properties: {
          title: SHEET_NAME,
          gridProperties: {
            frozenRowCount: 1,
            columnCount: 20,
          },
        },
      },
    ],
  };

  const res = await fetch('https://sheets.googleapis.com/v4/spreadsheets', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.error?.message || 'Không thể tạo Google Sheet mới trên tài khoản Google.');
  }

  const sheetData = await res.json();
  const spreadsheetId = sheetData.spreadsheetId;
  const sheetUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`;

  // Write header row
  await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(SHEET_NAME)}!A1:Q1?valueInputOption=USER_ENTERED`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      values: [SHEET_HEADERS],
    }),
  });

  // Apply styling to Header row (Dark Blue background, white bold text)
  try {
    await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}:batchUpdate`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        requests: [
          {
            repeatCell: {
              range: {
                sheetId: sheetData.sheets[0].properties.sheetId,
                startRowIndex: 0,
                endRowIndex: 1,
                startColumnIndex: 0,
                endColumnIndex: SHEET_HEADERS.length,
              },
              cell: {
                userEnteredFormat: {
                  backgroundColor: { red: 0.08, green: 0.15, blue: 0.28 },
                  textFormat: { foregroundColor: { red: 1, green: 1, blue: 1 }, bold: true, fontSize: 11 },
                  horizontalAlignment: 'CENTER',
                },
              },
              fields: 'userEnteredFormat(backgroundColor,textFormat,horizontalAlignment)',
            },
          },
        ],
      }),
    });
  } catch (styleErr) {
    console.warn('Failed to style headers, spreadsheet is still functional:', styleErr);
  }

  return { id: spreadsheetId, title: customTitle, url: sheetUrl };
};

/**
 * Format order into Google Sheet row values
 */
export const orderToSheetRow = (order: Order): (string | number)[] => {
  const itemsSummary = order.items
    .map(
      (item) =>
        `${item.product.name} [${item.product.sku || item.product.modelCode || ''}] (Size: ${item.selectedSize}) x${item.quantity}`
    )
    .join('; \n');

  const totalQuantity = order.items.reduce((sum, item) => sum + item.quantity, 0);

  const paymentMethodLabel =
    order.paymentMethod === 'banking'
      ? 'Chuyển Khoản (MB Bank)'
      : order.paymentMethod === 'momo'
      ? 'Ví Điện Tử (ZaloPay/MoMo)'
      : 'COD (Tiền mặt)';

  const paymentStatusLabel = order.paymentStatus === 'paid' ? 'Đã Thanh Toán' : 'Chưa Thanh Toán';

  const orderStatusLabel =
    order.orderStatus === 'received'
      ? 'Mới Tiếp Nhận'
      : order.orderStatus === 'processing'
      ? 'Đang Chuẩn Bị Hàng'
      : order.orderStatus === 'shipping'
      ? 'Đang Giao Hàng'
      : 'Giao Thành Công';

  return [
    order.id,
    formatDate(order.createdAt),
    order.customer.fullName,
    `'${order.customer.phone}`, // Leading quote prevents phone number stripping leading 0
    order.customer.address,
    order.customer.city,
    order.customer.district,
    itemsSummary,
    totalQuantity,
    order.subtotal,
    order.shippingFee,
    order.discount,
    order.total,
    paymentMethodLabel,
    paymentStatusLabel,
    orderStatusLabel,
    order.customer.note || '',
  ];
};

/**
 * Append a single order into Google Sheets
 */
export const appendOrderToSheet = async (
  token: string,
  spreadsheetId: string,
  order: Order
): Promise<boolean> => {
  try {
    const row = orderToSheetRow(order);
    const range = `${encodeURIComponent(SHEET_NAME)}!A:Q`;
    const res = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}:append?valueInputOption=USER_ENTERED`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          values: [row],
        }),
      }
    );

    return res.ok;
  } catch (err) {
    console.error('Error appending order to Google Sheet:', err);
    return false;
  }
};

/**
 * Fetch all orders currently recorded in the Google Sheet
 */
export const fetchOrdersFromSheet = async (
  token: string,
  spreadsheetId: string
): Promise<SheetRowOrder[]> => {
  const range = `${encodeURIComponent(SHEET_NAME)}!A2:Q`;
  const res = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    throw new Error('Không thể đọc dữ liệu từ Google Sheets. Vui lòng kiểm tra quyền truy cập.');
  }

  const data = await res.json();
  const rows: any[][] = data.values || [];

  return rows
    .map((row, idx) => {
      if (!row || !row[0]) return null;
      return {
        rowIndex: idx + 2, // Row 1 is header, 1-indexed
        orderId: row[0] || '',
        orderDate: row[1] || '',
        customerName: row[2] || '',
        phone: (row[3] || '').replace(/^'/, ''),
        address: row[4] || '',
        city: row[5] || '',
        district: row[6] || '',
        itemsSummary: row[7] || '',
        totalQuantity: Number(row[8]) || 1,
        subtotal: Number(String(row[9]).replace(/[^0-9]/g, '')) || 0,
        shippingFee: Number(String(row[10]).replace(/[^0-9]/g, '')) || 0,
        discount: Number(String(row[11]).replace(/[^0-9]/g, '')) || 0,
        total: Number(String(row[12]).replace(/[^0-9]/g, '')) || 0,
        paymentMethod: row[13] || '',
        paymentStatus: row[14] || 'Chưa Thanh Toán',
        orderStatus: row[15] || 'Mới Tiếp Nhận',
        note: row[16] || '',
      };
    })
    .filter(Boolean) as SheetRowOrder[];
};

/**
 * Update an order's status and payment status in Google Sheet.
 * Call this ONLY AFTER explicit user confirmation in UI (Destructive / Update operation).
 */
export const updateOrderInSheet = async (
  token: string,
  spreadsheetId: string,
  rowIndex: number,
  newOrderStatus: string,
  newPaymentStatus: string
): Promise<boolean> => {
  const range = `${encodeURIComponent(SHEET_NAME)}!O${rowIndex}:P${rowIndex}`;
  const res = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}?valueInputOption=USER_ENTERED`,
    {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        values: [[newPaymentStatus, newOrderStatus]],
      }),
    }
  );

  return res.ok;
};
