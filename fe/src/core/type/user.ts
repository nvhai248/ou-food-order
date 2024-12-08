export type User = {
  documentId: string;
  username: string;
  email: string;
  provider: string;
  confirmed: boolean;
  blocked: boolean;
  user_id: string | null;
  name: string | null;
  avatar: string | null;
};
