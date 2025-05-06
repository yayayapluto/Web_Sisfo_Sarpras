import { useEffect, useState } from 'react';

type CookieOptions = {
    expires?: Date | number;
    path?: string;
    domain?: string;
    secure?: boolean;
    sameSite?: 'strict' | 'lax' | 'none';
};

function setCookie(name: string, value: string, options: CookieOptions = {}) {
    let cookieString = `${name}=${value}`;

    if (options.expires) {
        if (typeof options.expires === 'number') {
            const date = new Date();
            date.setTime(date.getTime() + (options.expires * 24 * 60 * 60 * 1000));
            cookieString += `; expires=${date.toUTCString()}`;
        } else {
            cookieString += `; expires=${options.expires.toUTCString()}`;
        }
    }

    if (options.path) {
        cookieString += `; path=${options.path}`;
    }

    if (options.domain) {
        cookieString += `; domain=${options.domain}`;
    }

    if (options.secure) {
        cookieString += '; secure';
    }

    if (options.sameSite) {
        cookieString += `; samesite=${options.sameSite}`;
    }

    document.cookie = cookieString;
}

function getCookie(name: string): string | null {
    const nameEQ = `${name}=`;

    if (typeof document === "undefined") return null

    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return decodeURIComponent(c.substring(nameEQ.length, c.length));
    }
    return null;
}

function removeCookie(name: string, options: CookieOptions = {}) {
    setCookie(name, '', { ...options, expires: -1 });
}

export function useCookies(name: string, initialValue: string | null = null): [string | null, (value: string| null, options?: CookieOptions) => void, () => void] {
    const [cookieValue, setCookieValue] = useState<string | null>(() => {
        const value = getCookie(name);
        return value !== null ? value : initialValue;
    });

    const updateCookie = (value: string | null, options?: CookieOptions) => {
        if (value === null) {
            removeCookie(name, options);
        } else {
            setCookie(name, value, options);
        }
        setCookieValue(value);
    };

    const deleteCookie = (options?: CookieOptions) => {
        removeCookie(name, options);
        setCookieValue(null);
    };

    useEffect(() => {
        const value = getCookie(name);
        if (value !== null) {
            setCookieValue(value);
        }
    }, [name]);

    return [cookieValue, updateCookie, deleteCookie];
}