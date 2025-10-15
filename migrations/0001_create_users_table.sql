-- Data: 27/09/2025
-- Autor: Giselle Hoekveld Silva

CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(36) PRIMARY KEY NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role VARCHAR(20) NOT NULL DEFAULT 'viewer', -- roles: admin, editor, viewer
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_users_email ON users(email);

CREATE TABLE IF NOT EXISTS migrations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  applied_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS password_recoveries (
  id VARCHAR(36) PRIMARY KEY NOT NULL,
  code CHAR(5) NOT NULL,
  user_id VARCHAR(36) NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

INSERT INTO migrations (id, name, description) 
VALUES (1, '0001_initial_migration', 'Run initial migration to create users and migrations tables')
ON CONFLICT(id) DO NOTHING;