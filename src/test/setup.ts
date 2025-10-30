// 测试环境设置文件

// 模拟 window.devicePixelRatio
Object.defineProperty(window, "devicePixelRatio", {
    writable: true,
    configurable: true,
    value: 1,
});

// 模拟 HTMLCanvasElement.getContext
HTMLCanvasElement.prototype.getContext = vi.fn(() => ({
    fillRect: vi.fn(),
    clearRect: vi.fn(),
    getImageData: vi.fn(() => ({ data: new Array(4) })),
    putImageData: vi.fn(),
    createImageData: vi.fn(() => ({ data: new Array(4) })),
    setTransform: vi.fn(),
    drawImage: vi.fn(),
    save: vi.fn(),
    fillText: vi.fn(),
    restore: vi.fn(),
    beginPath: vi.fn(),
    moveTo: vi.fn(),
    lineTo: vi.fn(),
    closePath: vi.fn(),
    stroke: vi.fn(),
    translate: vi.fn(),
    scale: vi.fn(),
    rotate: vi.fn(),
    arc: vi.fn(),
    fill: vi.fn(),
    measureText: vi.fn(() => ({ width: 0 })),
    transform: vi.fn(),
    rect: vi.fn(),
    clip: vi.fn(),
})) as any;

// 模拟 requestAnimationFrame
global.requestAnimationFrame = vi.fn((cb) => setTimeout(cb, 16));
global.cancelAnimationFrame = vi.fn();

// 模拟 URL 构造函数
global.URL = class URL {
    public protocol: string;
    public href: string;

    constructor(url: string) {
        this.href = url;

        // 检查是否是有效的 URL 格式
        if (!url || typeof url !== "string") {
            throw new Error("Invalid URL");
        }

        if (url.startsWith("https://")) {
            this.protocol = "https:";
        } else if (url.startsWith("http://")) {
            this.protocol = "http:";
        } else if (url.startsWith("ftp://")) {
            this.protocol = "ftp:";
        } else if (url.includes("://")) {
            // 其他协议
            const protocolMatch = url.match(/^([^:]+):/);
            this.protocol = protocolMatch ? protocolMatch[1] + ":" : "";
        } else {
            throw new Error("Invalid URL");
        }
    }

    toString() {
        return this.href;
    }
} as any;
