-- init.sql
DO
$$
BEGIN
   IF NOT EXISTS (SELECT FROM pg_database WHERE datname = 'mydb') THEN
       CREATE DATABASE mydb;
   END IF;
END
$$;

-- Tạo bảng và chèn dữ liệu trong database "mydb"
-- Phải chạy lệnh này từ database "mydb"
-- Docker entrypoint sẽ tự động kết nối vào POSTGRES_DB (mydb) khi init
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50)
);

INSERT INTO users (name) VALUES ('Nam'), ('Docker');