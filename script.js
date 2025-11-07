let appSettings = {
    model: 'gpt-mini',
    temperature: 0.7,
    tone: 'friendly',
    memory: true,
    webSearch: false,
    codeExecution: false,
    imageGeneration: false,
    fileUpload: true
};

let currentSection = 'chat';

document.addEventListener('DOMContentLoaded', () => {
    initializeNavigation();
    loadSavedSettings();
});

function initializeNavigation() {
    const items = document.querySelectorAll('.history-item');
    items.forEach(item => {
        item.addEventListener('click', () => {
            items.forEach(i => i.classList.remove('active'));
            item.classList.add('active');
            showSection(item.getAttribute('data-section'));
        });
    });
}

function showSection(sectionName) {
    document.querySelectorAll('.section').forEach(sec => sec.classList.add('hidden'));
    const el = document.getElementById(sectionName + 'Section');
    if (el) el.classList.remove('hidden');
    currentSection = sectionName;
}

function newChat() {
    showSection('chat');
    document.querySelectorAll('.history-item').forEach(i => i.classList.remove('active'));
    document.querySelector('.history-item[data-section="chat"]').classList.add('active');
    const msgs = document.getElementById('chatMessages');
    msgs.innerHTML = `
        <div class="message bot">
            <div class="avatar">S</div>
            <div class="message-content">
                <p>Sawubona! I'm Switchly, Africa’s first intelligent code-switching AI. I can understand and respond naturally in both English and isiZulu. How can I help you today?</p>
                <div class="message-time">Just now</div>
            </div>
        </div>
    `;
    document.getElementById('messageInput').value = '';
}

function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
    }
}

function sendMessage() {
    const input = document.getElementById('messageInput');
    const text = input.value.trim();
    if (!text) return;

    appendUserMessage(text);
    input.value = '';
    // Show typing indicator
    document.getElementById('typingIndicator').style.display = 'flex';

    // Placeholder for your API integration
    // Example: call fetch/axios to your backend and get response
    setTimeout(() => {
        document.getElementById('typingIndicator').style.display = 'none';
        appendBotMessage("Response from API would go here...");
    }, 1000);
}

function appendUserMessage(text) {
    const container = document.getElementById('chatMessages');
    const html = `
    <div class="message user">
      <div class="avatar">U</div>
      <div class="message-content">
        <p>${escapeHtml(text)}</p>
        <div class="message-time">${new Date().toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</div>
      </div>
    </div>`;
    container.insertAdjacentHTML('beforeend', html);
    container.scrollTop = container.scrollHeight;
}

function appendBotMessage(text) {
    const container = document.getElementById('chatMessages');
    const html = `
    <div class="message bot">
      <div class="avatar">S</div>
      <div class="message-content">
        <p>${escapeHtml(text)}</p>
        <div class="message-time">${new Date().toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</div>
      </div>
    </div>`;
    container.insertAdjacentHTML('beforeend', html);
    container.scrollTop = container.scrollHeight;
}

function escapeHtml(str) {
    return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function translateToZulu() {
    const englishText = document.getElementById('englishInput').value.trim();
    if (!englishText) return;
    const translations = {
        'hello':'Sawubona','good morning':'Sawubona','good afternoon':'Sanibonani',
        'good evening':'Sanibonani','how are you':'Unjani?','i am fine':'Ngikhona',
        'thank you':'Ngiyabonga','thank you very much':'Ngiyabonga kakhulu',
        'please':'Ngiyacela','yes':'Yebo','no':'Cha',
        'goodbye':'Hamba kahle','see you later':'Sizobonana kamuva',
        'what is your name':'Ungubani igama lakho?','my name is':'Igama lami ngu',
        'how much':'Malini?','i need help':'Ngidinga usizo','where is':'Likuphi i',
        'i understand':'Ngiyaqonda','i dont understand':'Angizwisisi'
    };
    const key = englishText.toLowerCase();
    const translation = translations[key] || 'Hmm, angikwazi ukukuhumusha lokhu. Ngiyaxolisa.';
    document.getElementById('translationResult').innerHTML = `
        <strong>English:</strong> ${escapeHtml(englishText)}<br>
        <strong>isiZulu:</strong> ${escapeHtml(translation)}
    `;
}

function showAnswer(id) {
    const el = document.getElementById(id);
    if (el) el.classList.remove('hidden');
}

function loadSavedSettings() {
    const saved = localStorage.getItem('switchlySettings');
    if (saved) {
        appSettings = {...appSettings, ...JSON.parse(saved)};
        applySettingsToUI();
    }
}

function applySettingsToUI() {
    document.getElementById('modelSelect').value = appSettings.model;
    document.getElementById('temperatureSlider').value = appSettings.temperature * 100;
    document.getElementById('toneSelect').value = appSettings.tone;
    document.getElementById('memoryToggle').checked = appSettings.memory;
    document.getElementById('webSearch').checked = appSettings.webSearch;
    document.getElementById('codeExecution').checked = appSettings.codeExecution;
    document.getElementById('imageGeneration').checked = appSettings.imageGeneration;
    document.getElementById('fileUpload').checked = appSettings.fileUpload;
}

function saveSettings() {
    appSettings = {
        model: document.getElementById('modelSelect').value,
        temperature: document.getElementById('temperatureSlider').value / 100,
        tone: document.getElementById('toneSelect').value,
        memory: document.getElementById('memoryToggle').checked,
        webSearch: document.getElementById('webSearch').checked,
        codeExecution: document.getElementById('codeExecution').checked,
        imageGeneration: document.getElementById('imageGeneration').checked,
        fileUpload: document.getElementById('fileUpload').checked
    };
    localStorage.setItem('switchlySettings', JSON.stringify(appSettings));
    alert('Settings saved!');
    // apply settings to your API logic as needed
}

function resetSettings() {
    if (confirm('Reset settings to default?')) {
        appSettings = {
            model: 'gpt-mini',
            temperature: 0.7,
            tone: 'friendly',
            memory: true,
            webSearch: false,
            codeExecution: false,
            imageGeneration: false,
            fileUpload: true
        };
        applySettingsToUI();
        localStorage.removeItem('switchlySettings');
        alert('Settings reset!');
    }
}

// Optional: theme toggle
function toggleTheme() {
    document.body.classList.toggle('dark-theme');
    // You can alternate CSS variables or switch to dark mode accordingly
}
