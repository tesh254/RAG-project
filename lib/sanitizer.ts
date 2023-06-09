import { createHash } from "crypto";
import * as cheerio from "cheerio";

export const cleanAndExtractText = (html: string) => {
    const $ = cheerio.load(html);
    const cleanedText = $("body").text().trim();
    const escapedText = cleanedText.replace(/[\u00A0-\u9999<>&]/gim, (i) => `&#${i.charCodeAt(0)};`);
    return escapedText;
};

export function trimStr(str: string): string {
    // Remove newline characters
    const noNewLines = str.replace(/\n/g, ' ');

    // Remove Unicode characters
    const noUnicode = noNewLines.replace(/[^\x00-\x7F]/g, ' ');

    // Remove emoji characters
    const noEmojis = noUnicode.replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, ' ');

    return noEmojis;
}

export function genChecksum(str: string): string {
    const hash = createHash('sha256');

    hash.update(str);

    return hash.digest('hex');
}

export function cosineSimilarity(A: any, B: any) {
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;
    for (let i = 0; i < A.length; i++) {
        dotProduct += A[i] * B[i];
        normA += A[i] * A[i];
        normB += B[i] * B[i];
    }
    normA = Math.sqrt(normA);
    normB = Math.sqrt(normB);
    return dotProduct / (normA * normB);
}

export function getSimilarityScore(embeddingsHash: any, promptEmbedding: any, recordId: number): [any] {
    const similarityScoreHash: any = {};
    Object.keys(embeddingsHash).forEach((text) => {
        similarityScoreHash[text] = cosineSimilarity(
            promptEmbedding,
            JSON.parse(embeddingsHash[text])
        );
    });
    return similarityScoreHash;
}

export function cosSimilarity(embedding1: number[], embedding2: number[], recordId: number): number[] {
    let dotProduct = 0;
    let norm1 = 0;
    let norm2 = 0;

    for (let i = 0; i < embedding1.length; i++) {
        dotProduct += embedding1[i] * embedding2[i];
        norm1 += Math.pow(embedding1[i], 2);
        norm2 += Math.pow(embedding2[i], 2);
    }

    const denominator = Math.sqrt(norm1) * Math.sqrt(norm2);
    return [denominator === 0 ? 0 : dotProduct / denominator, recordId];
}

export const protocol = process.env.APP_ENV !== "development" ? "https://" : "http://";

export const renderBlock = (block: any) => {
    switch (block.type) {
        case 'heading_1':
            // For a heading
            return `<h1>${block['heading_1'].text[0].plain_text} </h1>`
        case 'bulleted_list_item':
            // For an unordered list
            return `<ul><li>${block['bulleted_list_item'].text[0].plain_text}</li></ul>`
        case 'paragraph':
            // For a paragraph
            return `<p>${block['paragraph'].text[0]?.text?.content}</p>`
        default:
            // For an extra type
            return ""
    }
}

export function splitString(input: string, maxLength: number = 4095) {
    const result = [];
  
    for (let i = 0; i < input.length; i += maxLength) {
      result.push(input.slice(i, i + maxLength));
    }
  
    return result;
  }