import { Survey, createSurvey, getSurvey, surveyExists } from '@/services/survey.service';
import { getQuestions } from '@/services/question.service';
import { NextApiRequest } from 'next';
import { NextRequest, NextResponse } from 'next/server';
import { Response, getResponses } from '@/services/response.service';

export async function GET(request: NextApiRequest, { params }: { params: { id: string }}) {
    if (!params.id)
        return NextResponse.json(null, { status: 400 });

    const exists: boolean = await surveyExists(params.id);
    if (!exists)
        return NextResponse.json(null, { status: 404 });

    const responses: Response[] = await getResponses(params.id);

    return NextResponse.json(JSON.stringify(responses), { status: 200 });
}