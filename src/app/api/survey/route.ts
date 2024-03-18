import { Survey, createSurvey, getSurvey } from '@/services/survey.service';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    const body = await request.json();

    if (!body.title || !body.questions)
        return NextResponse.json(null, { status: 400 });

    const survey: Survey = { title: body.title, questions: body.questions };

    await createSurvey(survey);

    return NextResponse.json("Success!", { status: 200 });
}