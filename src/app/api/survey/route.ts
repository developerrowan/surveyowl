import { createSurvey } from "@/services/survey.service";
import { Survey } from "@/types";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json();

  if (!body.title || !body.questions)
    return NextResponse.json(null, { status: 400 });

  const survey: Survey = {
    title: body.title,
    acceptResponsesUntil: undefined,
    questions: body.questions,
  };

  const createdSurvey = await createSurvey(survey);

  return NextResponse.json(
    {
      redirectUrl: `/${createdSurvey.id}/${createdSurvey.managerId}?fromCreation=true`,
    },
    { status: 200 },
  );
}
