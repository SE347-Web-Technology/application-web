# Application Web

Ứng dụng quản lý công việc dạng Kanban, gồm:

- **Frontend:** React, TypeScript, Vite, Tailwind CSS và dnd-kit.
- **Backend:** Node.js, Express và Prisma.
- **Database:** PostgreSQL.

Hướng dẫn này chạy ứng dụng trực tiếp trên máy local, **không sử dụng Docker/Docker Compose**.
Docker Compose sẽ được bổ sung ở phần triển khai sau.

## Yêu cầu môi trường

Cài đặt:

- Node.js 20 trở lên và npm.
- PostgreSQL 14 trở lên.
- Git.

Kiểm tra:

```bash
node --version
npm --version
psql --version
```

## 1. Clone project

```bash
git clone https://github.com/SE347-Web-Technology/application-web.git
cd application-web
```

## 2. Chuẩn bị database local

Đây là thành phần thứ nhất. Cài PostgreSQL trực tiếp trên máy, sau đó tạo database:

```sql
CREATE DATABASE cloudops_db;
```

Tạo file `backend/.env`:

```env
DATABASE_URL="postgresql://postgres:YOUR_DATABASE_PASSWORD@localhost:5432/cloudops_db?schema=public"
PORT=3000
```

Khi chạy local, dùng `localhost` vì PostgreSQL chạy trên máy của bạn. Chuỗi có hostname
`postgres` chỉ phù hợp khi Docker Compose hoặc DNS nội bộ cung cấp hostname đó; không dùng
chuỗi đó cho PostgreSQL local nếu máy chưa cấu hình hostname `postgres`.

## 3. Cài dependency và khởi tạo backend

Chạy một lần:

```bash
cd /e/application-web/backend
npm install
npx prisma generate
npx prisma migrate deploy
```

## 4. Cài dependency và cấu hình frontend

Chạy một lần:

```bash
cd /e/application-web/frontend
npm install
```

Tạo file `frontend/.env`:

```env
VITE_API_BASE_URL=http://localhost:3000
```

## Chạy local đủ 3 thành phần

Sau khi cài đặt xong, ứng dụng cần có 3 thành phần:

1. **PostgreSQL:** database chạy dưới dạng Windows Service.
2. **Backend:** API Express/Prisma tại cổng `3000`.
3. **Frontend:** giao diện Vite tại cổng `5173`.

### Terminal 1 — PostgreSQL

Mở PostgreSQL service trong Windows. Có thể kiểm tra bằng PowerShell:

```powershell
Get-Service -Name postgresql*
```

Nếu service đang dừng, mở ứng dụng Services của Windows và start service PostgreSQL.

### Terminal 2 — Backend

Mở Git Bash tại thư mục project:

```bash
cd /e/application-web
npm run dev:backend
```

Backend chạy tại <http://localhost:3000>. API documentation chạy tại
<http://localhost:3000/api-docs>.

### Terminal 3 — Frontend

Mở Git Bash thứ hai:

```bash
cd /e/application-web
npm run dev:frontend
```

Truy cập giao diện tại <http://localhost:5173>.

## Build frontend

Lệnh build chỉ tạo file production, không khởi động web server:

```bash
cd /e/application-web
npm run build
```

Muốn xem giao diện trong lúc phát triển, dùng `npm run dev:frontend`.

## Các lệnh hữu ích

```bash
# Chạy từ application-web/
npm run dev:backend
npm run dev:frontend
npm run build
npm run lint
```

Khi thay đổi schema Prisma:

```bash
cd /e/application-web/backend
npx prisma migrate dev --name ten-migration
```

## Cấu trúc project

```text
application-web/
├── backend/    # Express API, Prisma schema và migrations
├── frontend/   # React/Vite application
└── README.md
```

## Lưu ý

- Không commit `backend/.env` hoặc `frontend/.env` lên GitHub.
- PostgreSQL phải chạy trước backend; backend phải chạy trước khi frontend gọi API.
- Nếu đổi cổng backend, cập nhật đồng thời `PORT` trong `backend/.env` và
  `VITE_API_BASE_URL` trong `frontend/.env`.
