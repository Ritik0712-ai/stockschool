import { google } from "@ai-sdk/google";
import { streamText, tool } from "ai";
import { z } from "zod";
import { getQuote, getCompanyProfile } from "@/lib/finnhub";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

const systemPrompt = `
You are an expert, friendly financial tutor for StockSchool — a platform built for Indian investors.
Your goal is to explain complex financial terms in simple, jargon-free English and Hindi (Hinglish is great).
You never provide financial advice (e.g. "You should buy X"). Instead, you educate the user on what terms mean and how the stock market works.
You have access to a tool to fetch real-time and historical stock data for Indian NSE stocks (using Yahoo Finance). 
If a user asks about a specific stock's performance or current price, ALWAYS use the 'getStockData' tool to pull the real data before answering.

Guidelines:
1. Keep answers concise, clear, and beginner-friendly.
2. Use analogies where possible (e.g., comparing a stock to a slice of a pizza).
3. If asked about a specific stock (e.g., "How is Reliance doing?"), use the 'getStockData' tool using its symbol (e.g., RELIANCE.NS). Remember that Indian stocks usually end in '.NS' (NSE) or '.BO' (BSE).
4. Always remind users that the stock market involves risk.
5. Format your responses nicely with markdown (bolding key terms, using bullet points).
`;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const result = streamText({
      model: google("gemini-2.0-flash", {
        apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY!,
      }),
      system: systemPrompt,
      messages,
      tools: {
        getStockData: tool({
          description:
            "Fetch the current price, previous close, and company details for a given Indian stock symbol (e.g., 'RELIANCE.NS', 'TCS.NS').",
          parameters: z.object({
            symbol: z
              .string()
              .describe(
                "The stock symbol to fetch data for. Must include the exchange suffix (e.g., '.NS')."
              ),
          }),
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          execute: async ({ symbol }: { symbol: string }) => {
            try {
              const quote = await getQuote(symbol);
              const profile = await getCompanyProfile(symbol);
              return {
                symbol,
                name: profile.name,
                currentPrice: quote.c,
                previousClose: quote.pc,
                dayHigh: quote.h,
                dayLow: quote.l,
                change: quote.d,
                percentChange: quote.dp,
                currency: quote.currency,
              };
            } catch {
              return { error: `Failed to fetch data for ${symbol}` };
            }
          },
        /* eslint-disable @typescript-eslint/no-explicit-any */
        }) as any,
      },
    });

    // ai SDK v6: use toTextStreamResponse for plain text streaming
    return result.toTextStreamResponse();
  } catch (error) {
    console.error("Chat API Error:", error);
    return new Response(JSON.stringify({ error: "Failed to process chat" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
