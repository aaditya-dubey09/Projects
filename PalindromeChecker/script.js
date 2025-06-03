const textInput = document.getElementById('text-input');
        const checkBtn = document.getElementById('check-btn');
        const result = document.getElementById('result');

        function isPalindrome(str) {
            // Remove all non-alphanumeric characters and convert to lowercase
            const cleanedStr = str.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
            
            // Check if the cleaned string is the same as its reverse
            return cleanedStr === cleanedStr.split('').reverse().join('');
        }

        function checkPalindrome() {
            const inputValue = textInput.value.trim();
            
            // Check if input is empty
            if (!inputValue) {
                showAlert('Please input a value');
                return;
            }

            // Add pulse animation to button
            checkBtn.classList.add('pulse');
            setTimeout(() => checkBtn.classList.remove('pulse'), 300);

            // Check if it's a palindrome
            const isInputPalindrome = isPalindrome(inputValue);
            
            // Display result
            if (isInputPalindrome) {
                result.textContent = `${inputValue} is a palindrome`;
                result.className = 'palindrome show';
            } else {
                result.textContent = `${inputValue} is not a palindrome`;
                result.className = 'not-palindrome show';
            }
        }

        function showAlert(message) {
            const alertOverlay = document.getElementById('alert-overlay');
            const alertMessage = document.getElementById('alert-message');
            
            if (alertOverlay && alertMessage) {
                alertMessage.textContent = message;
                alertOverlay.classList.add('show');
                
                // Focus on input after alert is shown
                setTimeout(() => {
                    textInput.focus();
                }, 100);
            }
        }

        function closeAlert() {
            const alertOverlay = document.getElementById('alert-overlay');
            if (alertOverlay) {
                alertOverlay.classList.remove('show');
                textInput.focus();
            }
        }

        // Make closeAlert available globally
        window.closeAlert = closeAlert;

        function fillInput(text) {
            textInput.value = text;
            textInput.focus();
        }

        // Event listeners
        checkBtn.addEventListener('click', checkPalindrome);
        
        textInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                checkPalindrome();
            }
        });

        // Clear result when input changes
        textInput.addEventListener('input', function() {
            result.classList.remove('show');
            setTimeout(() => {
                result.className = '';
                result.textContent = '';
            }, 300);
        });

        // Close alert when clicking outside the alert box
        document.addEventListener('DOMContentLoaded', function() {
            const alertOverlay = document.getElementById('alert-overlay');
            if (alertOverlay) {
                alertOverlay.addEventListener('click', function(e) {
                    if (e.target === this) {
                        closeAlert();
                    }
                });
            }
        });

        // Close alert with Escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                const alertOverlay = document.getElementById('alert-overlay');
                if (alertOverlay && alertOverlay.classList.contains('show')) {
                    closeAlert();
                }
            }
        });