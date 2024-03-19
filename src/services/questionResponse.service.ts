import { Question } from '@/components/EditableQuestion'
import prisma from '@/lib/prisma';
import generateId from '@/utils/generateId';
import { getQuestions } from './question.service';
import { QuestionResponse } from '@/app/[id]/page';


export async function getQuestionResponses(responseId: string) {
    const responseFromDb = await prisma.questionResponse.findMany({
        where: {
            responseId
        },
        orderBy: {
            createdAt: 'desc'
        }
    });

    const answers: QuestionResponse[] = [];

    responseFromDb.forEach((element: any) => {
        answers.push({
            questionId: element.questionId,
            values: element.values,
        });
    });

    return answers;
}