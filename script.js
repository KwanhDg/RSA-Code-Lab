// Global variables to store RSA parameters
let rsaParams = {
    p: 0,
    q: 0,
    n: 0,
    phi: 0,
    e: 0,
    d: 0,
    message: 0,
    ciphertext: 0
};

// Tab switching functionality
function openTab(evt, tabName) {
    const tabContents = document.getElementsByClassName("tab-content");
    const tabButtons = document.getElementsByClassName("tab-button");
    
    // Hide all tab contents
    for (let i = 0; i < tabContents.length; i++) {
        tabContents[i].classList.remove("active");
    }
    
    // Remove active class from all buttons
    for (let i = 0; i < tabButtons.length; i++) {
        tabButtons[i].classList.remove("active");
    }
    
    // Show selected tab and mark button as active
    document.getElementById(tabName).classList.add("active");
    evt.currentTarget.classList.add("active");
}

// Check if a number is prime
function isPrime(num) {
    if (num < 2) return false;
    if (num === 2) return true;
    if (num % 2 === 0) return false;
    
    for (let i = 3; i <= Math.sqrt(num); i += 2) {
        if (num % i === 0) return false;
    }
    return true;
}

// Check prime status for input fields
function checkPrime(field) {
    const input = document.getElementById(`${field}-input`);
    const status = document.getElementById(`${field}-status`);
    const value = parseInt(input.value);
    
    if (isPrime(value)) {
        status.textContent = "✓ Là số nguyên tố";
        status.className = "status valid";
    } else {
        status.textContent = "✗ Không phải số nguyên tố";
        status.className = "status invalid";
    }
}

// Calculate GCD using Euclidean algorithm
function gcd(a, b) {
    while (b !== 0) {
        let temp = b;
        b = a % b;
        a = temp;
    }
    return a;
}

// Extended Euclidean Algorithm to find modular inverse
function extendedGCD(a, b) {
    if (a === 0) {
        return { gcd: b, x: 0, y: 1 };
    }
    
    const result = extendedGCD(b % a, a);
    const x = result.y - Math.floor(b / a) * result.x;
    const y = result.x;
    
    return { gcd: result.gcd, x: x, y: y };
}

// Find modular inverse
function modInverse(e, phi) {
    const result = extendedGCD(e, phi);
    if (result.gcd !== 1) {
        return null; // Modular inverse doesn't exist
    }
    return ((result.x % phi) + phi) % phi;
}

// Fast modular exponentiation
function modPow(base, exponent, modulus) {
    if (modulus === 1) return 0;
    
    let result = 1;
    base = base % modulus;
    
    while (exponent > 0) {
        if (exponent % 2 === 1) {
            result = (result * base) % modulus;
        }
        exponent = Math.floor(exponent / 2);
        base = (base * base) % modulus;
    }
    
    return result;
}

// Find a suitable e value
function findE(phi) {
    // Try common values first
    const commonE = [3, 17, 257, 65537];
    
    for (let e of commonE) {
        if (e < phi && gcd(e, phi) === 1) {
            return e;
        }
    }
    
    // If common values don't work, find the smallest suitable e
    for (let e = 3; e < phi; e += 2) {
        if (gcd(e, phi) === 1) {
            return e;
        }
    }
    
    return null;
}

// Generate RSA keys and show step-by-step calculation
function generateRSA() {
    const p = parseInt(document.getElementById('p-input').value);
    const q = parseInt(document.getElementById('q-input').value);
    const message = parseInt(document.getElementById('message-input').value);
    
    // Validate inputs
    if (!isPrime(p)) {
        alert('p phải là số nguyên tố!');
        return;
    }
    
    if (!isPrime(q)) {
        alert('q phải là số nguyên tố!');
        return;
    }
    
    if (p === q) {
        alert('p và q phải khác nhau!');
        return;
    }
    
    if (message <= 0) {
        alert('Thông điệp phải là số nguyên dương!');
        return;
    }
    
    // Calculate RSA parameters
    const n = p * q;
    const phi = (p - 1) * (q - 1);
    const e = findE(phi);
    
    if (!e) {
        alert('Không thể tìm được e phù hợp!');
        return;
    }
    
    const d = modInverse(e, phi);
    
    if (!d) {
        alert('Không thể tìm được d!');
        return;
    }
    
    if (message >= n) {
        alert(`Thông điệp phải nhỏ hơn n = ${n}!`);
        return;
    }
    
    // Store parameters
    rsaParams = { p, q, n, phi, e, d, message, ciphertext: 0 };
    
    // Display results
    displayRSAGeneration();
    
    // Show encryption section
    document.getElementById('encryption-section').style.display = 'block';
}

