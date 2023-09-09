import { error400, error500 } from "../error/app.error";
import challengeModel, {
    IChallenge,
    IChallengeDoc,
} from "../model/challenge.model";

export const createChallenge = async (
    challenge: IChallenge,
    life: number = 24 * 60 * 60 * 1000
) => {
    try {
        const challengeDoc = await challengeModel.create({
            ...challenge,
            timestamp: Date.now() + life,
        });
        return challengeDoc;
    } catch (error) {
        throw error500("Couldn't create challenge");
    }
};

export const deleteChallenge = async (challengeId: string) => {
    try {
        const challengeDoc = await challengeModel.findByIdAndDelete(
            challengeId
        );
        return challengeDoc;
    } catch (error) {
        throw error500("Couldn't delete challenge");
    }
};

export const findChallenge = async (
    challengeId: string
): Promise<IChallengeDoc> => {
    try {
        const challengeDoc = await challengeModel.findById(challengeId);
        if (!challengeDoc) throw error400("Couldn't find challenge");

        return challengeDoc;
    } catch (error) {
        throw error500("Couldn't find challenge");
    }
};
