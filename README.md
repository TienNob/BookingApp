# Tên Dự Án

NOB - Website kết nối cộng đồng chia sẽ chuyến đi

# Mô tả sơ về dự án và các công nghệ sử dụng

Mục tiêu website: Xây dựng một cộng đồng cho những người cần chia sẽ chuyến đi, với đầy đủ chức năng, phân
quyền, admin page. Phân chia component một cách tối ưu để tái sử dụng
code với giao diện bắt mắt, dễ sử dụng.

• Trang web được thiết kế theo mô hình MERN.
- Frontend: sử dụng HTML, CSS, framework ReacJS + ViteJS, Material-ui để làm giao diện người dùng.
- Backend: sử dụng NodeJS, ExpressJS, MongoDB để lưu trữ dữ liệu,
  JWT để phân quyền

# Một số hình ảnh của website

<img width="1280" alt="image" src="https://github.com/user-attachments/assets/b70914e5-dabe-49b4-9590-d520a7a50f6d">
<img width="1279" alt="image" src="https://github.com/user-attachments/assets/7415fc27-6acd-470e-99eb-77887c7951a2">
<img width="1280" alt="image" src="https://github.com/user-attachments/assets/f9f40778-eb25-44bf-be09-9c8e21250ffe">
<img width="1280" alt="image" src="https://github.com/user-attachments/assets/13d59e59-514f-4842-ae95-889d5200199b">
<img width="1280" alt="image" src="https://github.com/user-attachments/assets/c1422660-5329-41a8-baa9-c2b285917132">
<img width="1280" alt="image" src="https://github.com/user-attachments/assets/1a48ff5f-cba1-4717-869b-8f87eb477178">
<img width="1280" alt="image" src="https://github.com/user-attachments/assets/69bf2b63-9d95-4915-b845-8ff3625e07a8">
<img width="1279" alt="image" src="https://github.com/user-attachments/assets/4f6189e8-cd31-4a23-950c-8762ed7d3ca4">

## Cài Đặt

Đảm bảo bạn đã cài đặt [Node.js](https://nodejs.org/en/) trước khi bắt đầu.

2. **Di chuyển vào thư mục dự án:**

   ```bash
   cd BookingApp
   ```

3. **Cài đặt dependencies:**

   Sử dụng npm:

   ```bash
   npm install
   ```

   hoặc sử dụng Yarn:

   ```bash
   yarn
   ```

## Sử Dụng

1.  **Chạy ứng dụng trong môi trường development:**

    - Đối với thư mục frontend => cd BookingApp
      Sử dụng npm:

      ```bash
      npm run dev
      ```

      hoặc sử dụng Yarn:

      ```bash
      yarn dev
      ```

      Ứng dụng sẽ được chạy trên `http://localhost:5173`.

    - Đối với thư mục backend => cd BookingApp/backend
      Sử dụng npm:

      ```bash
      npm start (vì có sử dụng nodemon để auto chạy lại server khi save)

      ```

      Server sẽ được chạy trên `http://localhost:8080`.

2.  **Tạo production build:**

    Sử dụng npm:

    ```bash
    npm run build
    ```

    hoặc sử dụng Yarn:

    ```bash
    yarn build
    ```

## Các Chức Năng

Bao gồm: Quản lý thông chuyến đi, quản lý vé, quản lý thông tin cá nhân, quản lý thanh toán, quản lý đánh giá, nhắn tin...

## Thông Tin Thêm

Sản phẩm chỉ dùng để học tập các công nghệ, không dùng cho mục đích thương mại.

