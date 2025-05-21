import React, { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { Button, buttonVariants } from "@/components/ui/button";
import { SiteHeader } from "@/components/site-header";
import SpeechRecognition, {
    useSpeechRecognition,
} from "react-speech-recognition";
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
import { Info, MessagesSquare, Loader2, Mic, MicOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface Message {
    role: "user" | "assistant";
    content: string;
}

export default function ChatPage() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const {
        transcript,
        listening,
        resetTranscript,
        browserSupportsSpeechRecognition,
    } = useSpeechRecognition();

    // 当transcript更新时，更新input
    React.useEffect(() => {
        if (transcript) {
            setInput(transcript);
        }
    }, [transcript]);

    const handleSubmit = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage = { role: "user" as const, content: input };
        setMessages((prev) => [...prev, userMessage]);
        setInput("");
        resetTranscript();
        setIsLoading(true);

        try {
            // 初始化助手消息
            let assistantMessage = { role: "assistant" as const, content: "" };
            setMessages((prev) => [...prev, assistantMessage]);

            // 发送消息并获取响应
            const response = await window.electron.chat.sendMessage([
                ...messages,
                userMessage,
            ]);

            // 检查是否是流式响应
            if (response.success && response.type === "stream") {
                const { channelId } = response;

                // 设置监听器接收流式响应
                const removeStreamListener = window.electron.chat.onStream(
                    channelId,
                    (content) => {
                        assistantMessage.content += content;
                        setMessages((prev) =>
                            prev.map((msg, i) =>
                                i === prev.length - 1
                                    ? {
                                          ...msg,
                                          content: assistantMessage.content,
                                      }
                                    : msg
                            )
                        );
                    }
                );

                // 设置错误处理
                const removeErrorListener = window.electron.chat.onStreamError(
                    channelId,
                    (error) => {
                        console.error("聊天请求出错:", error);
                        setMessages((prev) => prev.slice(0, -1));
                        setIsLoading(false);
                    }
                );

                // 设置完成处理
                const removeDoneListener = window.electron.chat.onStreamDone(
                    channelId,
                    () => {
                        setIsLoading(false);
                        // 清理监听器
                        removeStreamListener();
                        removeErrorListener();
                        removeDoneListener();
                    }
                );
            } else if (response.success && response.data) {
                // 处理非流式响应
                setMessages((prev) =>
                    prev.map((msg, i) =>
                        i === prev.length - 1
                            ? {
                                  ...msg,
                                  content: response.data,
                              }
                            : msg
                    )
                );
                setIsLoading(false);
            } else {
                // 处理错误
                console.error("聊天请求失败:", response.error || "未知错误");
                setMessages((prev) => prev.slice(0, -1));
                setIsLoading(false);
            }
        } catch (error) {
            console.error("发送消息失败:", error);
            setMessages((prev) => prev.slice(0, -1));
            setIsLoading(false);
        }
    };

    const toggleListening = () => {
        if (listening) {
            SpeechRecognition.stopListening();
        } else {
            SpeechRecognition.startListening({
                continuous: true,
                language: "zh-CN",
            });
        }
    };

    if (!browserSupportsSpeechRecognition) {
        console.warn("浏览器不支持语音识别功能");
    }

    return (
        <React.Fragment>
            <Head>
                <title>银发无忧 - 智能助手</title>
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
                                                <BreadcrumbPage>
                                                    智能助手
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
                                    <CardTitle>AI聊天</CardTitle>
                                </div>
                                <CardDescription>
                                    与我们的智能助手聊天，了解更多信息，获取进一步的建议与帮助。
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="h-[400px] overflow-y-auto mb-4 space-y-4 p-4">
                                    {messages.map((message, index) => (
                                        <div
                                            key={index}
                                            className={cn(
                                                "flex",
                                                message.role === "user"
                                                    ? "justify-end"
                                                    : "justify-start"
                                            )}
                                        >
                                            <div
                                                className={cn(
                                                    "rounded-lg px-4 py-2 max-w-[80%]",
                                                    message.role === "user"
                                                        ? "bg-primary text-primary-foreground"
                                                        : "bg-muted"
                                                )}
                                            >
                                                {message.content}
                                            </div>
                                        </div>
                                    ))}
                                    {isLoading && (
                                        <div className="flex justify-start">
                                            <div className="bg-muted rounded-lg px-4 py-2">
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <div className="flex gap-2">
                                    <Input
                                        className="flex-1"
                                        value={input}
                                        onChange={(e) =>
                                            setInput(e.target.value)
                                        }
                                        onKeyPress={(e) =>
                                            e.key === "Enter" && handleSubmit()
                                        }
                                        placeholder="输入您的问题..."
                                        disabled={isLoading}
                                    />
                                    <Button
                                        onClick={toggleListening}
                                        disabled={
                                            isLoading ||
                                            !browserSupportsSpeechRecognition
                                        }
                                        variant="outline"
                                        className={cn(
                                            "px-3",
                                            listening &&
                                                "bg-red-500 text-white hover:bg-red-600"
                                        )}
                                    >
                                        {listening ? (
                                            <MicOff className="h-4 w-4" />
                                        ) : (
                                            <Mic className="h-4 w-4" />
                                        )}
                                    </Button>
                                    <Button
                                        onClick={handleSubmit}
                                        disabled={isLoading || !input.trim()}
                                        variant="outline"
                                    >
                                        {isLoading ? (
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                        ) : (
                                            "发送"
                                        )}
                                    </Button>
                                </div>
                                {listening && (
                                    <div className="mt-2 text-sm text-muted-foreground">
                                        正在听您说...
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
}
