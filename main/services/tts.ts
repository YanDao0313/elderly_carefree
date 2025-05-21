let ttsPort: number | null = null;

export function setTTSPort(port: number) {
    ttsPort = port;
}

export function getTTSPort(): Promise<number | null> {
    return Promise.resolve(ttsPort);
}

export function clearTTSPort() {
    ttsPort = null;
}
