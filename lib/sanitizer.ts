import { createHash } from "crypto";

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

export const protocol = process.env.NODE_ENV === "development" ? "http://" : "https://";