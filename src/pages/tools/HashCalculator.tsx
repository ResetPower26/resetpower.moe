// Responsible for the hash calculator tool supporting MD5, SHA-1, SHA-256, SHA-512.
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/Button";

type HashAlgorithm = "MD5" | "SHA-1" | "SHA-256" | "SHA-512";

const supportedAlgorithms: HashAlgorithm[] = [
  "MD5",
  "SHA-1",
  "SHA-256",
  "SHA-512",
];

// MD5 implementation (pure JS, no external dependency)
function md5(inputString: string): string {
  function safeAdd(x: number, y: number): number {
    const lsw = (x & 0xffff) + (y & 0xffff);
    const msw = (x >> 16) + (y >> 16) + (lsw >> 16);
    return (msw << 16) | (lsw & 0xffff);
  }
  function bitRotateLeft(num: number, cnt: number): number {
    return (num << cnt) | (num >>> (32 - cnt));
  }
  function md5cmn(
    q: number,
    a: number,
    b: number,
    x: number,
    s: number,
    t: number,
  ): number {
    return safeAdd(bitRotateLeft(safeAdd(safeAdd(a, q), safeAdd(x, t)), s), b);
  }
  function md5ff(
    a: number,
    b: number,
    c: number,
    d: number,
    x: number,
    s: number,
    t: number,
  ) {
    return md5cmn((b & c) | (~b & d), a, b, x, s, t);
  }
  function md5gg(
    a: number,
    b: number,
    c: number,
    d: number,
    x: number,
    s: number,
    t: number,
  ) {
    return md5cmn((b & d) | (c & ~d), a, b, x, s, t);
  }
  function md5hh(
    a: number,
    b: number,
    c: number,
    d: number,
    x: number,
    s: number,
    t: number,
  ) {
    return md5cmn(b ^ c ^ d, a, b, x, s, t);
  }
  function md5ii(
    a: number,
    b: number,
    c: number,
    d: number,
    x: number,
    s: number,
    t: number,
  ) {
    return md5cmn(c ^ (b | ~d), a, b, x, s, t);
  }
  function str2binl(str: string): number[] {
    const bin: number[] = [];
    const mask = (1 << 8) - 1;
    for (let i = 0; i < str.length * 8; i += 8)
      bin[i >> 5] |= (str.charCodeAt(i / 8) & mask) << (i % 32);
    return bin;
  }
  function binl2hex(binarray: number[]): string {
    const hexTab = "0123456789abcdef";
    let str = "";
    for (let i = 0; i < binarray.length * 4; i++) {
      str +=
        hexTab.charAt((binarray[i >> 2] >> ((i % 4) * 8 + 4)) & 0xf) +
        hexTab.charAt((binarray[i >> 2] >> ((i % 4) * 8)) & 0xf);
    }
    return str;
  }
  function binlMD5(x: number[], len: number): number[] {
    x[len >> 5] |= 0x80 << (len % 32);
    x[(((len + 64) >>> 9) << 4) + 14] = len;
    let a = 1732584193,
      b = -271733879,
      c = -1732584194,
      d = 271733878;
    for (let i = 0; i < x.length; i += 16) {
      const [oa, ob, oc, od] = [a, b, c, d];
      a = md5ff(a, b, c, d, x[i], 7, -680876936);
      d = md5ff(d, a, b, c, x[i + 1], 12, -389564586);
      c = md5ff(c, d, a, b, x[i + 2], 17, 606105819);
      b = md5ff(b, c, d, a, x[i + 3], 22, -1044525330);
      a = md5ff(a, b, c, d, x[i + 4], 7, -176418897);
      d = md5ff(d, a, b, c, x[i + 5], 12, 1200080426);
      c = md5ff(c, d, a, b, x[i + 6], 17, -1473231341);
      b = md5ff(b, c, d, a, x[i + 7], 22, -45705983);
      a = md5ff(a, b, c, d, x[i + 8], 7, 1770035416);
      d = md5ff(d, a, b, c, x[i + 9], 12, -1958414417);
      c = md5ff(c, d, a, b, x[i + 10], 17, -42063);
      b = md5ff(b, c, d, a, x[i + 11], 22, -1990404162);
      a = md5ff(a, b, c, d, x[i + 12], 7, 1804603682);
      d = md5ff(d, a, b, c, x[i + 13], 12, -40341101);
      c = md5ff(c, d, a, b, x[i + 14], 17, -1502002290);
      b = md5ff(b, c, d, a, x[i + 15], 22, 1236535329);
      a = md5gg(a, b, c, d, x[i + 1], 5, -165796510);
      d = md5gg(d, a, b, c, x[i + 6], 9, -1069501632);
      c = md5gg(c, d, a, b, x[i + 11], 14, 643717713);
      b = md5gg(b, c, d, a, x[i], 20, -373897302);
      a = md5gg(a, b, c, d, x[i + 5], 5, -701558691);
      d = md5gg(d, a, b, c, x[i + 10], 9, 38016083);
      c = md5gg(c, d, a, b, x[i + 15], 14, -660478335);
      b = md5gg(b, c, d, a, x[i + 4], 20, -405537848);
      a = md5gg(a, b, c, d, x[i + 9], 5, 568446438);
      d = md5gg(d, a, b, c, x[i + 14], 9, -1019803690);
      c = md5gg(c, d, a, b, x[i + 3], 14, -187363961);
      b = md5gg(b, c, d, a, x[i + 8], 20, 1163531501);
      a = md5gg(a, b, c, d, x[i + 13], 5, -1444681467);
      d = md5gg(d, a, b, c, x[i + 2], 9, -51403784);
      c = md5gg(c, d, a, b, x[i + 7], 14, 1735328473);
      b = md5gg(b, c, d, a, x[i + 12], 20, -1926607734);
      a = md5hh(a, b, c, d, x[i + 5], 4, -378558);
      d = md5hh(d, a, b, c, x[i + 8], 11, -2022574463);
      c = md5hh(c, d, a, b, x[i + 11], 16, 1839030562);
      b = md5hh(b, c, d, a, x[i + 14], 23, -35309556);
      a = md5hh(a, b, c, d, x[i + 1], 4, -1530992060);
      d = md5hh(d, a, b, c, x[i + 4], 11, 1272893353);
      c = md5hh(c, d, a, b, x[i + 7], 16, -155497632);
      b = md5hh(b, c, d, a, x[i + 10], 23, -1094730640);
      a = md5hh(a, b, c, d, x[i + 13], 4, 681279174);
      d = md5hh(d, a, b, c, x[i], 11, -358537222);
      c = md5hh(c, d, a, b, x[i + 3], 16, -722521979);
      b = md5hh(b, c, d, a, x[i + 6], 23, 76029189);
      a = md5hh(a, b, c, d, x[i + 9], 4, -640364487);
      d = md5hh(d, a, b, c, x[i + 12], 11, -421815835);
      c = md5hh(c, d, a, b, x[i + 15], 16, 530742520);
      b = md5hh(b, c, d, a, x[i + 2], 23, -995338651);
      a = md5ii(a, b, c, d, x[i], 6, -198630844);
      d = md5ii(d, a, b, c, x[i + 7], 10, 1126891415);
      c = md5ii(c, d, a, b, x[i + 14], 15, -1416354905);
      b = md5ii(b, c, d, a, x[i + 5], 21, -57434055);
      a = md5ii(a, b, c, d, x[i + 12], 6, 1700485571);
      d = md5ii(d, a, b, c, x[i + 3], 10, -1894986606);
      c = md5ii(c, d, a, b, x[i + 10], 15, -1051523);
      b = md5ii(b, c, d, a, x[i + 1], 21, -2054922799);
      a = md5ii(a, b, c, d, x[i + 8], 6, 1873313359);
      d = md5ii(d, a, b, c, x[i + 15], 10, -30611744);
      c = md5ii(c, d, a, b, x[i + 6], 15, -1560198380);
      b = md5ii(b, c, d, a, x[i + 13], 21, 1309151649);
      a = md5ii(a, b, c, d, x[i + 4], 6, -145523070);
      d = md5ii(d, a, b, c, x[i + 11], 10, -1120210379);
      c = md5ii(c, d, a, b, x[i + 2], 15, 718787259);
      b = md5ii(b, c, d, a, x[i + 9], 21, -343485551);
      a = safeAdd(a, oa);
      b = safeAdd(b, ob);
      c = safeAdd(c, oc);
      d = safeAdd(d, od);
    }
    return [a, b, c, d];
  }
  // Encode string to Latin-1 for MD5
  const latin1 = unescape(encodeURIComponent(inputString));
  return binl2hex(binlMD5(str2binl(latin1), latin1.length * 8));
}

