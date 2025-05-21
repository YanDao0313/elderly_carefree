import React, { useState, useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { RainbowButton } from "@/components/ui/rainbow-button";

export default function NotFoundPage() {
    const router = useRouter();
    const [currentPath, setCurrentPath] = useState("");

    useEffect(() => {
        setCurrentPath(router.asPath || "");
    }, [router.asPath]);

    return (
        <React.Fragment>
            <Head>
                <title>404 - 页面未找到</title>
            </Head>

            <div className="relative flex min-h-screen flex-col">
                <header className="absolute inset-0 max-h-10 bg-transparent" />
                <div className="w-full h-screen flex flex-col items-center justify-center px-4">
                    <div className="flex-1 flex flex-col justify-center items-center w-full space-y-8">
                        <div className="text-6xl font-bold text-primary">
                            404
                        </div>
                        <h1 className="text-2xl font-semibold text-foreground">
                            抱歉，页面未找到
                        </h1>
                        <p className="text-muted-foreground text-center max-w-md">
                            {currentPath && (
                                <>
                                    无法找到请求的路径：
                                    <span className="font-mono text-primary">
                                        {currentPath}
                                    </span>
                                    <br />
                                </>
                            )}
                            您访问的页面可能已被移除、名称已更改或暂时不可用。
                        </p>
                        <div className="w-full flex-wrap flex justify-center">
                            <RainbowButton
                                onClick={() => {
                                    window.history.back();
                                }}
                            >
                                返回上一页
                            </RainbowButton>
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
}
