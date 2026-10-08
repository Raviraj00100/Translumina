/**
 * Safe text chunking utility for long-text translation.
 * Preserves paragraphs, sentence boundaries, and unicode characters.
 */

export interface TextChunk {
  id: number;
  text: string;
  originalIndex: number;
}

export function splitIntoChunks(text: string, maxChunkLength = 1000): string[] {
  if (!text || text.length <= maxChunkLength) {
    return [text];
  }

  const chunks: string[] = [];
  // Split primarily by double newline (paragraphs)
  const paragraphs = text.split(/(\n\s*\n)/g);

  let currentChunk = '';

  for (const part of paragraphs) {
    if ((currentChunk + part).length <= maxChunkLength) {
      currentChunk += part;
    } else {
      if (currentChunk.trim().length > 0) {
        chunks.push(currentChunk);
        currentChunk = '';
      }

      // If a single paragraph is larger than maxChunkLength, split by sentence
      if (part.length > maxChunkLength) {
        // Sentence regex supporting European, Hindi/Devanagari (।), Arabic (؟), CJK (。！？)
        const sentences = part.split(/([.!?।؟。！？]+(?:\s+|$))/g);
        let sentenceChunk = '';

        for (const s of sentences) {
          if ((sentenceChunk + s).length <= maxChunkLength) {
            sentenceChunk += s;
          } else {
            if (sentenceChunk.trim().length > 0) {
              chunks.push(sentenceChunk);
              sentenceChunk = '';
            }

            // If even a single sentence is larger than maxChunkLength, split by whitespace
            if (s.length > maxChunkLength) {
              const words = s.split(/(\s+)/);
              let wordChunk = '';
              for (const w of words) {
                if ((wordChunk + w).length <= maxChunkLength) {
                  wordChunk += w;
                } else {
                  if (wordChunk.length > 0) {
                    chunks.push(wordChunk);
                    wordChunk = '';
                  }
                  if (w.length > maxChunkLength) {
                    // Hard cut as absolute last resort for giant unbroken strings
                    for (let i = 0; i < w.length; i += maxChunkLength) {
                      chunks.push(w.slice(i, i + maxChunkLength));
                    }
                  } else {
                    wordChunk = w;
                  }
                }
              }
              if (wordChunk.length > 0) {
                sentenceChunk = wordChunk;
              }
            } else {
              sentenceChunk = s;
            }
          }
        }
        if (sentenceChunk.length > 0) {
          currentChunk = sentenceChunk;
        }
      } else {
        currentChunk = part;
      }
    }
  }

  if (currentChunk.length > 0) {
    chunks.push(currentChunk);
  }

  return chunks.filter(c => c.length > 0);
}

export function reassembleChunks(translatedChunks: string[]): string {
  return translatedChunks.join('');
}