async function computeSubtleHash(
  algorithm: "SHA-1" | "SHA-256" | "SHA-512",
  input: string,
): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(input);
  const hashBuffer = await crypto.subtle.digest(algorithm, data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

const subtleAlgorithms = new Set<HashAlgorithm>([
  "SHA-1",
  "SHA-256",
  "SHA-512",
]);

async function computeHash(
  algorithm: HashAlgorithm,
  input: string,
): Promise<{ output: string; error: string | null }> {
  try {
    if (algorithm === "MD5") return { output: md5(input), error: null };
    if (subtleAlgorithms.has(algorithm)) {
      const output = await computeSubtleHash(
        algorithm as "SHA-1" | "SHA-256" | "SHA-512",
        input,
      );
      return { output, error: null };
    }
    return { output: "", error: "不支持该算法" };
  } catch {
    return { output: "", error: "计算哈希失败" };
  }
}

export function HashCalculator() {
  const navigate = useNavigate();
  const [inputText, setInputText] = useState("");
  const [selectedAlgorithm, setSelectedAlgorithm] =
    useState<HashAlgorithm>("SHA-256");
  const [hashResult, setHashResult] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  async function calculateHash() {
    if (!inputText.trim()) return;
    setIsCalculating(true);
    setErrorMessage(null);
    const { output, error } = await computeHash(selectedAlgorithm, inputText);
    setHashResult(output);
    setErrorMessage(error);
    setIsCalculating(false);
  }

  function selectAlgorithm(algo: HashAlgorithm) {
    setSelectedAlgorithm(algo);
    setHashResult("");
    setErrorMessage(null);
  }

  function clearAll() {
    setInputText("");
    setHashResult("");
    setErrorMessage(null);
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <button
        type="button"
        onClick={() => navigate("/tools")}
        className="text-sm text-slate-500 hover:text-blue-600 mb-6 inline-flex items-center gap-1 transition-colors"
      >
        ← 返回工具栏
      </button>
      <h1 className="text-2xl font-bold text-slate-800 mb-6">哈希值计算</h1>
      <div className="flex flex-col gap-4">
        <div>
          <p className="text-sm font-medium text-slate-600 mb-2">选择算法</p>
          <div className="flex flex-wrap gap-2">
            {supportedAlgorithms.map((algo) => (
              <button
                key={algo}
                type="button"
                onClick={() => selectAlgorithm(algo)}
                className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
                  selectedAlgorithm === algo
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white text-slate-600 border-slate-200 hover:border-blue-400 hover:text-blue-600"
                }`}
              >
                {algo}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label
            className="text-sm font-medium text-slate-600 mb-2 block"
            htmlFor="hash-input"
          >
            输入文本
          </label>
          <textarea
            id="hash-input"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="输入要计算哈希的文本…"
            className="w-full h-40 p-4 font-mono text-sm border border-slate-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50"
          />
        </div>
        <div className="flex gap-3">
          <Button
            variant="primary"
            className="px-6 py-2 text-sm"
            onClick={calculateHash}
          >
            {isCalculating ? "计算中…" : "计算哈希"}
          </Button>
          <Button
            variant="secondary"
            className="px-4 py-2 text-sm"
            onClick={clearAll}
          >
            清空
          </Button>
        </div>
        {(hashResult || errorMessage) && (
          <div>
            <p className="text-sm font-medium text-slate-600 mb-2">
              {selectedAlgorithm} 哈希值
            </p>
            {errorMessage ? (
              <div className="p-4 border border-red-200 rounded-xl bg-red-50 text-red-600 text-sm">
                错误：{errorMessage}
              </div>
            ) : (
              <div className="p-4 border border-slate-200 rounded-xl bg-slate-50 font-mono text-sm text-slate-800 break-all">
                {hashResult}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
