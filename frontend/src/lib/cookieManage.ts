type CookieOptions = {
  days?: number;
  path?: string;
  secure?: boolean;
  sameSite?: "strict" | "lax" | "none";
};

const cookieManager = {
  get: (key: string): string | null => {
    const cookies = document.cookie.split("; ");
    const cookie = cookies.find((row) => row.startsWith(key + "="));
    return cookie ? decodeURIComponent(cookie.split("=")[1]) : null;
  },

  set: (key: string, value: string, options: CookieOptions = {}): void => {
    let cookie = `${key}=${encodeURIComponent(value)}`;

    if (options.days) {
      const date = new Date();
      date.setTime(date.getTime() + options.days * 24 * 60 * 60 * 1000);
      cookie += `; expires=${date.toUTCString()}`;
    }

    cookie += `; path=${options.path || "/"}`;

    if (options.secure) {
      cookie += "; secure";
    }

    if (options.sameSite) {
      cookie += `; samesite=${options.sameSite}`;
    }

    document.cookie = cookie;
  },

  remove: (key: string): void => {
    document.cookie = `${key}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  },
};

export default cookieManager;
