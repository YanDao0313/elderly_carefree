import React, { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { Button, buttonVariants } from "@/components/ui/button";
import { SiteHeader } from "@/components/site-header";
import {
    Breadcrumb,
    BreadcrumbList,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbSeparator,
    BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    BadgeInfo,
    FileJson2,
    FileQuestion,
    MessagesSquare,
    ThumbsDown,
    ThumbsUp,
    Loader2,
    AlertTriangle,
    CheckCircle2,
    Timer,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

export default function ExperiencePage() {
    const [inputText, setInputText] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<any>(null);
    const [rawResponse, setRawResponse] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [feedback, setFeedback] = useState<"like" | "dislike" | null>(null);
    const [requestTime, setRequestTime] = useState<number | null>(null);
    const [responseTime, setResponseTime] = useState<number | null>(null);
    const [apiStatus, setApiStatus] = useState<"idle" | "success" | "error">(
        "idle"
    );

    const handleDetect = async () => {
        if (!inputText.trim()) {
            setError("请输入需要检测的内容");
            return;
        }

        setIsLoading(true);
        setError(null);
        setResult(null);
        setRawResponse(null);
        setFeedback(null);
        setApiStatus("idle");
        const startTime = Date.now();
        setRequestTime(startTime);

        try {
            const response = await window.electron.detect.checkText(inputText);
            const endTime = Date.now();
            setResponseTime(endTime - startTime);

            if (response.success && response.data) {
                setResult(response.data);
                setRawResponse(JSON.stringify(response.data, null, 2));
                setApiStatus("success");
            } else {
                setError(response.error || "检测失败，请稍后重试");
                if (response.rawContent) {
                    setRawResponse(response.rawContent);
                }
                setApiStatus("error");
            }
        } catch (err) {
            console.error("检测出错:", err);
            setError("检测过程中出现错误，请稍后重试");
            setApiStatus("error");
        } finally {
            setIsLoading(false);
        }
    };

    const handleFeedback = (type: "like" | "dislike") => {
        setFeedback(type);
        // 这里可以添加反馈提交到服务器的逻辑
    };

    return (
        <React.Fragment>
            <Head>
                <title>银发无忧 - 功能体验</title>
            </Head>

            <div className="relative flex min-h-screen flex-col bg-background">
                <div className="w-full h-screen flex flex-col items-center justify-center px-4">
                    <SiteHeader />

                    <div className="relative flex-1 min-h-0 p-8 w-full">
                        <div className="flex gap-2 h-auto">
                            <header className="flex h-16 shrink-0 items-center gap-2">
                                <div className="flex items-center gap-2 px-4">
                                    <Breadcrumb>
                                        <BreadcrumbList>
                                            <BreadcrumbItem>
                                                <BreadcrumbLink href="/home">
                                                    首页
                                                </BreadcrumbLink>
                                            </BreadcrumbItem>
                                            <BreadcrumbSeparator />
                                            <BreadcrumbItem>
                                                <BreadcrumbLink href="/settings">
                                                    设置
                                                </BreadcrumbLink>
                                            </BreadcrumbItem>
                                            <BreadcrumbSeparator />
                                            <BreadcrumbItem>
                                                <BreadcrumbPage>
                                                    功能体验
                                                </BreadcrumbPage>
                                            </BreadcrumbItem>
                                        </BreadcrumbList>
                                    </Breadcrumb>
                                    <Link
                                        href="/home"
                                        className={buttonVariants({
                                            variant: "outline",
                                        })}
                                    >
                                        回到主页
                                    </Link>
                                </div>
                            </header>
                        </div>
                        <Card className="text-wrap w-auto p-3">
                            <CardHeader>
                                <div className="flex items-center gap-2">
                                    <MessagesSquare className="h-5 w-5 text-primary" />
                                    <CardTitle>功能体验</CardTitle>
                                </div>
                                <CardDescription>
                                    体验本软件的核心功能——诈骗信息检测。
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <div className="flex">
                                    <Input
                                        className="w-11/12"
                                        value={inputText}
                                        onChange={(e) =>
                                            setInputText(e.target.value)
                                        }
                                        placeholder="请输入需要检测的文字内容..."
                                    />
                                    <Button
                                        className="w-1/12"
                                        variant="outline"
                                        onClick={handleDetect}
                                        disabled={
                                            isLoading || !inputText.trim()
                                        }
                                    >
                                        {isLoading ? (
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                        ) : (
                                            "提交"
                                        )}
                                    </Button>
                                </div>

                                {/* API状态信息 */}
                                {(apiStatus !== "idle" || isLoading) && (
                                    <div className="flex items-center justify-between text-sm">
                                        <div className="flex items-center gap-2">
                                            {isLoading ? (
                                                <Loader2 className="h-4 w-4 animate-spin text-yellow-500" />
                                            ) : apiStatus === "success" ? (
                                                <CheckCircle2 className="h-4 w-4 text-green-500" />
                                            ) : (
                                                <AlertTriangle className="h-4 w-4 text-red-500" />
                                            )}
                                            <span>
                                                API状态:{" "}
                                                {isLoading
                                                    ? "请求中..."
                                                    : apiStatus === "success"
                                                    ? "请求成功"
                                                    : "请求失败"}
                                            </span>
                                        </div>
                                        {responseTime && (
                                            <div className="flex items-center gap-1">
                                                <Timer className="h-4 w-4" />
                                                <span>
                                                    响应时间: {responseTime}ms
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                )}

                                <Alert>
                                    <div className="flex items-center gap-2">
                                        <BadgeInfo className="h-5 w-5" />
                                        <AlertTitle>检测结果</AlertTitle>
                                    </div>
                                    <AlertDescription className="mt-2">
                                        {error ? (
                                            <span className="text-red-500">
                                                {error}
                                            </span>
                                        ) : result ? (
                                            <div className="space-y-2">
                                                <div className="flex justify-between">
                                                    <span className="font-bold">
                                                        诈骗概率：
                                                    </span>
                                                    <span
                                                        className={
                                                            result.诈骗概率 >
                                                            0.5
                                                                ? "text-red-500 font-bold"
                                                                : "text-green-500"
                                                        }
                                                    >
                                                        {Math.round(
                                                            result.诈骗概率 *
                                                                100
                                                        )}
                                                        %
                                                        {result.诈骗概率 > 0.8
                                                            ? " (极高风险)"
                                                            : result.诈骗概率 >
                                                              0.5
                                                            ? " (高风险)"
                                                            : result.诈骗概率 >
                                                              0.3
                                                            ? " (中等风险)"
                                                            : result.诈骗概率 >
                                                              0.1
                                                            ? " (低风险)"
                                                            : " (几乎无风险)"}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="font-bold">
                                                        诈骗类型：
                                                    </span>
                                                    <span
                                                        className={
                                                            result.诈骗概率 >
                                                            0.3
                                                                ? "text-orange-500"
                                                                : "text-gray-500"
                                                        }
                                                    >
                                                        {result.诈骗概率 > 0.1
                                                            ? result.诈骗类型
                                                            : "未检测到明显诈骗特征"}
                                                    </span>
                                                </div>
                                                <div>
                                                    <span className="font-bold">
                                                        智能建议：
                                                    </span>
                                                    <p className="text-left mt-1">
                                                        {result.智能建议}
                                                    </p>
                                                </div>
                                                <div className="text-xs text-gray-500 mt-2">
                                                    <p>
                                                        *诈骗概率越高，表示信息越可能是诈骗内容
                                                    </p>
                                                    <p>
                                                        *概率阈值说明：极高风险(&gt;80%)、高风险(&gt;50%)、中等风险(&gt;30%)、低风险(&gt;10%)
                                                    </p>
                                                </div>
                                            </div>
                                        ) : (
                                            "在上方输入非空内容后，点击「提交」，稍等片刻检测结果就会显示在这里。"
                                        )}
                                    </AlertDescription>
                                </Alert>

                                <Alert>
                                    <div className="flex items-center gap-2">
                                        <FileJson2 className="h-5 w-5" />
                                        <AlertTitle>原始返回信息</AlertTitle>
                                    </div>
                                    <AlertDescription className="mt-2">
                                        {rawResponse ? (
                                            <pre className="text-xs overflow-auto max-h-40 p-2 bg-gray-100 dark:bg-gray-800 rounded">
                                                {rawResponse}
                                            </pre>
                                        ) : (
                                            "在上方输入非空内容后，点击「提交」，稍等片刻模型返回的内容就会显示在这里。"
                                        )}
                                    </AlertDescription>
                                </Alert>

                                <Alert>
                                    <div className="flex items-center gap-2">
                                        <FileQuestion className="h-5 w-5" />
                                        <AlertTitle>请求详情</AlertTitle>
                                    </div>
                                    <AlertDescription className="mt-2">
                                        <div className="space-y-2 text-sm">
                                            <div className="flex justify-between">
                                                <span>模型：</span>
                                                <span className="font-mono">
                                                    google/gemini-2.5-flash-preview
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>API提供商：</span>
                                                <span className="font-mono">
                                                    OpenRouter
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>温度参数：</span>
                                                <span className="font-mono">
                                                    0.2
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>输出格式：</span>
                                                <span className="font-mono">
                                                    JSON
                                                </span>
                                            </div>
                                            {requestTime && (
                                                <div className="flex justify-between">
                                                    <span>请求时间：</span>
                                                    <span className="font-mono">
                                                        {new Date(
                                                            requestTime
                                                        ).toLocaleTimeString()}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </AlertDescription>
                                </Alert>

                                <Alert>
                                    <div className="flex items-center gap-2 justify-around">
                                        <AlertTitle className="text-left">
                                            您觉得这个结果怎么样？
                                        </AlertTitle>
                                        <div className="space-x-2">
                                            <Button
                                                variant={
                                                    feedback === "like"
                                                        ? "default"
                                                        : "outline"
                                                }
                                                onClick={() =>
                                                    handleFeedback("like")
                                                }
                                                disabled={!result || isLoading}
                                            >
                                                <ThumbsUp />
                                            </Button>
                                            <Button
                                                variant={
                                                    feedback === "dislike"
                                                        ? "default"
                                                        : "outline"
                                                }
                                                onClick={() =>
                                                    handleFeedback("dislike")
                                                }
                                                disabled={!result || isLoading}
                                            >
                                                <ThumbsDown />
                                            </Button>
                                        </div>
                                    </div>
                                </Alert>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
}
