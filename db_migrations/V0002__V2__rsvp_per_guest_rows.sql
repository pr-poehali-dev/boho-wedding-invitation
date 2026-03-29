-- Добавляем новые поля для структуры "один гость = одна строка"
ALTER TABLE rsvp ADD COLUMN IF NOT EXISTS submitter_name TEXT NOT NULL DEFAULT '';
ALTER TABLE rsvp ADD COLUMN IF NOT EXISTS drinks TEXT[] NOT NULL DEFAULT '{}';
ALTER TABLE rsvp ADD COLUMN IF NOT EXISTS is_primary BOOLEAN NOT NULL DEFAULT TRUE;
