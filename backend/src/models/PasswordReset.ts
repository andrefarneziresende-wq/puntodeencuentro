export interface PasswordReset {
  id: string;
  userId: string;
  token: string;
  expiresAt: Date;
  used: boolean;
  createdAt: Date;
}

export interface CreatePasswordResetDTO {
  userId: string;
  token: string;
  expiresAt: Date;
}
