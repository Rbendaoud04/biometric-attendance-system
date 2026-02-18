// ============================================================
// mockAPI.js - Simulated Backend API for Biometric Attendance System
// ============================================================

// Helper to generate random IDs
const generateUserId = () => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "USR-";
  for (let i = 0; i < 4; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

// Helper to simulate network delay
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Helper to generate random time
const generateRandomTime = (isLate = false) => {
  const hour = isLate
    ? Math.floor(Math.random() * 3) + 9
    : Math.floor(Math.random() * 2) + 7;
  const minute = Math.floor(Math.random() * 60);
  return `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
};

// Helper to generate random date within last 7 days
const generateRandomDate = () => {
  const today = new Date();
  const daysAgo = Math.floor(Math.random() * 7);
  const date = new Date(today);
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString().split("T")[0];
};

// Sample names and departments for mock data
const sampleNames = [
  "Alex Chen",
  "Sarah Johnson",
  "Michael Park",
  "Emily Davis",
  "James Wilson",
  "Maria Garcia",
  "David Kim",
  "Lisa Thompson",
  "Robert Martinez",
  "Jennifer Lee",
  "William Brown",
  "Amanda Taylor",
  "Christopher Moore",
  "Jessica Anderson",
  "Daniel White",
];

const departments = [
  "Engineering",
  "Human Resources",
  "Marketing",
  "Finance",
  "Operations",
  "Research & Development",
  "Sales",
  "Customer Support",
  "Legal",
  "IT Security",
];

// ============================================================
// API Functions
// ============================================================

export const registerUser = async (formData) => {
  await delay(2000);

  const userId = generateUserId();

  return {
    success: true,
    userId: userId,
    message: `User ${formData.name} successfully registered with biometric data.`,
    user: {
      id: userId,
      name: formData.name,
      employeeId: formData.employeeId,
      department: formData.department,
      registeredAt: new Date().toISOString(),
    },
  };
};

export const recognizeUser = async (blob) => {
  await delay(1500);

  // 10% chance of failure
  const failureChance = Math.random();
  if (failureChance < 0.1) {
    return {
      success: false,
      message:
        "Face not recognized. Please ensure proper lighting and face the camera directly.",
    };
  }

  const randomName =
    sampleNames[Math.floor(Math.random() * sampleNames.length)];
  const randomDepartment =
    departments[Math.floor(Math.random() * departments.length)];
  const confidence = (Math.random() * 0.15 + 0.85).toFixed(2);

  return {
    success: true,
    user: {
      id: generateUserId(),
      name: randomName,
      department: randomDepartment,
      photo_placeholder: randomName
        .split(" ")
        .map((n) => n[0])
        .join(""),
    },
    confidence: parseFloat(confidence),
    timestamp: new Date().toISOString(),
  };
};

export const getAttendanceLogs = async () => {
  await delay(700);

  const logs = [];
  const usedNames = new Set();

  for (let i = 0; i < 25; i++) {
    let name;
    do {
      name = sampleNames[Math.floor(Math.random() * sampleNames.length)];
    } while (usedNames.has(name) && usedNames.size < sampleNames.length);
    usedNames.add(name);

    const isLate = Math.random() < 0.15;
    const isFailed = Math.random() < 0.08;
    const confidence = (Math.random() * 5 + 94).toFixed(1);

    logs.push({
      id: generateUserId(),
      employeeId:
        "EMP-" + Math.random().toString(36).substr(2, 6).toUpperCase(),
      name: name,
      department: departments[Math.floor(Math.random() * departments.length)],
      time: generateRandomTime(isLate),
      date: generateRandomDate(),
      confidence: parseFloat(confidence),
      status: isFailed ? "FAILED" : "VERIFIED",
    });
  }

  logs.sort((a, b) => {
    const dateCompare = b.date.localeCompare(a.date);
    if (dateCompare !== 0) return dateCompare;
    return b.time.localeCompare(a.time);
  });

  return logs;
};

export const getDashboardStats = async () => {
  await delay(500);

  return {
    totalUsers: 247,
    todayAttendance: 183,
    avgConfidence: 97.2,
    failedAttempts: 4,
  };
};

// Get registered users for admin dashboard
export const getRegisteredUsers = async () => {
  await delay(600);

  const users = [];
  for (let i = 0; i < 18; i++) {
    const name = sampleNames[i % sampleNames.length];
    const daysAgo = Math.floor(Math.random() * 30);
    const enrollDate = new Date();
    enrollDate.setDate(enrollDate.getDate() - daysAgo);

    users.push({
      id: generateUserId(),
      employeeId:
        "EMP-" + Math.random().toString(36).substr(2, 6).toUpperCase(),
      name: name,
      department: departments[Math.floor(Math.random() * departments.length)],
      enrolledAt: enrollDate.toISOString().split("T")[0],
      embeddingStored: true,
    });
  }

  return users;
};

// Get system status for admin dashboard
export const getSystemStatus = async () => {
  await delay(400);

  return {
    faceRecognition: "OPERATIONAL",
    gestureDetection: "OPERATIONAL",
    embeddingDatabase: "OPERATIONAL",
    apiServer: "OPERATIONAL",
    accuracy: 99.2,
    inferenceTime: 142,
    threshold: 0.65,
    dbEntries: 247,
    lastUpdate: "2026-02-15 03:42:00",
    uptime: "14d 7h 23m",
  };
};

// Get recent attendance for ticker display
export const getRecentAttendance = async () => {
  await delay(600);
  return [
    { name: "Zara Ahmed", time: "09:38:02", confidence: "97.3%" },
    { name: "Marcus Chen", time: "09:35:41", confidence: "98.9%" },
    { name: "Aisha Patel", time: "09:31:15", confidence: "96.1%" },
    { name: "Dev Nair", time: "09:28:50", confidence: "99.2%" },
    { name: "Layla Hassan", time: "09:25:03", confidence: "95.8%" },
  ];
};

const mockAPI = {
  registerUser,
  recognizeUser,
  getAttendanceLogs,
  getDashboardStats,
  getRegisteredUsers,
  getSystemStatus,
  getRecentAttendance,
};

export default mockAPI;
