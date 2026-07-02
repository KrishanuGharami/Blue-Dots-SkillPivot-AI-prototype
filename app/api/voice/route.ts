import { NextRequest, NextResponse } from "next/server";
import { ConversationState } from "@/lib/stateMachine";
import { askGemini as getGeminiReply } from "@/lib/gemini";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { history, currentState, structuredState } = body;
    
    if (!currentState || !structuredState) {
      return NextResponse.json({ error: "Missing state context" }, { status: 400 });
    }

    const result = await getGeminiReply(history || [], currentState, structuredState);
    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Error in API voice discovery agent:", error);
    return NextResponse.json(
      { error: error.message || "Failed to parse conversation input" },
      { status: 500 }
    );
  }
}
