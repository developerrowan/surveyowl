import { Survey, createSurvey, getSurvey, surveyExists } from '@/services/survey.service';
import { getQuestions } from '@/services/question.service';
import { NextApiRequest } from 'next';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextApiRequest, { params }: { params: { id: string }}) {
    if (!params.id)
        return NextResponse.json(null, { status: 400 });

    const exists: boolean = await surveyExists(params.id);
    if (!exists)
        return NextResponse.json(null, { status: 404 });

    const survey: Survey = await getSurvey(params.id);

    return NextResponse.json(JSON.stringify(survey), { status: 200 });
}