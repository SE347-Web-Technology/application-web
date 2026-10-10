# Application Web

Ứng dụng Kanban gồm PostgreSQL, backend Express/Prisma và frontend React/Vite.
Hướng dẫn này chạy local trên Windows, không dùng Docker Compose.

## Yêu cầu

- Windows PowerShell hoặc Git Bash.
- Node.js 20 trở lên.
- Quyền Administrator khi cài hoặc khởi động PostgreSQL.

## 1. Cài PostgreSQL bằng lệnh

Mở **PowerShell bằng quyền Administrator**:

```powershell
winget install --id PostgreSQL.PostgreSQL.17 -e
```

Trong trình cài đặt, nhớ mật khẩu của user `postgres` và giữ port `5432`.
Đóng rồi mở lại PowerShell sau khi cài xong.

Kiểm tra service PostgreSQL:

```powershell
Get-Service -Name postgresql*
```

Khởi động service nếu đang dừng:

```powershell
Get-Service -Name postgresql* | Start-Service
```

## 2. Đặt password và tạo database bằng lệnh

Nếu `psql` đã có trong PATH:

```powershell
psql -U postgres -h localhost -p 5432
```

Nếu PowerShell báo không tìm thấy `psql`, dùng đường dẫn đầy đủ:

```powershell
& "C:\Program Files\PostgreSQL\17\bin\psql.exe" -U postgres -h localhost -p 5432
```

Nhập mật khẩu đã đặt khi cài PostgreSQL. Khi thấy prompt `postgres=#`, chạy:

```sql
ALTER USER postgres WITH PASSWORD 'Postgres12345';
CREATE DATABASE cloudops_db;
\q
```

Nếu database đã tồn tại, thông báo `database "cloudops_db" already exists` có thể bỏ qua.
Thay `Postgres12345` bằng mật khẩu bạn muốn dùng. Không dùng dấu nháy đơn trong mật khẩu
ở câu lệnh SQL.

## 3. Cấu hình và setup backend

Từ Git Bash:

```bash
cd /e/application-web/backend
```

Tạo file `backend/.env` với nội dung sau, dùng đúng password vừa đặt:

```env
DATABASE_URL="postgresql://postgres:Postgres12345@localhost:5432/cloudops_db?schema=public"
PORT=3000
```

Cài package và setup Prisma:

```bash
npm install
npx prisma generate
npx prisma migrate deploy
```

Nếu chưa có thư mục frontend dependencies, cài một lần:

```bash
cd /e/application-web/frontend
npm install
```

Tạo file `frontend/.env`:

```env
VITE_API_BASE_URL=http://localhost:3000
```

## 4. Chạy trang web bằng 3 lệnh

Sau khi setup xong, dùng ba terminal.

### Terminal 1 — bật PostgreSQL

PowerShell Administrator:

```powershell
Get-Service -Name postgresql* | Start-Service
```

### Terminal 2 — chạy backend

Git Bash:

```bash
cd /e/application-web && npm run dev:backend
```

Backend chạy tại <http://localhost:3000>.

### Terminal 3 — chạy frontend

Git Bash:

```bash
cd /e/application-web && npm run dev:frontend
```

Mở giao diện tại <http://localhost:5173>.

## Nếu bạn đã tạo database rồi

Không cần chạy lại `CREATE DATABASE`. Làm tiếp theo thứ tự:

```bash
cd /e/application-web/backend
npm install
npx prisma generate
npx prisma migrate deploy
```

Sau đó mở ba terminal và chạy ba lệnh ở mục **Chạy trang web bằng 3 lệnh**.

## Build frontend

`build` chỉ biên dịch frontend, không khởi động web server:

```bash
cd /e/application-web
npm run build
```

Muốn mở giao diện local, dùng `npm run dev:frontend`.

## Lưu ý

- Không commit `backend/.env` hoặc `frontend/.env`.
- PostgreSQL local dùng hostname `localhost`, không dùng hostname `postgres` của Docker Compose.
- Nếu đổi port backend, cập nhật cả `PORT` và `VITE_API_BASE_URL`.
