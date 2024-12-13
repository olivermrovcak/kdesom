import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GEMINI_API_KEY);
const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    generationConfig: {
        temperature: 1.0,
    },
});

export async function getGeminiContent(prompt: string) {
    const result = await model.generateContent(prompt);
    return result.response.text();
}

export async function getRandomLatLng() {
    const prompt = `List one random coord, must be available by google street view, using this JSON schema:
    Cooord = {'lat': string, 'lng': string}
    Return: Array<Coords>`;

    const result = await model.generateContent(prompt);
    console.log(result.response.text()); 

}
