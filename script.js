// ===== FAQ Toggle =====
document.addEventListener('DOMContentLoaded', function() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                }
            });
            
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
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwFIKQk6PmpMIEvP-fPXJaq_U4G2YZ4kCGbPPPwP9zK5qHLgbWb_7rh2FCUhodK-bBHIw/exec';

// ===== Helper Functions =====
function compressBase64Image(base64String, maxSizeKB = 500) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = function() {
            const canvas = document.createElement('canvas');
            let width = img.width;
            let height = img.height;
            
            // ลดขนาดถ้าใหญ่เกินไป
            const maxDimension = 1920;
            if (width > maxDimension || height > maxDimension) {
                if (width > height) {
                    height = (height / width) * maxDimension;
                    width = maxDimension;
                } else {
                    width = (width / height) * maxDimension;
                    height = maxDimension;
                }
            }
            
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, width, height);
            
            // ลด quality จนกว่าจะได้ขนาดที่ต้องการ
            let quality = 0.9;
            let result = canvas.toDataURL('image/jpeg', quality);
            
            while (result.length > maxSizeKB * 1024 && quality > 0.1) {
                quality -= 0.1;
                result = canvas.toDataURL('image/jpeg', quality);
            }
            
            resolve(result);
        };
        img.onerror = reject;
        img.src = base64String;
    });
}

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
        logoFileInput.addEventListener('change', async function(e) {
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
                
                reader.onload = async function(e) {
                    let fileData = e.target.result;
                    
                    // ถ้าเป็นรูปภาพให้บีบอัด
                    if (file.type.startsWith('image/') && file.size > 500 * 1024) {
                        try {
                            Swal.fire({
                                title: 'กำลังประมวลผลไฟล์...',
                                allowOutsideClick: false,
                                didOpen: () => Swal.showLoading()
                            });
                            fileData = await compressBase64Image(fileData, 500);
                            Swal.close();
                        } catch (error) {
                            console.error('Compression error:', error);
                        }
                    }
                    
                    logoFileData = fileData;
                    
                    // Show preview based on file type
                    if (file.type.startsWith('image/')) {
                        logoPreview.innerHTML = `
                            <p style="color: var(--primary-color); font-weight: 600; margin-bottom: 0.5rem;">
                                ตัวอย่างโลโก้:
                            </p>
                            <img src="${fileData}" alt="โลโก้" style="max-height: 200px;">
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
            packageCards.forEach(c => c.classList.remove('selected'));
            this.classList.add('selected');
            
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
        slipImageInput.addEventListener('change', async function(e) {
            const file = e.target.files[0];
            
            if (file) {
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
                
                const reader = new FileReader();
                
                reader.onload = async function(e) {
                    let fileData = e.target.result;
                    
                    // ถ้าเป็นรูปภาพให้บีบอัด
                    if (file.type.startsWith('image/') && file.size > 500 * 1024) {
                        try {
                            Swal.fire({
                                title: 'กำลังประมวลผลไฟล์...',
                                allowOutsideClick: false,
                                didOpen: () => Swal.showLoading()
                            });
                            fileData = await compressBase64Image(fileData, 500);
                            Swal.close();
                        } catch (error) {
                            console.error('Compression error:', error);
                        }
                    }
                    
                    slipFileData = fileData;
                    
                    if (file.type.startsWith('image/')) {
                        imagePreview.innerHTML = `
                            <p style="color: var(--primary-color); font-weight: 600; margin-bottom: 0.5rem;">
                                ตัวอย่างสลิปที่แนบ:
                            </p>
                            <img src="${fileData}" alt="สลิปการโอนเงิน">
                        `;
                    } else if (file.type === 'application/pdf') {
                        imagePreview.innerHTML = `
                            <p style="color: var(--primary-color); font-weight: 600;">
                                ✓ ไฟล์ PDF: ${file.name}
                            </p>
                        `;
                    }
                    imagePreview.classList.add('show');
                };
                
                reader.readAsDataURL(file);
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
                    html: 'กรุณารอสักครู่ (อาจใช้เวลา 10-30 วินาที)',
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
                    logoOption: selectedLogoOption.value,
                    logoFile: logoFileData,
                    slipFile: slipFileData,
                    timestamp: new Date().toISOString()
                };
                
                console.log('Sending data...', {
                    ...formData,
                    logoFile: logoFileData ? 'File attached' : 'No file',
                    slipFile: slipFileData ? 'File attached' : 'No file'
                });
                
                // ส่งข้อมูลไปยัง Google Apps Script
                fetch(GOOGLE_SCRIPT_URL, {
                    method: 'POST',
                    mode: 'no-cors', // สำคัญ! เพื่อหลีกเลี่ยง CORS error
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData)
                })
                .then(() => {
                    // เนื่องจากใช้ no-cors จะไม่ได้ response กลับมา
                    console.log('Data sent successfully (no-cors mode)');
                    
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
                        logoPreview.innerHTML = '';
                        logoPreview.classList.remove('show');
                        slipFileData = null;
                        logoFileData = null;
                        
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
                        html: `
                            <p>ไม่สามารถส่งข้อมูลได้</p>
                            <p style="font-size: 0.9rem; color: #666;">Error: ${error.message}</p>
                            <p style="font-size: 0.9rem; margin-top: 1rem;">กรุณาลองใหม่อีกครั้ง หรือติดต่อทีมงาน</p>
                        `,
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
    const formInputs = sponsorForm.querySelectorAll('input:not([type="file"]):not([type="checkbox"]):not([type="radio"]), select, textarea');
    
    formInputs.forEach(input => {
        const savedValue = localStorage.getItem(`kpi_sponsor_${input.id}`);
        if (savedValue && input.value === '') {
            input.value = savedValue;
        }
        
        input.addEventListener('change', function() {
            localStorage.setItem(`kpi_sponsor_${input.id}`, this.value);
        });
    });
    
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