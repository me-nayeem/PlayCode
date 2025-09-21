class PlayCodePlatform {
        constructor() {
          this.currentLanguage = "python";
          this.activeTab = "description";
          this.activeConsoleTab = "output";
          this.isRunning = false;
          this.isSubmitting = false;
          this.timer = { minutes: 25, seconds: 34 };
          this.userXP = 15742;
          this.hintsVisible = false;
          this.fullscreenMode = false;

          // Code templates for different languages
          this.codeTemplates = {
            python: `def twoSum(nums, target):
    # Write your solution here
    # Hint: Consider using a hash map for O(n) solution
    hashmap = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in hashmap:
            return [hashmap[complement], i]
        hashmap[num] = i
    return []`,

            javascript: `/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
var twoSum = function(nums, target) {
    // Write your solution here
    const hashmap = new Map();
    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];
        if (hashmap.has(complement)) {
            return [hashmap.get(complement), i];
        }
        hashmap.set(nums[i], i);
    }
    return [];
};`,

            java: `class Solution {
    public int[] twoSum(int[] nums, int target) {
        // Write your solution here
        Map<Integer, Integer> hashmap = new HashMap<>();
        for (int i = 0; i < nums.length; i++) {
            int complement = target - nums[i];
            if (hashmap.containsKey(complement)) {
                return new int[]{hashmap.get(complement), i};
            }
            hashmap.put(nums[i], i);
        }
        return new int[]{};
    }
}`,

            cpp: `class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        // Write your solution here
        unordered_map<int, int> hashmap;
        for (int i = 0; i < nums.size(); i++) {
            int complement = target - nums[i];
            if (hashmap.find(complement) != hashmap.end()) {
                return {hashmap[complement], i};
            }
            hashmap[nums[i]] = i;
        }
        return {};
    }
};`,

            c: `/**
 * Note: The returned array must be malloced, assume caller calls free().
 */
int* twoSum(int* nums, int numsSize, int target, int* returnSize){
    // Write your solution here
    *returnSize = 2;
    int* result = (int*)malloc(2 * sizeof(int));
    
    for (int i = 0; i < numsSize - 1; i++) {
        for (int j = i + 1; j < numsSize; j++) {
            if (nums[i] + nums[j] == target) {
                result[0] = i;
                result[1] = j;
                return result;
            }
        }
    }
    return result;
}`,

            go: `func twoSum(nums []int, target int) []int {
    // Write your solution here
    hashmap := make(map[int]int)
    for i, num := range nums {
        complement := target - num
        if j, exists := hashmap[complement]; exists {
            return []int{j, i}
        }
        hashmap[num] = i
    }
    return []int{}
}`,
          };

          // Test cases for validation
          this.testCases = [
            { input: { nums: [2, 7, 11, 15], target: 9 }, expected: [0, 1] },
            { input: { nums: [3, 2, 4], target: 6 }, expected: [1, 2] },
            { input: { nums: [3, 3], target: 6 }, expected: [0, 1] },
            { input: { nums: [1, 2, 3, 4, 5], target: 9 }, expected: [3, 4] },
            {
              input: { nums: [-1, -2, -3, -4, -5], target: -8 },
              expected: [2, 4],
            },
          ];

          this.initializeEventListeners();
          this.startTimer();
          this.setupResizer();
          this.loadSavedCode();
          this.initializeCodeEditor();
        }

        initializeEventListeners() {
          // Language selector
          document.getElementById("language").addEventListener("change", () => {
            this.changeLanguage();
          });

          // Run and Submit buttons
          document.querySelector(".btn-run").addEventListener("click", () => {
            this.runCode();
          });

          document
            .querySelector(".btn-submit")
            .addEventListener("click", () => {
              this.submitCode();
            });

          // Code editor auto-save
          const editor = document.getElementById("codeEditor");
          editor.addEventListener("input", () => {
            this.autoSave();
            this.highlightSyntax();
          });

          // Keyboard shortcuts
          document.addEventListener("keydown", (e) => {
            this.handleKeyboardShortcuts(e);
          });

          // Tab functionality
          document.querySelectorAll(".tab").forEach((tab) => {
            tab.addEventListener("click", (e) => {
              this.switchTab(e.target.textContent.toLowerCase().trim());
            });
          });

          // Console tabs
          document.querySelectorAll(".console-tab").forEach((tab) => {
            tab.addEventListener("click", (e) => {
              this.switchConsoleTab(e.target.textContent.toLowerCase().trim());
            });
          });

          // Floating action buttons
          document.querySelectorAll(".floating-btn").forEach((btn, index) => {
            btn.addEventListener("click", () => {
              switch (index) {
                case 0:
                  this.toggleHints();
                  break;
                case 1:
                  this.shareCode();
                  break;
                case 2:
                  this.toggleFullscreen();
                  break;
              }
            });
          });
        }

        changeLanguage() {
          const newLanguage = document.getElementById("language").value;
          if (newLanguage !== this.currentLanguage) {
            // Show confirmation dialog
            const confirmChange = confirm(
              "Switching language will reset your code. Continue?"
            );
            if (confirmChange) {
              this.currentLanguage = newLanguage;
              document.getElementById("codeEditor").value =
                this.codeTemplates[newLanguage];
              this.highlightSyntax();
              this.showNotification(
                `Switched to ${newLanguage.toUpperCase()}`,
                "info"
              );
            } else {
              // Reset the selector to previous language
              document.getElementById("language").value = this.currentLanguage;
            }
          }
        }

        async runCode() {
          if (this.isRunning) return;

          this.isRunning = true;
          const runBtn = document.querySelector(".btn-run");
          const runText = document.getElementById("runText");

          // Update button state
          runText.innerHTML = '<span class="loading"></span>Running...';
          runBtn.disabled = true;

          // Switch to output tab
          this.switchConsoleTab("output");

          // Simulate code execution
          try {
            const code = document.getElementById("codeEditor").value;
            const result = await this.executeCode(code);
            this.displayOutput(result);

            // Award XP for running code
            this.addXP(5);
          } catch (error) {
            this.displayError(error.message);
          } finally {
            // Reset button state
            setTimeout(() => {
              runText.textContent = "Run Code";
              runBtn.disabled = false;
              this.isRunning = false;
            }, 1000);
          }
        }

        async submitCode() {
          if (this.isSubmitting) return;

          this.isSubmitting = true;
          const submitBtn = document.querySelector(".btn-submit");
          const submitText = document.getElementById("submitText");

          // Update button state
          submitText.innerHTML = '<span class="loading"></span>Submitting...';
          submitBtn.disabled = true;

          try {
            const code = document.getElementById("codeEditor").value;
            const results = await this.runAllTestCases(code);

            if (results.allPassed) {
              this.handleSuccessfulSubmission(results);
            } else {
              this.handleFailedSubmission(results);
            }
          } catch (error) {
            this.displayError(`Submission failed: ${error.message}`);
          } finally {
            // Reset button state
            setTimeout(() => {
              submitText.textContent = "Submit Solution";
              submitBtn.disabled = false;
              this.isSubmitting = false;
            }, 2000);
          }
        }

        async executeCode(code) {
          // Simulate code execution with delay
          await this.delay(1000 + Math.random() * 2000);

          // Basic validation
          if (!code.trim()) {
            throw new Error("Please write some code first!");
          }

          // Simulate running the code with sample input
          const sampleInput = this.testCases[0].input;
          const sampleExpected = this.testCases[0].expected;

          return {
            input: sampleInput,
            output: sampleExpected, // Simulated output
            executionTime: Math.random() * 100 + 50,
            memoryUsage: Math.random() * 20 + 10,
          };
        }

        async runAllTestCases(code) {
          const results = {
            testCases: [],
            allPassed: true,
            passedCount: 0,
            totalCount: this.testCases.length,
            executionTime: 0,
            memoryUsage: 0,
          };

          for (let i = 0; i < this.testCases.length; i++) {
            await this.delay(500); // Simulate execution time

            const testCase = this.testCases[i];
            const passed = Math.random() > 0.2; // 80% pass rate for demo

            const result = {
              id: i + 1,
              input: testCase.input,
              expected: testCase.expected,
              output: passed
                ? testCase.expected
                : [testCase.expected[1], testCase.expected[0]],
              passed: passed,
              executionTime: Math.random() * 100 + 50,
              memoryUsage: Math.random() * 20 + 10,
            };

            results.testCases.push(result);
            if (passed) results.passedCount++;
            else results.allPassed = false;

            results.executionTime += result.executionTime;
            results.memoryUsage = Math.max(
              results.memoryUsage,
              result.memoryUsage
            );
          }

          return results;
        }

        displayOutput(result) {
          const outputDiv = document.getElementById("output");
          outputDiv.innerHTML = `
            <div style="color: var(--success); margin-bottom: 1rem;">
                ✅ Code executed successfully!
            </div>
            <div class="code-block">
                <pre><strong>Input:</strong> nums = [${result.input.nums.join(
                  ", "
                )}], target = ${result.input.target}
<strong>Output:</strong> [${result.output.join(", ")}]
<strong>Execution Time:</strong> ${result.executionTime.toFixed(2)}ms
<strong>Memory Usage:</strong> ${result.memoryUsage.toFixed(1)}MB</pre>
            </div>
            <div style="color: var(--text-secondary); margin-top: 1rem;">
                Great! Your code runs without errors. Ready to submit?
            </div>
        `;
        }

        displayError(message) {
          const outputDiv = document.getElementById("output");
          outputDiv.innerHTML = `
            <div style="color: var(--danger); margin-bottom: 1rem;">
                ❌ Runtime Error
            </div>
            <div class="code-block" style="border-left-color: var(--danger);">
                <pre style="color: var(--danger);">${message}</pre>
            </div>
            <div style="color: var(--text-secondary); margin-top: 1rem;">
                💡 Check your code for syntax errors and try again.
            </div>
        `;
        }

        handleSuccessfulSubmission(results) {
          // Update test cases display
          this.updateTestCasesDisplay(results);

          // Show success message
          this.showNotification(
            "🎉 Accepted! Solution submitted successfully!",
            "success"
          );

          // Award XP
          let xpGained = 150; // Base XP
          if (results.executionTime < 10 * 60 * 1000) xpGained += 50; // Speed bonus
          if (this.isOptimalSolution()) xpGained += 25; // Efficiency bonus

          this.addXP(xpGained);

          // Add to submissions history
          this.addSubmission({
            status: "Accepted",
            language: this.currentLanguage,
            runtime: `${results.executionTime.toFixed(0)}ms`,
            memory: `${results.memoryUsage.toFixed(1)}MB`,
            timestamp: new Date(),
          });

          // Celebration effect
          this.triggerCelebration();
        }

        handleFailedSubmission(results) {
          // Update test cases display
          this.updateTestCasesDisplay(results);

          // Show failure message
          this.showNotification(
            `❌ Wrong Answer (${results.passedCount}/${results.totalCount} passed)`,
            "error"
          );

          // Switch to test cases tab
          this.switchConsoleTab("testcases");

          // Add to submissions history
          this.addSubmission({
            status: `Wrong Answer (${results.passedCount}/${results.totalCount})`,
            language: this.currentLanguage,
            error: `Failed on test case ${results.passedCount + 1}`,
            timestamp: new Date(),
          });
        }

        updateTestCasesDisplay(results) {
          const testCasesDiv = document.getElementById("testcases");
          let html = "";

          results.testCases.forEach((testCase) => {
            const statusClass = testCase.passed ? "passed" : "failed";
            const statusText = testCase.passed ? "Passed" : "Failed";
            const statusBadge = testCase.passed
              ? "status-passed"
              : "status-failed";

            html += `
                <div class="test-case ${statusClass}">
                    <div class="test-case-header">
                        <span class="test-case-title">Test Case ${
                          testCase.id
                        }</span>
                        <span class="test-status ${statusBadge}">${statusText}</span>
                    </div>
                    <div class="code-block">
                        <pre>Input: nums = [${testCase.input.nums.join(
                          ", "
                        )}], target = ${testCase.input.target}
Expected: [${testCase.expected.join(", ")}]
Output: [${testCase.output.join(", ")}]
Runtime: ${testCase.executionTime.toFixed(2)}ms</pre>
                    </div>
                </div>
            `;
          });

          testCasesDiv.innerHTML = html;
        }

        switchTab(tabName) {
          // Remove active class from all tabs and sections
          document
            .querySelectorAll(".tab")
            .forEach((tab) => tab.classList.remove("active"));
          document.querySelectorAll(".problem-section").forEach((section) => {
            section.classList.remove("active");
            section.style.display = "none";
          });

          // Add active class to clicked tab
          document.querySelectorAll(".tab").forEach((tab) => {
            if (tab.textContent.toLowerCase().trim() === tabName) {
              tab.classList.add("active");
            }
          });

          // Show corresponding section
          const sectionMap = {
            description: "description",
            editorial: "editorial",
            discussions: "discussions",
            submissions: "submissions",
          };

          const targetSection = document.getElementById(sectionMap[tabName]);
          if (targetSection) {
            targetSection.classList.add("active");
            targetSection.style.display = "block";
          }

          this.activeTab = tabName;

          // Load dynamic content for some tabs
          if (tabName === "discussions") {
            this.loadDiscussions();
          } else if (tabName === "submissions") {
            this.loadSubmissions();
          }
        }

        switchConsoleTab(tabName) {
          // Remove active class from all console tabs
          document
            .querySelectorAll(".console-tab")
            .forEach((tab) => tab.classList.remove("active"));
          document.querySelectorAll(".console-section").forEach((section) => {
            section.style.display = "none";
          });

          // Add active class to clicked tab
          document.querySelectorAll(".console-tab").forEach((tab) => {
            if (
              tab.textContent.toLowerCase().trim() === tabName.replace(" ", "")
            ) {
              tab.classList.add("active");
            }
          });

          // Show corresponding section
          const sectionMap = {
            output: "output",
            testcases: "testcases",
            "test cases": "testcases",
            debug: "debug",
          };

          const targetSection = document.getElementById(sectionMap[tabName]);
          if (targetSection) {
            targetSection.style.display = "block";
          }

          this.activeConsoleTab = tabName;
        }

        handleKeyboardShortcuts(e) {
          // Ctrl/Cmd + Enter to run code
          if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
            e.preventDefault();
            this.runCode();
          }

          // Ctrl/Cmd + Shift + Enter to submit
          if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === "Enter") {
            e.preventDefault();
            this.submitCode();
          }

          // Ctrl/Cmd + S to save
          if ((e.ctrlKey || e.metaKey) && e.key === "s") {
            e.preventDefault();
            this.autoSave();
            this.showNotification("Code saved!", "info");
          }

          // F11 for fullscreen
          if (e.key === "F11") {
            e.preventDefault();
            this.toggleFullscreen();
          }

          // Escape to exit fullscreen
          if (e.key === "Escape" && this.fullscreenMode) {
            this.toggleFullscreen();
          }
        }

        autoSave() {
          const code = document.getElementById("codeEditor").value;
          localStorage.setItem(`playcode_${this.currentLanguage}`, code);
          localStorage.setItem("playcode_last_save", new Date().toISOString());
        }

        loadSavedCode() {
          const savedCode = localStorage.getItem(
            `playcode_${this.currentLanguage}`
          );
          if (savedCode) {
            document.getElementById("codeEditor").value = savedCode;
          } else {
            document.getElementById("codeEditor").value =
              this.codeTemplates[this.currentLanguage];
          }
        }

        highlightSyntax() {
          // Basic syntax highlighting for demo (in a real app, use a library like CodeMirror or Monaco)
          const editor = document.getElementById("codeEditor");
          // This is just for demo - real syntax highlighting would be more complex
        }

        startTimer() {
          setInterval(() => {
            if (this.timer.seconds > 0) {
              this.timer.seconds--;
            } else if (this.timer.minutes > 0) {
              this.timer.minutes--;
              this.timer.seconds = 59;
            }

            document.getElementById("timer").textContent = `${this.timer.minutes
              .toString()
              .padStart(2, "0")}:${this.timer.seconds
              .toString()
              .padStart(2, "0")}`;
          }, 1000);
        }

        addXP(amount) {
          this.userXP += amount;
          document.querySelector(
            ".xp-display span:last-child"
          ).textContent = `${this.userXP.toLocaleString()} XP`;

          // Animate XP gain
          const xpDisplay = document.querySelector(".xp-display");
          xpDisplay.style.animation = "pulse 0.6s ease-in-out";
          setTimeout(() => {
            xpDisplay.style.animation = "";
          }, 600);

          this.showNotification(`+${amount} XP!`, "success");
        }

        setupResizer() {
          const resizer = document.getElementById("resizer");
          const leftPanel = document.querySelector(".left-panel");
          const rightPanel = document.querySelector(".right-panel");

          let isResizing = false;

          resizer.addEventListener("mousedown", (e) => {
            isResizing = true;
            document.addEventListener("mousemove", handleMouseMove);
            document.addEventListener("mouseup", () => {
              isResizing = false;
              document.removeEventListener("mousemove", handleMouseMove);
            });
          });

          function handleMouseMove(e) {
            if (!isResizing) return;

            const containerWidth =
              document.querySelector(".main-container").offsetWidth;
            const leftWidth = (e.clientX / containerWidth) * 100;
            const rightWidth = 100 - leftWidth;

            if (leftWidth > 20 && rightWidth > 20) {
              leftPanel.style.width = `${leftWidth}%`;
              rightPanel.style.width = `${rightWidth}%`;
            }
          }
        }

        toggleHints() {
          this.hintsVisible = !this.hintsVisible;

          if (this.hintsVisible) {
            this.showHintModal();
          }
        }

        showHintModal() {
          const hints = [
            "💡 Think about using a hash map to store numbers and their indices",
            "⚡ You only need one pass through the array",
            "🎯 For each number, check if its complement (target - number) exists in the hash map",
            "🔍 The time complexity of your solution should be O(n)",
          ];

          const hintIndex = Math.floor(Math.random() * hints.length);
          this.showNotification(hints[hintIndex], "info", 5000);
        }

        shareCode() {
          const code = document.getElementById("codeEditor").value;
          const shareData = {
            title: "Two Sum Warriors - PlayCode",
            text: "Check out my solution to Two Sum Warriors!",
            url: window.location.href,
          };

          if (
            navigator.share &&
            navigator.share.canShare &&
            navigator.share.canShare(shareData)
          ) {
            navigator.share(shareData);
          } else {
            // Fallback: copy to clipboard
            navigator.clipboard.writeText(code).then(() => {
              this.showNotification("Code copied to clipboard!", "info");
            });
          }
        }

        toggleFullscreen() {
          this.fullscreenMode = !this.fullscreenMode;

          if (this.fullscreenMode) {
            if (document.documentElement.requestFullscreen) {
              document.documentElement.requestFullscreen();
            }
            document.body.classList.add("fullscreen");
          } else {
            if (document.exitFullscreen) {
              document.exitFullscreen();
            }
            document.body.classList.remove("fullscreen");
          }
        }

        clearConsole() {
          const activeSection = document.getElementById(this.activeConsoleTab);
          if (activeSection) {
            activeSection.innerHTML =
              '<p style="color: var(--text-secondary)">Console cleared...</p>';
          }
        }

        expandConsole() {
          const consolePanel = document.querySelector(".console-panel");
          const currentHeight = consolePanel.offsetHeight;

          if (currentHeight < 400) {
            consolePanel.style.height = "400px";
          } else {
            consolePanel.style.height = "200px";
          }
        }

        showNotification(message, type = "info", duration = 3000) {
          const notification = document.createElement("div");
          notification.className = `notification notification-${type}`;
          notification.textContent = message;
          notification.style.cssText = `
            position: fixed;
            top: 80px;
            right: 20px;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            color: white;
            font-weight: 600;
            z-index: 10000;
            animation: slideInRight 0.3s ease-out;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
        `;

          // Set background color based on type
          const colors = {
            success: "var(--success)",
            error: "var(--danger)",
            info: "var(--accent-secondary)",
            warning: "var(--warning)",
          };
          notification.style.background = colors[type] || colors.info;

          document.body.appendChild(notification);

          setTimeout(() => {
            notification.style.animation =
              "slideOutRight 0.3s ease-in forwards";
            setTimeout(() => notification.remove(), 300);
          }, duration);
        }

        triggerCelebration() {
          // Create celebration effect
          for (let i = 0; i < 50; i++) {
            setTimeout(() => {
              this.createConfetti();
            }, i * 20);
          }
        }

        createConfetti() {
          const confetti = document.createElement("div");
          confetti.innerHTML = ["🎉", "🎊", "⭐", "✨", "🏆"][
            Math.floor(Math.random() * 5)
          ];
          confetti.style.cssText = `
            position: fixed;
            top: -10px;
            left: ${Math.random() * 100}vw;
            font-size: 2rem;
            z-index: 10000;
            pointer-events: none;
            animation: confettiFall 3s linear forwards;
        `;

          document.body.appendChild(confetti);
          setTimeout(() => confetti.remove(), 3000);
        }

        isOptimalSolution() {
          const code = document
            .getElementById("codeEditor")
            .value.toLowerCase();
          // Simple check for hash map usage (in real app, would analyze AST)
          return (
            code.includes("hashmap") ||
            code.includes("map") ||
            code.includes("dict")
          );
        }

        addSubmission(submission) {
          const submissions = JSON.parse(
            localStorage.getItem("playcode_submissions") || "[]"
          );
          submissions.unshift({
            id: submissions.length + 1,
            ...submission,
            problem: "Two Sum Warriors",
          });
          localStorage.setItem(
            "playcode_submissions",
            JSON.stringify(submissions.slice(0, 50))
          ); // Keep last 50
        }

        loadSubmissions() {
          const submissions = JSON.parse(
            localStorage.getItem("playcode_submissions") || "[]"
          );
          const submissionsSection = document.getElementById("submissions");

          let html =
            "<h2>Your Submissions</h2><p>Track your progress and improvement over time.</p>";

          if (submissions.length === 0) {
            html +=
              '<div class="example-box"><p>No submissions yet. Submit your first solution!</p></div>';
          } else {
            submissions.forEach((sub) => {
              const statusClass = sub.status.includes("Accepted")
                ? "status-passed"
                : "status-failed";
              html += `
                    <div class="example-box">
                        <div class="test-case-header">
                            <span class="test-case-title">Submission #${
                              sub.id
                            }</span>
                            <span class="test-status ${statusClass}">${
                sub.status
              }</span>
                        </div>
                        <p>
                            <strong>Language:</strong> ${sub.language}<br>
                            ${
                              sub.runtime
                                ? `<strong>Runtime:</strong> ${sub.runtime}<br>`
                                : ""
                            }
                            ${
                              sub.memory
                                ? `<strong>Memory:</strong> ${sub.memory}<br>`
                                : ""
                            }
                            ${
                              sub.error
                                ? `<strong>Error:</strong> ${sub.error}<br>`
                                : ""
                            }
                            <strong>Time:</strong> ${this.timeAgo(
                              sub.timestamp
                            )}
                        </p>
                    </div>
                `;
            });
          }

          submissionsSection.innerHTML = html;
        }

        loadDiscussions() {
          // Simulate loading discussions
          const discussionsSection = document.getElementById("discussions");
          setTimeout(() => {
            // Add some dynamic content
            const discussions = discussionsSection.innerHTML;
            const liveUpdate = `
                <div class="example-box" style="border-left-color: var(--accent-color);">
                    <h4>💬 CodeNinja_2024 <span style="color: var(--accent-color);">LIVE</span></h4>
                    <p>Just solved this with a Two Pointer approach! Anyone tried that method?</p>
                    <small style="color: var(--text-secondary)">Just now • 👍 3</small>
                </div>
            `;
            discussionsSection.innerHTML = discussionsSection.innerHTML.replace(
              "<h2>Community Discussions</h2>",
              "<h2>Community Discussions</h2>" + liveUpdate
            );
          }, 1000);
        }

        timeAgo(timestamp) {
          const now = new Date();
          const time = new Date(timestamp);
          const diff = now - time;

          const minutes = Math.floor(diff / 60000);
          const hours = Math.floor(diff / 3600000);
          const days = Math.floor(diff / 86400000);

          if (minutes < 1) return "Just now";
          if (minutes < 60)
            return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
          if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
          return `${days} day${days > 1 ? "s" : ""} ago`;
        }

        initializeCodeEditor() {
          const editor = document.getElementById("codeEditor");

          // Add line numbers functionality
          editor.addEventListener("scroll", this.syncLineNumbers.bind(this));
          editor.addEventListener("input", this.updateLineNumbers.bind(this));

          // Add bracket matching
          editor.addEventListener(
            "keyup",
            this.highlightMatchingBrackets.bind(this)
          );

          // Add auto-completion hints
          editor.addEventListener("keydown", (e) => {
            if (e.key === "Tab") {
              e.preventDefault();
              this.handleTabIndentation(e);
            }
          });

          // Initialize with template
          editor.value = this.codeTemplates[this.currentLanguage];
          this.updateLineNumbers();
        }

        syncLineNumbers() {
          // In a real implementation, sync line numbers with editor scroll
        }

        updateLineNumbers() {
          // In a real implementation, update line numbers as user types
          const editor = document.getElementById("codeEditor");
          const lines = editor.value.split("\n").length;
          // This would update a line numbers gutter
        }

        highlightMatchingBrackets() {
          // In a real implementation, highlight matching brackets
        }

        handleTabIndentation(e) {
          const editor = e.target;
          const start = editor.selectionStart;
          const end = editor.selectionEnd;

          // Insert tab or spaces
          const tabChar = "    "; // 4 spaces
          editor.value =
            editor.value.substring(0, start) +
            tabChar +
            editor.value.substring(end);
          editor.selectionStart = editor.selectionEnd = start + tabChar.length;
        }

        delay(ms) {
          return new Promise((resolve) => setTimeout(resolve, ms));
        }
      }

      // Advanced Features and Extensions
      class PlayCodeExtensions {
        constructor(platform) {
          this.platform = platform;
          this.setupAdvancedFeatures();
        }

        setupAdvancedFeatures() {
          this.initializeRealTimeFeatures();
          this.setupPerformanceMonitoring();
          this.initializeAIAssistant();
          this.setupCollaboration();
        }

        initializeRealTimeFeatures() {
          // Simulate real-time opponent tracking
          this.opponentData = {
            name: "AlgoMaster_Pro",
            progress: 0,
            status: "coding",
          };

          // Update opponent progress periodically
          setInterval(() => {
            this.updateOpponentProgress();
          }, 3000);

          this.showOpponentStatus();
        }

        updateOpponentProgress() {
          this.opponentData.progress += Math.random() * 10;
          if (this.opponentData.progress > 100) {
            this.opponentData.progress = 100;
            this.opponentData.status = "completed";
          }

          this.showOpponentStatus();
        }

        setupPerformanceMonitoring() {
          // Monitor typing speed, solution efficiency, etc.
          let keystrokeCount = 0;
          let startTime = Date.now();

          document
            .getElementById("codeEditor")
            .addEventListener("keydown", () => {
              keystrokeCount++;
              const wpm = Math.round(
                keystrokeCount / 5 / ((Date.now() - startTime) / 60000)
              );

              // Update performance stats
              this.updatePerformanceStats({
                wpm: wpm || 0,
                accuracy: Math.random() * 20 + 80, // Simulated
                focus: Math.random() * 30 + 70, // Simulated
              });
            });
        }

        updatePerformanceStats(stats) {
          let perfElement = document.getElementById("performance-stats");
          if (!perfElement) {
            perfElement = document.createElement("div");
            perfElement.id = "performance-stats";
            perfElement.style.cssText = `
                position: fixed;
                bottom: 20px;
                left: 20px;
                background: var(--secondary-bg);
                border: 1px solid var(--border-color);
                border-radius: 8px;
                padding: 1rem;
                font-family: 'JetBrains Mono', monospace;
                font-size: 0.8rem;
                z-index: 1000;
            `;
            document.body.appendChild(perfElement);
          }

          perfElement.innerHTML = `
            <div style="color: var(--accent-color); margin-bottom: 0.5rem; font-weight: bold;">
                📊 Performance
            </div>
            <div>WPM: <span style="color: var(--text-primary)">${
              stats.wpm
            }</span></div>
            <div>Accuracy: <span style="color: var(--success)">${stats.accuracy.toFixed(
              1
            )}%</span></div>
            <div>Focus: <span style="color: var(--accent-secondary)">${stats.focus.toFixed(
              1
            )}%</span></div>
        `;
        }

        initializeAIAssistant() {
          // Create AI assistant button
          const aiButton = document.createElement("button");
          aiButton.innerHTML = "🤖";
          aiButton.title = "AI Code Assistant";
          aiButton.className = "floating-btn";
          aiButton.style.cssText = `
            position: fixed;
            bottom: 200px;
            right: 20px;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            border: none;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            font-size: 1.2rem;
            cursor: pointer;
            box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
            transition: all 0.3s ease;
            z-index: 1000;
        `;

          aiButton.addEventListener("click", () => {
            this.showAIAssistant();
          });

          document.body.appendChild(aiButton);
        }

        showAIAssistant() {
          const modal = document.createElement("div");
          modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            z-index: 10000;
            display: flex;
            align-items: center;
            justify-content: center;
        `;

          modal.innerHTML = `
            <div style="
                background: var(--secondary-bg);
                border-radius: 12px;
                padding: 2rem;
                max-width: 500px;
                width: 90%;
                border: 1px solid var(--border-color);
            ">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                    <h3 style="color: var(--accent-color);">🤖 AI Code Assistant</h3>
                    <button onclick="this.closest('.modal').remove()" style="background: none; border: none; color: var(--text-secondary); font-size: 1.5rem; cursor: pointer;">×</button>
                </div>
                <div style="margin-bottom: 1rem;">
                    <p style="color: var(--text-secondary); margin-bottom: 1rem;">I can help you with:</p>
                    <div style="display: grid; gap: 0.5rem;">
                        <button class="ai-suggestion" data-action="explain">🔍 Explain the problem</button>
                        <button class="ai-suggestion" data-action="hint">💡 Give me a hint</button>
                        <button class="ai-suggestion" data-action="optimize">⚡ Optimize my solution</button>
                        <button class="ai-suggestion" data-action="debug">🐛 Debug my code</button>
                        <button class="ai-suggestion" data-action="complexity">📊 Analyze time complexity</button>
                    </div>
                </div>
                <div id="ai-response" style="background: var(--card-bg); padding: 1rem; border-radius: 8px; min-height: 100px; display: none;">
                    <div class="loading-ai" style="text-align: center; color: var(--accent-color);">
                        🤖 Thinking...
                    </div>
                </div>
            </div>
        `;

          modal.className = "modal";
          document.body.appendChild(modal);

          // Add event listeners for AI suggestions
          modal.querySelectorAll(".ai-suggestion").forEach((btn) => {
            btn.style.cssText = `
                background: var(--card-bg);
                border: 1px solid var(--border-color);
                color: var(--text-primary);
                padding: 0.8rem;
                border-radius: 6px;
                cursor: pointer;
                transition: all 0.3s ease;
                text-align: left;
                width: 100%;
            `;

            btn.addEventListener("mouseover", () => {
              btn.style.borderColor = "var(--accent-color)";
              btn.style.background = "var(--hover-bg)";
            });

            btn.addEventListener("mouseout", () => {
              btn.style.borderColor = "var(--border-color)";
              btn.style.background = "var(--card-bg)";
            });

            btn.addEventListener("click", (e) => {
              this.handleAIRequest(e.target.dataset.action, modal);
            });
          });
        }

        async handleAIRequest(action, modal) {
          const responseDiv = modal.querySelector("#ai-response");
          responseDiv.style.display = "block";

          // Simulate AI thinking
          await this.platform.delay(2000);

          const responses = {
            explain: `
                <h4 style="color: var(--accent-color);">🔍 Problem Explanation</h4>
                <p>This is the classic "Two Sum" problem. You need to find two numbers in the array that add up to the target value and return their indices.</p>
                <p><strong>Key insight:</strong> Use a hash map to store each number and its index as you iterate through the array.</p>
            `,
            hint: `
                <h4 style="color: var(--accent-color);">💡 Hint</h4>
                <p>Think about this: for each number in the array, what other number would you need to reach the target?</p>
                <p><strong>Formula:</strong> complement = target - current_number</p>
                <p>If you've seen this complement before, you found your answer!</p>
            `,
            optimize: `
                <h4 style="color: var(--accent-color);">⚡ Optimization Tips</h4>
                <p>Your current solution might be O(n²). Here's how to make it O(n):</p>
                <ol>
                    <li>Use a hash map instead of nested loops</li>
                    <li>Store numbers as keys and indices as values</li>
                    <li>Check for complement in O(1) time</li>
                </ol>
            `,
            debug: `
                <h4 style="color: var(--accent-color);">🐛 Debug Checklist</h4>
                <ul>
                    <li>✓ Are you returning indices, not values?</li>
                    <li>✓ Are you handling the case where complement exists?</li>
                    <li>✓ Are you not using the same element twice?</li>
                    <li>✓ Are your indices in the correct order?</li>
                </ul>
            `,
            complexity: `
                <h4 style="color: var(--accent-color);">📊 Complexity Analysis</h4>
                <p><strong>Optimal Solution:</strong></p>
                <p>Time Complexity: O(n) - single pass through array</p>
                <p>Space Complexity: O(n) - hash map storage</p>
                <p><strong>Brute Force:</strong></p>
                <p>Time Complexity: O(n²) - nested loops</p>
                <p>Space Complexity: O(1) - no extra storage</p>
            `,
          };

          responseDiv.innerHTML =
            responses[action] || "<p>AI assistant is thinking...</p>";
        }

        setupCollaboration() {
          // Setup collaborative features (simulated)
          this.collaborators = [
            { name: "CodeBuddy", status: "online", avatar: "👨‍💻" },
            { name: "DevGuru", status: "away", avatar: "👩‍💻" },
          ];

          this.showCollaboratorsList();
        }

        showCollaboratorsList() {
          const collabElement = document.createElement("div");
          collabElement.id = "collaborators";
          collabElement.style.cssText = `
            position: fixed;
            top: 300px;
            right: 20px;
            background: var(--secondary-bg);
            border: 1px solid var(--border-color);
            border-radius: 8px;
            padding: 1rem;
            min-width: 180px;
            z-index: 1000;
        `;

          this.collaborators.forEach((collab) => {
            const statusColor =
              collab.status === "online" ? "var(--success)" : "var(--warning)";
            html += `
                <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem; padding: 0.3rem; border-radius: 4px; background: var(--card-bg);">
                    <div style="font-size: 1.2rem;">${collab.avatar}</div>
                    <div style="flex: 1;">
                        <div style="font-size: 0.8rem; font-weight: 500;">${collab.name}</div>
                        <div style="font-size: 0.7rem; color: ${statusColor};">${collab.status}</div>
                    </div>
                </div>
            `;
          });

          collabElement.innerHTML = html;
          document.body.appendChild(collabElement);
        }
      }

      // CSS Animations - Add to existing styles
      const additionalCSS = `
@keyframes slideInRight {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
}

@keyframes slideOutRight {
    from { transform: translateX(0); opacity: 1; }
    to { transform: translateX(100%); opacity: 0; }
}

@keyframes confettiFall {
    to { transform: translateY(100vh) rotate(360deg); opacity: 0; }
}

@keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.05); }
}

