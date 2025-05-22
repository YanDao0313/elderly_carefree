import OpenAI from "openai";
import { envService } from "../services/env.service";

// Allow responses up to 30 seconds
export const maxDuration = 30;

// 初始化OpenAI客户端，使用OpenRouter
const openai = new OpenAI({
    baseURL:
        envService.get("OPENAI_BASE_URL") || "https://openrouter.ai/api/v1",
    apiKey: envService.requireEnvVar("OPENAI_API_KEY"),
});

// 处理诈骗检测请求
export async function POST(req: any) {
    try {
        const { text } = await req.json();

        if (!text || typeof text !== "string" || text.trim() === "") {
            return {
                error: "无效的文本内容",
                status: 400,
            };
        }

        const response = await openai.chat.completions.create({
            model: "google/gemini-2.5-flash-preview",
            messages: [
                {
                    role: "system",
                    content:
                        "- Role: 信息安全专家和反诈骗分析师\n" +
                        "- Background: 用户在日常生活中可能收到各种文本信息，其中部分可能包含诈骗内容。用户需要一个可靠的工具来快速判断这些信息是否为诈骗，并获取相应的建议。\n" +
                        "- Profile: 你是一位在信息安全和反诈骗领域拥有丰富经验的专家，熟悉各类诈骗手段和特征，能够通过文本分析快速识别潜在的诈骗风险。\n" +
                        "- Skills: 你具备强大的文本分析能力、对诈骗模式的敏锐洞察力以及提供实用建议的能力，能够准确判断文本信息的性质并给出针对性的建议。\n" +
                        "- Goals: 通过分析用户提供的文本信息，判断其是否为诈骗内容，并以结构化的JSON格式输出结果，包括诈骗概率、诈骗类型和智能建议。\n" +
                        "- Constrains: 输出必须严格遵循JSON格式，内容简洁明了，不得包含任何无关信息。不得使用markdown，更不得将内容包裹在代码框中，你必须直接开始输出json信息。\n" +
                        "- OutputFormat: JSON格式，包含三个字段：'诈骗概率'（0到1之间的小数）、'诈骗类型'（如'网络诈骗'、'电话诈骗'等）、'智能建议'（如'请勿点击链接'、'立即报警'等）。\n" +
                        "- Workflow:\n" +
                        "  1. 接收用户提供的文本信息。\n" +
                        "  2. 分析文本内容，识别其中的关键词、语义结构和潜在风险。\n" +
                        "  3. 根据分析结果，计算诈骗信息的概率，确定诈骗类型，并生成智能建议。智能建议可以略长。\n" +
                        "  4. 将结果以JSON格式返回。",
                },
                {
                    role: "user",
                    content: text,
                },
            ],
            temperature: 0.2,
            response_format: { type: "json_object" },
        });

        if (!response.choices || response.choices.length === 0) {
            return {
                error: "无法获取有效响应",
                status: 500,
            };
        }

        try {
            const content = response.choices[0].message.content;
            // 尝试解析JSON
            const jsonResponse = content ? JSON.parse(content) : null;

            return {
                result: jsonResponse,
                status: 200,
            };
        } catch (parseError) {
            console.error("解析JSON响应失败:", parseError);
            return {
                error: "解析响应失败",
                rawContent: response.choices[0].message.content,
                status: 500,
            };
        }
    } catch (error) {
        console.error("处理诈骗检测请求时出错:", error);
        return {
            error: "处理请求时发生错误",
            details: error instanceof Error ? error.message : "未知错误",
            status: 500,
        };
    }
}
