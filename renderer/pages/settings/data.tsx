import React from "react";
import Head from "next/head";
import Link from "next/link";
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
import { BadgeInfo } from "lucide-react";
import {
    Bar,
    BarChart,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    LineChart,
    Line,
} from "recharts";
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";

export default function DataPage() {
    const monthlyData = [
        {
            month: "2025-01",
            冒充公检法: 35,
            养老金诈骗: 28,
            中奖诈骗: 15,
            冒充亲友: 22,
        },
        {
            month: "2025-02",
            冒充公检法: 42,
            养老金诈骗: 31,
            中奖诈骗: 18,
            冒充亲友: 25,
        },
        {
            month: "2025-03",
            冒充公检法: 38,
            养老金诈骗: 35,
            中奖诈骗: 20,
            冒充亲友: 28,
        },
        {
            month: "2025-04",
            冒充公检法: 45,
            养老金诈骗: 30,
            中奖诈骗: 22,
            冒充亲友: 24,
        },
        {
            month: "2025-05",
            冒充公检法: 40,
            养老金诈骗: 33,
            中奖诈骗: 25,
            冒充亲友: 30,
        },
        {
            month: "2025-06",
            冒充公检法: 48,
            养老金诈骗: 38,
            中奖诈骗: 28,
            冒充亲友: 32,
        },
    ];

    // 计算总量数据用于饼图
    const totalData = [
        {
            name: "冒充公检法",
            value: monthlyData.reduce(
                (acc, curr) => acc + curr["冒充公检法"],
                0
            ),
        },
        {
            name: "养老金诈骗",
            value: monthlyData.reduce(
                (acc, curr) => acc + curr["养老金诈骗"],
                0
            ),
        },
        {
            name: "中奖诈骗",
            value: monthlyData.reduce((acc, curr) => acc + curr["中奖诈骗"], 0),
        },
        {
            name: "冒充亲友",
            value: monthlyData.reduce((acc, curr) => acc + curr["冒充亲友"], 0),
        },
    ];

    // 计算趋势数据用于折线图
    const trendData = monthlyData.map((item) => ({
        month: item.month,
        总量: Object.values(item).reduce(
            (acc: number, curr) =>
                typeof curr === "number" ? acc + curr : acc,
            0
        ),
    }));

    const chartConfig = {
        冒充公检法: {
            label: "冒充公检法",
            color: "hsl(var(--chart-1))",
        },
        养老金诈骗: {
            label: "养老金诈骗",
            color: "hsl(var(--chart-2))",
        },
        中奖诈骗: {
            label: "中奖诈骗",
            color: "hsl(var(--chart-3))",
        },
        冒充亲友: {
            label: "冒充亲友",
            color: "hsl(var(--chart-4))",
        },
    };

    const COLORS = [
        "hsl(var(--chart-1))",
        "hsl(var(--chart-2))",
        "hsl(var(--chart-3))",
        "hsl(var(--chart-4))",
    ];

    return (
        <React.Fragment>
            <Head>
                <title>银发无忧 - 本地数据</title>
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
                                                    本地数据
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
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Card className="text-wrap w-auto p-3">
                                <CardHeader>
                                    <div className="flex items-center gap-2">
                                        <BadgeInfo className="h-5 w-5 text-primary" />
                                        <CardTitle>月度分布</CardTitle>
                                    </div>
                                    <CardDescription>
                                        各类型诈骗案件的月度分布情况
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="h-auto w-full">
                                        <ChartContainer config={chartConfig}>
                                            <BarChart data={monthlyData}>
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis dataKey="month" />
                                                <YAxis />
                                                <Tooltip
                                                    content={
                                                        <ChartTooltipContent />
                                                    }
                                                />
                                                <Legend />
                                                <Bar
                                                    dataKey="冒充公检法"
                                                    fill="hsl(var(--chart-1))"
                                                />
                                                <Bar
                                                    dataKey="养老金诈骗"
                                                    fill="hsl(var(--chart-2))"
                                                />
                                                <Bar
                                                    dataKey="中奖诈骗"
                                                    fill="hsl(var(--chart-3))"
                                                />
                                                <Bar
                                                    dataKey="冒充亲友"
                                                    fill="hsl(var(--chart-4))"
                                                />
                                            </BarChart>
                                        </ChartContainer>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="text-wrap w-auto p-3">
                                <CardHeader>
                                    <div className="flex items-center gap-2">
                                        <BadgeInfo className="h-5 w-5 text-primary" />
                                        <CardTitle>类型占比</CardTitle>
                                    </div>
                                    <CardDescription>
                                        各类型诈骗案件的总体占比
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="h-auto w-full">
                                        <ChartContainer config={chartConfig}>
                                            <PieChart>
                                                <Pie
                                                    data={totalData}
                                                    cx="50%"
                                                    cy="50%"
                                                    labelLine={false}
                                                    outerRadius={80}
                                                    innerRadius={50}
                                                    fill="#8884d8"
                                                    dataKey="value"
                                                    nameKey="name"
                                                    label={(entry) =>
                                                        `${entry.name}: ${entry.value}件`
                                                    }
                                                >
                                                    {totalData.map(
                                                        (entry, index) => (
                                                            <Cell
                                                                key={`cell-${index}`}
                                                                fill={
                                                                    COLORS[
                                                                        index %
                                                                            COLORS.length
                                                                    ]
                                                                }
                                                            />
                                                        )
                                                    )}
                                                </Pie>
                                                <Tooltip />
                                                <Legend />
                                            </PieChart>
                                        </ChartContainer>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="text-wrap w-auto p-3 md:col-span-2">
                                <CardHeader>
                                    <div className="flex items-center gap-2">
                                        <BadgeInfo className="h-5 w-5 text-primary" />
                                        <CardTitle>总体趋势</CardTitle>
                                    </div>
                                    <CardDescription>
                                        诈骗案件总量的变化趋势
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="h-[400px] w-full">
                                        <ChartContainer config={chartConfig}>
                                            <LineChart data={trendData}>
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis dataKey="month" />
                                                <YAxis />
                                                <Tooltip
                                                    content={
                                                        <ChartTooltipContent />
                                                    }
                                                />
                                                <Legend />
                                                <Line
                                                    type="monotone"
                                                    dataKey="总量"
                                                    stroke="hsl(var(--chart-1))"
                                                    strokeWidth={2}
                                                    dot={{
                                                        fill: "hsl(var(--chart-1))",
                                                    }}
                                                />
                                            </LineChart>
                                        </ChartContainer>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
}
