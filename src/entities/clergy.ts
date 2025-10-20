export type Clergy = {
  id: string;
  title: string;
  name: string;
  slug: string;
  position:
    | 'supreme_pontiff'
    | 'diocesan_bishop'
    | 'parish_priest'
    | 'permanent_deacon';
  photoId: string;
  createdAt: string;
  updatedAt?: string;
};
