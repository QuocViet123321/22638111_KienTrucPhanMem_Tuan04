# Dockerfile
FROM postgres:15

# Thêm file SQL vào thư mục khởi tạo của Postgres
COPY init.sql /docker-entrypoint-initdb.d/

# Đặt biến môi trường cơ bản
ENV POSTGRES_USER=admin
ENV POSTGRES_PASSWORD=123456
ENV POSTGRES_DB=mydb

# Expose port
EXPOSE 5432

# Lệnh khởi động mặc định của postgres:15 sẽ được giữ