import React, { useEffect, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { Button, buttonVariants } from "@/components/ui/button";
import { SiteHeader } from "@/components/site-header";
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
    CardDescription,
} from "@/components/ui/card";
import {
    Bug,
    GithubIcon,
    Info,
    CircleUser,
    PersonStanding,
    Pencil,
    Cpu,
    HardDrive,
    Network,
    MemoryStick,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { RainbowButton } from "@/components/ui/rainbow-button";

type SystemInfo = {
    platform: string;
    arch: string;
    version: string;
    memory: {
        total: number;
        free: number;
    };
    cpu: {
        model: string;
        cores: number;
        speed: number;
    };
    display: {
        width: number;
        height: number;
        scaleFactor: number;
    };
    network: {
        ip: string;
        hostname: string;
    };
};

export default function AboutPage() {
    const [systemInfo, setSystemInfo] = useState<SystemInfo | null>(null);
    const [appVersion, setAppVersion] = useState<string>("");

    useEffect(() => {
        const getSystemInfo = async () => {
            try {
                const info = await window.electron.invoke("system:getInfo");
                setSystemInfo(info);
            } catch (error) {
                console.error("获取系统信息失败:", error);
            }
        };

        const getAppVersion = async () => {
            try {
                const version = await window.electron.invoke("app:getVersion");
                setAppVersion(version);
            } catch (error) {
                console.error("获取应用版本失败:", error);
            }
        };

        getSystemInfo();
    }, []);

    // 格式化内存大小
    const formatMemory = (bytes: number) => {
        const gb = bytes / (1024 * 1024 * 1024);
        return `${gb.toFixed(2)} GB`;
    };

    // 复制调试信息
    const copyDebugInfo = () => {
        if (!systemInfo) return;

        const debugInfo = `
调试信息
-------------------
应用版本: ${appVersion}
系统信息:
- 平台: ${systemInfo.platform}
- 架构: ${systemInfo.arch}
- 系统版本: ${systemInfo.version}
- CPU: ${systemInfo.cpu.model} (${systemInfo.cpu.cores}核, ${
            systemInfo.cpu.speed
        }MHz)
- 内存: 总计 ${formatMemory(systemInfo.memory.total)}, 可用 ${formatMemory(
            systemInfo.memory.free
        )}
- 显示器: ${systemInfo.display.width}x${systemInfo.display.height} (缩放比例: ${
            systemInfo.display.scaleFactor
        })
- 网络: ${systemInfo.network.hostname} (${systemInfo.network.ip})
    `.trim();

        navigator.clipboard.writeText(debugInfo).then((err) => {
            console.error("复制失败:", err);
        });
    };

    return (
        <React.Fragment>
            <Head>
                <title>银发无忧 - 个人中心</title>
            </Head>

            <div className="relative flex min-h-screen flex-col bg-background">
                <div className="w-full h-screen flex flex-col items-center justify-center px-4">
                    <SiteHeader />

                    <div className="flex-1 flex flex-col justify-center w-full p-8 space-y-8">
                        <div>
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
                                                    个人信息
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
                            <div className="space-y-3">
                                <Card
                                    title="用户名"
                                    className="text-wrap w-auto p-3"
                                >
                                    <CardHeader>
                                        <div className="flex items-center gap-2">
                                            <Info className="h-5 w-5 text-primary" />
                                            <CardTitle>个人信息</CardTitle>
                                        </div>
                                        <CardDescription>
                                            关于您的基本信息
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-4 p-3">
                                            <div className="flex-auto justify-between">
                                                <Alert>
                                                    <div className="flex items-center gap-2">
                                                        <CircleUser className="h-5 w-5 text-primary text-center mt-0.5" />
                                                        <AlertTitle>
                                                            您的姓名
                                                        </AlertTitle>
                                                    </div>
                                                    <AlertDescription className="mt-2">
                                                        <p>Sample</p>
                                                    </AlertDescription>
                                                </Alert>
                                                <Alert>
                                                    <div className="flex items-center gap-2">
                                                        <PersonStanding className="h-4 w-4 text-primary mt-0.5" />
                                                        <AlertTitle>
                                                            您的年龄
                                                        </AlertTitle>
                                                    </div>
                                                    <AlertDescription className="mt-2">
                                                        <p>64</p>
                                                    </AlertDescription>
                                                </Alert>
                                            </div>

                                            <div className="flex items-center gap-4">
                                                <Button variant="outline">
                                                    <Pencil className="h-4 w-4 mr-2" />
                                                    修改信息
                                                </Button>
                                                <Button variant="outline">
                                                    <GithubIcon className="h-4 w-4 mr-2" />
                                                    开源地址
                                                </Button>
                                                <Button variant="outline">
                                                    <Bug className="h-4 w-4 mr-2" />
                                                    报告问题
                                                </Button>
                                                <Link href="/help">
                                                    <RainbowButton>
                                                        查看使用帮助
                                                    </RainbowButton>
                                                </Link>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
}
