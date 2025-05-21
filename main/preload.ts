import { contextBridge, ipcRenderer, IpcRendererEvent } from "electron";

interface ExposedAPI {
    weather: {
        fetchWeather: (params: Record<string, string>) => Promise<any>;
    };
    tts: {
        getPort: () => Promise<number>;
        speak: (params: any) => Promise<ArrayBuffer | null>;
    };
    app: {
        restart: () => Promise<void>;
    };
    ipc: {
        on: (channel: string, callback: (...args: any[]) => void) => void;
        off: (channel: string, callback: (...args: any[]) => void) => void;
    };
    store: {
        get: (key: string) => Promise<any>;
        set: (key: string, value: any) => Promise<void>;
    };
    invoke: (channel: string, ...args: any[]) => Promise<any>;
    ipcRenderer: {
        invoke: (channel: string, ...args: any[]) => Promise<any>;
    };
    chat: {
        sendMessage: (messages: any[]) => Promise<any>;
    };
    detect: {
        checkText: (text: string) => Promise<any>;
        openFraudNotice: (fraudData: any) => Promise<any>;
        closeFraudNotice: () => void;
    };
}

export type IpcHandler = {
    on: (channel: string, callback: (...args: any[]) => void) => void;
    off: (channel: string, callback: (...args: any[]) => void) => void;
};

interface ElectronAPI {
    receive: (channel: string, func: (...args: any[]) => void) => void;
    removeAllListeners: (channel: string) => void;
    send: (channel: string, ...args: any[]) => void;
    invoke: (channel: string, ...args: any[]) => Promise<any>;
    weather: {
        fetchWeather: (params: Record<string, string>) => Promise<any>;
    };
    tts: {
        getPort: () => Promise<number>;
        speak: (params: any) => Promise<ArrayBuffer | null>;
    };
    app: {
        restart: () => Promise<void>;
    };
    ipc: IpcHandler;
    openExternal: (url: string) => Promise<void>;
    chat: {
        sendMessage: (messages: any[]) => Promise<any>;
        onStream: (
            channelId: string,
            callback: (content: string) => void
        ) => () => void;
        onStreamError: (
            channelId: string,
            callback: (error: any) => void
        ) => () => void;
        onStreamDone: (channelId: string, callback: () => void) => () => void;
    };
    detect: {
        checkText: (text: string) => Promise<any>;
        openFraudNotice: (fraudData: any) => Promise<any>;
        closeFraudNotice: () => void;
    };
}

const handler = {
    send(channel: string, value: unknown) {
        ipcRenderer.send(channel, value);
    },
    on(channel: string, callback: (...args: unknown[]) => void) {
        const subscription = (_event: IpcRendererEvent, ...args: unknown[]) =>
            callback(...args);
        ipcRenderer.on(channel, subscription);

        return () => {
            ipcRenderer.removeListener(channel, subscription);
        };
    },
};

declare global {
    interface Window {
        api: ExposedAPI;
        electron: ElectronAPI;
    }
}

const api: ExposedAPI = {
    weather: {
        fetchWeather: (params: Record<string, string>) =>
            ipcRenderer.invoke("fetch-weather", params),
    },
    chat: {
        sendMessage: (messages: any[]) =>
            ipcRenderer.invoke("chat:send", messages),
    },
    detect: {
        checkText: (text: string) => ipcRenderer.invoke("detect:check", text),
        openFraudNotice: (fraudData: any) =>
            ipcRenderer.invoke("open-fraud-notice", fraudData),
        closeFraudNotice: () => ipcRenderer.send("close-fraud-notice"),
    },
    tts: {
        getPort: async () => {
            try {
                const port = await ipcRenderer.invoke("get-tts-port");
                return port;
            } catch (error) {
                console.error("getPort 获取TTS端口出错：", error);
                throw error;
            }
        },
        speak: async (params: any) => {
            try {
                const audio = await ipcRenderer.invoke("tts:speak", params);
                return audio;
            } catch (error) {
                console.error("TTS生成出错：", error);
                return null;
            }
        },
    },
    app: {
        restart: () => ipcRenderer.invoke("app:restart"),
    },
    ipc: {
        on: (channel: string, callback: (...args: any[]) => void) => {
            ipcRenderer.on(channel, (_, ...args) => callback(...args));
        },
        off: (channel: string, callback: (...args: any[]) => void) => {
            ipcRenderer.off(channel, (_, ...args) => callback(...args));
        },
    },
    store: {
        get: (key: string) => ipcRenderer.invoke("store:get", key),
        set: (key: string, value: any) =>
            ipcRenderer.invoke("store:set", { key, value }),
    },
    invoke: (channel: string, ...args: any[]) => {
        const validChannels = [
            "tts:speak",
            "fetch-weather",
            "app:restart",
            "open-external-url",
            "update:check",
            "update:download",
            "update:install",
            "update:getConfig",
            "update:saveConfig",
        ];
        if (validChannels.includes(channel)) {
            return ipcRenderer.invoke(channel, ...args);
        }
        throw new Error(`不支持的通道: ${channel}`);
    },
    ipcRenderer: {
        invoke: (channel: string, ...args: any[]) =>
            ipcRenderer.invoke(channel, ...args),
    },
};

