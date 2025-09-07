// LIFF ID Configuration
export interface LiffIdMapping {
  [path: string]: string;
}

// กำหนด LIFF ID สำหรับแต่ละ route
export const liffIdMapping: LiffIdMapping = {
  "/": import.meta.env.VITE_LIFF_ID_HOME,
  "/about": import.meta.env.VITE_LIFF_ID_ABOUT,
  // เพิ่ม route อื่นๆ ตามต้องการ
  // "/profile": import.meta.env.VITE_LIFF_ID_PROFILE,
};

// Default LIFF ID สำหรับ fallback
export const defaultLiffId = import.meta.env.VITE_LIFF_ID;

// ฟังก์ชันสำหรับหา LIFF ID ที่เหมาะสมกับ path ปัจจุบัน
export const getLiffIdForPath = (pathname: string): string => {
  // หา exact match ก่อน
  if (liffIdMapping[pathname]) {
    return liffIdMapping[pathname];
  }
  
  // หา partial match (สำหรับ dynamic routes)
  const matchingPath = Object.keys(liffIdMapping).find(path => {
    if (path === '/') return pathname === '/';
    return pathname.startsWith(path);
  });
  
  // ถ้าพบ matching path ให้ใช้ LIFF ID นั้น ถ้าไม่พบให้ใช้ default
  if (matchingPath && liffIdMapping[matchingPath]) {
    return liffIdMapping[matchingPath];
  }
  
  return defaultLiffId;
};