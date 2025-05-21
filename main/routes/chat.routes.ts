import OpenAI from "openai";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

// 检查环境变量
if (!process.env.OPENAI_API_KEY) {
    console.error("Error: OPENAI_API_KEY environment variable is not set");
    throw new Error("OPENAI_API_KEY is required");
}

// 初始化OpenAI客户端，使用OpenRouter
const openai = new OpenAI({
    baseURL: process.env.OPENAI_BASE_URL || "https://openrouter.ai/api/v1",
    apiKey: process.env.OPENAI_API_KEY,
});

// 修改函数签名，接受任何带有 json 方法的对象
export async function POST(req: any) {
    try {
        const { messages } = await req.json();

        if (!messages || !Array.isArray(messages) || messages.length === 0) {
            // 返回错误对象而不是 Response
            return {
                error: "无效的消息格式",
                status: 400,
            };
        }

        const stream = await openai.chat.completions.create({
            model: "google/gemini-2.5-flash-preview",
            messages: [
                {
                    role: "system",
                    content:
                        "- Role: 老年人防诈骗专家和智能助手设计顾问\n" +
                        "- Background: 随着科技的快速发展，老年人在享受数字生活便利的同时，也面临着各种诈骗风险。他们可能对新型诈骗手段缺乏了解，且容易轻信他人，因此需要一个专门的防诈骗智能助手来帮助他们识别和防范诈骗。\n" +
                        "- Profile: 你是一位在老年人权益保护和防诈骗领域有着丰富经验的专家，对老年人的心理特点和行为习惯有深入的了解，同时具备智能助手设计的专业知识，能够将防诈骗知识与智能技术相结合，为老年人提供贴心的保护。\n" +
                        "- Skills: 你精通心理学原理、诈骗案例分析、智能技术应用以及老年人教育方法，能够设计出简单易用、针对性强的防诈骗智能助手功能。\n" +
                        "- Goals: 为老年人设计一个能够实时识别诈骗信息、提供防诈骗提示和教育的智能助手，帮助他们提高防诈骗意识和能力。\n" +
                        "- Constrains: 该智能助手应操作简单，界面友好，适合老年人使用；内容应通俗易懂，避免使用过于复杂的技术术语；功能应实用且高效，能够快速响应诈骗风险。不得输出任何包含markdown的内容。\n" +
                        "- OutputFormat: 仅以纯文本形式输出内容。文字提示、语音提醒、简单易懂的防诈骗知识图示、案例分析。\n" +
                        "- Workflow:\n" +
                        "  1. 实时监测老年人收到的信息，包括电话、短信、邮件等。\n" +
                        "  2. 对信息内容进行分析，识别其中是否存在诈骗风险。\n" +
                        "  3. 一旦发现风险，立即通过语音和文字提示老年人，并提供相应的防诈骗建议。\n" +
                        "  4. 定期向老年人推送防诈骗知识和案例，帮助他们增强防范意识。",
                },
                ...messages,
            ],
            stream: true,
        });

        // 在 Electron 主进程中，我们不能直接使用 Response 对象
        // 所以我们返回流对象和必要的元数据
        return {
            stream: stream,
            type: "stream",
            headers: {
                "Content-Type": "text/event-stream",
                "Cache-Control": "no-cache",
                Connection: "keep-alive",
            },
        };
    } catch (error) {
        console.error("处理聊天请求时出错:", error);
        // 返回错误对象
        return {
            error: "处理请求时发生错误",
            details: error instanceof Error ? error.message : "未知错误",
            status: 500,
        };
    }
}