// Display RSA key generation steps
function displayRSAGeneration() {
    const resultsDiv = document.getElementById('results');
    const { p, q, n, phi, e, d } = rsaParams;
    
    resultsDiv.innerHTML = `
        <h3><i class="fas fa-key"></i> Quá trình tạo khóa RSA</h3>
        
        <div class="step">
            <h4>Bước 1: Chọn hai số nguyên tố p và q</h4>
            <div class="calculation">
                p = ${p}
                q = ${q}
            </div>
            <div class="result">✓ Đã chọn hai số nguyên tố khác nhau</div>
        </div>
        
        <div class="step">
            <h4>Bước 2: Tính n = p × q</h4>
            <div class="calculation">
                n = ${p} × ${q} = ${n}
            </div>
            <div class="result">n = ${n} (modulus công khai)</div>
        </div>
        
        <div class="step">
            <h4>Bước 3: Tính φ(n) = (p-1)(q-1)</h4>
            <div class="calculation">
                φ(n) = (${p}-1) × (${q}-1)
                φ(n) = ${p-1} × ${q-1} = ${phi}
            </div>
            <div class="result">φ(n) = ${phi} (hàm Euler's totient)</div>
        </div>
        
        <div class="step">
            <h4>Bước 4: Chọn e sao cho gcd(e, φ(n)) = 1</h4>
            <div class="calculation">
                Kiểm tra: gcd(${e}, ${phi}) = ${gcd(e, phi)}
                1 < ${e} < ${phi} ✓
            </div>
            <div class="result">e = ${e} (số mũ công khai)</div>
        </div>
        
        <div class="step">
            <h4>Bước 5: Tìm d sao cho e × d ≡ 1 (mod φ(n))</h4>
            <div class="calculation">
                ${e} × d ≡ 1 (mod ${phi})
                d = ${d}
                Kiểm tra: ${e} × ${d} mod ${phi} = ${(e * d) % phi}
            </div>
            <div class="result">d = ${d} (số mũ riêng tư)</div>
        </div>
        
        <div class="step" style="border-left-color: #007bff;">
            <h4><i class="fas fa-key"></i> Kết quả cuối cùng</h4>
            <div class="calculation">
                <strong>Khóa công khai:</strong> (n, e) = (${n}, ${e})
                <strong>Khóa riêng tư:</strong> (n, d) = (${n}, ${d})
            </div>
            <div class="result">✓ Tạo khóa RSA thành công!</div>
        </div>
    `;
}

// Encrypt message
function encryptMessage() {
    if (rsaParams.n === 0) {
        alert('Vui lòng tạo khóa RSA trước!');
        return;
    }
    
    const { message, e, n } = rsaParams;
    const ciphertext = modPow(message, e, n);
    rsaParams.ciphertext = ciphertext;
    
    displayEncryption();
}

// Decrypt message
function decryptMessage() {
    if (rsaParams.ciphertext === 0) {
        alert('Vui lòng mã hóa thông điệp trước!');
        return;
    }
    
    displayDecryption();
}

// Display encryption process
function displayEncryption() {
    const resultsDiv = document.getElementById('encryption-results');
    const { message, e, n, ciphertext } = rsaParams;
    
    resultsDiv.innerHTML = `
        <div class="encryption-step">
            <h5><i class="fas fa-lock"></i> Quá trình mã hóa</h5>
            <div class="calc">
                <strong>Công thức:</strong> c ≡ m<sup>e</sup> (mod n)
            </div>
            <div class="calc">
                <strong>Thay số:</strong> c ≡ ${message}<sup>${e}</sup> (mod ${n})
            </div>
            <div class="calc">
                <strong>Tính toán:</strong> c ≡ ${ciphertext} (mod ${n})
            </div>
            <div class="result" style="color: #dc3545; font-size: 1.2rem;">
                <strong>Kết quả mã hóa:</strong> c = ${ciphertext}
            </div>
        </div>
    `;
}

// Display decryption process
function displayDecryption() {
    const resultsDiv = document.getElementById('encryption-results');
    const { message, d, n, ciphertext } = rsaParams;
    const decryptedMessage = modPow(ciphertext, d, n);
    
    resultsDiv.innerHTML += `
        <div class="encryption-step">
            <h5><i class="fas fa-unlock"></i> Quá trình giải mã</h5>
            <div class="calc">
                <strong>Công thức:</strong> m ≡ c<sup>d</sup> (mod n)
            </div>
            <div class="calc">
                <strong>Thay số:</strong> m ≡ ${ciphertext}<sup>${d}</sup> (mod ${n})
            </div>
            <div class="calc">
                <strong>Tính toán:</strong> m ≡ ${decryptedMessage} (mod ${n})
            </div>
            <div class="result" style="color: #28a745; font-size: 1.2rem;">
                <strong>Kết quả giải mã:</strong> m = ${decryptedMessage}
            </div>
            ${decryptedMessage === message ? 
                '<div style="color: #28a745; font-weight: bold; margin-top: 10px;">✓ Giải mã thành công! Thông điệp gốc được khôi phục chính xác.</div>' :
                '<div style="color: #dc3545; font-weight: bold; margin-top: 10px;">✗ Lỗi giải mã! Có vấn đề trong quá trình tính toán.</div>'
            }
        </div>
    `;
}

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    // Check if we have values from examples page
    const storedP = localStorage.getItem('rsa_p');
    const storedQ = localStorage.getItem('rsa_q');
    const storedM = localStorage.getItem('rsa_m');
    
    if (storedP && storedQ && storedM) {
        // Load values from localStorage
        document.getElementById('p-input').value = storedP;
        document.getElementById('q-input').value = storedQ;
        document.getElementById('message-input').value = storedM;
        
        // Clear localStorage
        localStorage.removeItem('rsa_p');
        localStorage.removeItem('rsa_q');
        localStorage.removeItem('rsa_m');
        
        // Switch to codelab tab if hash is present
        if (window.location.hash === '#codelab') {
            const codelabButton = document.querySelector('.tab-button:nth-child(2)');
            if (codelabButton) {
                codelabButton.click();
            }
        }
    }
    
    // Check initial prime status
    checkPrime('p');
    checkPrime('q');
    
    // Add event listeners for real-time prime checking
    document.getElementById('p-input').addEventListener('input', () => checkPrime('p'));
    document.getElementById('q-input').addEventListener('input', () => checkPrime('q'));
    
    // Add enter key support for inputs
    document.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            const activeTab = document.querySelector('.tab-content.active');
            if (activeTab && activeTab.id === 'codelab') {
                generateRSA();
            }
        }
    });
    
    console.log('RSA Code Lab initialized successfully!');
});
