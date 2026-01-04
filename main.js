// 四川沁科科技有限公司官网主要交互逻辑

document.addEventListener('DOMContentLoaded', function() {
    // 初始化所有功能
    initScrollEffects();
    initNavigation();
    initContactForm();
    initBackToTop();
    initImageCarousel();
    initMobileMenu();
});

// 滚动效果初始化
function initScrollEffects() {
    // 滚动动画
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // 数字动画
                if (entry.target.classList.contains('stat-number')) {
                    animateNumber(entry.target);
                }
            }
        });
    }, observerOptions);

    // 观察所有需要动画的元素
    document.querySelectorAll('.fade-in, .stat-number').forEach(el => {
        observer.observe(el);
    });

    // 导航栏滚动效果
    let lastScrollTop = 0;
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const navbar = document.querySelector('.navbar');
        
        if (scrollTop > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        lastScrollTop = scrollTop;
    });
}

// 数字动画函数
function animateNumber(element) {
    const target = parseInt(element.dataset.target);
    const duration = 1500;
    const start = performance.now();
    
    function update(currentTime) {
        const elapsed = currentTime - start;
        const progress = Math.min(elapsed / duration, 1);
        
        // 使用缓动函数
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const current = Math.floor(easeOutQuart * target);
        
        element.textContent = current;
        
        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            element.textContent = target;
        }
    }
    
    requestAnimationFrame(update);
}

// 导航功能初始化
function initNavigation() {
    // 平滑滚动
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 80; // 考虑导航栏高度
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
                
                // 更新活动状态
                updateActiveNavLink(this);
            }
        });
    });

    // 滚动监听
    window.addEventListener('scroll', function() {
        updateActiveNavOnScroll();
    });
}

// 更新导航链接活动状态
function updateActiveNavLink(activeLink) {
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    activeLink.classList.add('active');
}

// 根据滚动位置更新导航活动状态
function updateActiveNavOnScroll() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.clientHeight;
        if (window.pageYOffset >= sectionTop && 
            window.pageYOffset < sectionTop + sectionHeight) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + current) {
            link.classList.add('active');
        }
    });
}

// 联系表单初始化
function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (validateForm()) {
            submitForm();
        }
    });

    // 实时验证
    const inputs = form.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            if (this.classList.contains('error')) {
                validateField(this);
            }
        });
    });
}

// 表单验证
function validateForm() {
    const form = document.getElementById('contact-form');
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;

    requiredFields.forEach(field => {
        if (!validateField(field)) {
            isValid = false;
        }
    });

    return isValid;
}

// 单个字段验证
function validateField(field) {
    const value = field.value.trim();
    const fieldName = field.name;
    let isValid = true;
    let errorMessage = '';

    // 必填验证
    if (field.required && !value) {
        isValid = false;
        errorMessage = '此字段为必填项';
    }

    // 特定字段验证
    if (value) {
        switch (fieldName) {
            case 'name':
                if (value.length < 2) {
                    isValid = false;
                    errorMessage = '姓名至少需要2个字符';
                }
                break;
            
            case 'phone':
                const phoneRegex = /^1[3-9]\d{9}$/;
                if (!phoneRegex.test(value)) {
                    isValid = false;
                    errorMessage = '请输入正确的手机号码';
                }
                break;
            
            case 'email':
                if (field.required || value) {
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailRegex.test(value)) {
                        isValid = false;
                        errorMessage = '请输入正确的邮箱地址';
                    }
                }
                break;
            
            case 'message':
                if (value.length < 10) {
                    isValid = false;
                    errorMessage = '咨询内容至少需要10个字符';
                }
                break;
        }
    }

    // 显示错误信息
    showFieldError(field, isValid, errorMessage);
    return isValid;
}

// 显示字段错误
function showFieldError(field, isValid, errorMessage) {
    const errorDiv = field.parentNode.querySelector('.error-message');
    
    if (isValid) {
        field.classList.remove('error');
        if (errorDiv) {
            errorDiv.textContent = '';
            errorDiv.classList.add('hidden');
        }
    } else {
        field.classList.add('error');
        if (errorDiv) {
            errorDiv.textContent = errorMessage;
            errorDiv.classList.remove('hidden');
        }
    }
}

// 提交表单
function submitForm() {
    const form = document.getElementById('contact-form');
    const submitBtn = form.querySelector('button[type="submit"]');
    const successDiv = document.getElementById('form-success');
    const errorDiv = document.getElementById('form-error');
    
    // 显示提交状态
    submitBtn.disabled = true;
    submitBtn.textContent = '提交中...';
    
    // 模拟提交（实际项目中应该发送到服务器）
    setTimeout(() => {
        // 获取表单数据
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        
        console.log('表单提交数据:', data);
        
        // 显示成功消息
        if (successDiv) {
            successDiv.classList.remove('hidden');
            form.reset();
        }
        
        // 恢复按钮状态
        submitBtn.disabled = false;
        submitBtn.textContent = '提交咨询';
        
        // 3秒后隐藏成功消息
        setTimeout(() => {
            if (successDiv) {
                successDiv.classList.add('hidden');
            }
        }, 5000);
        
    }, 1500);
}

// 返回顶部按钮初始化
function initBackToTop() {
    const backToTopBtn = document.getElementById('back-to-top');
    if (!backToTopBtn) return;

    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            backToTopBtn.classList.remove('hidden');
        } else {
            backToTopBtn.classList.add('hidden');
        }
    });

    backToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// 图片轮播初始化
function initImageCarousel() {
    const carousel = document.getElementById('internship-gallery');
    if (!carousel) return;

    new Splide(carousel, {
        type: 'loop',
        perPage: 3,
        perMove: 1,
        gap: '1rem',
        autoplay: true,
        interval: 3000,
        pauseOnHover: true,
        breakpoints: {
            1024: {
                perPage: 2,
            },
            640: {
                perPage: 1,
            }
        }
    }).mount();
}

// 移动端菜单初始化
function initMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (!mobileMenuBtn || !mobileMenu) return;

    mobileMenuBtn.addEventListener('click', function() {
        mobileMenu.classList.toggle('hidden');
    });

    // 点击菜单项后关闭菜单
    mobileMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', function() {
            mobileMenu.classList.add('hidden');
        });
    });

    // 点击外部关闭菜单
    document.addEventListener('click', function(e) {
        if (!mobileMenuBtn.contains(e.target) && !mobileMenu.contains(e.target)) {
            mobileMenu.classList.add('hidden');
        }
    });
}

// 工具函数

// 防抖函数
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// 节流函数
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// 检查元素是否在视口中
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// 获取URL参数
function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    const regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    const results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

// 显示通知消息
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 ${
        type === 'success' ? 'bg-green-500' : 
        type === 'error' ? 'bg-red-500' : 
        type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
    } text-white`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // 3秒后自动移除
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// 页面加载完成后的初始化
document.addEventListener('DOMContentLoaded', function() {
    // 检查是否有跳转锚点
    const hash = window.location.hash;
    if (hash) {
        setTimeout(() => {
            const targetElement = document.querySelector(hash);
            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        }, 100);
    }
    
    // 检查是否有通知消息
    const notification = getUrlParameter('notification');
    const notificationType = getUrlParameter('type') || 'info';
    if (notification) {
        setTimeout(() => {
            showNotification(notification, notificationType);
        }, 500);
    }
});

// 导出函数供其他脚本使用
window.QinkeTech = {
    showNotification,
    debounce,
    throttle,
    isInViewport,
    getUrlParameter
};