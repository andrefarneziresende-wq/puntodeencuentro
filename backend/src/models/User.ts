export interface User {
  id: string;
  email: string;
  password: string;
  name?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserDTO {
  email: string;
  password: string;
  name?: string;
}

export interface UpdateUserDTO {
  email?: string;
  password?: string;
  name?: string;
}

export interface UserResponse {
  id: string;
  email: string;
  name?: string;
  createdAt: Date;
}

// Remove sensitive data from user
export function toUserResponse(user: User): UserResponse {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    createdAt: user.createdAt,
  };
}
