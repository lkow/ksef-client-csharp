function shorten(input: string, maxLen = 512): string {
  if (!input) return "";
  return input.length <= maxLen ? input : `${input.slice(0, maxLen)}...`;
}

export class JsonUtil {
  public static serialize<T>(obj: T): string {
    try {
      return JSON.stringify(obj);
    } catch (error) {
      throw new Error(`[Serialize] Nie udało się zserializować typu ${(obj as object)?.constructor?.name ?? "unknown"}: ${(error as Error).message}`);
    }
  }

  public static deserialize<T>(json: string): T {
    try {
      return JSON.parse(json) as T;
    } catch (error) {
      throw new Error(`[Deserialize] Nie udało się zdeserializować JSON (pierwsze 512 znaków): ${shorten(json)}\nWyjątek: ${(error as Error).message}`);
    }
  }
}