contextBridge.exposeInMainWorld("ipc", handler);
// 将 electron API 暴露给渲染进程
contextBridge.exposeInMainWorld("api", api);
contextBridge.exposeInMainWorld("electron", {
    receive: (channel: string, func: (...args: any[]) => void) => {
        ipcRenderer.on(channel, (_, ...args) => func(...args));
    },
    removeAllListeners: (channel: string) => {
        ipcRenderer.removeAllListeners(channel);
    },
    send: (channel: string, ...args: any[]) => {
        ipcRenderer.send(channel, ...args);
    },
    invoke: (channel: string, ...args: any[]) => {
        return ipcRenderer.invoke(channel, ...args);
    },
    chat: {
        sendMessage: async (messages: any[]) => {
            try {
                const response = await ipcRenderer.invoke(
                    "chat:send",
                    messages
                );
                return response;
            } catch (error) {
                console.error("发送聊天消息失败:", error);
                throw error;
            }
        },
        onStream: (channelId: string, callback: (content: string) => void) => {
            const subscription = (
                _event: IpcRendererEvent,
                data: { content: string }
            ) => callback(data.content);
            ipcRenderer.on(channelId, subscription);
            return () => {
                ipcRenderer.removeListener(channelId, subscription);
            };
        },
        onStreamError: (channelId: string, callback: (error: any) => void) => {
            const errorChannel = `${channelId}:error`;
            const subscription = (_event: IpcRendererEvent, error: any) =>
                callback(error);
            ipcRenderer.on(errorChannel, subscription);
            return () => {
                ipcRenderer.removeListener(errorChannel, subscription);
            };
        },
        onStreamDone: (channelId: string, callback: () => void) => {
            const doneChannel = `${channelId}:done`;
            const subscription = (_event: IpcRendererEvent) => callback();
            ipcRenderer.on(doneChannel, subscription);
            return () => {
                ipcRenderer.removeListener(doneChannel, subscription);
            };
        },
    },
    weather: {
        fetchWeather: async (params: Record<string, string>) => {
            try {
                const result = await ipcRenderer.invoke(
                    "fetch-weather",
                    params
                );
                return result;
            } catch (error) {
                console.error("fetchWeather 获取天气信息出错：", error);
                throw error;
            }
        },
    },
    tts: {
        getPort: async () => {
            try {
                const port = await ipcRenderer.invoke("get-tts-port");
                return port;
            } catch (error) {
                console.error("getPort 获取TTS端口出错：", error);
                throw error;
            }
        },
        speak: async (params: any) => {
            try {
                const audio = await ipcRenderer.invoke("tts:speak", params);
                return audio;
            } catch (error) {
                console.error("TTS生成出错：", error);
                return null;
            }
        },
    },
    app: {
        restart: () => ipcRenderer.invoke("app:restart"),
    },
    ipc: handler,
    openExternal: (url: string) => ipcRenderer.invoke("open-external-url", url),
    detect: {
        checkText: async (text: string) => {
            try {
                const response = await ipcRenderer.invoke("detect:check", text);
                return response;
            } catch (error) {
                console.error("检测诈骗文本失败:", error);
                throw error;
            }
        },
        openFraudNotice: async (fraudData: any) => {
            try {
                const response = await ipcRenderer.invoke(
                    "open-fraud-notice",
                    fraudData
                );
                return response;
            } catch (error) {
                console.error("打开诈骗警告窗口失败:", error);
                throw error;
            }
        },
        closeFraudNotice: () => {
            try {
                ipcRenderer.send("close-fraud-notice");
            } catch (error) {
                console.error("关闭诈骗警告窗口失败:", error);
            }
        },
    },
});