.fullscreen {
    position: fixed !important;
    top: 0 !important;
    left: 0 !important;
    width: 100vw !important;
    height: 100vh !important;
    z-index: 9999 !important;
    background: var(--primary-bg) !important;
}

.notification {
    font-family: 'Rajdhani', sans-serif;
}

.loading {
    display: inline-block;
    width: 16px;
    height: 16px;
    border: 2px solid transparent;
    border-top: 2px solid currentColor;
    border-radius: 50%;
    animation: spin 1s linear infinite;
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}
`;

      // Initialize everything when DOM is loaded
      document.addEventListener("DOMContentLoaded", () => {
        // Add additional CSS
        const styleSheet = document.createElement("style");
        styleSheet.textContent = additionalCSS;
        document.head.appendChild(styleSheet);

        // Initialize the platform
        window.playCodePlatform = new PlayCodePlatform();
        window.playCodeExtensions = new PlayCodeExtensions(
          window.playCodePlatform
        );

        console.log("🎮 PlayCode Platform initialized successfully!");
        console.log("⌨️ Keyboard shortcuts:");
        console.log("  Ctrl+Enter: Run code");
        console.log("  Ctrl+Shift+Enter: Submit solution");
        console.log("  Ctrl+S: Save code");
        console.log("  F11: Toggle fullscreen");
      });

      // Global functions for backward compatibility
      function switchTab(tabName) {
        window.playCodePlatform?.switchTab(tabName);
      }

      function switchConsoleTab(tabName) {
        window.playCodePlatform?.switchConsoleTab(tabName);
      }

      function changeLanguage() {
        window.playCodePlatform?.changeLanguage();
      }

      function runCode() {
        window.playCodePlatform?.runCode();
      }

      function submitCode() {
        window.playCodePlatform?.submitCode();
      }

      function toggleHints() {
        window.playCodePlatform?.toggleHints();
      }

      function shareCode() {
        window.playCodePlatform?.shareCode();
      }

      function toggleFullscreen() {
        window.playCodePlatform?.toggleFullscreen();
      }

      function clearConsole() {
        window.playCodePlatform?.clearConsole();
      }

      function expandConsole() {
        window.playCodePlatform?.expandConsole();
      }

      function showUserMenu() {
        window.playCodePlatform?.showNotification(
          "👤 User menu - Coming soon!",
          "info"
        );
      }

      window.addEventListener("scroll", () => {
  const navbar = document.querySelector(".navbar");
  if (window.scrollY > 50) {
    navbar.style.background = "transparent";
  } else {
    navbar.style.background = "rgba(26, 26, 26, 0.95)";
  }
});
