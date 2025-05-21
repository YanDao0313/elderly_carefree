import { app, ipcMain, screen } from "electron";
import os from "os";

export class SystemService {
    constructor() {
        this.setupIpcHandlers();
    }

    private setupIpcHandlers() {
        // 获取系统信息
        ipcMain.handle("system:getInfo", () => {
            const primaryDisplay = screen.getPrimaryDisplay();
            return {
                platform: process.platform,
                arch: process.arch,
                version: os.release(),
                memory: {
                    total: os.totalmem(),
                    free: os.freemem(),
                },
                cpu: {
                    model: os.cpus()[0].model,
                    cores: os.cpus().length,
                    speed: os.cpus()[0].speed,
                },
                display: {
                    width: primaryDisplay.workAreaSize.width,
                    height: primaryDisplay.workAreaSize.height,
                    scaleFactor: primaryDisplay.scaleFactor,
                },
                network: {
                    hostname: os.hostname(),
                    ip: this.getLocalIP(),
                },
            };
        });

        // 获取应用版本
        ipcMain.handle("app:getVersion", () => {
            return app.getVersion();
        });
    }

    // 获取本地IP地址
    private getLocalIP(): string {
        const interfaces = os.networkInterfaces();
        for (const devName in interfaces) {
            const iface = interfaces[devName];
            if (!iface) continue;

            for (const alias of iface) {
                if (alias.family === "IPv4" && !alias.internal) {
                    return alias.address;
                }
            }
        }
        return "unknown";
    }
}
