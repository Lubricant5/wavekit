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

const DEMO_ANALYSIS = {
  overallScore: 6,
  overallAssessment:
    "This living space has a warm, inviting atmosphere but chi energy is partially blocked by furniture placement and a lack of elemental balance. The room shows strong Earth and Fire energy in the southern zones, but the northern Career area is underactivated and cluttered, creating stagnation in professional life force.",
  chiFlow: {
    rating: "Fair",
    description:
      "Energy enters through the main window and circulates reasonably well through the central area, but is trapped in corners by large furniture pieces. The sofa placement cuts the room diagonally, disrupting the natural meandering path chi prefers.",
    blockages: [
      "Sofa back faces the door — creates vulnerability energy",
      "Dead corner behind armchair accumulates stagnant chi",
      "Overhead lighting too harsh — scatters rather than guides energy",
    ],
  },
  baguaAnalysis: {
    dominantArea: "South (Fame & Reputation)",
    activeZones: [
      { direction: "S", element: "Fire", lifeArea: "Fame", currentState: "TV wall with warm lighting", energyRating: "Strong" },
      { direction: "SE", element: "Wood", lifeArea: "Wealth", currentState: "Empty corner, no plants", energyRating: "Weak" },
      { direction: "E", element: "Wood", lifeArea: "Family", currentState: "Family photos on wall", energyRating: "Balanced" },
      { direction: "N", element: "Water", lifeArea: "Career", currentState: "Cluttered bookshelf", energyRating: "Weak" },
      { direction: "NW", element: "Metal", lifeArea: "Helpful People", currentState: "Window with thin curtains", energyRating: "Balanced" },
      { direction: "Center", element: "Earth", lifeArea: "Health", currentState: "Coffee table centered", energyRating: "Balanced" },
      { direction: "SW", element: "Earth", lifeArea: "Love", currentState: "Pair of chairs, warm tones", energyRating: "Strong" },
    ],
  },
  colorRecommendations: [
    { currentColor: "Beige/neutral walls", recommendedColor: "#4a7c59", element: "Wood", reasoning: "A sage green accent wall on the eastern side activates family harmony and growth chi. Wood element colors support the eastern Bagua zone and invite new opportunities.", urgency: "Medium" },
    { currentColor: "White ceiling", recommendedColor: "#f5f0e8", element: "Earth", reasoning: "A warm ivory ceiling grounds the space and prevents chi from escaping upward. Pure white creates excessive Metal energy that can feel sterile and cold.", urgency: "Low" },
    { currentColor: "Dark curtains", recommendedColor: "#1a3a5c", element: "Water", reasoning: "Deep navy or teal window treatments in the northern Career zone activate water energy, supporting flow, clarity, and professional opportunities.", urgency: "High" },
  ],
  furnitureArrangement: [
    { item: "Main sofa", currentPosition: "Back partially facing entry door", recommendedAction: "Move", targetRoom: "", targetPosition: "Against the solid south wall, commanding view of the door", reason: "The 'command position' places you with your back to a solid wall and a clear sightline to the entry, building confidence and security chi." },
    { item: "Armchair", currentPosition: "Dead corner creating chi trap", recommendedAction: "Move", targetRoom: "", targetPosition: "Angle at 45° to face the center of the room", reason: "Angled placement prevents stagnant energy from pooling in the corner and creates a welcoming conversation arc." },
    { item: "Bookshelf (N wall)", currentPosition: "Cluttered, items in disarray", recommendedAction: "Keep", targetRoom: "", targetPosition: "Same location, but declutter and add a small water feature or dark blue items", reason: "The northern position is ideal for knowledge and career objects — just needs activation with Water element accessories." },
    { item: "Floor lamp", currentPosition: "Behind sofa, casting downward shadow", recommendedAction: "Move", targetRoom: "", targetPosition: "Southeast corner to activate Wealth zone", reason: "Fire/light energy in the Wealth corner (SE) stimulates abundance chi. Upward-facing light lifts energy." },
    { item: "Coffee table (rectangular)", currentPosition: "Center of room", recommendedAction: "Move", targetRoom: "Any room", targetPosition: "Replace with oval or round table", reason: "Sharp corners create 'poison arrows' of cutting chi aimed at seating. A round table promotes harmonious conversation energy." },
  ],
  elementBalance: {
    wood: "Deficient",
    fire: "Excess",
    earth: "Balanced",
    metal: "Deficient",
    water: "Deficient",
  },
  recommendations: [
    { priority: 1, category: "Placement", action: "Move sofa to command position against the south wall so you can see the door while seated", benefit: "Security & Career" },
    { priority: 2, category: "Plants", action: "Place a healthy money plant or jade plant in the southeast Wealth corner", benefit: "Abundance & Prosperity" },
    { priority: 3, category: "Decor", action: "Add a small tabletop water fountain to the north Career zone of the bookshelf", benefit: "Career Flow" },
    { priority: 4, category: "Clutter", action: "Clear and organize the north bookshelf — remove anything not related to knowledge or career goals", benefit: "Mental Clarity" },
    { priority: 5, category: "Lighting", action: "Replace overhead harsh lighting with floor lamps and table lamps to create layered, soft illumination", benefit: "Relationship Harmony" },
  ],
  shoppingRecommendations: [
    { item: "Tabletop Water Fountain", purpose: "Activates Water element in Career zone, encouraging flow and new opportunities", element: "Water", placement: "North side of bookshelf or north wall", priceRange: "Mid-range", lifeAreaBenefit: "Career & Life Path", searchKeywords: "indoor tabletop water fountain feng shui black ceramic" },
    { item: "Jade Money Plant", purpose: "Living Wood energy in Wealth corner attracts abundance and growth chi", element: "Wood", placement: "Southeast corner of the room", priceRange: "Budget", lifeAreaBenefit: "Wealth & Prosperity", searchKeywords: "jade plant crassula feng shui prosperity" },
    { item: "Round Ottoman or Coffee Table", purpose: "Circular shapes promote harmonious chi flow and eliminate cutting corner energy", element: "Earth", placement: "Center of seating area", priceRange: "Mid-range", lifeAreaBenefit: "Health & Relationships", searchKeywords: "round ottoman coffee table living room feng shui" },
    { item: "Amethyst Cluster Crystal", purpose: "Transmutes negative energy and enhances spiritual clarity in the Knowledge zone", element: "Earth", placement: "Northeast corner or bookshelf", priceRange: "Budget", lifeAreaBenefit: "Wisdom & Self-Cultivation", searchKeywords: "amethyst cluster crystal feng shui northeast knowledge" },
    { item: "Pair of Rose Quartz Crystals", purpose: "Activates Love & Relationship energy with feminine yin balance", element: "Earth", placement: "Southwest corner — always in pairs", priceRange: "Budget", lifeAreaBenefit: "Love & Partnership", searchKeywords: "rose quartz pair feng shui southwest love relationship" },
    { item: "Metal Wind Chime (6 rods)", purpose: "Metal element in the West activates Children and Creativity zone, clears stagnant chi", element: "Metal", placement: "West-facing window or wall", priceRange: "Budget", lifeAreaBenefit: "Creativity & Children", searchKeywords: "6 rod metal wind chime feng shui hollow" },
  ],
  quickWins: [
    "Move your sofa so your back is against a solid wall and you can see the door — do this today",
    "Place 3 fresh green plants anywhere in the room to inject Wood element energy immediately",
    "Remove all items stored under the bed or sofa — trapped objects create stagnant chi fields",
  ],
  avoidList: [
    "Mirrors facing the bed or directly opposite the front door",
    "Dead or artificial plants — they carry stagnant yin energy",
    "Cactus or thorny plants indoors — their spines emit cutting chi",
    "Clutter under furniture — blocks energy circulation at floor level",
    "Broken items left unrepaired — symbolize blocked life areas",
    "Beams running directly over seating or sleeping areas",
  ],
};

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const imageFile = formData.get("image") as File;

    if (!imageFile) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      await new Promise((r) => setTimeout(r, 1800));
      return NextResponse.json({ analysis: DEMO_ANALYSIS, demo: true });
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
