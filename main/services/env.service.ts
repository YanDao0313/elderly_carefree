import * as path from "path";
import * as fs from "fs";
import * as dotenv from "dotenv";
import { app } from "electron";

export class EnvService {
    private static instance: EnvService;
    private envVars: { [key: string]: string } = {};

    private constructor() {
        this.loadEnvFile();
    }

    public static getInstance(): EnvService {
        if (!EnvService.instance) {
            EnvService.instance = new EnvService();
        }
        return EnvService.instance;
    }

    private loadEnvFile() {
        try {
            // 确定环境变量文件路径
            const isProd = process.env.NODE_ENV === "production";
            const envFile = isProd ? ".env.production" : ".env.development";

            let envPath;
            if (app.isPackaged) {
                // 生产环境：从Resources目录读取
                const resourcesPath =
                    process.platform === "darwin"
                        ? path.join(
                              path.dirname(app.getPath("exe")),
                              "..",
                              "Resources"
                          )
                        : path.join(
                              path.dirname(app.getPath("exe")),
                              "resources"
                          );
                envPath = path.join(resourcesPath, envFile);
            } else {
                // 开发环境：从项目根目录读取
                envPath = path.resolve(process.cwd(), envFile);
            }

            // 检查文件是否存在
            if (!fs.existsSync(envPath)) {
                throw new Error(
                    `Environment file ${envFile} not found at ${envPath}`
                );
            }

            // 加载环境变量
            const envConfig = dotenv.parse(fs.readFileSync(envPath));

            // 合并环境变量
            this.envVars = {
                ...process.env,
                ...envConfig,
            };

            // 将变量设置到 process.env
            Object.keys(envConfig).forEach((key) => {
                process.env[key] = envConfig[key];
            });

            console.log("Environment variables loaded successfully");
            console.log("Environment:", process.env.NODE_ENV);
            console.log("OPENAI_API_KEY is set:", !!process.env.OPENAI_API_KEY);
            console.log("Env file path:", envPath);
        } catch (error) {
            console.error("Error loading environment variables:", error);
            throw error;
        }
    }

    public get(key: string): string | undefined {
        return this.envVars[key];
    }

    public requireEnvVar(key: string): string {
        const value = this.get(key);
        if (!value) {
            throw new Error(`Required environment variable ${key} is not set`);
        }
        return value;
    }
}

// 导出单例实例
export const envService = EnvService.getInstance();
