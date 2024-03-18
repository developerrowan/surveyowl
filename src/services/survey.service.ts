import { Question } from '@/components/EditableQuestion'
import prisma from '@/lib/prisma';
import generateId from '@/utils/generateId';
import { getQuestions } from './question.service';

export type Survey = {
    title: string,
    questions: Question[]
};

export async function createSurvey(survey: Survey) {
    const newSurvey = await prisma.survey.create({
        data: {
            id: generateId(),
            managerId: generateId(),
            title: survey.title,
            questions: {
                create: survey.questions.map((question, i) => {
                        return {
                            id: generateId(12),
                            index: i,
                            title: question.title,
                            required: question.required,
                            type: question.type,
                            values: question.responses || []
                        }
                    })
            }
        }
    });

    return newSurvey;
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

export async function surveyExists(surveyId: string, managerId?: string): Promise<boolean> {
    const query = managerId ? { where: { id: surveyId, managerId }} : { where: { id: surveyId }};

    const count = await prisma.survey.count(query);

    return count !== 0;
}