        function generateCalendar() {
            const calendar = document.getElementById('calendar');
            const today = new Date();
            const currentMonth = today.getMonth();
            const currentYear = today.getFullYear();
            const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
            const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
            
            const dayHeaders = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
            dayHeaders.forEach(day => {
                const dayHeader = document.createElement('div');
                dayHeader.textContent = day;
                dayHeader.style.fontWeight = '600';
                dayHeader.style.color = 'var(--text-secondary)';
                calendar.appendChild(dayHeader);
            });
            for (let i = 0; i < firstDayOfMonth; i++) {
                const emptyDay = document.createElement('div');
                emptyDay.className = 'calendar-day';
                calendar.appendChild(emptyDay);
            }
            for (let day = 1; day <= daysInMonth; day++) {
                const dayElement = document.createElement('div');
                dayElement.className = 'calendar-day';
                dayElement.textContent = day;
                
                if (day === today.getDate()) {
                    dayElement.classList.add('today');
                }
                
                if (Math.random() > 0.7) {
                    dayElement.classList.add('has-problems');
                }
                
                calendar.appendChild(dayElement);
            }
        }

        // Filter functionality
        const searchInput = document.getElementById('searchInput');
        const topicFilter = document.getElementById('topicFilter');
        const statusFilter = document.getElementById('statusFilter');
        const difficultyButtons = document.querySelectorAll('.difficulty-btn');
        const problemItems = document.querySelectorAll('.problem-item');

        function filterProblems() {
            const searchTerm = searchInput.value.toLowerCase();
            const selectedTopic = topicFilter.value;
            const selectedStatus = statusFilter.value;
            const activeDifficulties = Array.from(difficultyButtons)
                .filter(btn => btn.classList.contains('active'))
                .map(btn => btn.getAttribute('data-difficulty'));

            problemItems.forEach(item => {
                const title = item.querySelector('.problem-title').textContent.toLowerCase();
                const topic = item.getAttribute('data-topic');
                const status = item.getAttribute('data-status');
                const difficulty = item.getAttribute('data-difficulty');

                const matchesSearch = title.includes(searchTerm);
                const matchesTopic = !selectedTopic || topic === selectedTopic;
                const matchesStatus = !selectedStatus || status === selectedStatus;
                const matchesDifficulty = activeDifficulties.includes(difficulty);

                if (matchesSearch && matchesTopic && matchesStatus && matchesDifficulty) {
                    item.style.display = 'grid';
                } else {
                    item.style.display = 'none';
                }
            });
        }

        // Event listeners for filtering
        searchInput.addEventListener('input', filterProblems);
        topicFilter.addEventListener('change', filterProblems);
        statusFilter.addEventListener('change', filterProblems);

        // Difficulty filter buttons
        difficultyButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                btn.classList.toggle('active');
                filterProblems();
            });
        });

        // Topic selection from sidebar
        document.querySelectorAll('.topic-item').forEach(item => {
            item.addEventListener('click', () => {
                const topic = item.getAttribute('data-topic');
                topicFilter.value = topic;
                filterProblems();
                document.querySelectorAll('.topic-item').forEach(t => t.style.background = 'var(--card-bg)');
                item.style.background = 'var(--hover-bg)';
            });
        });

        // Battle button animations
        document.querySelectorAll('.battle-btn').forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                const ripple = document.createElement('span');
                const rect = this.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;
                
                ripple.style.cssText = `
                    position: absolute;
                    border-radius: 50%;
                    background: rgba(255, 255, 255, 0.3);
                    transform: scale(0);
                    animation: ripple 0.6s linear;
                    left: ${x}px;
                    top: ${y}px;
                    width: ${size}px;
                    height: ${size}px;
                `;
                
                this.style.position = 'relative';
                this.style.overflow = 'hidden';
                this.appendChild(ripple);
                
                setTimeout(() => {
                    ripple.remove();
                }, 600);
                
                // Simulate navigation to battle
                setTimeout(() => {
                    alert('🎮 Initiating battle mode... Find an opponent!');
                }, 200);
            });
        });

        // Problem item click handler
        document.querySelectorAll('.problem-item').forEach(item => {
            item.addEventListener('click', function(e) {
                if (!e.target.classList.contains('battle-btn')) {
                    const title = this.querySelector('.problem-title').textContent;
                    // Simulate navigation to problem page
                    console.log(`Navigating to problem: ${title}`);
                }
            });
        });

        // Smooth scroll animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in');
                }
            });
        }, observerOptions);

        document.querySelectorAll('.fade-in').forEach(el => {
            observer.observe(el);
        });

        generateCalendar();

        const style = document.createElement('style');
        style.textContent = `
            @keyframes ripple {
                to {
                    transform: scale(4);
                    opacity: 0;
                }
            }
            
            .problem-item:hover .problem-title {
                color: var(--accent-color);
            }
            
            .calendar-day:hover {
                transform: scale(1.1);
            }
            
            .stat-card:nth-child(1) .stat-number { color: var(--accent-color); }
            .stat-card:nth-child(2) .stat-number { color: var(--easy-color); }
            .stat-card:nth-child(3) .stat-number { color: var(--medium-color); }
            .stat-card:nth-child(4) .stat-number { color: var(--accent-secondary); }
        `;
        document.head.appendChild(style);

        window.addEventListener('scroll', () => {
            const navbar = document.querySelector('.navbar');
            if (window.scrollY > 50) {
                navbar.style.background = 'rgba(26, 26, 26, 0.98)';
            } else {
                navbar.style.background = 'rgba(26, 26, 26, 0.95)';
            }
        });

        // loading animation for problem items
        let loadDelay = 0;
        problemItems.forEach(item => {
            item.style.opacity = '0';
            item.style.transform = 'translateX(-20px)';
            setTimeout(() => {
                item.style.transition = 'all 0.5s ease-out';
                item.style.opacity = '1';
                item.style.transform = 'translateX(0)';
            }, loadDelay);
            loadDelay += 100;
        });

        // hover effects for better UX
        document.querySelectorAll('.problem-item').forEach(item => {
            item.addEventListener('mouseenter', function() {
                this.style.borderLeft = '4px solid var(--accent-color)';
                this.style.paddingLeft = 'calc(1.5rem - 4px)';
            });
            
            item.addEventListener('mouseleave', function() {
                this.style.borderLeft = 'none';
                this.style.paddingLeft = '1.5rem';
            });
        });

        window.addEventListener("scroll", () => {
  const navbar = document.querySelector(".navbar");
  if (window.scrollY > 50) {
    navbar.style.background = "transparent";
  } else {
    navbar.style.background = "rgba(26, 26, 26, 0.95)";
  }
});
