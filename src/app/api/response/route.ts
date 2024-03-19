import { createResponse } from "@/services/response.service";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json();

  if (!body.surveyId || !body.questionResponses)
    return NextResponse.json(null, { status: 400 });

  const response = await createResponse(body.surveyId, body.questionResponses);

  return NextResponse.json({ responseId: response.id }, { status: 200 });
}
