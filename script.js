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

// ===== Lazy Loading Images =====
document.addEventListener('DOMContentLoaded', function() {
    const lazyImages = document.querySelectorAll('.lazy-image');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                const src = img.getAttribute('data-src');
                
                if (src) {
                    img.src = src;
                    img.onload = () => {
                        img.parentElement.classList.remove('lazy-loading');
                        img.parentElement.classList.add('lazy-loaded');
                    };
                    observer.unobserve(img);
                }
            }
        });
    });
    
    lazyImages.forEach(image => imageObserver.observe(image));
});

// ===== Configuration =====
// ใส่ URL ของ Google Apps Script Web App ที่นี่
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwFIKQk6PmpMIEvP-fPXJaq_U4G2YZ4kCGbPPPwP9zK5qHLgbWb_7rh2FCUhodK-bBHIw/exec';

// ===== Sponsor Form Validation and Features =====
const sponsorForm = document.getElementById('sponsorForm');

if (sponsorForm) {
    // Logo Option Toggle
    const logoOptions = document.querySelectorAll('input[name="logoOption"]');
    const logoUploadSection = document.getElementById('logoUploadSection');
    const logoFileInput = document.getElementById('logoFile');
    const logoPreview = document.getElementById('logoPreview');
    let logoFileData = null;
    
    logoOptions.forEach(option => {
        option.addEventListener('change', function() {
            if (this.value === 'with-logo') {
                logoUploadSection.style.display = 'block';
                logoFileInput.required = true;
            } else {
                logoUploadSection.style.display = 'none';
                logoFileInput.required = false;
                logoFileInput.value = '';
                logoPreview.innerHTML = '';
                logoPreview.classList.remove('show');
                logoFileData = null;
            }
        });
    });
    
    // Logo File Preview
    if (logoFileInput && logoPreview) {
        logoFileInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            
            if (file) {
                // Check file size (10MB limit for logo)
                if (file.size > 10 * 1024 * 1024) {
                    Swal.fire({
                        icon: 'error',
                        title: 'ไฟล์ใหญ่เกินไป',
                        text: 'ไฟล์มีขนาดใหญ่เกิน 10 MB กรุณาเลือกไฟล์ใหม่',
                        confirmButtonText: 'ตกลง',
                        confirmButtonColor: '#2d6a5f'
                    });
                    this.value = '';
                    logoPreview.innerHTML = '';
                    logoPreview.classList.remove('show');
                    logoFileData = null;
                    return;
                }
                
                const reader = new FileReader();
                
                reader.onload = function(e) {
                    logoFileData = e.target.result;
                    
                    // Show preview based on file type
                    if (file.type.startsWith('image/')) {
                        logoPreview.innerHTML = `
                            <p style="color: var(--primary-color); font-weight: 600; margin-bottom: 0.5rem;">
                                ตัวอย่างโลโก้:
                            </p>
                            <img src="${e.target.result}" alt="โลโก้" style="max-height: 200px;">
                        `;
                    } else {
                        logoPreview.innerHTML = `
                            <p style="color: var(--primary-color); font-weight: 600;">
                                ✓ ไฟล์: ${file.name} (${(file.size / 1024).toFixed(2)} KB)
                            </p>
                        `;
                    }
                    logoPreview.classList.add('show');
                };
                
                reader.readAsDataURL(file);
            } else {
                logoPreview.innerHTML = '';
                logoPreview.classList.remove('show');
                logoFileData = null;
            }
        });
    }
    
    // Package Selection and Amount Display
    const packageRadios = document.querySelectorAll('input[name="package"]');
    const amountDisplay = document.getElementById('amountDisplay');
    
    packageRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            const amount = this.dataset.amount;
            const packageName = this.parentElement.querySelector('.package-badge').textContent;
            
            if (amount) {
                amountDisplay.innerHTML = `
                    <div style="font-size: 1.1rem; margin-bottom: 0.5rem;">แพคเกจที่เลือก</div>
                    <div style="font-size: 1.5rem; font-weight: 800; margin: 0.5rem 0;">${packageName}</div>
                    <div style="font-size: 2.5rem; font-weight: 800; margin-top: 0.5rem;">฿${parseInt(amount).toLocaleString()}</div>
                `;
            }
        });
    });
    
    // Package Card Selection Visual Feedback
    const packageCards = document.querySelectorAll('.package-card');
    packageCards.forEach(card => {
        card.addEventListener('click', function() {
            // Remove selection from all cards
            packageCards.forEach(c => c.classList.remove('selected'));
            
            // Add selection to clicked card
            this.classList.add('selected');
            
            // Check the radio button
            const radio = this.querySelector('input[type="radio"]');
            if (radio) {
                radio.checked = true;
                radio.dispatchEvent(new Event('change'));
            }
        });
    });
    
    // Image Preview for Slip
    const slipImageInput = document.getElementById('slipImage');
    const imagePreview = document.getElementById('imagePreview');
    let slipFileData = null;
    
    if (slipImageInput && imagePreview) {
        slipImageInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            
            if (file) {
                // Check file size (5MB limit)
                if (file.size > 5 * 1024 * 1024) {
                    Swal.fire({
                        icon: 'error',
                        title: 'ไฟล์ใหญ่เกินไป',
                        text: 'ไฟล์มีขนาดใหญ่เกิน 5 MB กรุณาเลือกไฟล์ใหม่',
                        confirmButtonText: 'ตกลง',
                        confirmButtonColor: '#2d6a5f'
                    });
                    this.value = '';
                    imagePreview.innerHTML = '';
                    imagePreview.classList.remove('show');
                    slipFileData = null;
                    return;
                }
                
                // Show preview for images
                if (file.type.startsWith('image/')) {
                    const reader = new FileReader();
                    
                    reader.onload = function(e) {
                        slipFileData = e.target.result; // เก็บ Base64 data
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
                    const reader = new FileReader();
                    
                    reader.onload = function(e) {
                        slipFileData = e.target.result; // เก็บ Base64 data
                        imagePreview.innerHTML = `
                            <p style="color: var(--primary-color); font-weight: 600;">
                                ✓ ไฟล์ PDF: ${file.name}
                            </p>
                        `;
                        imagePreview.classList.add('show');
                    };
                    
                    reader.readAsDataURL(file);
                }
            } else {
                imagePreview.innerHTML = '';
                imagePreview.classList.remove('show');
                slipFileData = null;
            }
        });
    }
    
    // Phone Number Validation
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            // Allow only numbers and dash
            this.value = this.value.replace(/[^0-9-]/g, '');
        });
    }
    
    // Form Submission
    sponsorForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Validate Organization Name
        const orgName = document.getElementById('organizationName').value.trim();
        if (orgName.length < 3) {
            Swal.fire({
                icon: 'warning',
                title: 'กรุณากรอกข้อมูล',
                text: 'กรุณากรอกชื่อหน่วยงานให้ถูกต้อง',
                confirmButtonText: 'ตกลง',
                confirmButtonColor: '#2d6a5f'
            });
            document.getElementById('organizationName').focus();
            return;
        }
        
        // Validate Address
        const address = document.getElementById('address').value.trim();
        if (address.length < 10) {
            Swal.fire({
                icon: 'warning',
                title: 'กรุณากรอกข้อมูล',
                text: 'กรุณากรอกที่อยู่ให้ครบถ้วน',
                confirmButtonText: 'ตกลง',
                confirmButtonColor: '#2d6a5f'
            });
            document.getElementById('address').focus();
            return;
        }
        
        // Validate Package Selection
        const selectedPackage = document.querySelector('input[name="package"]:checked');
        if (!selectedPackage) {
            Swal.fire({
                icon: 'info',
                title: 'กรุณาเลือกแพคเกจ',
                text: 'กรุณาเลือกแพคเกจสนับสนุนที่ต้องการ',
                confirmButtonText: 'ตกลง',
                confirmButtonColor: '#2d6a5f'
            });
            window.scrollTo({ top: document.querySelector('.sponsor-packages').offsetTop - 100, behavior: 'smooth' });
            return;
        }
        
        // Validate Logo Option
        const selectedLogoOption = document.querySelector('input[name="logoOption"]:checked');
        if (!selectedLogoOption) {
            Swal.fire({
                icon: 'info',
                title: 'กรุณาเลือกตัวเลือก',
                text: 'กรุณาเลือกว่าจะใส่โลโก้หรือไม่',
                confirmButtonText: 'ตกลง',
                confirmButtonColor: '#2d6a5f'
            });
            window.scrollTo({ top: document.querySelector('.logo-option-group').offsetTop - 100, behavior: 'smooth' });
            return;
        }
        
        // Validate Logo File if "with-logo" is selected
        if (selectedLogoOption.value === 'with-logo' && !logoFileData) {
            Swal.fire({
                icon: 'warning',
                title: 'กรุณาแนบไฟล์โลโก้',
                text: 'กรุณาแนบไฟล์โลโก้ของคุณ',
                confirmButtonText: 'ตกลง',
                confirmButtonColor: '#2d6a5f'
            });
            document.getElementById('logoFile').focus();
            return;
        }
        
        // Validate Contact Name
        const contactName = document.getElementById('contactName').value.trim();
        if (contactName.length < 3) {
            Swal.fire({
                icon: 'warning',
                title: 'กรุณากรอกข้อมูล',
                text: 'กรุณากรอกชื่อผู้ติดต่อให้ถูกต้อง',
                confirmButtonText: 'ตกลง',
                confirmButtonColor: '#2d6a5f'
            });
            document.getElementById('contactName').focus();
            return;
        }
        
        // Validate Phone Number
        const phone = document.getElementById('phone').value;
        if (phone.length < 9 || phone.length > 10) {
            Swal.fire({
                icon: 'warning',
                title: 'กรุณากรอกข้อมูล',
                text: 'กรุณากรอกเบอร์โทรศัพท์ให้ถูกต้อง (9-10 หลัก)',
                confirmButtonText: 'ตกลง',
                confirmButtonColor: '#2d6a5f'
            });
            document.getElementById('phone').focus();
            return;
        }
        
        // Check checkboxes
        if (!document.getElementById('acceptTerms').checked) {
            Swal.fire({
                icon: 'warning',
                title: 'กรุณายอมรับเงื่อนไข',
                text: 'กรุณายอมรับข้อกำหนดและเงื่อนไข',
                confirmButtonText: 'ตกลง',
                confirmButtonColor: '#2d6a5f'
            });
            return;
        }
        
        if (!document.getElementById('acceptPDPA').checked) {
            Swal.fire({
                icon: 'warning',
                title: 'กรุณายอมรับเงื่อนไข',
                text: 'กรุณายินยอมให้เก็บรวบรวมข้อมูลส่วนบุคคล',
                confirmButtonText: 'ตกลง',
                confirmButtonColor: '#2d6a5f'
            });
            return;
        }
        
        // Get selected package info
        const packageName = selectedPackage.parentElement.querySelector('.package-badge').textContent;
        const packageAmount = selectedPackage.dataset.amount;
        const packageType = selectedPackage.value;
        const email = document.getElementById('email').value;
        
        // Confirmation dialog
        Swal.fire({
            title: 'ยืนยันการส่งข้อมูล?',
            html: `
                <div style="text-align: left; padding: 1rem;">
                    <p><strong>หน่วยงาน:</strong> ${orgName}</p>
                    <p><strong>แพคเกจ:</strong> ${packageName}</p>
                    <p><strong>จำนวนเงิน:</strong> ฿${parseInt(packageAmount).toLocaleString()}</p>
                    <p><strong>ผู้ติดต่อ:</strong> ${contactName}</p>
                    <p><strong>เบอร์โทร:</strong> ${phone}</p>
                </div>
            `,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'ยืนยัน',
            cancelButtonText: 'ยกเลิก',
            confirmButtonColor: '#2d6a5f',
            cancelButtonColor: '#6b7280'
        }).then((result) => {
            if (result.isConfirmed) {
                // Show loading
                Swal.fire({
                    title: 'กำลังส่งข้อมูล...',
                    html: 'กรุณารอสักครู่',
                    allowOutsideClick: false,
                    didOpen: () => {
                        Swal.showLoading();
                    }
                });
                
                // เตรียมข้อมูลที่จะส่ง
                const formData = {
                    organizationName: orgName,
                    address: address,
                    packageType: packageType,
                    amount: packageAmount,
                    contactName: contactName,
                    phone: phone,
                    email: email,
                    transferDate: document.getElementById('transferDate') ? document.getElementById('transferDate').value : '',
                    logoOption: selectedLogoOption.value, // เพิ่ม logo option
                    logoFile: logoFileData, // Base64 encoded logo file (ถ้ามี)
                    slipFile: slipFileData, // Base64 encoded slip file
                    timestamp: new Date().toISOString()
                };
                
                // ส่งข้อมูลไปยัง Google Apps Script
                fetch(GOOGLE_SCRIPT_URL, {
                    method: 'POST',
                    mode: 'no-cors', // สำคัญ! เพื่อให้ทำงานกับ Google Apps Script
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData)
                })
                .then(() => {
                    // เนื่องจากใช้ no-cors จะไม่ได้ response กลับมา
                    // แต่ถือว่าส่งสำเร็จ
                    Swal.fire({
                        icon: 'success',
                        title: 'ส่งข้อมูลสำเร็จ!',
                        html: `
                            <p>ขอบคุณสำหรับการสนับสนุน</p>
                            <p><strong>แพคเกจ:</strong> ${packageName}</p>
                            <p><strong>จำนวน:</strong> ฿${parseInt(packageAmount).toLocaleString()}</p>
                            <p style="margin-top: 1rem; color: #2d6a5f;">ทีมงานจะติดต่อกลับภายใน 2-3 วันทำการ</p>
                        `,
                        confirmButtonText: 'ตกลง',
                        confirmButtonColor: '#2d6a5f'
                    }).then(() => {
                        // Reset form
                        sponsorForm.reset();
                        amountDisplay.innerHTML = '';
                        packageCards.forEach(c => c.classList.remove('selected'));
                        imagePreview.innerHTML = '';
                        imagePreview.classList.remove('show');
                        slipFileData = null;
                        
                        // Clear localStorage
                        const formInputs = sponsorForm.querySelectorAll('input:not([type="file"]):not([type="checkbox"]):not([type="radio"]), select, textarea');
                        formInputs.forEach(input => {
                            localStorage.removeItem(`kpi_sponsor_${input.id}`);
                        });
                        localStorage.removeItem('kpi_sponsor_package');
                        
                        // Redirect to home page
                        setTimeout(() => {
                            window.location.href = 'index.html';
                        }, 1500);
                    });
                })
                .catch(error => {
                    console.error('Error:', error);
                    Swal.fire({
                        icon: 'error',
                        title: 'เกิดข้อผิดพลาด',
                        text: 'ไม่สามารถส่งข้อมูลได้ กรุณาลองใหม่อีกครั้ง',
                        confirmButtonText: 'ตกลง',
                        confirmButtonColor: '#2d6a5f'
                    });
                });
            }
        });
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
if (sponsorForm) {
    // Save form data on input
    const formInputs = sponsorForm.querySelectorAll('input:not([type="file"]):not([type="checkbox"]):not([type="radio"]), select, textarea');
    
    formInputs.forEach(input => {
        // Load saved data on page load
        const savedValue = localStorage.getItem(`kpi_sponsor_${input.id}`);
        if (savedValue && input.value === '') {
            input.value = savedValue;
        }
        
        // Save data on change
        input.addEventListener('change', function() {
            localStorage.setItem(`kpi_sponsor_${input.id}`, this.value);
        });
    });
    
    // Save and restore package selection
    const savedPackage = localStorage.getItem('kpi_sponsor_package');
    if (savedPackage) {
        const radio = document.querySelector(`input[name="package"][value="${savedPackage}"]`);
        if (radio) {
            radio.checked = true;
            radio.dispatchEvent(new Event('change'));
            radio.closest('.package-card').classList.add('selected');
        }
    }
    
    const packageRadios = document.querySelectorAll('input[name="package"]');
    packageRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            if (this.checked) {
                localStorage.setItem('kpi_sponsor_package', this.value);
            }
        });
    });
}

// ===== Mobile Menu Toggle (for future implementation) =====
const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');

if (menuToggle && nav) {
    menuToggle.addEventListener('click', function() {
        nav.classList.toggle('active');
    });
}