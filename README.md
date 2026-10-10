# Application Web

Ứng dụng quản lý công việc dạng Kanban, gồm:

- **Frontend:** React, TypeScript, Vite, Tailwind CSS và dnd-kit.
- **Backend:** Node.js, Express và Prisma.
- **Database:** PostgreSQL.

Hướng dẫn dưới đây chạy ứng dụng trực tiếp trên máy local, **không sử dụng Docker/Docker Compose**.

## Yêu cầu môi trường

Cài đặt các phần mềm sau trước khi bắt đầu:

- Node.js 20 trở lên và npm.
- PostgreSQL 14 trở lên.
- Git.

Kiểm tra cài đặt:

```powershell
node --version
npm --version
psql --version
```

## 1. Clone project

```powershell
git clone https://github.com/SE347-Web-Technology/application-web.git
cd application-web
```

## 2. Tạo database PostgreSQL

Mở `psql` bằng tài khoản PostgreSQL của bạn và tạo database:

```sql
CREATE DATABASE cloudops_db;
```

Nếu PostgreSQL yêu cầu mật khẩu, ghi nhớ mật khẩu của user `postgres` để dùng trong `DATABASE_URL` ở bước tiếp theo.

## 3. Cấu hình và chạy backend

Mở một terminal tại thư mục project:

```powershell
cd backend
npm install
```

Tạo file `backend/.env` với nội dung sau. Thay `YOUR_POSTGRES_PASSWORD` bằng mật khẩu PostgreSQL trên máy của bạn:

```env
DATABASE_URL="postgresql://postgres:YOUR_POSTGRES_PASSWORD@localhost:5432/cloudops_db?schema=public"
PORT=3000
```

Áp dụng các migration:

```powershell
npx prisma generate
npx prisma migrate deploy
```

Khởi động backend ở chế độ development:

```powershell
npm run dev
```

Backend chạy tại <http://localhost:3000>. Trang API documentation có tại <http://localhost:3000/api-docs>.

## 4. Cấu hình và chạy frontend

Mở **terminal thứ hai** tại thư mục project:

```powershell
cd frontend
npm install
```

Tạo file `frontend/.env`:

```env
VITE_API_BASE_URL=http://localhost:3000
```

Khởi động frontend:

```powershell
npm run dev
```

Mở URL được Vite hiển thị trong terminal, thường là <http://localhost:5173>.

## Các lệnh hữu ích

Sau khi đã cài dependency cho từng phần, các lệnh frontend có thể chạy trực tiếp từ thư mục gốc:

```powershell
# chạy từ application-web/
npm run build
npm run lint
npm run dev:frontend
npm run dev:backend
```

Hoặc chạy từ đúng thư mục tương ứng:

```powershell
# frontend
npm run dev
npm run build
npm run lint

# backend
npm start
```

Khi thay đổi schema Prisma trong quá trình phát triển, có thể tạo migration mới bằng:

```powershell
cd backend
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
- PostgreSQL và backend phải đang chạy trước khi sử dụng frontend.
- Nếu đổi cổng backend, cập nhật đồng thời `PORT` trong `backend/.env` và `VITE_API_BASE_URL` trong `frontend/.env`.