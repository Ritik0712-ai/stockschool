import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const connectionString = process.env.DATABASE_URL || "postgres://postgres:postgres@localhost:51214/template1";
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Starting seed...");

  // Optional: clear existing courses to avoid duplicates during dev
  await prisma.course.deleteMany({});
  
  // 1. Create the Course
  const course = await prisma.course.create({
    data: {
      title: "Stock Market Basics",
      description: "A beginner-friendly introduction to how the stock market works, the definition of a stock, and how you can start investing safely.",
      level: "beginner",
      order: 1,
      lessons: {
        create: [
          {
            title: "What is a Stock?",
            order: 1,
            duration: 5,
            content: `
# Understanding Stocks

A **stock** (also known as equity) represents a fraction of ownership in a corporation. 

## The Domino's Analogy

Imagine your friend wants to open a new Domino's Pizza franchise. It costs $100,000, but they only have $50,000. They ask you to invest the remaining $50,000. In return, you own **50% of the business**. 

If the pizzeria makes a profit of $20,000 in its first year, your share is $10,000. If they sell the business for $200,000, you get $100,000.

This is exactly how stocks work, just on a much larger scale. When you buy shares in a company like Reliance or Apple, you become a partial owner of that business.

### Why do stock prices change?

Stock prices fluctuate based on **supply and demand**. If more people want to buy a stock (demand) than sell it (supply), the price goes up. Conversely, if more people want to sell a stock than buy it, the price falls.

These factors influence demand:
*   **Company Earnings:** If a company reports higher profits, its stock price usually goes up.
*   **Economic News:** Good economic news can boost the overall market.
*   **Market Sentiment:** Investor emotions (fear and greed) can drive prices in the short term.

> **Key Takeaway:** A stock isn't just a ticker symbol moving on a screen; it's an ownership stake in a real business.
            `,
            quiz: {
              create: {
                questions: [
                  {
                    question: "What does owning a stock represent?",
                    options: [
                      "A loan you made to the company",
                      "A fraction of ownership in the company",
                      "A guaranteed monthly income",
                      "The right to work at the company"
                    ],
                    correctAnswerIndex: 1,
                    explanation: "A stock represents equity, meaning you own a fractional piece of the business."
                  },
                  {
                    question: "What is the primary driver of a stock's price?",
                    options: [
                      "The company's CEO decides the price",
                      "The government sets the price",
                      "Supply and demand in the market",
                      "The number of employees the company has"
                    ],
                    correctAnswerIndex: 2,
                    explanation: "Stock prices fluctuate constantly based on how many people want to buy vs sell the stock (supply and demand)."
                  },
                  {
                    question: "If a company reports higher profits than expected, what usually happens to its stock price?",
                    options: [
                      "It goes down",
                      "It goes up",
                      "It stays exactly the same",
                      "It gets delisted"
                    ],
                    correctAnswerIndex: 1,
                    explanation: "Higher profits usually increase demand for the stock, driving the price up."
                  }
                ]
              }
            }
          },
          {
            title: "How Stock Market Works",
            order: 2,
            duration: 8,
            content: `
# The Stock Exchange

The stock market works like a massive auction house where buyers and sellers come together to trade shares of public companies.

## What is a Stock Exchange?

A stock exchange is a centralized platform where these trades happen. In India, the two primary exchanges are:
1.  **NSE (National Stock Exchange):** The largest in India by trading volume.
2.  **BSE (Bombay Stock Exchange):** The oldest exchange in Asia.

Companies list their shares on these exchanges so the public can buy and sell them.

## The Role of Brokers

You cannot go directly to the NSE or BSE to buy a stock. You must go through a registered intermediary called a **Stock Broker** (like Zerodha, Groww, or Upstox). 

When you place a "Buy" order on your broker's app, the broker sends that order to the exchange. The exchange matches your "Buy" order with someone else's "Sell" order.

## Market Hours

The Indian stock market operates on specific timings (Monday to Friday, excluding public holidays):
*   **Pre-Market Session:** 9:00 AM to 9:15 AM
*   **Normal Trading Session:** 9:15 AM to 3:30 PM

> **Key Takeaway:** You use a broker's app to place orders, which are then matched with other buyers/sellers on a stock exchange like the NSE or BSE.
            `,
            quiz: {
              create: {
                questions: [
                  {
                    question: "What are the two primary stock exchanges in India?",
                    options: [
                      "NYSE and NASDAQ",
                      "NSE and BSE",
                      "LSE and TSE",
                      "NIFTY and SENSEX"
                    ],
                    correctAnswerIndex: 1,
                    explanation: "The National Stock Exchange (NSE) and Bombay Stock Exchange (BSE) are the primary exchanges in India."
                  },
                  {
                    question: "Who do you need an account with to buy stocks?",
                    options: [
                      "Directly with the NSE",
                      "Directly with the company you want to buy",
                      "A Stock Broker",
                      "The Reserve Bank of India"
                    ],
                    correctAnswerIndex: 2,
                    explanation: "You must use a registered stock broker as an intermediary to route your trades to the exchange."
                  },
                  {
                    question: "At what time does the normal trading session close in the Indian stock market?",
                    options: [
                      "3:00 PM",
                      "3:30 PM",
                      "4:00 PM",
                      "5:00 PM"
                    ],
                    correctAnswerIndex: 1,
                    explanation: "The normal trading session runs from 9:15 AM to 3:30 PM."
                  }
                ]
              }
            }
          },
          {
            title: "Bull vs Bear Markets",
            order: 3,
            duration: 6,
            content: `
# Market Sentiments: Bull vs Bear

The stock market doesn't always go straight up. It goes through cycles. We use animal metaphors to describe the overall trend of the market.

## The Bull Market 🐂

A **Bull Market** is a period when stock prices are rising or are expected to rise. 

*   **Analogy:** A bull attacks by thrusting its horns **upward**.
*   **Characteristics:** High investor confidence, strong economy, low unemployment.
*   **Action:** Investors are generally buying, expecting prices to go higher.

## The Bear Market 🐻

A **Bear Market** is a period when stock prices are falling. Generally, a market is considered a "bear market" when it has fallen by 20% or more from recent highs.

*   **Analogy:** A bear attacks by swiping its paws **downward**.
*   **Characteristics:** Widespread pessimism, slowing economy, fear.
*   **Action:** Many investors sell out of fear, driving prices lower.

### How to behave

*   **In a Bull Market:** It's easy to make money, but be careful not to get overly greedy and buy overvalued stocks.
*   **In a Bear Market:** It can be scary, but historically, bear markets represent the best buying opportunities for long-term investors because stocks are "on sale."

> **Key Takeaway:** Bull markets go up (optimism), Bear markets go down (pessimism).
            `,
            quiz: {
              create: {
                questions: [
                  {
                    question: "What defines a Bull Market?",
                    options: [
                      "When prices are falling and investors are fearful",
                      "When the market is closed for holidays",
                      "When prices are rising and investor confidence is high",
                      "When the government buys stocks"
                    ],
                    correctAnswerIndex: 2,
                    explanation: "A bull market is characterized by rising prices and optimism."
                  },
                  {
                    question: "A market is officially considered a Bear Market when it falls by at least what percentage from recent highs?",
                    options: [
                      "5%",
                      "10%",
                      "20%",
                      "50%"
                    ],
                    correctAnswerIndex: 2,
                    explanation: "A 20% decline from recent highs is the standard definition of a bear market."
                  },
                  {
                    question: "Why might a long-term investor view a bear market as an opportunity?",
                    options: [
                      "Because the market is about to crash to zero",
                      "Because good stocks are trading at discounted prices ('on sale')",
                      "Because the government guarantees against losses",
                      "Because brokers charge lower fees"
                    ],
                    correctAnswerIndex: 1,
                    explanation: "Bear markets lower the prices of stocks, allowing long-term investors to buy good companies at a discount."
                  }
                ]
              }
            }
          }
        ]
      }
    }
  });

  console.log("Seeding complete! Course created with ID:", course.id);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
