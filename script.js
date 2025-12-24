// ===== FAQ Toggle =====
document.addEventListener('DOMContentLoaded', function() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            // Close other open items
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                }
            });
            
            // Toggle current item
            item.classList.toggle('active');
        });
    });
});

// ===== Form Validation and Image Preview =====
const donateForm = document.getElementById('donateForm');

if (donateForm) {
    // Image Preview
    const slipImageInput = document.getElementById('slipImage');
    const imagePreview = document.getElementById('imagePreview');
    
    slipImageInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        
        if (file) {
            // Check file size (5MB limit)
            if (file.size > 5 * 1024 * 1024) {
                alert('ไฟล์มีขนาดใหญ่เกิน 5 MB กรุณาเลือกไฟล์ใหม่');
                this.value = '';
                imagePreview.innerHTML = '';
                imagePreview.classList.remove('show');
                return;
            }
            
            // Show preview for images
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                
                reader.onload = function(e) {
                    imagePreview.innerHTML = `
                        <p style="color: var(--primary-color); font-weight: 600; margin-bottom: 0.5rem;">
                            ตัวอย่างสลิปที่แนบ:
                        </p>
                        <img src="${e.target.result}" alt="สลิปการโอนเงิน">
                    `;
                    imagePreview.classList.add('show');
                };
                
                reader.readAsDataURL(file);
            } else if (file.type === 'application/pdf') {
                imagePreview.innerHTML = `
                    <p style="color: var(--primary-color); font-weight: 600;">
                        ✓ ไฟล์ PDF: ${file.name}
                    </p>
                `;
                imagePreview.classList.add('show');
            }
        } else {
            imagePreview.innerHTML = '';
            imagePreview.classList.remove('show');
        }
    });
    
    // ID Card Validation
    const idCardInput = document.getElementById('idCard');
    idCardInput.addEventListener('input', function(e) {
        // Allow only numbers
        this.value = this.value.replace(/[^0-9]/g, '');
        
        // Limit to 13 digits
        if (this.value.length > 13) {
            this.value = this.value.slice(0, 13);
        }
    });
    
    // Phone Number Validation
    const phoneInputs = document.querySelectorAll('input[type="tel"]');
    phoneInputs.forEach(input => {
        input.addEventListener('input', function(e) {
            // Allow only numbers and dash
            this.value = this.value.replace(/[^0-9-]/g, '');
        });
    });
    
    // Amount Validation based on Category
    const categorySelect = document.getElementById('category');
    const amountInput = document.getElementById('amount');
    
    categorySelect.addEventListener('change', function() {
        const category = this.value;
        let minAmount = 300;
        
        switch(category) {
            case '3km':
                minAmount = 300;
                amountInput.value = 300;
                break;
            case '5km':
                minAmount = 400;
                amountInput.value = 400;
                break;
            case '10km':
                minAmount = 500;
                amountInput.value = 500;
                break;
        }
        
        amountInput.min = minAmount;
    });
    
    // Form Submission
    donateForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Validate ID Card (13 digits)
        const idCard = document.getElementById('idCard').value;
        if (idCard.length !== 13) {
            alert('กรุณากรอกเลขบัตรประชาชนให้ครบ 13 หลัก');
            document.getElementById('idCard').focus();
            return;
        }
        
        // Validate Phone Number
        const phone = document.getElementById('phone').value;
        if (phone.length < 9 || phone.length > 10) {
            alert('กรุณากรอกเบอร์โทรศัพท์ให้ถูกต้อง');
            document.getElementById('phone').focus();
            return;
        }
        
        // Validate Emergency Phone
        const emergencyPhone = document.getElementById('emergencyPhone').value;
        if (emergencyPhone.length < 9 || emergencyPhone.length > 10) {
            alert('กรุณากรอกเบอร์โทรผู้ติดต่อฉุกเฉินให้ถูกต้อง');
            document.getElementById('emergencyPhone').focus();
            return;
        }
        
        // Validate Amount
        const category = document.getElementById('category').value;
        const amount = parseInt(document.getElementById('amount').value);
        let requiredAmount = 0;
        
        switch(category) {
            case '3km':
                requiredAmount = 300;
                break;
            case '5km':
                requiredAmount = 400;
                break;
            case '10km':
                requiredAmount = 500;
                break;
        }
        
        if (amount < requiredAmount) {
            alert(`จำนวนเงินต้องไม่น้อยกว่า ${requiredAmount} บาท สำหรับประเภทที่เลือก`);
            document.getElementById('amount').focus();
            return;
        }
        
        // Check if file is uploaded
        const slipFile = document.getElementById('slipImage').files[0];
        if (!slipFile) {
            alert('กรุณาแนบสลิปการโอนเงิน');
            document.getElementById('slipImage').focus();
            return;
        }
        
        // Check checkboxes
        if (!document.getElementById('acceptTerms').checked) {
            alert('กรุณายอมรับข้อกำหนดและเงื่อนไข');
            return;
        }
        
        if (!document.getElementById('acceptPDPA').checked) {
            alert('กรุณายินยอมให้เก็บรวบรวมข้อมูลส่วนบุคคล');
            return;
        }
        
        // If all validations pass
        if (confirm('ยืนยันการส่งข้อมูลลงทะเบียน?')) {
            // Here you would normally send data to server
            // For now, we'll just show success message
            
            alert('✓ ส่งข้อมูลลงทะเบียนเรียบร้อยแล้ว!\n\nคุณจะได้รับอีเมลยืนยันภายใน 24 ชั่วโมง');
            
            // Reset form
            donateForm.reset();
            imagePreview.innerHTML = '';
            imagePreview.classList.remove('show');
            
            // Redirect to home page after 2 seconds
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 2000);
        }
    });
}

// ===== Smooth Scrolling for Anchor Links =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        
        // Skip if it's just "#"
        if (href === '#') {
            e.preventDefault();
            return;
        }
        
        const target = document.querySelector(href);
        
        if (target) {
            e.preventDefault();
            const headerOffset = 80;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
            
            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ===== Auto-save Form Data to LocalStorage =====
if (donateForm) {
    // Save form data on input
    const formInputs = donateForm.querySelectorAll('input:not([type="file"]):not([type="checkbox"]), select, textarea');
    
    formInputs.forEach(input => {
        // Load saved data on page load
        const savedValue = localStorage.getItem(`kpi_run_${input.id}`);
        if (savedValue && input.value === '') {
            input.value = savedValue;
        }
        
        // Save data on change
        input.addEventListener('change', function() {
            localStorage.setItem(`kpi_run_${input.id}`, this.value);
        });
    });
    
    // Clear localStorage on successful submission
    donateForm.addEventListener('submit', function() {
        formInputs.forEach(input => {
            localStorage.removeItem(`kpi_run_${input.id}`);
        });
    });
}

// ===== Mobile Menu Toggle (for future implementation) =====
// This is a placeholder for responsive menu functionality
const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');

if (menuToggle && nav) {
    menuToggle.addEventListener('click', function() {
        nav.classList.toggle('active');
    });
}