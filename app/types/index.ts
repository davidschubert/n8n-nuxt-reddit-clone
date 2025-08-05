export type VoteType = 'upvote' | 'downvote' | null;

export interface Comment {
  id: string;
  content: string;
  author: string;
  createdAt: Date;
  score: number;
  userVote: VoteType;
  parentId?: string;
  replies?: Comment[];
}

export interface VotePayload {
  voteType: 'upvote' | 'downvote' | 'remove';
}

export interface VoteResponse {
  success: boolean;
  newScore: number;
  userVote: VoteType;
}

export interface VoteDisplayProps {
  score: number;
  userVote: VoteType;
  onVote: (type: 'upvote' | 'downvote') => void;
  disabled?: boolean;
}

export interface VoteState {
  votes: Record<string, VoteType>;
  scores: Record<string, number>;
  isLoading: Record<string, boolean>;
}