# Application Web

Ứng dụng Kanban gồm PostgreSQL, backend Express/Prisma và frontend React/Vite.

Có hai cách chạy:

- **Cách 1 — Docker (khuyên dùng):** không cần cài Node.js hay PostgreSQL, chỉ cần Docker.
- **Cách 2 — Chạy thủ công:** cài PostgreSQL và Node.js trên máy.

## Cách 1: Chạy bằng Docker

### Yêu cầu

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) đã cài và đang chạy
  (biểu tượng Docker báo *Engine running*).

Không cần chạy `npm install`, `prisma generate` hay tạo database trước. Docker tự tải
thư viện, tự tạo database và tự chạy migration.

### Các file Docker

| File | Vai trò |
| --- | --- |
| `docker-compose.yml` | Chạy 3 service: `db` (PostgreSQL 17), `backend`, `frontend` |
| `backend/Dockerfile` | Image Node 20, chạy `prisma migrate deploy` rồi khởi động server |
| `frontend/Dockerfile` | Build Vite, phục vụ bằng Nginx |
| `frontend/entrypoint.sh` | Gắn URL backend (`API_BASE_URL`) vào `index.html` khi container khởi động |
| `frontend/nginx.conf` | Cấu hình Nginx cho ứng dụng React |

### Khởi động

Mở terminal tại thư mục gốc của dự án:

```bash
docker compose up -d --build
```

Lần đầu mất vài phút để tải image và thư viện. Kiểm tra trạng thái:

```bash
docker compose ps
docker compose logs backend
```

Backend chạy xong khi log có `All migrations have been successfully applied.` và
`Server is running on port 3000`.

| Thành phần | Địa chỉ |
| --- | --- |
| Giao diện web | <http://localhost:8080> |
| Backend API | <http://localhost:3000> |
| Swagger (test API) | <http://localhost:3000/api-docs> |
| PostgreSQL | `localhost:5433`, user `postgres`, password `Postgres12345`, database `cloudops_db` |

PostgreSQL trong Docker dùng port `5433` để không trùng với PostgreSQL cài sẵn trên máy (`5432`).
Muốn đổi mật khẩu database, đặt biến `POSTGRES_PASSWORD` trước khi chạy, hoặc tạo file `.env`
ở thư mục gốc:

```env
POSTGRES_PASSWORD=MatKhauCuaBan
```

### Các lệnh thường dùng

```bash
docker compose up -d --build     # build lại và chạy (dùng sau khi sửa code hoặc git pull)
docker compose logs -f backend   # xem log backend (Ctrl+C để thoát)
docker compose down              # tắt, giữ nguyên dữ liệu
docker compose down -v           # tắt và xoá toàn bộ dữ liệu database
```

Xem dữ liệu trực tiếp trong database:

```bash
docker compose exec db psql -U postgres -d cloudops_db -c "SELECT * FROM boards;"
```

### Lưu ý khi dùng Docker

- Database chạy **local trên từng máy**: mỗi thành viên có dữ liệu riêng, không đồng bộ với nhau.
- Container không tự cập nhật theo code. Sau khi sửa code hoặc `git pull`, chạy lại
  `docker compose up -d --build`.
- Lỗi `port is already allocated`: port `3000`, `8080` hoặc `5433` đang bị chương trình khác dùng
  (thường là `npm run dev:backend` đang chạy). Tắt chương trình đó rồi chạy lại.
- Nếu backend chạy ở địa chỉ khác, đổi `API_BASE_URL` của service `frontend` trong
  `docker-compose.yml`. Đây là địa chỉ mà **trình duyệt** dùng để gọi backend.

## Cách 2: Chạy thủ công (không dùng Docker)

Hướng dẫn chạy local trên Windows.

### Yêu cầu

- Windows PowerShell hoặc Git Bash.
- Node.js 20 trở lên.
- Quyền Administrator khi cài hoặc khởi động PostgreSQL.

### 1. Cài PostgreSQL bằng lệnh

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

### 2. Đặt password và tạo database bằng lệnh

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

### 3. Cấu hình và setup backend

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

### 4. Chạy trang web bằng 3 lệnh

Sau khi setup xong, dùng ba terminal.

#### Terminal 1 — bật PostgreSQL

PowerShell Administrator:

```powershell
Get-Service -Name postgresql* | Start-Service
```

#### Terminal 2 — chạy backend

Git Bash:

```bash
cd /e/application-web && npm run dev:backend
```

Backend chạy tại <http://localhost:3000>.

#### Terminal 3 — chạy frontend

Git Bash:

```bash
cd /e/application-web && npm run dev:frontend
```

Mở giao diện tại <http://localhost:5173>.

### Nếu bạn đã tạo database rồi

Không cần chạy lại `CREATE DATABASE`. Làm tiếp theo thứ tự:

```bash
cd /e/application-web/backend
npm install
npx prisma generate
npx prisma migrate deploy
```

Sau đó mở ba terminal và chạy ba lệnh ở mục **Chạy trang web bằng 3 lệnh**.

### Build frontend

`build` chỉ biên dịch frontend, không khởi động web server:

```bash
cd /e/application-web
npm run build
```

Muốn mở giao diện local, dùng `npm run dev:frontend`.

### Lưu ý

- Không commit `backend/.env` hoặc `frontend/.env`.
- PostgreSQL local dùng hostname `localhost`, không dùng hostname `db` của Docker Compose.
- Nếu đổi port backend, cập nhật cả `PORT` và `VITE_API_BASE_URL`.
