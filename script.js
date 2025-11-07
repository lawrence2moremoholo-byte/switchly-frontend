// Configuration
const CONFIG = {
    SWITCHLY_API: 'https://moremoholo2-metawell-ai-chat.hf.space/api/predict',
    OPENAI_API: 'https://api.openai.com/v1/chat/completions', // Backup API
    OPENAI_API_KEY: 'your-openai-api-key-here' // You'll add this later
};

// State management
let currentChat = [];
let isDarkTheme = true;

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    loadTheme();
    focusInput();
    showQuickPrompts();
});

// Main message sending function
async function sendMessage() {
    const input = document.getElementById('messageInput');
    const button = document.getElementById('sendButton');
    const message = input.value.trim();
    
    if (!message) return;
    
    // Add user message
    addMessage(message, 'user');
    input.value = '';
    button.disabled = true;
    hideQuickPrompts();
    
    // Show typing indicator
    showTyping();
    
    try {
        // Try Switchly API first
        let response = await callSwitchlyAPI(message);
        
        // If Switchly fails, try OpenAI as backup
        if (!response || response.includes('error') || response.includes('Sorry')) {
            console.log('Switchly API failed, trying OpenAI backup...');
            response = await callOpenAI(message);
        }
        
        hideTyping();
        addMessage(response, 'bot');
        
    } catch (error) {
        hideTyping();
        addMessage('Sorry, I encountered an error. Please try again.', 'bot');
        console.error('API Error:', error);
    } finally {
        button.disabled = false;
        focusInput();
    }
}

// Switchly API call
async function callSwitchlyAPI(message) {
    try {
        const response = await fetch(CONFIG.SWITCHLY_API, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                data: [message]
            })
        });
        
        if (response.ok) {
            const data = await response.json();
            return data.data[0];
        } else {
            throw new Error(`HTTP ${response.status}`);
        }
    } catch (error) {
        console.error('Switchly API error:', error);
        throw error;
    }
}

// OpenAI backup API call
async function callOpenAI(message) {
    if (!CONFIG.OPENAI_API_KEY || CONFIG.OPENAI_API_KEY === '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') {
        return "I'm currently experiencing high demand. Please try again in a moment.";
    }
    
    try {
        const response = await fetch(CONFIG.OPENAI_API, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${CONFIG.OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: 'gpt-3.5-turbo',
                messages: [
                    {
                        role: 'system',
                        content: `You are Switchly, an AI assistant that specializes in Zulu-English code-switching. 
                        Respond naturally mixing both languages. Use Zulu phrases like Sawubona, Yebo, Hawu, Ngiyabonga 
                        appropriately. Keep responses conversational and helpful.`
                    },
                    {
                        role: 'user',
                        content: message
                    }
                ],
                max_tokens: 500,
                temperature: 0.7
            })
        });
        
        if (response.ok) {
            const data = await response.json();
            return data.choices[0].message.content;
        } else {
            throw new Error(`OpenAI API error: ${response.status}`);
        }
    } catch (error) {
        console.error('OpenAI API error:', error);
        return "I'm having trouble connecting right now. Please try again shortly.";
    }
}

// UI Functions
function addMessage(text, sender) {
    const messagesContainer = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}`;
    
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    messageDiv.innerHTML = `
        <div class="avatar">${sender === 'user' ? 'Y' : 'S'}</div>
        <div class="message-content">
            <div class="message-text">
                <p>${escapeHtml(text)}</p>
            </div>
            <div class="message-time">${timestamp}</div>
        </div>
        <div class="message-actions">
            <button class="action-btn" onclick="copyMessage(this)">
                <i class="fas fa-copy"></i>
            </button>
        </div>
    `;
    
    messagesContainer.appendChild(messageDiv);
    scrollToBottom();
    
    // Add to chat history
    currentChat.push({ sender, text, timestamp });
}

function showTyping() {
    const typingIndicator = document.getElementById('typingIndicator');
    typingIndicator.style.display = 'flex';
    scrollToBottom();
}

function hideTyping() {
    const typingIndicator = document.getElementById('typingIndicator');
    typingIndicator.style.display = 'none';
}

function showQuickPrompts() {
    const messagesContainer = document.getElementById('chatMessages');
    if (messagesContainer.children.length <= 1) { // Only welcome message
        const quickPrompts = document.getElementById('quickPrompts');
        quickPrompts.style.display = 'block';
    }
}

function hideQuickPrompts() {
    const quickPrompts = document.getElementById('quickPrompts');
    quickPrompts.style.display = 'none';
}

function usePrompt(prompt) {
    document.getElementById('messageInput').value = prompt;
    hideQuickPrompts();
    focusInput();
}

function newChat() {
    const messagesContainer = document.getElementById('chatMessages');
    const welcomeMessage = messagesContainer.children[0];
    messagesContainer.innerHTML = '';
    messagesContainer.appendChild(welcomeMessage);
    currentChat = [];
    showQuickPrompts();
}

function toggleSidebar() {
    const sidebar = document.querySelector('.sidebar');
    sidebar.classList.toggle('open');
}

function toggleTheme() {
    isDarkTheme = !isDarkTheme;
    document.documentElement.setAttribute('data-theme', isDarkTheme ? 'dark' : 'light');
    localStorage.setItem('switchly-theme', isDarkTheme ? 'dark' : 'light');
}

function loadTheme() {
    const savedTheme = localStorage.getItem('switchly-theme') || 'dark';
    isDarkTheme = savedTheme === 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
}

function copyMessage(button) {
    const messageText = button.closest('.message').querySelector('.message-text p').textContent;
    navigator.clipboard.writeText(messageText).then(() => {
        const icon = button.querySelector('i');
        const originalIcon = icon.className;
        icon.className = 'fas fa-check';
        setTimeout(() => {
            icon.className = originalIcon;
        }, 2000);
    });
}

function handleKeyDown(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        sendMessage();
    }
    
    // Auto-resize textarea
    const textarea = event.target;
    textarea.style.height = 'auto';
    textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
}

function focusInput() {
    const input = document.getElementById('messageInput');
    input.focus();
    input.style.height = 'auto';
}

function scrollToBottom() {
    const messagesContainer = document.getElementById('chatMessages');
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Export chat function (optional)
function exportChat() {
    const chatData = {
        timestamp: new Date().toISOString(),
        chat: currentChat
    };
    
    const dataStr = JSON.stringify(chatData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `switchly-chat-${new Date().getTime()}.json`;
    link.click();
}