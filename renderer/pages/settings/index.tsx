import React from "react";
import Head from "next/head";
import Link from "next/link";
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
    UserRoundCheck,
    Settings,
    SquareCheckBig,
    FilePieChart,
    Bot,
} from "lucide-react";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export default function AboutPage() {
    return (
        <React.Fragment>
            <Head>
                <title>银发无忧 - 设置</title>
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
                                                <BreadcrumbItem>
                                                    <BreadcrumbLink href="/home">
                                                        首页
                                                    </BreadcrumbLink>
                                                </BreadcrumbItem>
                                                <BreadcrumbSeparator />
                                                <BreadcrumbPage>
                                                    设置
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
                            <Card className="p-3">
                                <CardHeader>
                                    <div className="flex items-center gap-2">
                                        <Settings className="h-5 w-5 text-primary" />
                                        <CardTitle>设置</CardTitle>
                                    </div>
                                    <CardDescription>
                                        配置您的「银发无忧」软件
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="flex flex-col gap-2 p-2 text-left">
                                    <Link href="/settings/my">
                                        <Button className="h-auto w-full border text-left border-input bg-background text-foreground hover:bg-accent hover:text-accent-foreground">
                                            <UserRoundCheck />
                                            <div className="mt-2 text-left p-2">
                                                <div className="text-base font-medium">
                                                    编辑个人信息
                                                </div>
                                                <p className="text-sm font-normal">
                                                    编辑您的个人信息，以便我们更好为您服务。
                                                </p>
                                            </div>
                                        </Button>
                                    </Link>
                                    <Link href="/settings/general">
                                        <Button className="h-auto w-full border text-left border-input bg-background text-foreground hover:bg-accent hover:text-accent-foreground">
                                            <SquareCheckBig />
                                            <div className="mt-2 text-left p-2">
                                                <div className="text-base font-medium">
                                                    管理基本配置
                                                </div>
                                                <p className="text-sm font-normal">
                                                    配置软件的基本行为等内容。
                                                </p>
                                            </div>
                                        </Button>
                                    </Link>
                                    <Link href="/settings/data">
                                        <Button className="h-auto w-full border text-left border-input bg-background text-foreground hover:bg-accent hover:text-accent-foreground">
                                            <FilePieChart />
                                            <div className="mt-2 text-left p-2">
                                                <div className="text-base font-medium">
                                                    查看历史数据
                                                </div>
                                                <p className="text-sm font-normal">
                                                    可视化查看已经保存至本机的历史数据。
                                                </p>
                                            </div>
                                        </Button>
                                    </Link>
                                    <Link href="/settings/try">
                                        <Button className="h-auto w-full border text-left border-input bg-background text-foreground hover:bg-accent hover:text-accent-foreground">
                                            <Bot />
                                            <div className="mt-2 text-left p-2">
                                                <div className="text-base font-medium">
                                                    体验软件功能
                                                </div>
                                                <p className="text-sm font-normal">
                                                    通过此演示查看软件核心功能的运作原理。
                                                </p>
                                            </div>
                                        </Button>
                                    </Link>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
}
