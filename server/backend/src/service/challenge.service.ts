import { error500 } from "../error/app.error";
import challengeModel, { IChallenge } from "../model/challenge.model";

export const createChallenge = async (challenge: IChallenge) => {
    try {
        const challengeDoc = await challengeModel.create(challenge);
        return challengeDoc;
    } catch (error) {
        throw error500("Couldn't create challenge");
    }
};

export const deleteChallenge = async (challengeId: string) => {
    try {
        const challengeDoc = await challengeModel.findByIdAndDelete(challengeId);
        return challengeDoc;
    } catch (error) {
        throw error500("Couldn't delete challenge");
    }
}
