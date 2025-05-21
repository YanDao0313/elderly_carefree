import path from "path";
import fs from "fs";
import crypto from "crypto";
import os from "os";
import { EdgeTTS } from "node-edge-tts";

interface TTSOptions {
    text: string;
    voice?: string;
    rate?: number;
    volume?: number;
    pitch?: number;
}

interface TTSConfig {
    maxTextLength: number;
    tempDir: string;
    fileExpiryMs: number;
    rateRange: { min: number; max: number };
    volumeRange: { min: number; max: number };
    pitchRange: { min: number; max: number };
}

export class TTSService {
    private config: TTSConfig;
    private tempDir: string;

    constructor() {
        this.config = {
            maxTextLength: 5000, // 最大文本长度
            tempDir: path.join(os.tmpdir(), "edge-tts-temp"),
            fileExpiryMs: 30 * 60 * 1000, // 30分钟后过期
            rateRange: { min: -100, max: 100 },
            volumeRange: { min: -100, max: 100 },
            pitchRange: { min: -100, max: 100 },
        };
        this.initTempDir();
        this.startCleanupSchedule();
        console.log("TTS服务初始化完成，临时目录:", this.config.tempDir);
    }

    private initTempDir(): void {
        try {
            if (!fs.existsSync(this.config.tempDir)) {
                fs.mkdirSync(this.config.tempDir, { recursive: true });
                console.log("创建TTS临时目录:", this.config.tempDir);
            } else {
                console.log("TTS临时目录已存在:", this.config.tempDir);
            }
        } catch (error) {
            console.error("创建临时目录失败:", error);
            // 尝试使用当前目录作为备用
            this.config.tempDir = path.join(process.cwd(), "tts-temp");
            console.log("尝试使用备用临时目录:", this.config.tempDir);
            if (!fs.existsSync(this.config.tempDir)) {
                fs.mkdirSync(this.config.tempDir, { recursive: true });
            }
        }
    }

    private startCleanupSchedule(): void {
        // 每5分钟清理一次过期文件
        setInterval(() => this.cleanupTempFiles(), 5 * 60 * 1000);
    }

    private cleanupTempFiles(): void {
        try {
            const files = fs.readdirSync(this.config.tempDir);
            const now = Date.now();

            files.forEach((file) => {
                const filePath = path.join(this.config.tempDir, file);
                const stats = fs.statSync(filePath);
                if (now - stats.ctimeMs > this.config.fileExpiryMs) {
                    fs.unlinkSync(filePath);
                }
            });
        } catch (error) {
            console.error("清理临时文件失败:", error);
        }
    }

    private validateOptions(options: TTSOptions): void {
        if (!options.text) {
            throw new Error("文本内容不能为空");
        }

        if (options.text.length > this.config.maxTextLength) {
            throw new Error(
                `文本长度不能超过${this.config.maxTextLength}个字符`
            );
        }

        if (
            options.rate !== undefined &&
            (options.rate < this.config.rateRange.min ||
                options.rate > this.config.rateRange.max)
        ) {
            throw new Error(
                `语速范围必须在${this.config.rateRange.min}到${this.config.rateRange.max}之间`
            );
        }

        if (
            options.volume !== undefined &&
            (options.volume < this.config.volumeRange.min ||
                options.volume > this.config.volumeRange.max)
        ) {
            throw new Error(
                `音量范围必须在${this.config.volumeRange.min}到${this.config.volumeRange.max}之间`
            );
        }

        if (
            options.pitch !== undefined &&
            (options.pitch < this.config.pitchRange.min ||
                options.pitch > this.config.pitchRange.max)
        ) {
            throw new Error(
                `音调范围必须在${this.config.pitchRange.min}到${this.config.pitchRange.max}之间`
            );
        }
    }

    private generateTempFilePath(options: TTSOptions): string {
        // 使用参数创建唯一的文件名
        const hash = crypto
            .createHash("md5")
            .update(JSON.stringify(options))
            .digest("hex");
        return path.join(this.config.tempDir, `${hash}.mp3`);
    }

    public getAvailableVoices(lang?: string): string[] {
        // 返回中文语音包列表
        return [
            "zh-CN-XiaoxiaoNeural",
            "zh-CN-XiaoyiNeural",
            "zh-CN-YunjianNeural",
            "zh-CN-YunxiNeural",
            "zh-CN-YunxiaNeural",
            "zh-CN-YunyangNeural",
            "zh-HK-HiuGaaiNeural",
            "zh-HK-WanLungNeural",
            "zh-TW-HsiaoChenNeural",
            "zh-TW-YunJheNeural",
        ];
    }

    public async generateAudio(options: TTSOptions): Promise<string> {
        try {
            console.log("开始生成音频，参数:", options);
            this.validateOptions(options);
            const outputPath = this.generateTempFilePath(options);
            console.log("输出路径:", outputPath);

            // 如果文件已存在且未过期，直接返回
            if (fs.existsSync(outputPath)) {
                const stats = fs.statSync(outputPath);
                if (Date.now() - stats.ctimeMs < this.config.fileExpiryMs) {
                    console.log("音频文件已存在，直接返回:", outputPath);
                    return outputPath;
                }
            }

            // 打印参数
            console.log("TTS参数:", {
                text: options.text,
                outputPath,
                voice: options.voice || "zh-CN-XiaoxiaoNeural",
                rate: options.rate ? `${options.rate}%` : undefined,
                volume: options.volume ? `${options.volume}%` : undefined,
                pitch: options.pitch ? `${options.pitch}%` : undefined,
            });

            // 创建TTS实例
            console.log("创建EdgeTTS实例");
            const tts = new EdgeTTS({
                voice: options.voice || "zh-CN-XiaoxiaoNeural",
                rate: options.rate ? `${options.rate}%` : undefined,
                volume: options.volume ? `${options.volume}%` : undefined,
                pitch: options.pitch ? `${options.pitch}%` : undefined,
            });

            // 生成音频
            console.log("开始生成音频...");
            await tts.ttsPromise(options.text, outputPath);
            console.log("音频生成完成");

            // 验证文件是否生成
            if (!fs.existsSync(outputPath)) {
                console.error("音频文件未生成，路径:", outputPath);
                throw new Error("音频文件未生成");
            }

            const stats = fs.statSync(outputPath);
            if (stats.size === 0) {
                console.error("生成的音频文件为空，路径:", outputPath);
                throw new Error("生成的音频文件为空");
            }

            console.log("音频文件生成成功:", outputPath, "大小:", stats.size);
            return outputPath;
        } catch (error) {
            console.error("TTS生成错误:", error);
            // 尝试获取更详细的错误信息
            if (error instanceof Error) {
                console.error("错误名称:", error.name);
                console.error("错误消息:", error.message);
                console.error("错误堆栈:", error.stack);
            }
            throw new Error(`音频生成失败: ${error.message || "未知错误"}`);
        }
    }
}
