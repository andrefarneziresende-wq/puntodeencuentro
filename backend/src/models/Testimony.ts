export interface Testimony {
  id: string;
  title: string;
  content: string;
  groupId: string;
  groupName: string;
  authorId: string;
  authorName: string;
  isFavoriteByResponsible: boolean;
  isFavoriteByAdmin: boolean;
  isHighlighted: boolean; // Destacado para toda la iglesia
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateTestimonyDTO {
  title: string;
  content: string;
  groupId: string;
  groupName: string;
  authorId: string;
  authorName: string;
}

export interface UpdateTestimonyDTO {
  title?: string;
  content?: string;
  isFavoriteByResponsible?: boolean;
  isFavoriteByAdmin?: boolean;
  isHighlighted?: boolean;
}

export interface TestimonyResponse {
  id: string;
  title: string;
  content: string;
  groupId: string;
  groupName: string;
  authorId: string;
  authorName: string;
  isFavoriteByResponsible: boolean;
  isFavoriteByAdmin: boolean;
  isHighlighted: boolean;
  createdAt: Date;
}

export function toTestimonyResponse(testimony: Testimony): TestimonyResponse {
  return {
    id: testimony.id,
    title: testimony.title,
    content: testimony.content,
    groupId: testimony.groupId,
    groupName: testimony.groupName,
    authorId: testimony.authorId,
    authorName: testimony.authorName,
    isFavoriteByResponsible: testimony.isFavoriteByResponsible,
    isFavoriteByAdmin: testimony.isFavoriteByAdmin,
    isHighlighted: testimony.isHighlighted,
    createdAt: testimony.createdAt,
  };
}
