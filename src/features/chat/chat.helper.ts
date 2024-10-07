import { User } from "@/features/user/user.type";

export const objectifyChatParticipants = (participants: User[]) => {
  return participants.reduce(
    (acc, participant) => {
      acc[participant.data().uid] = participant;
      return acc;
    },
    {} as Record<string, User>,
  );
};
