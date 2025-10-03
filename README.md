# Họ và tên: Dương Khải Anh - MSV: 22810350161

# RSA Code Lab - Lý thuyết và Thực hành

Ứng dụng web tương tác để học và thực hành thuật toán mã hóa RSA.

## 🎯 Tính năng

### Tab 1: Lý thuyết
- **Nguyên lý RSA**: Giải thích chi tiết các bước tạo khóa (p, q, n, φ(n), e, d)
- **Tại sao RSA bảo mật**: Vai trò của phân tích thừa số n
- **Hệ số e phổ biến**: Giải thích về 65537 và lý do sử dụng
- **Padding**: So sánh PKCS#1 v1.5 và OAEP, tại sao cần padding

### Tab 2: Code Lab
- **Demo RSA tương tác**: Chọn p, q nhỏ (ví dụ: p=61, q=53)
- **Tính toán từng bước**: Hiển thị chi tiết n, φ(n), e, d
- **Mã hóa/Giải mã**: Demo với số nguyên m
- **Kiểm tra số nguyên tố**: Tự động kiểm tra p và q
- **Hiển thị công thức**: Mỗi bước tính toán được giải thích rõ ràng

## 📝 Hướng dẫn sử dụng Code Lab

1. **Nhập số nguyên tố p và q**:
   - Mặc định: p=61, q=53
   - Click "Kiểm tra" để xác nhận số nguyên tố
   - Thử các giá trị khác: 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97

2. **Nhập thông điệp m**:
   - Phải là số nguyên dương
   - Phải nhỏ hơn n (sẽ được tính tự động)
   - Ví dụ: 123, 42, 100

3. **Tạo khóa RSA**:
   - Click nút "Tạo khóa RSA"
   - Xem từng bước tính toán chi tiết
   - Khóa công khai (n, e) và khóa riêng tư (n, d) sẽ được hiển thị

4. **Mã hóa và Giải mã**:
   - Click "Mã hóa" để mã hóa thông điệp m
   - Click "Giải mã" để giải mã và xác minh kết quả
   - Xem công thức và các bước tính toán

## 🔢 Ví dụ minh họa

### Ví dụ 1: p=61, q=53, m=123
```
n = 61 × 53 = 3233
φ(n) = 60 × 52 = 3120
e = 17 (gcd(17, 3120) = 1)
d = 2753 (17 × 2753 ≡ 1 mod 3120)

Mã hóa: c = 123^17 mod 3233 = 855
Giải mã: m = 855^2753 mod 3233 = 123 ✓
```

### Ví dụ 2: p=7, q=11, m=5
```
n = 7 × 11 = 77
φ(n) = 6 × 10 = 60
e = 17 (gcd(17, 60) = 1)
d = 53 (17 × 53 ≡ 1 mod 60)

Mã hóa: c = 5^17 mod 77 = 26
Giải mã: m = 26^53 mod 77 = 5 ✓
Được tạo bởi Cascade AI Assistant cho mục đích giáo dục.

---

**Chúc bạn học tập vui vẻ! 🎓🔐**
