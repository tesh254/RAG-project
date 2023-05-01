import crypto from "crypto";

type IdentityFunction = () => string;

const getUserAgent: IdentityFunction = () => {
    return navigator.userAgent;
}

const getScreenResolution: IdentityFunction = () => {
    return `${screen.width}x${screen.height}`;
}

const getBrowserLang: IdentityFunction = () => {
    return navigator.language;
}

const getTimezoneOffset: IdentityFunction = () => {
    return new Date().getTimezoneOffset().toString();
}

function customGetRandomValues(buffer: Uint8Array): Uint8Array {
    if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
        return crypto.getRandomValues(buffer);
    } else {
        for (let i = 0; i < buffer.length; i++) {
            buffer[i] = Math.floor(Math.random() * 256);
        }
        return buffer;
    }
}

const generateUUID: IdentityFunction = () => {
    let uuid = new Uint8Array(16);
    uuid = customGetRandomValues(uuid);
    uuid[6] &= 0x0f;
    uuid[6] |= 0x40;
    uuid[8] &= 0x3f;
    uuid[8] |= 0x80;
    return Array.from(uuid, (byte) => byte.toString(16).padStart(2, '0')).join('');
}

export const getFingerprint: IdentityFunction = () => {
    const userAgent = getUserAgent();
    const screenRes = getScreenResolution();
    const lang = getBrowserLang();
    const tz = getTimezoneOffset();
    const uuid = generateUUID();

    return `${userAgent}:${screenRes}:${lang}:${tz}:${uuid}`;
}
