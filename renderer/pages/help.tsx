import React from "react";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { buttonVariants } from "@/components/ui/button";
import { SiteHeader } from "@/components/site-header";
import {
    Breadcrumb,
    BreadcrumbList,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbSeparator,
    BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
} from "@/components/ui/card";
import {
    BellRing,
    Brain,
    Coins,
    FileKey2,
    Sticker,
    UserRoundCheck,
} from "lucide-react";

export default function CasesPage() {
    return (
        <React.Fragment>
            <Head>
                <title>银发无忧 - 使用帮助</title>
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
                                                    使用帮助
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
                        <Card>
                            <CardHeader>
                                <div className="flex items-center gap-2">
                                    <Brain className="h-5 w-5 text-primary" />
                                    <CardTitle>使用帮助</CardTitle>
                                </div>
                                <CardDescription>
                                    本页面向您介绍如何使用本软件
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4 p-3">
                                    <Alert className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 dark:from-green-500/5 dark:to-emerald-500/5 border-green-500/20">
                                        <div className="flex items-center gap-2">
                                            <UserRoundCheck className="h-5 w-5  text-green-700 dark:text-green-400 mt-0.5" />
                                            <AlertTitle className="text-green-700 dark:text-green-400">
                                                软件是如何工作的？
                                            </AlertTitle>
                                        </div>
                                        <AlertDescription className="text-green-700/90 dark:text-green-400/90 mt-2">
                                            <p>
                                                软件通过对提供的文本信息使用自然语言处理技术进行分析，侦测是否含有诈骗风险，然后在监测到诈骗信息时为您弹窗预警并语音提示。
                                                <br />
                                                软件同时支持展示记录在案的提示记录，并支持您通过本软件学习、了解常见的诈骗方式。
                                            </p>
                                        </AlertDescription>
                                    </Alert>
                                    <Alert>
                                        <div className="flex items-center gap-2">
                                            <BellRing className="h-5 w-5" />
                                            <AlertTitle>
                                                何时会弹窗提醒？
                                            </AlertTitle>
                                        </div>
                                        <AlertDescription className="mt-2">
                                            当软件分析并探测到具有潜在诈骗风险的文本信息时，会弹出窗口向您进行说明。
                                            <br />
                                            弹出的窗口中会向您展示探测到的可能为诈骗内容的信息，同时会向您展其被判定为诈骗的原因。
                                            <br />
                                            为了您的安全，此窗口无法直接关闭，但您可按照其引导前往学习反诈骗知识，完成后即可关闭。
                                        </AlertDescription>
                                    </Alert>
                                    <Alert>
                                        <div className="flex items-center gap-2">
                                            <Sticker className="h-5 w-5" />
                                            <AlertTitle>
                                                分析的原理是什么？
                                            </AlertTitle>
                                        </div>
                                        <AlertDescription className="mt-2">
                                            软件会接受您输入的文本信息，并将其发送至云端，交由大型语言模型进行分与处理。
                                            <br />
                                            模型在完成分析后会返回其判断的结果，如果疑似为诈骗的阈值高于设定值，则会视之为诈骗而进行告警。
                                        </AlertDescription>
                                    </Alert>
                                    <Alert>
                                        <div className="flex items-center gap-2">
                                            <FileKey2 className="h-5 w-5" />
                                            <AlertTitle>
                                                我需要担心我的隐私吗？
                                            </AlertTitle>
                                        </div>
                                        <AlertDescription className="mt-2">
                                            软件只会在选择连接云端模型时在判断时与供应商的API接口进行交互，此部分数据由供应商加密保护并定时销毁。
                                            <br />
                                            软件仅会在本地存储报警时选择的类型及各类型报警的数据，不会存储您的文本信息及其他敏感信息。
                                            <br />
                                            您的所有数据均在本地存储，不会离开本机、不会被上传至云端。
                                        </AlertDescription>
                                    </Alert>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
}
