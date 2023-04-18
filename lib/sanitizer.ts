export function removeNonTextChars(str: string): string {
    // Remove newline characters
    const noNewLines = str.replace(/\n/g, '');

    // Remove Unicode characters
    const noUnicode = noNewLines.replace(/[^\x00-\x7F]/g, '');

    // Remove emoji characters
    const noEmojis = noUnicode.replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, '');

    return noEmojis;
}
