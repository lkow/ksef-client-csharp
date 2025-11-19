const ESCAPE_MAP: Record<string, string> = {
  "\\": "\\",
  n: "\n",
  r: "\r",
  t: "\t",
  "0": "\0",
  b: "\b",
  f: "\f",
  v: "\v",
  a: "\x07",
  "'": "'",
  '"': '"',
};

export function regexUnescape(value: string): string {
  return value.replace(/\\(u[0-9a-fA-F]{4}|x[0-9a-fA-F]{2}|.)/g, (_, seq: string) => {
    if (seq.startsWith("u") && seq.length === 5) {
      return String.fromCharCode(parseInt(seq.substring(1), 16));
    }
    if (seq.startsWith("x") && seq.length === 3) {
      return String.fromCharCode(parseInt(seq.substring(1), 16));
    }
    return ESCAPE_MAP[seq] ?? seq;
  });
}
