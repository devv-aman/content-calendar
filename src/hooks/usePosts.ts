import { useContext } from "react";
import { PostsContext } from "@/context/PostsContext";

export function usePosts() {
  const context = useContext(PostsContext);

  if (context === undefined) {
    throw new Error("usePosts must be used within a PostsProvider");
  }

  return context;
}
