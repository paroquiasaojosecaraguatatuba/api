CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(26) PRIMARY KEY NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role VARCHAR(20) NOT NULL DEFAULT 'viewer', -- roles: admin, editor, viewer
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_users_email ON users(email);

CREATE TABLE IF NOT EXISTS attachments (
  id VARCHAR(26) PRIMARY KEY NOT NULL,
  filename VARCHAR(255) NOT NULL,
  mime_type VARCHAR(100) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'attached', 'deleted')),
  storage_provider VARCHAR(50) NOT NULL,
  uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  uploaded_by VARCHAR(36),

  FOREIGN KEY (uploaded_by) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS communities (
  id VARCHAR(26) PRIMARY KEY NOT NULL,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  type VARCHAR(20) NOT NULL CHECK (type IN ('chapel', 'parish_church')),
  address TEXT NOT NULL,
  cover_id VARCHAR(26),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME,

  FOREIGN KEY (cover_id) REFERENCES attachments(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_communities_name ON communities(name);
CREATE INDEX IF NOT EXISTS idx_communities_slug ON communities(slug);

CREATE TABLE IF NOT EXISTS clergy (
  id VARCHAR(26) PRIMARY KEY NOT NULL,
  title VARCHAR(50),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  position VARCHAR(50) NOT NULL CHECK (position IN ('supreme_pontiff', 'diocesan_bishop', 'parish_priest', 'permanent_deacon')),
  photo_id VARCHAR(26),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME,

  FOREIGN KEY (photo_id) REFERENCES attachments(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS pastorals (
  id VARCHAR(26) PRIMARY KEY NOT NULL,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT NOT NULL,
  responsible_name VARCHAR(255) NOT NULL,
  contact_phone VARCHAR(20) NOT NULL,
  cover_id VARCHAR(26),
  active BOOLEAN NOT NULL DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME,

  FOREIGN KEY (cover_id) REFERENCES attachments(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_pastorals_name ON pastorals(name);
CREATE INDEX IF NOT EXISTS idx_pastorals_slug ON pastorals(slug);

CREATE TABLE IF NOT EXISTS blog_categories (
  id VARCHAR(26) PRIMARY KEY NOT NULL,
  name VARCHAR(50) UNIQUE NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME
);

CREATE INDEX IF NOT EXISTS idx_blog_categories_name ON blog_categories(name);
CREATE INDEX IF NOT EXISTS idx_blog_categories_slug ON blog_categories(slug);

CREATE TABLE IF NOT EXISTS blog_drafts (
  id VARCHAR(26) PRIMARY KEY NOT NULL,
  title VARCHAR(255) NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  event_date DATETIME,
  scheduled_publish_at DATETIME,
  scheduled_unpublish_at DATETIME,
  cover_id VARCHAR(26),
  category_id VARCHAR(26) NOT NULL,
  author_id VARCHAR(26)  NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME,

  FOREIGN KEY (cover_id) REFERENCES attachments(id) ON DELETE SET NULL,
  FOREIGN KEY (category_id) REFERENCES blog_categories(id) ON DELETE CASCADE,
  FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS blog_posts (
  id VARCHAR(26) PRIMARY KEY NOT NULL,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  event_date DATETIME,
  published_at DATETIME  NOT NULL,
  scheduled_unpublish_at DATETIME,
  cover_id VARCHAR(26),
  category_id VARCHAR(26) NOT NULL,
  author_id VARCHAR(26)  NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME,

  FOREIGN KEY (cover_id) REFERENCES attachments(id) ON DELETE SET NULL,
  FOREIGN KEY (category_id) REFERENCES blog_categories(id) ON DELETE CASCADE,
  FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_blog_posts_title ON blog_posts(title);
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_category_published ON blog_posts(category_id, published_at DESC);
CREATE INDEX IF NOT EXISTS idx_blog_posts_category_unpublish ON blog_posts(category_id, scheduled_unpublish_at) WHERE scheduled_unpublish_at IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_blog_posts_category_events ON blog_posts(category_id, event_date) WHERE event_date IS NOT NULL;

-- -- ✅ Query SEMPRE com categoria (super otimizada)
-- SELECT 
--   p.id, p.title, p.slug, p.excerpt, p.published_at, p.event_date,
--   c.name as category_name, c.slug as category_slug,
--   u.email as author_email
-- FROM blog_posts p
-- JOIN blog_categories c ON c.id = p.category_id  
-- JOIN users u ON u.id = p.author_id
-- WHERE p.category_id = ? -- ✅ SEMPRE presente
--   AND p.published_at <= datetime('now')
--   AND (p.scheduled_unpublish_at IS NULL OR p.scheduled_unpublish_at > datetime('now'))
-- ORDER BY p.published_at DESC
-- LIMIT ? OFFSET ?;
-- -- ✅ Vai usar idx_blog_posts_category_published perfeitamente!
-- -- Execução: ~1-2ms mesmo com milhares de posts

CREATE TABLE IF NOT EXISTS blog_posts_archive (
  id VARCHAR(26) PRIMARY KEY NOT NULL,
  original_id VARCHAR(26) NOT NULL, -- ID do post original
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL, -- Pode repetir aqui
  excerpt TEXT,
  content TEXT NOT NULL,
  event_date DATETIME,
  original_published_at DATETIME NOT NULL, -- Quando foi publicado originalmente
  archived_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, -- Quando foi arquivado
  archive_reason VARCHAR(100) DEFAULT 'unpublished', -- 'unpublished', 'expired', 'manual', 'scheduled'
  cover_id VARCHAR(26),
  category_id VARCHAR(26) NOT NULL,
  author_id VARCHAR(26) NOT NULL,
  created_at DATETIME NOT NULL, -- Data original de criação
  
  FOREIGN KEY (cover_id) REFERENCES attachments(id) ON DELETE SET NULL,
  FOREIGN KEY (category_id) REFERENCES blog_categories(id) ON DELETE CASCADE,
  FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_blog_posts_archive_title ON blog_posts_archive(title);
CREATE INDEX IF NOT EXISTS idx_blog_posts_archive_slug ON blog_posts_archive(slug);

CREATE TABLE IF NOT EXISTS migrations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  author VARCHAR(100) NOT NULL,
  applied_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO migrations (id, name, description, author) 
VALUES (1, '0001_initial_migration', 'Run initial migration to create users and migrations tables', 'Giselle Hoekveld Silva')
ON CONFLICT(id) DO NOTHING;