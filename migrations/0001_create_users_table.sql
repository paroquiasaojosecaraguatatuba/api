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
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME
);

CREATE INDEX IF NOT EXISTS idx_blog_categories_name ON blog_categories(name);
CREATE INDEX IF NOT EXISTS idx_blog_categories_slug ON blog_categories(slug);

CREATE TABLE IF NOT EXISTS blog_drafts (
  id VARCHAR(26) PRIMARY KEY NOT NULL,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  excerpt TEXT NOT NULL,
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

-- CREATE TABLE IF NOT EXISTS blog_posts (
--   id VARCHAR(26) PRIMARY KEY NOT NULL,
--   title VARCHAR(255) NOT NULL,
--   slug VARCHAR(255) UNIQUE NOT NULL,
--   excerpt TEXT,
--   content TEXT NOT NULL,
--   event_date DATETIME,
--   published_at DATETIME  NOT NULL,
--   scheduled_unpublish_at DATETIME,
--   cover_id VARCHAR(26),
--   category_id VARCHAR(26) NOT NULL,
--   author_id VARCHAR(26)  NOT NULL,
--   created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
--   updated_at DATETIME,

--   FOREIGN KEY (cover_id) REFERENCES attachments(id) ON DELETE SET NULL,
--   FOREIGN KEY (category_id) REFERENCES blog_categories(id) ON DELETE CASCADE,
--   FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE
-- );

-- CREATE INDEX IF NOT EXISTS idx_blog_posts_title ON blog_posts(title);
-- CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
-- CREATE INDEX IF NOT EXISTS idx_blog_posts_category_published ON blog_posts(category_id, published_at DESC);
-- CREATE INDEX IF NOT EXISTS idx_blog_posts_category_unpublish ON blog_posts(category_id, scheduled_unpublish_at) WHERE scheduled_unpublish_at IS NOT NULL;
-- CREATE INDEX IF NOT EXISTS idx_blog_posts_category_events ON blog_posts(category_id, event_date) WHERE event_date IS NOT NULL;

-- -- -- ✅ Query SEMPRE com categoria (super otimizada)
-- -- SELECT 
-- --   p.id, p.title, p.slug, p.excerpt, p.published_at, p.event_date,
-- --   c.name as category_name, c.slug as category_slug,
-- --   u.email as author_email
-- -- FROM blog_posts p
-- -- JOIN blog_categories c ON c.id = p.category_id  
-- -- JOIN users u ON u.id = p.author_id
-- -- WHERE p.category_id = ? -- ✅ SEMPRE presente
-- --   AND p.published_at <= datetime('now')
-- --   AND (p.scheduled_unpublish_at IS NULL OR p.scheduled_unpublish_at > datetime('now'))
-- -- ORDER BY p.published_at DESC
-- -- LIMIT ? OFFSET ?;
-- -- -- ✅ Vai usar idx_blog_posts_category_published perfeitamente!
-- -- -- Execução: ~1-2ms mesmo com milhares de posts

-- CREATE TABLE IF NOT EXISTS blog_posts_archive (
--   id VARCHAR(26) PRIMARY KEY NOT NULL,
--   original_id VARCHAR(26) NOT NULL, -- ID do post original
--   title VARCHAR(255) NOT NULL,
--   slug VARCHAR(255) NOT NULL, -- Pode repetir aqui
--   excerpt TEXT,
--   content TEXT NOT NULL,
--   event_date DATETIME,
--   original_published_at DATETIME NOT NULL, -- Quando foi publicado originalmente
--   archived_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, -- Quando foi arquivado
--   archive_reason VARCHAR(100) DEFAULT 'unpublished', -- 'unpublished', 'expired', 'manual', 'scheduled'
--   cover_id VARCHAR(26),
--   category_id VARCHAR(26) NOT NULL,
--   author_id VARCHAR(26) NOT NULL,
--   created_at DATETIME NOT NULL, -- Data original de criação
  
--   FOREIGN KEY (cover_id) REFERENCES attachments(id) ON DELETE SET NULL,
--   FOREIGN KEY (category_id) REFERENCES blog_categories(id) ON DELETE CASCADE,
--   FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE
-- );

-- CREATE INDEX IF NOT EXISTS idx_blog_posts_archive_title ON blog_posts_archive(title);
-- CREATE INDEX IF NOT EXISTS idx_blog_posts_archive_slug ON blog_posts_archive(slug);

-- CREATE TABLE IF NOT EXISTS mass_schedules (
--   id VARCHAR(26) PRIMARY KEY NOT NULL,
--   community_id VARCHAR(26) NOT NULL,
  
--   -- ✅ Identificação da missa
--   title VARCHAR(255) NOT NULL, -- "Missa Dominical", "Sagrado Coração", "São José"
--   type VARCHAR(50) NOT NULL CHECK (type IN ('regular', 'devotional')),
--   description TEXT,
  
--   -- ✅ Configuração de recorrência
--   recurrence_type VARCHAR(20) NOT NULL CHECK (recurrence_type IN ('weekly', 'monthly')),
  
--   -- ✅ Para recorrência semanal
--   day_of_week INTEGER, -- 0=domingo, 1=segunda, ..., 6=sábado (ISO)
  
--   -- ✅ Para recorrência mensal
--   day_of_month INTEGER, -- 1-31 para dia específico do mês
--   week_of_month INTEGER, -- 1-5 para "1ª semana", "2ª semana", etc. (usado com day_of_week)
  
--   -- ✅ Status e datas
--   active BOOLEAN NOT NULL DEFAULT true,
--   start_date DATE NOT NULL, -- Quando começou a vigorar
--   end_date DATE, -- NULL = indefinidamente
  
--   created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
--   updated_at DATETIME,
  
--   FOREIGN KEY (community_id) REFERENCES communities(id) ON DELETE CASCADE
-- );

-- -- ✅ Tabela para os horários (relacionamento 1:N)
-- CREATE TABLE IF NOT EXISTS mass_schedule_times (
--   id VARCHAR(26) PRIMARY KEY NOT NULL,
--   schedule_id VARCHAR(26) NOT NULL,
--   time TIME NOT NULL, -- "09:00", "19:30"
--   active BOOLEAN NOT NULL DEFAULT true,
  
--   FOREIGN KEY (schedule_id) REFERENCES mass_schedules(id) ON DELETE CASCADE
-- );

-- -- ✅ Índices para performance
-- CREATE INDEX IF NOT EXISTS idx_mass_schedules_community ON mass_schedules(community_id);
-- CREATE INDEX IF NOT EXISTS idx_mass_schedules_recurrence ON mass_schedules(recurrence_type, active);
-- CREATE INDEX IF NOT EXISTS idx_mass_schedules_day_week ON mass_schedules(day_of_week) WHERE day_of_week IS NOT NULL;
-- CREATE INDEX IF NOT EXISTS idx_mass_schedules_day_month ON mass_schedules(day_of_month) WHERE day_of_month IS NOT NULL;

-- CREATE INDEX IF NOT EXISTS idx_mass_schedule_times_schedule ON mass_schedule_times(schedule_id);
-- CREATE INDEX IF NOT EXISTS idx_mass_schedule_times_time ON mass_schedule_times(time);

-- -- -- ✅ Missas de uma comunidade específica
-- -- SELECT 
-- --   ms.title, ms.type, ms.recurrence_type, ms.day_of_week, ms.day_of_month, ms.week_of_month,
-- --   GROUP_CONCAT(mst.time) as times
-- -- FROM mass_schedules ms
-- -- JOIN mass_schedule_times mst ON mst.schedule_id = ms.id
-- -- WHERE ms.community_id = ? AND ms.active = true AND mst.active = true
-- -- GROUP BY ms.id;

-- -- -- ✅ Todas as missas dominicais da região
-- -- SELECT c.name, ms.title, GROUP_CONCAT(mst.time) as times
-- -- FROM mass_schedules ms
-- -- JOIN communities c ON c.id = ms.community_id
-- -- JOIN mass_schedule_times mst ON mst.schedule_id = ms.id
-- -- WHERE ms.day_of_week = 0 AND ms.active = true AND mst.active = true
-- -- GROUP BY ms.id
-- -- ORDER BY c.name, mst.time;

-- -- ✅ Tabela para exceções de agendamentos
-- CREATE TABLE IF NOT EXISTS mass_schedule_exceptions (
--   id VARCHAR(26) PRIMARY KEY NOT NULL,
--   schedule_id VARCHAR(26) NOT NULL,
--   exception_date DATE NOT NULL, -- Data específica da exceção
--   time TIME, -- NULL = cancelar todos os horários, específico = cancelar só esse horário
--   exception_type VARCHAR(20) NOT NULL CHECK (exception_type IN ('cancelled', 'rescheduled', 'special_event')),
--   reason VARCHAR(255), -- "Festa da Padroeira", "Manutenção da Igreja", "Retiro Espiritual"
  
--   -- ✅ Para reagendamento (tipo 'rescheduled')
--   new_time TIME, -- Novo horário se foi reagendado
--   new_location VARCHAR(255), -- Se mudou de local
  
--   -- ✅ Auditoria
--   created_by VARCHAR(26) NOT NULL, -- Quem fez a exceção
--   created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  
--   FOREIGN KEY (schedule_id) REFERENCES mass_schedules(id) ON DELETE CASCADE,
--   FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE,
  
--   -- ✅ Constraint: Uma exceção por agendamento/data/horário
--   UNIQUE(schedule_id, exception_date, time)
-- );

-- -- ✅ Índices para consultas rápidas
-- CREATE INDEX IF NOT EXISTS idx_mass_exceptions_schedule_date ON mass_schedule_exceptions(schedule_id, exception_date);
-- CREATE INDEX IF NOT EXISTS idx_mass_exceptions_date ON mass_schedule_exceptions(exception_date);
-- CREATE INDEX IF NOT EXISTS idx_mass_exceptions_type ON mass_schedule_exceptions(exception_type);

-- -- -- Cancelar missa das 19:30 no dia 25/12/2024
-- -- INSERT INTO mass_schedule_exceptions (
-- --   id, schedule_id, exception_date, time, exception_type, reason, created_by
-- -- ) VALUES (
-- --   '01K8ABC1...', 'schedule_missa_dominical', '2024-12-25', '19:30', 
-- --   'cancelled', 'Natal - apenas missa das 09:00', 'user_admin_id'
-- -- );

-- -- Cancelar todas as missas do dia 01/01/2025
-- -- INSERT INTO mass_schedule_exceptions (
-- --   id, schedule_id, exception_date, time, exception_type, reason, created_by
-- -- ) VALUES (
-- --   '01K8DEF1...', 'schedule_missa_dominical', '2025-01-01', NULL, 
-- --   'cancelled', 'Confraternização Universal da Paz', 'user_admin_id'
-- -- );

-- -- ✅ Tabela para eventos/compromissos únicos (mais genérica)
-- CREATE TABLE IF NOT EXISTS events (
--   id VARCHAR(26) PRIMARY KEY NOT NULL,
--   community_id VARCHAR(26) NOT NULL,
--   title VARCHAR(255) NOT NULL, -- "Festa Junina", "Retiro de Carnaval", "Missa de São José", "Casamento de João e Maria"
--   description TEXT,
--   event_type VARCHAR(50) NOT NULL, -- Bem flexível: 'missa', 'festa', 'retiro', 'casamento', 'batizado', 'reuniao', 'novena', etc.
  
--   event_date DATE NOT NULL,
--   start_time TIME NOT NULL, -- "14:00"
--   end_time TIME, -- "17:00" (opcional)
  
--   -- ✅ Local (opcional - se diferente da comunidade)
--   custom_location VARCHAR(255), -- NULL = usar endereço da comunidade, preenchido = endereço específico
--   location_notes TEXT, -- "Salão Paroquial", "Capela Lateral", "Quadra da Igreja", "Casa Paroquial"
  
--   -- ✅ Informações de contato/responsável
--   contact_name VARCHAR(255),
--   contact_phone VARCHAR(20),
  
--   -- ✅ Observações gerais
--   notes TEXT, -- Informações extras, requisitos, etc.
  
--   -- ✅ Status do evento
--   status VARCHAR(20) NOT NULL DEFAULT 'confirmed' CHECK (status IN ('draft', 'confirmed', 'cancelled', 'completed')),
  
--   -- ✅ Auditoria
--   created_by VARCHAR(26) NOT NULL,
--   created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
--   updated_at DATETIME,
  
--   FOREIGN KEY (community_id) REFERENCES communities(id) ON DELETE CASCADE,
--   FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE
-- );

-- -- ✅ Índices para consultas
-- CREATE INDEX IF NOT EXISTS idx_events_community ON events(community_id);
-- CREATE INDEX IF NOT EXISTS idx_events_date ON events(event_date);
-- CREATE INDEX IF NOT EXISTS idx_events_datetime ON events(event_date, start_time);
-- CREATE INDEX IF NOT EXISTS idx_events_type ON events(event_type);
-- CREATE INDEX IF NOT EXISTS idx_events_status ON events(status);
-- CREATE INDEX IF NOT EXISTS idx_events_created_by ON events(created_by);

-- -- ✅ 1. Missa especial
-- INSERT INTO events (
--   id, community_id, title, description, event_type, event_date, start_time, end_time,
--   location_notes, contact_name, contact_phone, created_by
-- ) VALUES (
--   '01K8EVT1...', 'community_id', 'Missa de São José Padroeiro', 
--   'Missa em honra ao padroeiro da paróquia com procissão', 'missa',
--   '2024-03-19', '19:30', '21:00', 'Igreja Principal + Procissão pelas ruas',
--   'Padre João Silva', '(12) 99999-1234', 'user_admin_id'
-- );

-- -- ✅ 2. Festa paroquial
-- INSERT INTO events (
--   id, community_id, title, description, event_type, event_date, start_time, end_time,
--   custom_location, contact_name, contact_phone, notes, created_by
-- ) VALUES (
--   '01K8EVT2...', 'community_id', 'Festa Junina da Paróquia',
--   'Festa junina com quadrilha, comidas típicas e brincadeiras', 'festa',
--   '2024-06-29', '18:00', '23:00', 'Quadra Coberta da Paróquia',
--   'Maria Santos', '(12) 99999-5678', 
--   'Colaboração: trazer pratos doces. Ingressos: R$ 15 adultos, R$ 8 crianças',
--   'user_admin_id'
-- );

-- -- ✅ 3. Retiro espiritual
-- INSERT INTO events (
--   id, community_id, title, description, event_type, event_date, start_time, end_time,
--   custom_location, contact_name, contact_phone, notes, created_by
-- ) VALUES (
--   '01K8EVT3...', 'community_id', 'Retiro de Carnaval',
--   'Retiro espiritual para jovens e adultos durante o período carnavalesco', 'retiro',
--   '2024-02-10', '08:00', '17:00', 'Chácara São Francisco - Estrada do Sertão, km 15',
--   'Ana Paula Costa', '(12) 99999-9012',
--   'Trazer: Bíblia, caderno, roupa confortável. Almoço incluso. Inscrições até 05/02',
--   'user_admin_id'
-- );

-- -- ✅ 4. Casamento (evento mais simples)
-- INSERT INTO events (
--   id, community_id, title, description, event_type, event_date, start_time, end_time,
--   location_notes, contact_name, contact_phone, created_by
-- ) VALUES (
--   '01K8EVT4...', 'community_id', 'Casamento de Pedro e Ana',
--   'Cerimônia religiosa de casamento', 'casamento',
--   '2024-05-18', '16:00', '17:00', 'Igreja Principal - Altar-mor',
--   'Ana Silva (noiva)', '(12) 99999-3456', 'user_admin_id'
-- );

-- -- ✅ 5. Reunião pastoral
-- INSERT INTO events (
--   id, community_id, title, description, event_type, event_date, start_time, end_time,
--   location_notes, contact_name, notes, created_by
-- ) VALUES (
--   '01K8EVT5...', 'community_id', 'Reunião do Conselho Pastoral',
--   'Reunião mensal do conselho pastoral paroquial', 'reuniao',
--   '2024-11-15', '19:30', '21:30', 'Sala de Reuniões da Casa Paroquial',
--   'José Carlos (Coordenador)', 'Pauta: Planejamento Advent 2024, Festa do Padroeiro 2025',
--   'user_admin_id'
-- );

-- -- ✅ 6. Evento em local externo
-- INSERT INTO events (
--   id, community_id, title, description, event_type, event_date, start_time, end_time,
--   custom_location, contact_name, contact_phone, notes, created_by
-- ) VALUES (
--   '01K8EVT6...', 'community_id', 'Visita ao Asilo São Vicente',
--   'Visita pastoral mensal aos idosos do asilo', 'visita_pastoral',
--   '2024-11-20', '14:00', '16:00', 'Asilo São Vicente de Paulo - Rua das Flores, 123',
--   'Irmã Maria José', '(12) 99999-7890',
--   'Levar: violão, hinários, lembrancinhas. Voluntários bem-vindos',
--   'user_admin_id'
-- );

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