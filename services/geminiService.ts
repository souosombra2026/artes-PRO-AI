
import { GoogleGenAI, Type } from "@google/genai";

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const transformProductImage = async (base64Image: string, stylePrompt: string) => {
  const ai = getAI();
  const prompt = `You are a professional product photographer for handmade crafts.
  The attached image is a photo of a handmade product.
  Your task is to keep the product exactly as it is but place it in a new environment: ${stylePrompt}.
  Make the image look high-quality, professional, and commercial. 
  Ensure the lighting on the product matches the new background.`;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [
        { inlineData: { mimeType: 'image/png', data: base64Image.split(',')[1] } },
        { text: prompt }
      ]
    }
  });

  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }
  throw new Error("Não foi possível gerar a imagem.");
};

export const generateMascot = async (description: string) => {
  const ai = getAI();
  const prompt = `Crie um mascote fofo e amigável para uma marca de artesanato baseada em: ${description}. 
  O estilo deve ser 2D flat, colorido, ideal para adesivos de WhatsApp. 
  Fundo branco sólido para fácil remoção.`;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: { parts: [{ text: prompt }] },
    config: {
      imageConfig: { aspectRatio: "1:1" }
    }
  });

  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }
  throw new Error("Não foi possível gerar o mascote.");
};

export const generateMarketingContent = async (options: {
  productName: string,
  description: string,
  tone: string,
  target: string
}) => {
  const ai = getAI();
  const systemInstruction = `Você é uma especialista em marketing para artesãs brasileiras. 
  Seu objetivo é criar textos que valorizem o trabalho manual e gerem desejo de compra.`;

  const prompt = options.target === 'stories' 
    ? `Crie uma sequência de 5 stories para o Instagram vendendo o produto "${options.productName}". 
       Descrição: ${options.description}. 
       Tom: ${options.tone}. 
       Inclua ganchos de curiosidade, benefícios do artesanal e chamada para ação (CTA).`
    : `Crie uma legenda de alta conversão para o Instagram para o produto "${options.productName}". 
       Descrição: ${options.description}. 
       Tom: ${options.tone}. 
       Use emojis, hashtags relevantes e uma CTA clara.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: { systemInstruction }
  });

  return response.text || "Conteúdo não disponível.";
};
