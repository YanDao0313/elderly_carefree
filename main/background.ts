import path from "path";
import { app, ipcMain } from "electron";
import serve from "electron-serve";
import { createWindow } from "./helpers";
import { getTTSPort, setTTSPort } from "./services/tts";
import express from "express";
import { TTSRoutes } from "./routes/tts.routes";
import { POST as handleChatRequest } from "./routes/chat.routes";
import { POST as handleDetectRequest } from "./routes/detect.routes";

const isProd = process.env.NODE_ENV === "production";

if (isProd) {
    serve({ directory: "app" });
} else {
    app.setPath("userData", `${app.getPath("userData")} (development)`);
}

// 创建 Express 服务器
const expressApp = express();
expressApp.use(express.json());

// 添加 CORS 中间件
expressApp.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    );

    // 处理 OPTIONS 预检请求
    if (req.method === "OPTIONS") {
        return res.sendStatus(200);
    }

    next();
});

// 设置 TTS 路由
const ttsRoutes = new TTSRoutes();
expressApp.use("/tts", ttsRoutes.getRouter());

// 启动 Express 服务器
const ttsServer = expressApp.listen(0, () => {
    const addressInfo = ttsServer.address() as { port: number };
    const port = addressInfo.port;
    console.log(`TTS 服务器运行在端口 ${port}`);
    // 设置 TTS 端口
    setTTSPort(port);
});

(async () => {
    await app.whenReady();

    const mainWindow = await createWindow("main", {
        width: 1000,
        height: 900,
        webPreferences: {
            preload: path.join(__dirname, "preload.js"),
        },
    });

    // 注册 IPC 处理程序
    ipcMain.handle("get-tts-port", async () => {
        return await getTTSPort();
    });

    // 注册打开诈骗警告窗口的处理程序
    ipcMain.handle("open-fraud-notice", async (event, fraudData) => {
        try {
            const noticeWindow = await createWindow("notice", {
                width: 800,
                height: 600,
                webPreferences: {
                    preload: path.join(__dirname, "preload.js"),
                },
                parent: mainWindow,
                modal: true,
                show: false,
            });

            // 设置窗口加载完成后显示
            noticeWindow.once("ready-to-show", () => {
                noticeWindow.show();
            });

            // 当窗口准备好后发送诈骗数据
            noticeWindow.webContents.on("did-finish-load", () => {
                noticeWindow.webContents.send("fraud-data", fraudData);
            });

            // 加载警告页面
            if (isProd) {
                await noticeWindow.loadURL("app://./notice");
            } else {
                const port = process.argv[2];
                await noticeWindow.loadURL(`http://localhost:${port}/notice`);
            }

            // 注册关闭窗口的IPC处理程序
            const closeHandler = () => {
                if (!noticeWindow.isDestroyed()) {
                    noticeWindow.close();
                }
            };

            ipcMain.once("close-fraud-notice", closeHandler);

            // 窗口关闭时移除处理程序
            noticeWindow.on("closed", () => {
                ipcMain.removeHandler("close-fraud-notice");
            });

            return { success: true };
        } catch (error) {
            console.error("打开诈骗警告窗口时出错:", error);
            return {
                success: false,
                error: "打开警告窗口失败",
                details: error instanceof Error ? error.message : "未知错误",
            };
        }
    });

    // 注册诈骗检测处理程序
    ipcMain.handle("detect:check", async (event, text) => {
        try {
            // 创建一个类似于 Web API Request 的对象，以便与 handleDetectRequest 兼容
            const mockRequest = {
                json: async () => ({ text }),
            };

            const result = await handleDetectRequest(mockRequest as any);

            // 处理错误响应
            if (result.error) {
                return {
                    success: false,
                    error: result.error,
                    details: result.details || "",
                    status: result.status || 500,
                };
            }

            // 处理成功响应
            return {
                success: true,
                data: result.result,
            };
        } catch (error) {
            console.error("处理诈骗检测请求时出错:", error);
            return {
                success: false,
                error: "处理请求时发生错误",
                details: error instanceof Error ? error.message : "未知错误",
            };
        }
    });

    // 注册聊天API处理程序
    ipcMain.handle("chat:send", async (event, messages) => {
        try {
            // 创建一个类似于 Web API Request 的对象，以便与 handleChatRequest 兼容
            const mockRequest = {
                json: async () => ({ messages }),
            };

            const result = await handleChatRequest(mockRequest as any);

            // 处理流式响应
            if (result.type === "stream" && result.stream) {
                // 创建一个唯一的通道ID用于此次对话
                const channelId = `chat:stream:${Date.now()}`;

                // 启动一个异步处理流的过程
                (async () => {
                    try {
                        for await (const chunk of result.stream) {
                            if (chunk.choices[0]?.delta?.content) {
                                // 只发送必要的数据，避免序列化整个对象
                                event.sender.send(channelId, {
                                    content: chunk.choices[0].delta.content,
                                });
                            }
                        }
                        // 发送完成信号
                        event.sender.send(`${channelId}:done`);
                    } catch (error) {
                        console.error("处理流时出错:", error);
                        event.sender.send(`${channelId}:error`, {
                            message:
                                error instanceof Error
                                    ? error.message
                                    : "未知错误",
                        });
                    }
                })();

                // 返回通道ID，而不是尝试返回复杂对象
                return {
                    success: true,
                    type: "stream",
                    channelId: channelId,
                };
            }

            // 处理错误响应
            if (result.error) {
                return {
                    success: false,
                    error: result.error,
                    details: result.details || "",
                    status: result.status || 500,
                };
            }

            // 处理其他类型的响应
            return {
                success: true,
                data: result,
            };
        } catch (error) {
            console.error("处理聊天消息时出错:", error);
            return {
                success: false,
                error: "处理请求时发生错误",
                details: error instanceof Error ? error.message : "未知错误",
            };
        }
    });

    if (isProd) {
        await mainWindow.loadURL("app://./home");
    } else {
        const port = process.argv[2];
        await mainWindow.loadURL(`http://localhost:${port}/home`);
        mainWindow.webContents.openDevTools();
    }
})();

app.on("window-all-closed", () => {
    app.quit();
});
