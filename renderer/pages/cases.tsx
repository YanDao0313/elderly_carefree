import React, { useState, useEffect } from "react";
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
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    CardFooter,
} from "@/components/ui/card";
import {
    Bot,
    Brain,
    CircleUser,
    Coins,
    Info,
    PhoneCall,
    SearchCheck,
    UserCheck,
    UserRoundCheck,
    Loader2,
    RefreshCw,
    Wifi,
    WifiOff,
    ShieldAlert,
    ShieldCheck,
    AlertTriangle,
    PlayCircle,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { RainbowButton } from "@/components/ui/rainbow-button";

// AI提示数据
const aiTips = [
    {
        title: "保护个人信息",
        icon: <ShieldCheck className="h-5 w-5 text-green-500" />,
        content:
            "不要轻易将您的身份证号、银行卡号、验证码等个人敏感信息告诉陌生人，即使对方自称是银行、公安等机构工作人员。",
    },
    {
        title: "警惕异常链接",
        icon: <AlertTriangle className="h-5 w-5 text-yellow-500" />,
        content:
            "收到短信中的链接时要特别警惕，不要随意点击。正规机构很少通过短信发送链接要求您登录或输入个人信息。",
    },
    {
        title: "核实身份",
        icon: <UserCheck className="h-5 w-5 text-blue-500" />,
        content:
            "接到自称是亲友的陌生号码请求帮助时，一定要通过其他渠道核实对方身份，如拨打您知道的亲友电话进行确认。",
    },
    {
        title: "天上不会掉馅饼",
        icon: <ShieldAlert className="h-5 w-5 text-red-500" />,
        content:
            '对于"免费获奖"、"高额回报"的信息保持警惕，天上不会掉馅饼，所有意外之财背后可能都是精心设计的骗局。',
    },
    {
        title: "转账需谨慎",
        icon: <Coins className="h-5 w-5 text-amber-500" />,
        content:
            "任何要求您立即转账的紧急情况都值得怀疑。在转账前，请冷静思考，与家人商量，或咨询官方渠道。",
    },
    {
        title: "定期更新密码",
        icon: <RefreshCw className="h-5 w-5 text-indigo-500" />,
        content:
            "定期更换您的银行卡密码、支付密码和重要账户密码，不要使用容易被猜到的密码，如生日、手机号等。",
    },
    {
        title: "安装正规软件",
        icon: <ShieldCheck className="h-5 w-5 text-emerald-500" />,
        content:
            "只从官方应用商店下载软件，不要通过短信链接或不明来源的网站安装应用，这些可能包含木马或病毒。",
    },
    {
        title: "公检法不会电话办案",
        icon: <PhoneCall className="h-5 w-5 text-rose-500" />,
        content:
            "公安机关、检察院、法院不会通过电话进行办案，更不会要求您转账或提供银行卡信息。收到此类电话应立即挂断。",
    },
];

export default function CasesPage() {
    const [aiTipIndex, setAiTipIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [isOnline, setIsOnline] = useState(true);

    // 检查网络连接状态
    useEffect(() => {
        const handleOnlineStatus = () => {
            setIsOnline(navigator.onLine);
        };

        // 初始检查
        setIsOnline(navigator.onLine);

        // 添加事件监听器
        window.addEventListener("online", handleOnlineStatus);
        window.addEventListener("offline", handleOnlineStatus);

        // 清理事件监听器
        return () => {
            window.removeEventListener("online", handleOnlineStatus);
            window.removeEventListener("offline", handleOnlineStatus);
        };
    }, []);

    // 获取新的AI提示
    const getNewAiTip = () => {
        setIsLoading(true);

        // 模拟API请求延迟
        setTimeout(() => {
            // 随机选择一个不同的提示
            let newIndex;
            do {
                newIndex = Math.floor(Math.random() * aiTips.length);
            } while (newIndex === aiTipIndex && aiTips.length > 1);

            setAiTipIndex(newIndex);
            setIsLoading(false);
        }, 800);
    };

    return (
        <React.Fragment>
            <Head>
                <title>银发无忧 - 案例展示</title>
            </Head>

            <div className="relative flex min-h-screen flex-col bg-background overflow-auto">
                <div className="w-full h-screen flex flex-col items-center justify-center px-4">
                    <SiteHeader />

                    <div className="relative flex-1 min-h-0 w-full p-8">
                        <div className="gap-2 h-auto">
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
                                                    案例学习
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
                            <div className="gap-3 p-3 space-y-3">
                                <Card>
                                    <CardHeader>
                                        <div className="flex items-center gap-2">
                                            <Brain className="h-5 w-5 text-primary" />
                                            <CardTitle>常见诈骗话术</CardTitle>
                                        </div>
                                        <CardDescription>
                                            学习常见诈骗话术，助力尽早识别骗局
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-2">
                                        <Alert>
                                            <AlertTitle className="font-normal">
                                                <strong>1. </strong>
                                                我是XX公安的，这边办案需要，麻烦您把钱转入指定的安全账户...
                                            </AlertTitle>
                                        </Alert>
                                        <Alert>
                                            <AlertTitle className="font-normal">
                                                <strong>2. </strong>
                                                我是XX公司的，恭喜您在我公司的XX活动中获得了XX，现在麻烦您...
                                            </AlertTitle>
                                        </Alert>
                                        <Alert>
                                            <AlertTitle className="font-normal">
                                                <strong>3. </strong>
                                                加入下一波行业浪潮吧！今天就购买XX数字货币/虚拟货币，让它成为您...
                                            </AlertTitle>
                                        </Alert>
                                        <Alert>
                                            <AlertTitle className="font-normal">
                                                <strong>4. </strong>
                                                您的家人XXX今日因伤入院，现在需要您尽快将手术费用转至指定银行卡上...
                                            </AlertTitle>
                                        </Alert>
                                        <Alert>
                                            <AlertTitle className="font-normal">
                                                <strong>5. </strong>
                                                恭喜您获得免押贷款资格！只需要点击下方链接下载软件即可...
                                            </AlertTitle>
                                        </Alert>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardHeader>
                                        <div className="flex items-center gap-2">
                                            <Bot className="h-5 w-5 text-primary" />
                                            <CardTitle>AI提示</CardTitle>
                                        </div>
                                        <CardDescription>
                                            基于目前已有数据为您生成的智能建议内容
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-2">
                                        {!isOnline ? (
                                            <Alert>
                                                <div className="flex items-center gap-2">
                                                    <WifiOff className="h-5 w-5 text-red-500" />
                                                    <AlertTitle className="font-normal">
                                                        <strong>提示: </strong>
                                                        请先连接互联网以获取最新AI提示
                                                    </AlertTitle>
                                                </div>
                                            </Alert>
                                        ) : (
                                            <>
                                                <Alert>
                                                    <div className="flex items-center gap-2">
                                                        {
                                                            aiTips[aiTipIndex]
                                                                .icon
                                                        }
                                                        <AlertTitle className="font-normal">
                                                            <strong>
                                                                {
                                                                    aiTips[
                                                                        aiTipIndex
                                                                    ].title
                                                                }
                                                                :{" "}
                                                            </strong>
                                                        </AlertTitle>
                                                    </div>
                                                    <AlertDescription className="mt-2">
                                                        {
                                                            aiTips[aiTipIndex]
                                                                .content
                                                        }
                                                    </AlertDescription>
                                                </Alert>
                                                <div className="flex justify-end">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={getNewAiTip}
                                                        disabled={isLoading}
                                                    >
                                                        {isLoading ? (
                                                            <>
                                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                                加载中...
                                                            </>
                                                        ) : (
                                                            <>
                                                                <RefreshCw className="mr-2 h-4 w-4" />
                                                                换一条
                                                            </>
                                                        )}
                                                    </Button>
                                                </div>
                                            </>
                                        )}
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardHeader>
                                        <div className="flex items-center gap-2">
                                            <Brain className="h-5 w-5 text-primary" />
                                            <CardTitle>案例学习</CardTitle>
                                        </div>
                                        <CardDescription>
                                            学习真实诈骗案例，助力增长您的防骗意识
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-4 p-3">
                                            <Alert>
                                                <div className="flex items-center gap-2">
                                                    <Coins className="h-5 w-5 text-primary text-center mt-0.5" />
                                                    <AlertTitle>
                                                        养老金类诈骗
                                                    </AlertTitle>
                                                </div>
                                                <AlertDescription className="mt-2">
                                                    "您好，这里是社保中心，您的养老金需要重新认证，否则将被暂停发放。请登录我们提供的链接进行认证..."
                                                    <br />
                                                    社保中心会暂停发放养老金吗？当然不会！这是典型的
                                                    <strong>养老金诈骗</strong>
                                                    。
                                                    正规的养老金认证都有固定的程序和渠道，社保部门绝不会通过电话或短信要求您点击链接进行认证。
                                                    一旦点击这些链接，您的个人信息和账户安全就会受到威胁。
                                                    <div className="mt-4">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() =>
                                                                window.open(
                                                                    "https://www.bilibili.com/video/BV1Mv4y1j7FU/",
                                                                    "_blank"
                                                                )
                                                            }
                                                        >
                                                            <PlayCircle className="mr-2 h-4 w-4" />
                                                            观看相关案例视频
                                                        </Button>
                                                    </div>
                                                </AlertDescription>
                                            </Alert>
                                            <Alert>
                                                <div className="flex items-center gap-2">
                                                    <UserRoundCheck className="h-5 w-5 text-primary text-center mt-0.5" />
                                                    <AlertTitle>
                                                        冒充公检法类诈骗
                                                    </AlertTitle>
                                                </div>
                                                <AlertDescription className="mt-2">
                                                    "这里是XX市公安局，您的银行账户涉嫌洗钱，需要配合我们调查。请将资金转入安全账户..."
                                                    <br />
                                                    突然接到公安电话说账户有问题，要求转账？这就是典型的
                                                    <strong>
                                                        冒充公检法诈骗
                                                    </strong>
                                                    。
                                                    真实的公检法机关绝不会通过电话要求您转账或者提供银行账户信息。
                                                    遇到此类情况，应立即挂断电话，并拨打110核实。
                                                    <div className="mt-4">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() =>
                                                                window.open(
                                                                    "https://www.bilibili.com/video/BV1Nf4y1x77H/",
                                                                    "_blank"
                                                                )
                                                            }
                                                        >
                                                            <PlayCircle className="mr-2 h-4 w-4" />
                                                            观看相关案例视频
                                                        </Button>
                                                    </div>
                                                </AlertDescription>
                                            </Alert>
                                            <Alert>
                                                <div className="flex items-center gap-2">
                                                    <PhoneCall className="h-5 w-5 text-primary text-center mt-0.5" />
                                                    <AlertTitle>
                                                        伪装中奖类诈骗
                                                    </AlertTitle>
                                                </div>
                                                <AlertDescription className="mt-2">
                                                    "恭喜您，中奖了！您成功地参与了XX公司举办的庆典活动，并获得华为手机一台！请立即点击链接..."
                                                    <br />
                                                    真奇怪，自己明明什么活动都没参与，却收到了中奖短信，难道是天上掉馅饼了？
                                                    当然不是，这就是典型的
                                                    <strong>中奖诈骗</strong>
                                                    ，骗子通过人们爱占便宜的心理吸引其点击链接而进行下一步操作。
                                                    一旦上钩，后果会很严重。
                                                    <div className="mt-4">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() =>
                                                                window.open(
                                                                    "https://www.bilibili.com/video/BV1URQzYFEYF/",
                                                                    "_blank"
                                                                )
                                                            }
                                                        >
                                                            <PlayCircle className="mr-2 h-4 w-4" />
                                                            观看相关案例视频
                                                        </Button>
                                                    </div>
                                                </AlertDescription>
                                            </Alert>
                                            <Alert>
                                                <div className="flex items-center gap-2">
                                                    <CircleUser className="h-5 w-5 text-primary text-center mt-0.5" />
                                                    <AlertTitle>
                                                        冒充亲友类诈骗
                                                    </AlertTitle>
                                                </div>
                                                <AlertDescription className="mt-2">
                                                    "爸/妈，我的手机丢了，这是我的新号码。我现在急需用钱，能马上转给我5000元吗？"
                                                    <br />
                                                    孩子换号码要钱？先别急着转账！这是常见的
                                                    <strong>
                                                        冒充亲友诈骗
                                                    </strong>
                                                    。
                                                    骗子会利用父母对子女的关心，谎称换号码急需用钱。遇到此类情况，
                                                    一定要通过其他方式与亲友本人联系核实，不要轻易相信转账请求。
                                                    <div className="mt-4">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() =>
                                                                window.open(
                                                                    "https://www.bilibili.com/video/BV1P34y1D7VG/",
                                                                    "_blank"
                                                                )
                                                            }
                                                        >
                                                            <PlayCircle className="mr-2 h-4 w-4" />
                                                            观看相关案例视频
                                                        </Button>
                                                    </div>
                                                </AlertDescription>
                                            </Alert>
                                            <Alert>
                                                <div className="flex items-center gap-2">
                                                    <SearchCheck className="h-5 w-5 text-primary text-center mt-0.5" />
                                                    <AlertTitle>
                                                        遇到不明白的了？遇到这里没有的了？
                                                    </AlertTitle>
                                                </div>
                                                <AlertDescription className="mt-2">
                                                    <p className="p-2">
                                                        不用担心，在软件内随时向我们的智能助手提问
                                                    </p>
                                                    <Link href="/ai">
                                                        <Button variant="outline">
                                                            <Bot className="h-4 w-4 mr-2" />
                                                            去聊一聊
                                                        </Button>
                                                    </Link>
                                                </AlertDescription>
                                            </Alert>
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
