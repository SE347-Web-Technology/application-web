# Backend Database Setup (Prisma + Local PostgreSQL)

## Yêu cầu

- PostgreSQL 14 trở lên đã được cài và đang chạy trên máy.
- Đã tạo database `cloudops_db`.

## Cấu hình

Tạo file `backend/.env`:

```env
DATABASE_URL="postgresql://postgres:YOUR_POSTGRES_PASSWORD@localhost:5432/cloudops_db?schema=public"
PORT=3000
```

## Chạy migration và backend

```powershell
cd backend
npm install
npx prisma generate
npx prisma migrate deploy
npm run dev
```

API chạy tại `http://localhost:3000`, còn Swagger UI chạy tại `http://localhost:3000/api-docs`.

Để dừng backend, nhấn `Ctrl+C` trong terminal đang chạy server. PostgreSQL được quản lý bởi dịch vụ PostgreSQL trên máy local.


