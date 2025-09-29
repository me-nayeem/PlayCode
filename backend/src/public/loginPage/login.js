        // Toggle password visibility
        function togglePassword() {
            const passwordInput = document.getElementById('password');
            const toggleBtn = document.querySelector('.password-toggle');
            
            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                toggleBtn.innerHTML = '<i class="fa-solid fa-eye-slash"></i>';
            } else {
                passwordInput.type = 'password';
                toggleBtn.innerHTML = '<i class="fa-solid fa-eye"></i>';
            }
        }

        // Toggle remember me checkbox
        function toggleCheckbox() {
            const checkbox = document.getElementById('rememberCheckbox');
            checkbox.classList.toggle('checked');
        }

        // Input field focus effects
        function addInputEffects() {
            const inputFields = document.querySelectorAll('.input-field');
            
            inputFields.forEach(input => {
                input.addEventListener('focus', function() {
                    this.parentElement.style.transform = 'scale(1.02)';
                    this.parentElement.style.transition = 'transform 0.3s ease';
                });
                
                input.addEventListener('blur', function() {
                    this.parentElement.style.transform = 'scale(1)';
                });
            });
        }

        // Keyboard shortcuts
        function addKeyboardShortcuts() {
            document.addEventListener('keydown', function(e) {
                // Enter key submits form
                if (e.key === 'Enter' && (e.target.classList.contains('input-field'))) {
                    e.preventDefault();
                    document.getElementById('loginForm').dispatchEvent(new Event('submit'));
                }
            });
        }

        // Add shake animation for errors
        const shakeKeyframes = `
            @keyframes shake {
                0%, 100% { transform: translateX(0); }
                10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
                20%, 40%, 60%, 80% { transform: translateX(5px); }
            }
            
            @keyframes fadeIn {
                from { opacity: 0; transform: translateY(10px); }
                to { opacity: 1; transform: translateY(0); }
            }
        `;

        document.addEventListener('DOMContentLoaded', function() {
            const style = document.createElement('style');
            style.textContent = shakeKeyframes;
            document.head.appendChild(style);
            addInputEffects();
            addKeyboardShortcuts();
            document.getElementById('loginForm').addEventListener('submit', handleLogin);
            document.getElementById('email').focus();
    
            // Add card entrance animation
            const loginCard = document.querySelector('.login-card');
            loginCard.style.opacity = '0';
            loginCard.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                loginCard.style.transition = 'all 0.6s ease-out';
                loginCard.style.opacity = '1';
                loginCard.style.transform = 'translateY(0)';
            }, 200);
        });


        window.addEventListener("scroll", () => {
  const navbar = document.querySelector(".navbar");
  if (window.scrollY > 50) {
    navbar.style.background = "transparent";
  } else {
    navbar.style.background = "rgba(26, 26, 26, 0.95)";
  }
});
