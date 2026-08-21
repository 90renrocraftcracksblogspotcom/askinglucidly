import { useQuery } from "@tanstack/react-query";
import { env } from "@/env.mjs";
import { ChatSnapshot } from "../../generated";

const BASE_URL = env.NEXT_PUBLIC_API_URL;

export const fetchChatHistory = async (): Promise<ChatSnapshot[]> => {
  return [];
};

export const useChatHistory = () => {
  return useQuery<ChatSnapshot[], Error>({
    queryKey: ["chatHistory"],
    queryFn: fetchChatHistory,
    retry: false,
  });
};
