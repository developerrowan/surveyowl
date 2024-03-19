import { getSurvey, surveyExists } from "@/services/survey.service";
import { Survey } from "@/types";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string; managerId: string } },
) {
  if (!params.id || !params.managerId)
    return NextResponse.json(null, { status: 400 });

  const exists: boolean = await surveyExists(params.id, params.managerId);
  if (!exists) return NextResponse.json(null, { status: 404 });

  const survey: Survey = await getSurvey(params.id);

  return NextResponse.json(JSON.stringify(survey), { status: 200 });
}
