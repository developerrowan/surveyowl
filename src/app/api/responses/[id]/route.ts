import { getResponses } from "@/services/response.service";
import { surveyExists } from "@/services/survey.service";
import { Response } from "@/types";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  if (!params.id) return NextResponse.json(null, { status: 400 });

  const exists: boolean = await surveyExists(params.id);
  if (!exists) return NextResponse.json(null, { status: 404 });

  const responses: Response[] = await getResponses(params.id);

  return NextResponse.json(JSON.stringify(responses), { status: 200 });
}
