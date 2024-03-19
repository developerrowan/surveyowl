import {
  deleteSurvey,
  getSurvey,
  surveyExists,
  updateSurveyResponseWindow,
} from "@/services/survey.service";
import { Survey } from "@/types";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  if (!params.id) return NextResponse.json(null, { status: 400 });

  const exists: boolean = await surveyExists(params.id);
  if (!exists) return NextResponse.json(null, { status: 404 });

  const result = await deleteSurvey(params.id);

  console.log(result);

  if (!result) return NextResponse.json(null, { status: 500 });

  return NextResponse.json(null, { status: 200 });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const body = await request.json();

  if (!params.id || !body.acceptResponsesUntil)
    return NextResponse.json(null, { status: 400 });

  const exists: boolean = await surveyExists(params.id);
  if (!exists) return NextResponse.json(null, { status: 404 });

  const result = await updateSurveyResponseWindow(
    params.id,
    body.acceptResponsesUntil,
  );

  if (!result) return NextResponse.json(null, { status: 500 });

  return NextResponse.json(null, { status: 200 });
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  if (!params.id) return NextResponse.json(null, { status: 400 });

  const exists: boolean = await surveyExists(params.id);
  if (!exists) return NextResponse.json(null, { status: 404 });

  const survey: Survey = await getSurvey(params.id);

  return NextResponse.json(JSON.stringify(survey), { status: 200 });
}
