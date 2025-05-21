import { Router, Request, Response } from "express";
import { TTSService } from "../services/tts.service";
import fs from "fs";
import path from "path";

export class TTSRoutes {
    private router: Router;
    private ttsService: TTSService;

    constructor() {
        this.router = Router();
        try {
            console.log("初始化 TTSService...");
            this.ttsService = new TTSService();
            console.log("TTSService 初始化成功");
        } catch (error) {
            console.error("TTSService 初始化失败:", error);
            throw error;
        }
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        // 获取可用的语音包列表
        this.router.get("/", this.getVoices.bind(this));

        // 生成语音文件
        this.router.post("/", this.generateAudio.bind(this));

        console.log("TTS 路由初始化完成");
    }

    private async getVoices(req: Request, res: Response): Promise<void> {
        try {
            console.log("收到获取语音包请求");
            const lang = req.query.lang as string | undefined;
            const voices = await this.ttsService.getAvailableVoices(lang);
            console.log("获取语音包成功, 数量:", voices.length);
            res.json({ success: true, data: voices });
        } catch (error) {
            console.error("获取语音包列表失败:", error);
            res.status(500).json({
                success: false,
                error: error.message || "获取语音包列表失败",
            });
        }
    }

    private async generateAudio(req: Request, res: Response): Promise<void> {
        try {
            console.log("收到 TTS 请求, body:", req.body);

            // 验证请求参数
            if (!req.body || !req.body.text) {
                console.error("无效的请求参数: 缺少文本");
                return res.status(400).json({
                    success: false,
                    error: "请求参数无效: 缺少文本",
                });
            }

            const { text, voice, rate, volume, pitch } = req.body;
            console.log("处理 TTS 请求:", { text, voice, rate, volume, pitch });

            // 调用 TTS 服务生成音频
            console.log("调用 TTSService.generateAudio...");
            const audioPath = await this.ttsService.generateAudio({
                text,
                voice,
                rate,
                volume,
                pitch,
            });

            console.log("音频文件生成成功:", audioPath);

            // 检查文件是否存在
            if (!fs.existsSync(audioPath)) {
                console.error("生成的音频文件不存在:", audioPath);
                return res.status(500).json({
                    success: false,
                    error: "音频文件生成失败: 文件不存在",
                });
            }

            // 检查文件大小
            const stats = fs.statSync(audioPath);
            console.log("音频文件大小:", stats.size, "字节");
            if (stats.size === 0) {
                console.error("生成的音频文件为空:", audioPath);
                return res.status(500).json({
                    success: false,
                    error: "音频文件生成失败: 文件为空",
                });
            }

            // 设置响应头
            res.setHeader("Content-Type", "audio/mpeg");
            res.setHeader(
                "Content-Disposition",
                `attachment; filename="tts-${Date.now()}.mp3"`
            );
            console.log("设置响应头完成");

            // 创建文件读取流并传输到响应
            console.log("开始传输音频文件...");
            const fileStream = fs.createReadStream(audioPath);
            fileStream.pipe(res);

            // 处理错误
            fileStream.on("error", (error) => {
                console.error("文件流传输错误:", error);
                if (!res.headersSent) {
                    res.status(500).json({
                        success: false,
                        error: "音频文件传输失败: " + error.message,
                    });
                }
            });

            // 处理完成
            fileStream.on("end", () => {
                console.log("音频文件传输完成");
            });
        } catch (error) {
            console.error("TTS生成失败:", error);
            // 尝试获取更详细的错误信息
            if (error instanceof Error) {
                console.error("错误名称:", error.name);
                console.error("错误消息:", error.message);
                console.error("错误堆栈:", error.stack);
            }

            if (!res.headersSent) {
                res.status(500).json({
                    success: false,
                    error: error.message || "音频生成失败",
                });
            }
        }
    }

    public getRouter(): Router {
        return this.router;
    }
}
