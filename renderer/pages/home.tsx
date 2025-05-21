import React, { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { Button, buttonVariants } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";
import { SiteHeader } from "@/components/site-header";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    BadgeInfo,
    FileScan,
    MessageCircleQuestion,
    PhoneCall,
    ThumbsDown,
    ThumbsUp,
    Loader2,
    Coins,
    CircleUser,
    UserRoundCheck,
    Mic,
    MicOff,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Dock } from "@/components/ui/dock";
import SpeechRecognition, {
    useSpeechRecognition,
} from "react-speech-recognition";
import { cn } from "@/lib/utils";

export default function HomePage() {
    const [inputText, setInputText] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);
    const [feedback, setFeedback] = useState<"like" | "dislike" | null>(null);

    const {
        transcript,
        listening,
        resetTranscript,
        browserSupportsSpeechRecognition,
    } = useSpeechRecognition();

    // 当transcript更新时，更新inputText
    React.useEffect(() => {
        if (transcript) {
            setInputText(transcript);
        }
    }, [transcript]);

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

    // 诈骗知识数据
    const fraudTips = [
        {
            title: "伪装中奖类诈骗",
            icon: <PhoneCall className="h-5 w-5 text-primary" />,
            description: `"恭喜您，中奖了！您成功地参与了XX公司举办的庆典活动，并获得华为手机一台！请立即点击链接..."
                \n真奇怪，自己明明什么活动都没参与，却收到了中奖短信，难道是天上掉馅饼了？
                当然不是，这就是典型的中奖诈骗，骗子通过人们爱占便宜的心理吸引其点击链接而进行下一步操作。
                一旦上钩，后果会很严重。`,
        },
        {
            title: "冒充公检法类诈骗",
            icon: <UserRoundCheck className="h-5 w-5 text-primary" />,
            description: `"这里是XX市公安局，您的银行账户涉嫌洗钱，需要配合我们调查。请将资金转入安全账户..."
                \n突然接到公安电话说账户有问题，要求转账？这就是典型的冒充公检法诈骗。
                真实的公检法机关绝不会通过电话要求您转账或者提供银行账户信息。
                遇到此类情况，应立即挂断电话，并拨打110核实。`,
        },
        {
            title: "养老金类诈骗",
            icon: <Coins className="h-5 w-5 text-primary" />,
            description: `"您好，这里是社保中心，您的养老金需要重新认证，否则将被暂停发放。请登录我们提供的链接进行认证..."
                \n社保中心会暂停发放养老金吗？当然不会！这是典型的养老金诈骗。
                正规的养老金认证都有固定的程序和渠道，社保部门绝不会通过电话或短信要求您点击链接进行认证。
                一旦点击这些链接，您的个人信息和账户安全就会受到威胁。`,
        },
        {
            title: "冒充亲友类诈骗",
            icon: <CircleUser className="h-5 w-5 text-primary" />,
            description: `"爸/妈，我的手机丢了，这是我的新号码。我现在急需用钱，能马上转给我5000元吗？"
                \n孩子换号码要钱？先别急着转账！这是常见的冒充亲友诈骗。
                骗子会利用父母对子女的关心，谎称换号码急需用钱。遇到此类情况，
                一定要通过其他方式与亲友本人联系核实，不要轻易相信转账请求。`,
        },
    ];

    const [fraudTip, setFraudTip] = useState(fraudTips[0]);

    const getRandomTip = () => {
        const currentIndex = fraudTips.findIndex(
            (tip) => tip.title === fraudTip.title
        );
        let newIndex;
        // 确保不会连续显示同一个提示
        do {
            newIndex = Math.floor(Math.random() * fraudTips.length);
        } while (newIndex === currentIndex && fraudTips.length > 1);

        setFraudTip(fraudTips[newIndex]);
    };

    const handleDetect = async () => {
        if (!inputText.trim()) {
            setError("请输入需要检测的内容");
            return;
        }

        setIsLoading(true);
        setError(null);
        setResult(null);
        setFeedback(null);

        try {
            const response = await window.electron.detect.checkText(inputText);

            if (response.success && response.data) {
                setResult(response.data);

                // 如果诈骗概率超过阈值，打开警告窗口
                if (response.data.诈骗概率 > 0.5) {
                    try {
                        // 构造传递给警告窗口的数据
                        const fraudData = {
                            originalText: inputText,
                            result: response.data,
                        };

                        // 打开诈骗警告窗口
                        await window.electron.detect.openFraudNotice(fraudData);
                    } catch (err) {
                        console.error("打开诈骗警告窗口失败:", err);
                    }
                }
            } else {
                setError(response.error || "检测失败，请稍后重试");
            }
        } catch (err) {
            console.error("检测出错:", err);
            setError("检测过程中出现错误，请稍后重试");
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
                <title>银发无忧</title>
            </Head>

            <div className="relative flex min-h-screen flex-col bg-background overflow-auto">
                <div className="w-full h-screen flex flex-col items-center justify-center px-4">
                    <SiteHeader />

                    <div className="relative flex-1 min-h-0 p-2 w-full">
                        <div className="p-2 h-auto text-center">
                            <span className="text-center text-2xl font-bold justify-center">
                                🧑‍🦳 银发无忧 👨‍🦳
                            </span>
                            <br />
                            <span className="text-sm">
                                为长者量身定制的防诈骗智能预警与诈骗知识学习软件
                            </span>
                        </div>
                        <div className="w-full flex h-5/6 p-8 gap-4 ">
                            <Card className="w-full">
                                <CardHeader>
                                    <div className="flex flex-row items-center justify-between space-y-0">
                                        <div className="flex items-center gap-2">
                                            <FileScan className="h-5 w-5" />
                                            <CardTitle>
                                                检测一下，这是诈骗吗？
                                            </CardTitle>
                                        </div>
                                        <Link
                                            href="/cases"
                                            className={buttonVariants({
                                                variant: "outline",
                                            })}
                                        >
                                            学习更多案例
                                        </Link>
                                    </div>
                                    <CardDescription>
                                        在下方输入您需要检测的文本，软件会为您识别是否为潜在的诈骗信息。
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="flex flex-wrap gap-3">
                                    <div className="w-full flex gap-2">
                                        <Input
                                            className="flex-1"
                                            value={inputText}
                                            onChange={(e) =>
                                                setInputText(e.target.value)
                                            }
                                            placeholder="请输入需要检测的文字内容..."
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
                                    </div>
                                    {listening && (
                                        <div className="text-sm text-muted-foreground">
                                            正在听您说...
                                        </div>
                                    )}
                                    <Button
                                        className="w-full"
                                        variant="outline"
                                        onClick={handleDetect}
                                        disabled={
                                            isLoading || !inputText.trim()
                                        }
                                    >
                                        {isLoading ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                检测中...
                                            </>
                                        ) : (
                                            "检测一下"
                                        )}
                                    </Button>
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
                                                            {result.诈骗概率 >
                                                            0.8
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
                                                            {result.诈骗概率 >
                                                            0.1
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
                                                "在上方输入非空内容后，点击「检测一下」，稍等片刻检测结果就会显示在这里。"
                                            )}
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
                                                    disabled={
                                                        !result || isLoading
                                                    }
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
                                                        handleFeedback(
                                                            "dislike"
                                                        )
                                                    }
                                                    disabled={
                                                        !result || isLoading
                                                    }
                                                >
                                                    <ThumbsDown />
                                                </Button>
                                            </div>
                                        </div>
                                    </Alert>
                                </CardContent>
                            </Card>
                            <Card className="w-3/6">
                                <CardHeader>
                                    <div className="flex items-center gap-2">
                                        <MessageCircleQuestion className="h-5 w-5 text-primary" />
                                        <CardTitle>您知道吗？</CardTitle>
                                    </div>
                                    <CardDescription>
                                        为您带来随机一则骗术信息，一起积累吧！
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <Alert>
                                        <div className="flex items-center gap-2">
                                            {fraudTip.icon}
                                            <AlertTitle>
                                                {fraudTip.title}
                                            </AlertTitle>
                                        </div>
                                        <AlertDescription className="mt-2 whitespace-pre-line">
                                            {fraudTip.description}
                                        </AlertDescription>
                                    </Alert>
                                    <Button
                                        className="w-full"
                                        variant="outline"
                                        onClick={getRandomTip}
                                    >
                                        换一换
                                    </Button>
                                    <Link href="/cases">
                                        <Button
                                            className="w-full"
                                            variant="outline"
                                        >
                                            学更多
                                        </Button>
                                    </Link>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                    <div className="w-full flex justify-normal items-center gap-2 p-2 space-x-2">
                        <Dock>
                            <Link
                                href="/settings/my"
                                className={buttonVariants({
                                    variant: "secondary",
                                })}
                            >
                                前往个人中心
                            </Link>
                            <Link href="/cases" className={buttonVariants()}>
                                前往案例学习
                            </Link>
                            <Link
                                href="/settings/general"
                                className={buttonVariants({
                                    variant: "secondary",
                                })}
                            >
                                配置界面色彩
                            </Link>
                        </Dock>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
}
