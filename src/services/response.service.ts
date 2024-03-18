import { Question } from '@/components/EditableQuestion'
import prisma from '@/lib/prisma';
import generateId from '@/utils/generateId';
import { getQuestions } from './question.service';
import { QuestionResponse } from '@/app/[id]/page';

export type Survey = {
    title: string,
    questions: Question[]
};

export async function createResponse(surveyId: string, responses: QuestionResponse[]) {
    const responseId = generateId();
    const questionResponse = await prisma.response.create({
        data: {
            id: responseId,
            surveyId: surveyId,
            questionResponses: {
                create: responses.map((response) => {
                        return {
                            id: generateId(12),
                            question: {
                                connect: { id: response.questionId }
                            },
                            values: response.values
                        }
                    })
            }
        }
    });

    return questionResponse;
}

export async function getSurvey(surveyId: string) {
    const surveyFromDb = await prisma.survey.findUnique({
        where: {
            id: surveyId
        }
    });

    const questions: Question[] = await getQuestions(surveyId);

    const survey: Survey = { title: surveyFromDb.title, questions };

    return survey;
}