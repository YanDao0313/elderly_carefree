import React, { useEffect, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { Button, buttonVariants } from "@/components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    CardFooter,
} from "@/components/ui/card";
import {
    BadgeAlert,
    MessageSquareWarning,
    ShieldAlert,
    UserRoundCheck,
    X,
} from "lucide-react";

interface FraudData {
    originalText: string;
    result: {
        诈骗概率: number;
        诈骗类型: string;
        智能建议: string;
    };
}

export default function NoticePage() {
    const [fraudData, setFraudData] = useState<FraudData | null>(null);
    const [canClose, setCanClose] = useState(false);
    const [countdown, setCountdown] = useState(5);

    // 关闭窗口的函数
    const closeWindow = () => {
        if (canClose) {
            window.electron.detect.closeFraudNotice();
        }
    };

    useEffect(() => {
        // 接收从主进程传递的诈骗数据
        window.electron.receive("fraud-data", (data: FraudData) => {
            console.log("收到诈骗数据:", data);
            setFraudData(data);
        });

        // 设置倒计时，5秒后允许关闭窗口
        const timer = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    setCanClose(true);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        const playWarningTTS = async () => {
            // 最大重试次数
            const maxRetries = 3;
            let retryCount = 0;
            let success = false;

            while (retryCount < maxRetries && !success) {
                try {
                    console.log(
                        `尝试播放 TTS 警告 (尝试 ${
                            retryCount + 1
                        }/${maxRetries})...`
                    );

                    // 获取 TTS 服务端口
                    const ttsPort = await window.electron.tts.getPort();
                    console.log("获取到 TTS 端口:", ttsPort);

                    if (!ttsPort) {
                        console.error("TTS 服务端口未找到");
                        retryCount++;

                        if (retryCount < maxRetries) {
                            console.log(`等待 1 秒后重试...`);
                            await new Promise((resolve) =>
                                setTimeout(resolve, 1000)
                            );
                        }
                        continue;
                    }

                    // 准备 TTS 请求参数
                    const ttsParams = {
                        text: "警告！探测到诈骗风险，请您谨慎对待、慎重处理！",
                        voice: "zh-CN-YunjianNeural",
                        volume: 100,
                        rate: 10,
                    };
                    console.log("TTS 请求参数:", ttsParams);

                    // 发送 TTS 请求
                    console.log(
                        `发送 TTS 请求到 http://localhost:${ttsPort}/tts`
                    );
                    const response = await fetch(
                        `http://localhost:${ttsPort}/tts`,
                        {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify(ttsParams),
                        }
                    );

                    // 检查响应状态
                    console.log("TTS 响应状态:", response.status);
                    if (!response.ok) {
                        const errorText = await response.text();
                        console.error(
                            "TTS 请求失败:",
                            response.status,
                            errorText
                        );
                        throw new Error(
                            `TTS 请求失败: ${response.status} ${errorText}`
                        );
                    }

                    // 处理音频数据
                    console.log("获取音频数据...");
                    const audioBlob = await response.blob();
                    console.log("音频大小:", audioBlob.size, "字节");

                    if (audioBlob.size === 0) {
                        throw new Error("获取到的音频数据为空");
                    }

                    const audioUrl = URL.createObjectURL(audioBlob);
                    const audio = new Audio(audioUrl);

                    // 播放音频
                    console.log("开始播放音频...");
                    await audio.play();
                    console.log("音频播放开始");

                    // 播放完成后清理 URL
                    audio.onended = () => {
                        console.log("音频播放完成");
                        URL.revokeObjectURL(audioUrl);
                    };

                    // 标记成功
                    success = true;
                } catch (error) {
                    console.error("TTS 播放失败:", error);
                    retryCount++;

                    if (retryCount < maxRetries) {
                        console.log(`等待 ${retryCount * 1000} 毫秒后重试...`);
                        await new Promise((resolve) =>
                            setTimeout(resolve, retryCount * 1000)
                        );
                    }
                }
            }

            if (!success) {
                console.error(`TTS 播放失败，已重试 ${maxRetries} 次`);
            }
        };

        playWarningTTS();

        // 组件卸载时清除监听器和定时器
        return () => {
            window.electron.removeAllListeners("fraud-data");
            clearInterval(timer);
        };
    }, []); // 空依赖数组意味着只在组件挂载时执行一次

    // 计算显示的诈骗风险文本
    const getFraudRiskText = (probability: number) => {
        if (probability > 0.8) return "极高风险";
        if (probability > 0.5) return "高风险";
        if (probability > 0.3) return "中等风险";
        if (probability > 0.1) return "低风险";
        return "几乎无风险";
    };

    return (
        <React.Fragment>
            <Head>
                <title>银发无忧 - 侦测到潜在的诈骗风险！</title>
            </Head>

            <div className="relative flex min-h-screen flex-col bg-background">
                <div className="w-full h-screen flex flex-col items-center justify-center px-4">
                    <div className="relative flex-1 min-h-0 p-2 w-full h-full">
                        <Card>
                            <CardHeader>
                                <div className="flex flex-row items-center justify-between space-y-0">
                                    <div className="flex items-center gap-2">
                                        <ShieldAlert className="h-5 w-5 text-destructive" />
                                        <CardTitle className="text-destructive">
                                            警告
                                        </CardTitle>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Link
                                            href="/cases"
                                            className={buttonVariants({
                                                variant: "outline",
                                            })}
                                        >
                                            查看诈骗案例
                                        </Link>
                                    </div>
                                </div>
                                <CardDescription className="text-destructive">
                                    银发无忧探测到潜在的诈骗风险，请您谨慎操作！
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4 p-3">
                                    <Alert variant="destructive">
                                        <div className="flex items-center gap-2">
                                            <BadgeAlert className="h-5 w-5 text-destructive" />
                                            <AlertTitle>
                                                探测到疑似诈骗信息
                                            </AlertTitle>
                                        </div>
                                        <AlertDescription className="mt-2">
                                            <p>
                                                探测到疑似诈骗信息：
                                                <span className="bg-red-100 dark:bg-orange-950">
                                                    {fraudData?.originalText ||
                                                        "加载中..."}
                                                </span>
                                                {fraudData?.result && (
                                                    <>
                                                        ，种类为
                                                        <strong>
                                                            {
                                                                fraudData.result
                                                                    .诈骗类型
                                                            }
                                                        </strong>
                                                        ，风险等级：
                                                        <strong>
                                                            {getFraudRiskText(
                                                                fraudData.result
                                                                    .诈骗概率
                                                            )}
                                                            (
                                                            {Math.round(
                                                                fraudData.result
                                                                    .诈骗概率 *
                                                                    100
                                                            )}
                                                            %)
                                                        </strong>
                                                    </>
                                                )}
                                                <br />
                                                <strong>
                                                    请您严肃对待，谨慎处理。
                                                </strong>
                                                如需进一步的帮助，请致电96110。
                                            </p>
                                        </AlertDescription>
                                    </Alert>
                                    <Alert className="border-yellow-500 dark:border-yellow-400">
                                        <div className="flex items-center gap-2">
                                            <MessageSquareWarning className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                                            <AlertTitle className="text-yellow-600 dark:text-yellow-400">
                                                智能提示
                                            </AlertTitle>
                                        </div>
                                        <AlertDescription className="mt-2 text-yellow-600 dark:text-yellow-400">
                                            <p>
                                                {fraudData?.result?.智能建议 ||
                                                    "正在分析诈骗信息，请稍候..."}
                                            </p>
                                        </AlertDescription>
                                    </Alert>
                                    <Alert>
                                        <div className="flex items-center gap-2">
                                            <UserRoundCheck className="h-5 w-5" />
                                            <AlertTitle>
                                                您为何会看到此警告？
                                            </AlertTitle>
                                        </div>
                                        <AlertDescription className="mt-2">
                                            <p>
                                                软件通过对提供的文本信息使用自然语言处理技术进行分析，侦测是否含有诈骗风险，在监测到诈骗信息时为您弹窗预警并语音提示。
                                                <br />
                                                触发此警告即意味着软件探测到了可能包含诈骗内容的信息。
                                                <strong>
                                                    请您严肃对待，谨慎处理。
                                                </strong>
                                            </p>
                                        </AlertDescription>
                                    </Alert>
                                </div>
                            </CardContent>
                            <CardFooter className="flex justify-end">
                                {!canClose ? (
                                    <div className="text-sm text-muted-foreground">
                                        请等待 {countdown} 秒后再关闭此窗口...
                                    </div>
                                ) : (
                                    <Button onClick={closeWindow}>
                                        我已了解，关闭窗口
                                    </Button>
                                )}
                            </CardFooter>
                        </Card>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
}
