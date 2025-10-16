export interface PasswordRecoveryDAF {
  findByUserId(userId: string, c: DomainContext): Promise<{
    id: string;
    userId: string;
    code: string;
    createdAt: string;
  } | null>;
}