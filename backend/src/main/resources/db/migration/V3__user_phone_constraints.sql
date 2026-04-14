ALTER TABLE users
    MODIFY phone VARCHAR(50) NOT NULL;

ALTER TABLE users
    ADD CONSTRAINT uk_users_phone UNIQUE (phone);
