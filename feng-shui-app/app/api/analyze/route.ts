import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const FENG_SHUI_PROMPT = `You are an expert Feng Shui master with deep knowledge of traditional Chinese Feng Shui principles, the Bagua map, Five Elements theory, and Chi flow. Analyze this room image and provide a comprehensive Feng Shui report.

Provide your analysis in the following JSON structure:

{
  "overallScore": <1-10 number>,
  "overallAssessment": "<2-3 sentence overview of the room's energy>",
  "chiFlow": {
    "rating": "<Good|Fair|Poor>",
    "description": "<description of how chi/energy flows in the space>",
    "blockages": ["<blockage 1>", "<blockage 2>"]
  },
  "baguaAnalysis": {
    "dominantArea": "<which Bagua area appears dominant>",
    "activeZones": [
      {
        "direction": "<N|NE|E|SE|S|SW|W|NW|Center>",
        "element": "<Wood|Fire|Earth|Metal|Water>",
        "lifeArea": "<Career|Knowledge|Family|Wealth|Fame|Love|Children|Helpful People|Health>",
        "currentState": "<description of what's there>",
        "energyRating": "<Strong|Weak|Balanced>"
      }
    ]
  },
  "colorRecommendations": [
    {
      "currentColor": "<color observed>",
      "recommendedColor": "<recommended color>",
      "element": "<associated element>",
      "reasoning": "<why this color supports the space>",
      "urgency": "<High|Medium|Low>"
    }
  ],
  "furnitureArrangement": [
    {
      "item": "<item name>",
      "currentPosition": "<where it is now>",
      "recommendedAction": "<Move|Keep|Remove>",
      "targetRoom": "<if moving, which room>",
      "targetPosition": "<where to place it>",
      "reason": "<feng shui reason>"
    }
  ],
  "elementBalance": {
    "wood": "<Excess|Balanced|Deficient>",
    "fire": "<Excess|Balanced|Deficient>",
    "earth": "<Excess|Balanced|Deficient>",
    "metal": "<Excess|Balanced|Deficient>",
    "water": "<Excess|Balanced|Deficient>"
  },
  "recommendations": [
    {
      "priority": "<1-5 number, 1 being highest>",
      "category": "<Placement|Color|Decor|Plants|Lighting|Clutter>",
      "action": "<specific action to take>",
      "benefit": "<what life area this improves>"
    }
  ],
  "shoppingRecommendations": [
    {
      "item": "<item name>",
      "purpose": "<feng shui purpose>",
      "element": "<associated element>",
      "placement": "<where to put it>",
      "priceRange": "<Budget|Mid-range|Premium>",
      "lifeAreaBenefit": "<what it enhances>",
      "searchKeywords": "<keywords to search for this item>"
    }
  ],
  "quickWins": ["<immediate action 1>", "<immediate action 2>", "<immediate action 3>"],
  "avoidList": ["<thing to avoid 1>", "<thing to avoid 2>"]
}

Be specific, practical, and grounded in traditional Feng Shui principles. Reference actual items visible in the image. For shopping recommendations, include items that would genuinely enhance the room's energy according to Feng Shui — such as crystals, plants, water features, wind chimes, mirrors, artwork, etc.`;

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const imageFile = formData.get("image") as File;

    if (!imageFile) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }

    const bytes = await imageFile.arrayBuffer();
    const base64 = Buffer.from(bytes).toString("base64");
    const mediaType = imageFile.type as "image/jpeg" | "image/png" | "image/gif" | "image/webp";

    const message = await client.messages.create({
      model: "claude-opus-4-8",
      max_tokens: 4096,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image",
              source: {
                type: "base64",
                media_type: mediaType,
                data: base64,
              },
            },
            {
              type: "text",
              text: FENG_SHUI_PROMPT,
            },
          ],
        },
      ],
    });

    const responseText = message.content[0].type === "text" ? message.content[0].text : "";

    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return NextResponse.json({ error: "Failed to parse analysis" }, { status: 500 });
    }

    const analysis = JSON.parse(jsonMatch[0]);
    return NextResponse.json({ analysis });
  } catch (error) {
    console.error("Analysis error:", error);
    return NextResponse.json(
      { error: "Failed to analyze image. Please check your API key and try again." },
      { status: 500 }
    );
  }
}
