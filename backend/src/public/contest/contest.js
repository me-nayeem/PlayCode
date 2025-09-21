      class ContestPage {
        constructor() {
          this.searchInput = document.querySelector('.search-input');
          this.filterSelects = document.querySelectorAll('.filter-select');
          this.viewButtons = document.querySelectorAll('.view-btn');

          this.initializeEventListeners();
          this.startCountdowns();
          this.setupSearch();
        }

        initializeEventListeners() {
          // Search functionality
          this.searchInput.addEventListener('input', (e) => {
            this.filterContests(e.target.value);
          });

          // Filter dropdowns
          this.filterSelects.forEach(select => {
            select.addEventListener('change', () => {
              this.applyFilters();
            });
          });

          // View toggle buttons
          this.viewButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
              this.toggleView(e.target);
            });
          });

          // Contest card interactions
          this.setupContestCardInteractions();
        }

        filterContests(searchTerm) {
          const contestCards = document.querySelectorAll('.contest-card');
          const lowercaseSearch = searchTerm.toLowerCase();

          contestCards.forEach(card => {
            const contestName = card.querySelector('.contest-name').textContent.toLowerCase();
            const contestType = card.querySelector('.contest-type').textContent.toLowerCase();

            const matches = contestName.includes(lowercaseSearch) ||
              contestType.includes(lowercaseSearch);

            if (matches || searchTerm === '') {
              card.style.display = 'block';
              card.style.animation = 'slideIn 0.3s ease-out';
            } else {
              card.style.display = 'none';
            }
          });

          this.updateSectionCounts();
        }

        applyFilters() {
          const typeFilter = this.filterSelects[0].value;
          const difficultyFilter = this.filterSelects[1].value;
          const contestCards = document.querySelectorAll('.contest-card');

          contestCards.forEach(card => {
            let showCard = true;

            // Type filter
            if (typeFilter !== 'all') {
              const cardType = card.querySelector('.contest-type').textContent.toLowerCase();
              if (!cardType.includes(typeFilter)) {
                showCard = false;
              }
            }

            // Difficulty filter (based on star rating)
            if (difficultyFilter !== 'all' && showCard) {
              const stars = card.querySelector('.stat-value').textContent;
              const starCount = stars.includes('★') ? stars.length : 0;

              const difficultyMap = {
                'beginner': 1,
                'intermediate': 2,
                'advanced': 3,
                'expert': 4
              };

              if (starCount !== difficultyMap[difficultyFilter]) {
                showCard = false;
              }
            }

            card.style.display = showCard ? 'block' : 'none';
          });

          this.updateSectionCounts();
        }

        updateSectionCounts() {
          const sections = document.querySelectorAll('.section');

          sections.forEach(section => {
            const visibleCards = section.querySelectorAll('.contest-card[style*="display: block"], .contest-card:not([style*="display: none"])');
            const countElement = section.querySelector('.section-count');
            if (countElement) {
              countElement.textContent = visibleCards.length;
            }
          });
        }

        toggleView(clickedButton) {
          this.viewButtons.forEach(btn => btn.classList.remove('active'));
          clickedButton.classList.add('active');

          const contestGrids = document.querySelectorAll('.contest-grid');

          if (clickedButton.textContent === '📊') {
            // Switch to table view (simplified for demo)
            contestGrids.forEach(grid => {
              grid.style.gridTemplateColumns = '1fr';
            });
            this.showNotification('Table view activated', 'info');
          } else {
            // Switch to card view
            contestGrids.forEach(grid => {
              grid.style.gridTemplateColumns = 'repeat(auto-fit, minmax(400px, 1fr))';
            });
            this.showNotification('Card view activated', 'info');
          }
        }

        setupContestCardInteractions() {
          const contestCards = document.querySelectorAll('.contest-card');

          contestCards.forEach(card => {
            // Add hover sound effect (visual feedback)
            card.addEventListener('mouseenter', () => {
              card.style.transform = 'translateY(-6px)';
            });

            card.addEventListener('mouseleave', () => {
              card.style.transform = 'translateY(-4px)';
            });

            // Button interactions
            const buttons = card.querySelectorAll('.contest-btn');
            buttons.forEach(btn => {
              btn.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleContestAction(btn, card);
              });
            });
          });
        }

        handleContestAction(button, card) {
          const action = button.textContent.trim();
          const contestName = card.querySelector('.contest-name').textContent;

          switch (action) {
            case 'Join Battle':
              this.joinContest(contestName);
              break;
            case 'Register Now':
              this.registerForContest(contestName);
              break;
            case 'Set Reminder':
              this.setReminder(contestName);
              break;
            case 'View Problems':
            case 'View Solutions':
            case 'Practice':
              this.viewContent(action, contestName);
              break;
          }
        }

        joinContest(contestName) {
          this.showNotification(`🚀 Joining ${contestName}...`, 'success');

          // Simulate joining process
          setTimeout(() => {
            this.showNotification('🎮 Ready to battle! Good luck!', 'success');
            // In real app: redirect to contest page
          }, 1500);
        }

        registerForContest(contestName) {
          this.showNotification(`📝 Registering for ${contestName}...`, 'info');

          setTimeout(() => {
            this.showNotification('✅ Registration successful! Reminder set.', 'success');

            // Update button to show registered state
            const card = event.target.closest('.contest-card');
            event.target.textContent = '✓ Registered';
            event.target.classList.remove('btn-primary');
            event.target.classList.add('btn-disabled');
          }, 1000);
        }

        setReminder(contestName) {
          if ('Notification' in window) {
            Notification.requestPermission().then(permission => {
              if (permission === 'granted') {
                this.showNotification('🔔 Reminder set! You\'ll be notified.', 'success');
              } else {
                this.showNotification('⚠️ Please enable notifications for reminders.', 'warning');
              }
            });
          } else {
            this.showNotification('📅 Reminder added to your calendar!', 'info');
          }
        }

        viewContent(action, contestName) {
          this.showNotification(`📖 Loading ${action.toLowerCase()}...`, 'info');
          // In real app: navigate to appropriate page
        }

        startCountdowns() {
          const countdowns = document.querySelectorAll('.countdown');

          countdowns.forEach(countdown => {
            this.updateCountdown(countdown);
            setInterval(() => {
              this.updateCountdown(countdown);
            }, 1000);
          });
        }

        updateCountdown(countdownElement) {
          const items = countdownElement.querySelectorAll('.countdown-item > div:first-child');

          items.forEach((item, index) => {
            let currentValue = parseInt(item.textContent);

            if (index === items.length - 1) { // Seconds
              currentValue = currentValue > 0 ? currentValue - 1 : 59;
              item.textContent = currentValue.toString().padStart(2, '0');

              if (currentValue === 0 && index > 0) {
                // Decrease the previous unit (minutes/hours/days)
                const prevItem = items[index - 1];
                let prevValue = parseInt(prevItem.textContent);
                if (prevValue > 0) {
                  prevItem.textContent = (prevValue - 1).toString().padStart(2, '0');
                }
              }
            }
          });
        }

        setupSearch() {
          // Add search suggestions
          this.searchInput.addEventListener('focus', () => {
            this.showSearchSuggestions();
          });

          this.searchInput.addEventListener('blur', () => {
            setTimeout(() => {
              this.hideSearchSuggestions();
            }, 200);
          });
        }

        showSearchSuggestions() {
          let suggestions = document.getElementById('search-suggestions');
          if (!suggestions) {
            suggestions = document.createElement('div');
            suggestions.id = 'search-suggestions';
            suggestions.style.cssText = `
                        position: absolute;
                        top: 100%;
                        left: 0;
                        right: 0;
                        background: var(--secondary-bg);
                        border: 1px solid var(--border-color);
                        border-radius: 0 0 8px 8px;
                        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
                        z-index: 1000;
                        max-height: 200px;
                        overflow-y: auto;
                    `;

            const suggestionsData = [
              '🔍 weekly challenge',
              '🔍 algorithm arena',
              '🔍 beginner contest',
              '🔍 data structure',
              '🔍 official contests'
            ];

            suggestionsData.forEach(suggestion => {
              const item = document.createElement('div');
              item.textContent = suggestion;
              item.style.cssText = `
                            padding: 0.8rem 1rem;
                            cursor: pointer;
                            border-bottom: 1px solid var(--border-color);
                            transition: background 0.2s ease;
                        `;

              item.addEventListener('mouseenter', () => {
                item.style.background = 'var(--hover-bg)';
              });

              item.addEventListener('mouseleave', () => {
                item.style.background = 'transparent';
              });

              item.addEventListener('click', () => {
                this.searchInput.value = suggestion.replace('🔍 ', '');
                this.filterContests(this.searchInput.value);
                this.hideSearchSuggestions();
              });

              suggestions.appendChild(item);
            });

            this.searchInput.parentElement.style.position = 'relative';
            this.searchInput.parentElement.appendChild(suggestions);
          }

          suggestions.style.display = 'block';
        }

        hideSearchSuggestions() {
          const suggestions = document.getElementById('search-suggestions');
          if (suggestions) {
            suggestions.style.display = 'none';
          }
        }

        showNotification(message, type = 'info', duration = 3000) {
          const notification = document.createElement('div');
          notification.className = `notification notification-${type}`;
          notification.textContent = message;
          notification.style.cssText = `
                    position: fixed;
                    top: 100px;
                    right: 20px;
                    padding: 1rem 1.5rem;
                    border-radius: 8px;
                    color: white;
                    font-weight: 600;
                    z-index: 10000;
                    animation: slideInRight 0.3s ease-out;
                    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
                    font-family: 'Rajdhani', sans-serif;
                `;

          const colors = {
            'success': 'var(--success)',
            'error': 'var(--danger)',
            'info': 'var(--accent-secondary)',
            'warning': 'var(--warning)'
          };
          notification.style.background = colors[type] || colors.info;

          document.body.appendChild(notification);

          setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease-in forwards';
            setTimeout(() => notification.remove(), 300);
          }, duration);
        }
      }

      // Additional CSS animations
      const additionalCSS = `
            @keyframes slideInRight {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            
            @keyframes slideOutRight {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
        `;

      // Initialize when DOM is loaded
      document.addEventListener('DOMContentLoaded', () => {
        const styleSheet = document.createElement('style');
        styleSheet.textContent = additionalCSS;
        document.head.appendChild(styleSheet);

        window.contestPage = new ContestPage();
        console.log('🎮 PlayCode Contest Page initialized!');
      });


      window.addEventListener("scroll", () => {
  const navbar = document.querySelector(".navbar");
  if (window.scrollY > 50) {
    navbar.style.background = "transparent";
  } else {
    navbar.style.background = "rgba(26, 26, 26, 0.95)";
  }
});
