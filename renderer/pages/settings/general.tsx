import React from "react";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { useTheme } from "next-themes";
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
import { BadgeInfo, FileJson2, Lightbulb, MessagesSquare } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export default function ExperiencePage() {
    const { setTheme } = useTheme();

    return (
        <React.Fragment>
            <Head>
                <title>银发无忧 - 基本配置</title>
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
                                                    基本配置
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
                                    <BadgeInfo className="h-5 w-5 text-primary" />
                                    <CardTitle>基本配置</CardTitle>
                                </div>
                                <CardDescription>
                                    配置软件的基本行为等内容
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <Card className="text-wrap w-auto p-3">
                                    <CardHeader>
                                        <div className="flex items-center gap-2">
                                            <Lightbulb className="h-5 w-5 text-primary" />
                                            <CardTitle>显示模式</CardTitle>
                                        </div>
                                        <CardDescription>
                                            管理软件的颜色显示模式
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-2">
                                        <Tabs
                                            defaultValue="light"
                                            className="w-full"
                                            onValueChange={(value) =>
                                                setTheme(value)
                                            }
                                        >
                                            <TabsList className="grid w-full grid-cols-3">
                                                <TabsTrigger
                                                    value="light"
                                                    onClick={() =>
                                                        setTheme("light")
                                                    }
                                                >
                                                    浅色模式
                                                </TabsTrigger>
                                                <TabsTrigger
                                                    value="dark"
                                                    onClick={() =>
                                                        setTheme("dark")
                                                    }
                                                >
                                                    深色模式
                                                </TabsTrigger>
                                                <TabsTrigger
                                                    value="system"
                                                    onClick={() =>
                                                        setTheme("system")
                                                    }
                                                >
                                                    跟随系统
                                                </TabsTrigger>
                                            </TabsList>
                                            <TabsContent value="light">
                                                <Alert>
                                                    <AlertTitle>
                                                        浅色模式
                                                    </AlertTitle>
                                                    <AlertDescription>
                                                        使用浅色主题，适合在明亮环境下使用。
                                                    </AlertDescription>
                                                </Alert>
                                            </TabsContent>
                                            <TabsContent value="dark">
                                                <Alert>
                                                    <AlertTitle>
                                                        深色模式
                                                    </AlertTitle>
                                                    <AlertDescription>
                                                        使用深色主题，适合在暗光环境下使用，减少眼睛疲劳。
                                                    </AlertDescription>
                                                </Alert>
                                            </TabsContent>
                                            <TabsContent value="system">
                                                <Alert>
                                                    <AlertTitle>
                                                        跟随系统
                                                    </AlertTitle>
                                                    <AlertDescription>
                                                        根据系统的主题设置自动切换明暗模式。
                                                    </AlertDescription>
                                                </Alert>
                                            </TabsContent>
                                        </Tabs>
                                    </CardContent>
                                </Card>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
}
