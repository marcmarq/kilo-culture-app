const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");

// Import services using CommonJS
const {
  addMember, getAllMembers, getMemberById, updateMember, deleteMember
} = require("./services/memberService.js");
const {
  registerUser, loginUser, authenticateUser, logoutUser
} = require("./services/authService.js");
const {
  addPayment, getAllPayments, getPaymentById, updatePayment, deletePayment
} = require("./services/paymentService.js");


let mainWindow;

app.whenReady().then(() => {
  console.log("Electron app is ready.");

  const indexPath = path.resolve(__dirname, "react-app/dist/index.html");
  console.log(`Attempting to load: file://${indexPath}`);

  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      preload: path.join(__dirname, "preload.js"),
    },
  });
  console.log("BrowserWindow created successfully.");

  mainWindow
    .loadURL(`file://${indexPath}`)
    .then(() => console.log("Renderer Load Initiated."))
    .catch((err) => console.error("Error loading URL:", err));

  mainWindow.webContents.once("did-finish-load", () => {
    console.log("Renderer Loaded Successfully.");
  });

  mainWindow.webContents.once("did-fail-load", (_, errorCode, errorDescription) => {
    console.error(`Failed to load: ${errorCode} - ${errorDescription}`);
  });

  mainWindow.webContents.on("console-message", (event, level, message, line, source) => {
    console.log(`Renderer Log [${level}]: ${message} (source: ${source}:${line})`);
  });

  mainWindow.webContents.openDevTools({ mode: "detach" });
});



// -------------------- Authentication IPC Handlers --------------------
ipcMain.handle("auth:register", async (_, name, email, password) => {
  try {
    return await registerUser(name, email, password);
  } catch (error) {
    return { success: false, message: error.message };
  }
});

ipcMain.handle("auth:login", async (_, email, password) => {
  try {
    return await loginUser(email, password);
  } catch (error) {
    return { success: false, message: error.message };
  }
});

ipcMain.handle("auth:authenticateUser", async (_, token) => {
  try {
    return await authenticateUser(token);
  } catch (error) {
    return { success: false, message: error.message };
  }
});

ipcMain.handle("auth:logout", async (_, token) => {
  try {
    return await logoutUser(token);
  } catch (error) {
    return { success: false, message: error.message };
  }
});

ipcMain.handle("auth:checkSession", async (_, token) => {
  try {
    return await authenticateUser(token);
  } catch (error) {
    return false;
  }
});

// -------------------- Members IPC Handlers --------------------
ipcMain.handle("members:add", async (_, member) => {
  try {
    return await addMember(member);
  } catch (error) {
    return { success: false, message: error.message };
  }
});

ipcMain.handle("members:getAll", async () => {
  try {
    return await getAllMembers();
  } catch (error) {
    return { success: false, message: error.message };
  }
});

ipcMain.handle("members:getById", async (_, id) => {
  try {
    return await getMemberById(id);
  } catch (error) {
    return { success: false, message: error.message };
  }
});

ipcMain.handle("members:update", async (_, id, updatedData) => {
  try {
    return await updateMember(id, updatedData);
  } catch (error) {
    return { success: false, message: error.message };
  }
});

ipcMain.handle("members:delete", async (_, id) => {
  try {
    return await deleteMember(id);
  } catch (error) {
    return { success: false, message: error.message };
  }
});

// -------------------- Payments IPC Handlers --------------------
ipcMain.handle("payments:add", async (_, payment) => {
  try {
    if (!payment.memberId || !payment.amount || !payment.date || !payment.type || !payment.expiry) {
      throw new Error("Missing required payment fields.");
    }
    return await addPayment(payment);
  } catch (error) {
    return { success: false, message: error.message };
  }
});

ipcMain.handle("payments:getAll", async () => {
  try {
    return await getAllPayments();
  } catch (error) {
    return { success: false, message: error.message };
  }
});

ipcMain.handle("payments:getById", async (_, id) => {
  try {
    return await getPaymentById(id);
  } catch (error) {
    return { success: false, message: error.message };
  }
});

ipcMain.handle("payments:update", async (_, id, updatedData) => {
  try {
    return await updatePayment(id, updatedData);
  } catch (error) {
    return { success: false, message: error.message };
  }
});

ipcMain.handle("payments:delete", async (_, id) => {
  try {
    return await deletePayment(id);
  } catch (error) {
    return { success: false, message: error.message };
  }
});

