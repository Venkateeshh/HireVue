import { useAppContext } from "@/context/AppContext"; // Adjust the path as needed
import { User } from "@/types/user";

export const useVideoCall = (): User => {
    const { currentUser } = useAppContext();
    return currentUser;
};
