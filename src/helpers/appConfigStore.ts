import redis from "@/lib/redis";

export async function getConfigValue<T = string>(
  key: string,
  defaultValue?: T,
): Promise<T> {
  const raw = (await redis.get(key)) as string | null; // 👈 Fix: explicitly annotate type

  if (raw === null || raw === undefined) {
    return defaultValue as T;
  }

  try {
    return JSON.parse(raw) as T;
  } catch {
    return raw as unknown as T;
  }
}

export async function setConfigValue<T = string>(
  key: string,
  value: T,
): Promise<void> {
  const stringified = typeof value === "string" ? value : JSON.stringify(value);
  await redis.set(key, stringified);
}
