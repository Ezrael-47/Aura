document.addEventListener('DOMContentLoaded', () => {
    const tiltCard = document.getElementById('tilt-card');
    const htmlElement = document.documentElement;

    // ============================================
    // ۱. مدیریت تغییر فرم‌ها (ورود و ثبت‌نام)
    // ============================================
    const signupForm = document.getElementById('signup-form');
    const loginForm = document.getElementById('login-form');
    const goToLogin = document.getElementById('go-to-login');
    const goToSignup = document.getElementById('go-to-signup');

    function switchForm(hideForm, showForm) {
        hideForm.classList.remove('active');
        setTimeout(() => {
            hideForm.style.display = 'none';
            showForm.style.display = 'block';
            void showForm.offsetWidth;
            showForm.classList.add('active');
        }, 200);
    }

    goToLogin.addEventListener('click', (e) => { e.preventDefault(); switchForm(signupForm, loginForm); });
    goToSignup.addEventListener('click', (e) => { e.preventDefault(); switchForm(loginForm, signupForm); });

    // ============================================
    // ۲. تغییر تم روشن / تاریک
    // ============================================
    const themeToggle = document.getElementById('theme-toggle');
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        htmlElement.setAttribute('data-theme', 'light');
        themeToggle.textContent = '☀️';
    }

    themeToggle.addEventListener('click', () => {
        if (htmlElement.hasAttribute('data-theme')) {
            htmlElement.removeAttribute('data-theme');
            themeToggle.textContent = '🌙';
            localStorage.setItem('theme', 'dark');
        } else {
            htmlElement.setAttribute('data-theme', 'light');
            themeToggle.textContent = '☀️';
            localStorage.setItem('theme', 'light');
        }
    });

    // ============================================
    // ۳. تب‌های ایمیل / موبایل
    // ============================================
    const tabs = document.querySelectorAll('.tab');
    const emailGroup = document.getElementById('email-input-group');
    const mobileGroup = document.getElementById('mobile-input-group');
    const loginEmail = document.getElementById('login-email');
    const loginMobile = document.getElementById('login-mobile');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            if (tab.dataset.target === 'email') {
                emailGroup.style.display = 'block';
                mobileGroup.style.display = 'none';
                loginEmail.required = true;
                loginMobile.required = false;
            } else {
                emailGroup.style.display = 'none';
                mobileGroup.style.display = 'block';
                loginEmail.required = false;
                loginMobile.required = true;
            }
        });
    });

    // ============================================
    // ۴. نمایش/مخفی رمز عبور
    // ============================================
    window.togglePassword = function(inputId, iconElement) {
        const input = document.getElementById(inputId);
        if (input.type === 'password') {
            input.type = 'text';
            iconElement.style.opacity = '1';
            iconElement.innerHTML = '🙈';
        } else {
            input.type = 'password';
            iconElement.style.opacity = '0.5';
            iconElement.innerHTML = '👁';
        }
    };

    // ============================================
    // ۵. نشانگر قدرت رمز عبور
    // ============================================
    const passwordInput = document.getElementById('signup-password');
    const strengthMeter = document.getElementById('strength-meter');
    const strengthText = strengthMeter.querySelector('.strength-text span');

    if (passwordInput) {
        passwordInput.addEventListener('input', function() {
            const val = this.value;
            strengthMeter.classList.add('active');
            strengthMeter.classList.remove('strength-weak', 'strength-medium', 'strength-strong');

            if (val.length === 0) {
                strengthMeter.classList.remove('active');
                return;
            }

            let strength = 0;
            if (val.length >= 6) strength++;
            if (val.match(/[a-z]/) && val.match(/[A-Z]/)) strength++;
            if (val.match(/\d/)) strength++;
            if (val.match(/[^a-zA-Z\d]/)) strength++;

            if (strength <= 1) {
                strengthMeter.classList.add('strength-weak');
                strengthText.textContent = 'ضعیف';
            } else if (strength === 2 || strength === 3) {
                strengthMeter.classList.add('strength-medium');
                strengthText.textContent = 'متوسط';
            } else {
                strengthMeter.classList.add('strength-strong');
                strengthText.textContent = 'قوی';
            }
        });
    }

    // ============================================
    // ۶. Toast Notification (پیام زیبا)
    // ============================================
    const toastContainer = document.getElementById('toast-container');

    function showToast(message, type = 'info', duration = 3000) {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        const icons = { success: '✓', error: '✕', info: 'ℹ' };
        
        toast.innerHTML = `
            <div class="toast-icon">${icons[type] || 'ℹ'}</div>
            <div>${message}</div>
        `;
        
        toastContainer.appendChild(toast);
        
        // انیمیشن ورود
        requestAnimationFrame(() => {
            setTimeout(() => toast.classList.add('show'), 10);
        });

        // حذف بعد از مدت زمان
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 400);
        }, duration);
    }

    window.showToast = showToast;

    // ============================================
    // ۷. انفجار کاغذرنگی (Confetti)
    // ============================================
    const confettiContainer = document.getElementById('confetti-container');
    const confettiColors = ['#6c5ce7', '#a29bfe', '#fd79a8', '#74b9ff', '#ffeaa7', '#55efc4', '#fab1a0'];

    function launchConfetti(count = 120) {
        const shapes = ['square', 'circle', 'triangle'];
        
        for (let i = 0; i < count; i++) {
            const piece = document.createElement('div');
            const shape = shapes[Math.floor(Math.random() * shapes.length)];
            const color = confettiColors[Math.floor(Math.random() * confettiColors.length)];
            const startX = Math.random() * 100;
            const drift = (Math.random() - 0.5) * 400;
            const duration = 2.5 + Math.random() * 2;
            const delay = Math.random() * 0.5;
            const size = 6 + Math.random() * 8;
            
            piece.className = `confetti-piece ${shape}`;
            piece.style.left = startX + 'vw';
            piece.style.background = color;
            piece.style.width = size + 'px';
            piece.style.height = size + 'px';
            piece.style.setProperty('--drift', drift + 'px');
            piece.style.animation = `confettiFall ${duration}s ease-in ${delay}s forwards`;
            
            if (shape === 'triangle') {
                piece.style.borderBottomColor = color;
                piece.style.background = 'transparent';
            }
            
            confettiContainer.appendChild(piece);
            
            setTimeout(() => piece.remove(), (duration + delay) * 1000 + 500);
        }
    }

    // ============================================
    // ۸. افکت Tilt سه‌بعدی (کارت به سمت موس می‌چرخد)
    // ============================================
    if (tiltCard && window.innerWidth > 850) {
        const maxTilt = 5; // حداکثر درجه چرخش

        tiltCard.addEventListener('mousemove', (e) => {
            const rect = tiltCard.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            
            const mouseX = e.clientX - centerX;
            const mouseY = e.clientY - centerY;
            
            const rotateY = (mouseX / (rect.width / 2)) * maxTilt;
            const rotateX = -(mouseY / (rect.height / 2)) * maxTilt;
            
            tiltCard.style.transform = `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });

        tiltCard.addEventListener('mouseleave', () => {
            tiltCard.style.transform = 'perspective(1200px) rotateX(0) rotateY(0)';
        });
    }

    // ============================================
    // ۹. دکمه مغناطیسی (به سمت موس کشیده می‌شود)
    // ============================================
    const magneticButtons = document.querySelectorAll('.magnetic');
    
    magneticButtons.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            
            const moveX = (e.clientX - centerX) * 0.25;
            const moveY = (e.clientY - centerY) * 0.25;
            
            btn.style.transform = `translate(${moveX}px, ${moveY}px)`;
        });

        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'translate(0, 0)';
        });
    });

    // ============================================
    // ۱۰. لرزش فرم هنگام خطا
    // ============================================
    function shakeElement(element) {
        element.classList.add('shake');
        setTimeout(() => element.classList.remove('shake'), 500);
    }

    function markError(inputGroup) {
        inputGroup.classList.add('error');
        setTimeout(() => inputGroup.classList.remove('error'), 2000);
    }

    // ============================================
    // ۱۱. مدیریت ارسال فرم‌ها
    // ============================================
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const btn = this.querySelector('.submit-btn');
            const isSignup = this.id === 'actual-signup-form';
            
            // اعتبارسنجی
            let isValid = true;
            const requiredInputs = this.querySelectorAll('input[required]');
            
            requiredInputs.forEach(input => {
                const group = input.closest('.input-group');
                if (!input.value.trim()) {
                    isValid = false;
                    markError(group);
                }
                
                // اعتبارسنجی ایمیل
                if (input.type === 'email' && input.value && !input.value.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
                    isValid = false;
                    markError(group);
                }
            });
            
            // بررسی چک‌باکس قوانین
            if (isSignup) {
                const terms = document.getElementById('terms');
                if (!terms.checked) {
                    isValid = false;
                    shakeElement(terms.closest('.checkbox-group'));
                    showToast('لطفاً قوانین و مقررات را بپذیرید', 'error');
                }
            }
            
            if (!isValid) {
                shakeElement(this);
                showToast('لطفاً اطلاعات را به درستی پر کنید', 'error');
                return;
            }
            
            // شروع لودینگ
            btn.classList.add('loading');
            
            // شبیه‌سازی درخواست به سرور
            setTimeout(() => {
                btn.classList.remove('loading');
                
                if (isSignup) {
                    showToast('حساب کاربری با موفقیت ساخته شد! 🎉', 'success', 4000);
                    launchConfetti(150);
                    this.reset();
                    strengthMeter.classList.remove('active');
                } else {
                    showToast('خوش آمدید! در حال انتقال...', 'success');
                }
            }, 2000);
        });
    });

    // ============================================
    // ۱۲. حذف خطا هنگام تایپ
    // ============================================
    document.querySelectorAll('.input-group input').forEach(input => {
        input.addEventListener('input', () => {
            input.closest('.input-group').classList.remove('error');
        });
    });

    // پیام خوش‌آمد اولیه
    setTimeout(() => {
        showToast('به AMU خوش آمدید! 👋', 'info', 2500);
    }, 1500);
});