-- Jalankan di VPS: mysql -u root -p < schema.sql

CREATE DATABASE IF NOT EXISTS kilastugas_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE kilastugas_db;

CREATE USER IF NOT EXISTS 'kilas_user'@'localhost' IDENTIFIED BY 'KilasPass2026!';
GRANT ALL PRIVILEGES ON kilastugas_db.* TO 'kilas_user'@'localhost';
FLUSH PRIVILEGES;

CREATE TABLE IF NOT EXISTS sessions (
    id          VARCHAR(36)  PRIMARY KEY,
    user_agent  VARCHAR(512),
    created_at  TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
    last_active TIMESTAMP    DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS tasks (
    id           VARCHAR(36)  PRIMARY KEY,
    session_id   VARCHAR(36)  NOT NULL,
    title        VARCHAR(255) NOT NULL,
    description  TEXT,
    subject      VARCHAR(100),
    category     ENUM('laporan_lab','makalah','coding','presentasi','custom') DEFAULT 'custom',
    deadline     DATETIME     NOT NULL,
    is_completed BOOLEAN      DEFAULT FALSE,
    created_at   TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
    updated_at   TIMESTAMP    DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (session_id) REFERENCES sessions(id) ON DELETE CASCADE,
    INDEX idx_session_id (session_id),
    INDEX idx_deadline   (deadline)
);

CREATE TABLE IF NOT EXISTS subtasks (
    id               VARCHAR(36)  PRIMARY KEY,
    task_id          VARCHAR(36)  NOT NULL,
    step_number      INT          NOT NULL,
    title            VARCHAR(255) NOT NULL,
    description      TEXT,
    duration_minutes INT          DEFAULT 25,
    target_date      DATE,
    is_completed     BOOLEAN      DEFAULT FALSE,
    completed_at     TIMESTAMP    NULL,
    source           ENUM('ai','template','manual') DEFAULT 'ai',
    created_at       TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
    updated_at       TIMESTAMP    DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE,
    INDEX idx_task_id    (task_id),
    INDEX idx_target_date (target_date)
);

CREATE TABLE IF NOT EXISTS pomodoro_sessions (
    id                     VARCHAR(36) PRIMARY KEY,
    subtask_id             VARCHAR(36) NOT NULL,
    started_at             TIMESTAMP   DEFAULT CURRENT_TIMESTAMP,
    ended_at               TIMESTAMP   NULL,
    duration_actual_minutes INT,
    is_completed           BOOLEAN     DEFAULT FALSE,
    FOREIGN KEY (subtask_id) REFERENCES subtasks(id) ON DELETE CASCADE
);
