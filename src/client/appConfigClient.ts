export async function getConfigValue<T = any>(key: string): Promise<T | null> {
  try {
    const res = await fetch(`/api/config?key=${encodeURIComponent(key)}`);
    const data = await res.json();

    if (!res.ok || data.error) {
      console.error("Config fetch error:", data.error);
      return null;
    }

    return data.value as T;
  } catch (error) {
    console.error("Failed to fetch config:", error);
    return null;
  }
}

export async function setConfigValue<T = any>(
  key: string,
  value: T,
): Promise<boolean> {
  try {
    const res = await fetch("/api/config", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ key, value }),
    });

    if (!res.ok) throw new Error("Failed to update config");
    return true;
  } catch (error) {
    console.error("Failed to set config:", error);
    return false;
  }
}
