import type { BlogPostDraft } from '@/entities/blog-post-draft';
import type { BlogPostDraftsDAF } from '@/services/database/blog-post-drafts-daf';

export class InMemoryBlogPostDraftsDAF implements BlogPostDraftsDAF {
  public postDrafts: BlogPostDraft[] = [];

  async findById(id: string): Promise<BlogPostDraft | null> {
    const postDraft = this.postDrafts.find((postDraft) => postDraft.id === id);

    return postDraft || null;
  }

  async findByPostId(postId: string): Promise<BlogPostDraft | null> {
    const postDraft = this.postDrafts.find(
      (postDraft) => postDraft.postId === postId,
    );

    return postDraft || null;
  }

  async create(blogPostDraft: BlogPostDraft): Promise<void> {
    this.postDrafts.push(blogPostDraft);
  }

  async save(blogPostDraft: BlogPostDraft): Promise<void> {
    const index = this.postDrafts.findIndex((p) => p.id === blogPostDraft.id);

    if (index >= 0) {
      this.postDrafts[index] = blogPostDraft;
    }
  }

  async delete(id: string): Promise<void> {
    this.postDrafts = this.postDrafts.filter(
      (postDraft) => postDraft.id !== id,
    );
  }
}
