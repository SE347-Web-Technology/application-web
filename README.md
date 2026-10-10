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

## 2. Cấu hình database PostgreSQL dùng chung

Database dùng chung được cung cấp theo dạng:

```text
postgresql://postgres:YOUR_DATABASE_PASSWORD@postgres:5432/cloudops_db
```

Không commit mật khẩu thật vào GitHub. Tạo file `backend/.env` trên máy local:

```env
DATABASE_URL="postgresql://postgres:YOUR_DATABASE_PASSWORD@YOUR_DATABASE_HOST:5432/cloudops_db"
PORT=3000
```

Nếu máy bạn phân giải được hostname `postgres`, dùng:

```env
DATABASE_URL="postgresql://postgres:YOUR_DATABASE_PASSWORD@postgres:5432/cloudops_db"
```

Hostname `postgres` thường chỉ hoạt động trong Docker network hoặc mạng nội bộ có DNS/hosts tương ứng. Nếu PostgreSQL chạy trực tiếp trên máy ASUS, dùng `localhost`:

```env
DATABASE_URL="postgresql://postgres:YOUR_DATABASE_PASSWORD@localhost:5432/cloudops_db"
```

Nếu database nằm trên máy khác, thay `YOUR_DATABASE_HOST` bằng hostname hoặc IP mà máy bạn truy cập được.

## 3. Cấu hình và chạy backend

Mở một terminal tại thư mục project:

```powershell
cd backend
npm install
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

## Chạy web bằng 3 lệnh

Sau khi đã tạo `backend/.env` và cài dependencies một lần, mở Git Bash tại thư mục project:

```bash
cd /e/application-web
```

Mở terminal thứ hai và chạy backend:

```bash
npm run dev:backend
```

Mở terminal thứ ba và chạy frontend:

```bash
cd /e/application-web && npm run dev:frontend
```

Truy cập giao diện tại <http://localhost:5173>. Backend phải kết nối được database dùng chung trước khi các thao tác board/card hoạt động.

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