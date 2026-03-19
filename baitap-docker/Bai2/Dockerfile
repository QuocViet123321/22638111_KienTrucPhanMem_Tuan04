# dùng Python
FROM python:3.9
# thư mục làm việc
WORKDIR /app
# copy tất cả file
COPY . .
# cài Flask
RUN pip install -r requirements.txt
# khai báo port
EXPOSE 5000
# chạy app
CMD ["python", "app.py"]