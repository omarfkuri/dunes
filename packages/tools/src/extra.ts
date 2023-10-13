

export function sleep(ms = 5000) {
  // @ts-expect-error
  return new Promise<void>(res => setTimeout(res, ms));
}

const enc1 = "data:text/javascript;charset=utf-8";
const enc2 = "data:text/javascript;base64";

export function evaluate<T>(script: string): Promise<T> {
  const encodedJs = encodeURIComponent(script);
  const dataUri = enc2 + ',' + encodedJs;

  return import(dataUri);
}