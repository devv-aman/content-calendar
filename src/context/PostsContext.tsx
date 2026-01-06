import {
  createContext,
  useState,
  useCallback,
  useMemo,
  type ReactNode,
} from "react";
import type {
  ScheduledPost,
  PostsQueryParams,
  CreatePostInput,
  UpdatePostInput,
} from "@/components/calendar/calendar.types";
import {
  fetchPosts as fetchPostsApi,
  createPost as createPostApi,
  updatePost as updatePostApi,
  deletePost as deletePostApi,
  getErrorMessage,
} from "@/lib/posts.service";

interface PostsState {
  posts: ScheduledPost[];
  isLoading: boolean;
  isMutating: boolean;
  error: string | null;
}

interface PostsContextType extends PostsState {
  fetchPosts: (params?: PostsQueryParams) => Promise<void>;
  createPost: (input: CreatePostInput) => Promise<ScheduledPost | null>;
  updatePost: (
    id: string,
    input: UpdatePostInput
  ) => Promise<ScheduledPost | null>;
  deletePost: (id: string) => Promise<boolean>;
  clearError: () => void;
}

export const PostsContext = createContext<PostsContextType | undefined>(
  undefined
);

interface PostsProviderProps {
  children: ReactNode;
}

export function PostsProvider({ children }: PostsProviderProps) {
  const [posts, setPosts] = useState<ScheduledPost[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isMutating, setIsMutating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const fetchPosts = useCallback(async (params?: PostsQueryParams) => {
    setIsLoading(true);
    setError(null);

    try {
      const fetchedPosts = await fetchPostsApi(params);
      setPosts(fetchedPosts);
    } catch (err) {
      const message = getErrorMessage(err);
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createPost = useCallback(
    async (input: CreatePostInput): Promise<ScheduledPost | null> => {
      setIsMutating(true);
      setError(null);

      try {
        const newPost = await createPostApi(input);
        setPosts((prev) => [...prev, newPost]);
        return newPost;
      } catch (err) {
        const message = getErrorMessage(err);
        setError(message);
        return null;
      } finally {
        setIsMutating(false);
      }
    },
    []
  );

  const updatePost = useCallback(
    async (
      id: string,
      input: UpdatePostInput
    ): Promise<ScheduledPost | null> => {
      setIsMutating(true);
      setError(null);

      try {
        const updatedPost = await updatePostApi(id, input);
        setPosts((prev) =>
          prev.map((post) => (post.id === id ? updatedPost : post))
        );
        return updatedPost;
      } catch (err) {
        const message = getErrorMessage(err);
        setError(message);
        return null;
      } finally {
        setIsMutating(false);
      }
    },
    []
  );

  const deletePost = useCallback(async (id: string): Promise<boolean> => {
    setIsMutating(true);
    setError(null);

    try {
      await deletePostApi(id);
      setPosts((prev) => prev.filter((post) => post.id !== id));
      return true;
    } catch (err) {
      const message = getErrorMessage(err);
      setError(message);
      return false;
    } finally {
      setIsMutating(false);
    }
  }, []);

  const value = useMemo(
    () => ({
      posts,
      isLoading,
      isMutating,
      error,
      fetchPosts,
      createPost,
      updatePost,
      deletePost,
      clearError,
    }),
    [
      posts,
      isLoading,
      isMutating,
      error,
      fetchPosts,
      createPost,
      updatePost,
      deletePost,
      clearError,
    ]
  );

  return (
    <PostsContext.Provider value={value}>{children}</PostsContext.Provider>
  );
}
