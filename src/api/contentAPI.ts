import { HfInference } from '@huggingface/inference';

const hf = new HfInference(import.meta.env.VITE_HUGGINGFACE_API_KEY);

export const checkContentAI = async (content: string) => {
    const result = await hf.textClassification({
        inputs: content,
        model: 'cardiffnlp/twitter-roberta-base-offensive',
    });

    const offensiveScore = result.find((item: any) => item.label === 'offensive')?.score ?? 0;

    if (offensiveScore > 0.9) {
        return { type: 'Extremely offensive', score: offensiveScore };
    } else if (offensiveScore > 0.75) {
        return { type: 'Highly offensive', score: offensiveScore };
    } else if (offensiveScore > 0.5) {
        return { type: 'Very offensive', score: offensiveScore };
    } else if (offensiveScore > 0.35) {
        return { type: 'Quite offensive', score: offensiveScore };
    } else {
        return false;
    }
};

export const censorBadWords = async (content: string) => {
    const result = await hf.textGeneration({
        inputs: `Rewrite this content by replacing bad words with '***': ${content}`,
        model: 'distilgpt2', // Specify a valid text generation model
    });

    // Safely access the generated text
    if (result) {
        return result;
    }

    throw new Error('Unexpected output format from the model');
};