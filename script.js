// Add these to your existing State management section
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

// Add to your existing Initialize app function
document.addEventListener('DOMContentLoaded', function() {
    loadTheme();
    focusInput();
    showQuickPrompts();
    initializeNavigation(); // Add this line
    loadSavedSettings();   // Add this line
});

// Navigation between sections
function initializeNavigation() {
    const historyItems = document.querySelectorAll('.history-item');
    
    historyItems.forEach(item => {
        item.addEventListener('click', function() {
            const targetSection = this.getAttribute('data-section');
            
            // Update active item
            historyItems.forEach(hi => hi.classList.remove('active'));
            this.classList.add('active');
            
            // Show target section
            showSection(targetSection);
        });
    });
}

function showSection(sectionName) {
    // Hide all sections
    document.querySelectorAll('.section').forEach(section => {
        section.classList.add('hidden');
    });
    
    // Show target section
    const targetElement = document.getElementById(sectionName + 'Section');
    if (targetElement) {
        targetElement.classList.remove('hidden');
    }
    
    currentSection = sectionName;
    
    // Special handling for chat section
    if (sectionName === 'chat') {
        showQuickPrompts();
    } else {
        hideQuickPrompts();
    }
}

// Zulu Learning Functions
function translateToZulu() {
    const englishText = document.getElementById('englishInput').value.trim();
    if (!englishText) return;
    
    const simpleTranslations = {
        'hello': 'Sawubona',
        'good morning': 'Sawubona',
        'good afternoon': 'Sanibonani',
        'good evening': 'Sanibonani',
        'how are you': 'Unjani?',
        'i am fine': 'Ngikhona',
        'thank you': 'Ngiyabonga',
        'thank you very much': 'Ngiyabonga kakhulu',
        'please': 'Ngiyacela',
        'yes': 'Yebo',
        'no': 'Cha',
        'goodbye': 'Hamba kahle',
        'see you later': 'Sizobonana kamuva',
        'what is your name': 'Ungubani igama lakho?',
        'my name is': 'Igama lami ngu',
        'how much': 'Malini?',
        'i need help': 'Ngidinga usizo',
        'where is': 'Likuphi i',
        'i understand': 'Ngiyaqonda',
        'i dont understand': 'Angizwisisi'
    };
    
    const lowerText = englishText.toLowerCase();
    let translation = 'Hmm, angikwazi ukukuhumusha lokhu. Ngiyaxolisa. (I cannot translate this yet. Sorry.)';
    
    for (const [eng, zul] of Object.entries(simpleTranslations)) {
        if (lowerText.includes(eng)) {
            translation = zul;
            break;
        }
    }
    
    document.getElementById('translationResult').innerHTML = `
        <strong>English:</strong> ${englishText}<br>
        <strong>isiZulu:</strong> ${translation}
    `;
}

function showAnswer(elementId) {
    const element = document.getElementById(elementId);
    element.classList.remove('hidden');
}

// Business Ideas Functions
function generateBusinessIdeas() {
    const industry = document.getElementById('industrySelect').value;
    const investment = document.getElementById('investmentSelect').value;
    const location = document.getElementById('locationSelect').value;
    
    const allIdeas = [
        {
            title: "Online Zulu Language Tutoring Platform",
            description: "Connect Zulu language learners with native speakers for virtual lessons and cultural exchange.",
            industry: "education",
            investment: "low",
            location: "online"
        },
        {
            title: "African Craft E-commerce Store",
            description: "Sell authentic African crafts and artifacts to international markets with cultural storytelling.",
            industry: "retail",
            investment: "medium",
            location: "online"
        },
        {
            title: "Local Food Delivery Service",
            description: "Focus on traditional Zulu cuisine and healthy meal options for urban professionals.",
            industry: "food",
            investment: "medium",
            location: "local"
        },
        {
            title: "Mobile App Development Agency",
            description: "Create custom mobile applications for local businesses looking to digitize their operations.",
            industry: "tech",
            investment: "low",
            location: "online"
        },
        {
            title: "Co-working Space with Cultural Programming",
            description: "Provide workspace with regular cultural events, language classes, and business networking.",
            industry: "services",
            investment: "high",
            location: "local"
        },
        {
            title: "Digital Marketing Agency for Local Businesses",
            description: "Help small businesses establish online presence with culturally relevant marketing strategies.",
            industry: "services",
            investment: "low",
            location: "online"
        },
        {
            title: "Sustainable Farming and Produce Delivery",
            description: "Organic farming with direct-to-consumer delivery of fresh produce and traditional ingredients.",
            industry: "food",
            investment: "medium",
            location: "mobile"
        },
        {
            title: "Health and Wellness Coaching Service",
            description: "Combine modern wellness practices with traditional Zulu health knowledge and remedies.",
            industry: "health",
            investment: "low",
            location: "online"
        }
    ];
    
    // Filter ideas based on selections
    let filteredIdeas = allIdeas;
    
    if (industry) {
        filteredIdeas = filteredIdeas.filter(idea => idea.industry === industry);
    }
    
    if (investment) {
        filteredIdeas = filteredIdeas.filter(idea => idea.investment === investment);
    }
    
    if (location) {
        filteredIdeas = filteredIdeas.filter(idea => idea.location === location);
    }
    
    // If no filters selected or no matches, show random ideas
    if (filteredIdeas.length === 0) {
        filteredIdeas = allIdeas.sort(() => 0.5 - Math.random()).slice(0, 4);
    }
    
    displayBusinessIdeas(filteredIdeas);
}

function displayBusinessIdeas(ideas) {
    const resultsContainer = document.getElementById('businessIdeasResults');
    
    if (ideas.length === 0) {
        resultsContainer.innerHTML = '<p>No business ideas found matching your criteria. Try adjusting your filters.</p>';
        return;
    }
    
    let ideasHTML = '<h3>Generated Business Ideas</h3>';
    
    ideas.forEach((idea, index) => {
        ideasHTML += `
            <div class="business-idea-card">
                <h4>${idea.title}</h4>
                <p>${idea.description}</p>
                <div class="idea-meta">
                    <span><strong>Industry:</strong> ${getIndustryName(idea.industry)}</span>
                    <span><strong>Investment:</strong> ${getInvestmentName(idea.investment)}</span>
                    <span><strong>Location:</strong> ${getLocationName(idea.location)}</span>
                </div>
                <div class="idea-actions">
                    <button class="idea-btn" onclick="expandIdea(${index})">View Details</button>
                    <button class="idea-btn" onclick="saveIdea('${idea.title}')">Save Idea</button>
                </div>
            </div>
        `;
    });
    
    resultsContainer.innerHTML = ideasHTML;
}

function getIndustryName(key) {
    const industries = {
        'tech': 'Technology',
        'food': 'Food & Beverage',
        'retail': 'Retail',
        'services': 'Services',
        'education': 'Education',
        'health': 'Health & Wellness'
    };
    return industries[key] || key;
}

function getInvestmentName(key) {
    const investments = {
        'low': 'Low (Under $1k)',
        'medium': 'Medium ($1k-$10k)',
        'high': 'High ($10k+)'
    };
    return investments[key] || key;
}

function getLocationName(key) {
    const locations = {
        'online': 'Online',
        'local': 'Local Store',
        'mobile': 'Mobile',
        'home': 'Home-based'
    };
    return locations[key] || key;
}

function expandIdea(index) {
    // In a real app, this would show more detailed information
    alert('Detailed business plan view would open here with:\n- Market analysis\n- Startup costs\n- Revenue projections\n- Marketing strategy\n- Implementation timeline');
}

function saveIdea(ideaTitle) {
    // In a real app, this would save to local storage or database
    alert(`Business idea "${ideaTitle}" saved to your favorites!`);
}

// Settings Functions
function loadSavedSettings() {
    const saved = localStorage.getItem('switchlySettings');
    if (saved) {
        appSettings = { ...appSettings, ...JSON.parse(saved) };
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
    
    // Show confirmation
    alert('Settings saved successfully!');
    
    // Update chat behavior based on new settings
    updateChatBehavior();
}

function resetSettings() {
    if (confirm('Are you sure you want to reset all settings to default?')) {
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
        alert('Settings reset to defaults!');
    }
}

function updateChatBehavior() {
    // This function would modify how your chat works based on settings
    console.log('Chat behavior updated with settings:', appSettings);
    
    // You can integrate these settings into your existing chat functions
    // For example, modify the API calls based on model selection
    // or adjust response style based on temperature and tone
}

// Update your existing newChat function to handle section switching
function newChat() {
    if (currentSection === 'chat') {
        const messagesContainer = document.getElementById('chatMessages');
        const welcomeMessage = messagesContainer.children[0];
        messagesContainer.innerHTML = '';
        messagesContainer.appendChild(welcomeMessage);
        currentChat = [];
        showQuickPrompts();
    } else {
        // If not in chat section, switch to chat and start new chat
        showSection('chat');
        const historyItems = document.querySelectorAll('.history-item');
        historyItems.forEach(hi => hi.classList.remove('active'));
        document.querySelector('.history-item[data-section="chat"]').classList.add('active');
        
        // Clear existing chat
        const messagesContainer = document.getElementById('chatMessages');
        const welcomeMessage = messagesContainer.children[0];
        messagesContainer.innerHTML = '';
        messagesContainer.appendChild(welcomeMessage);
        currentChat = [];
        showQuickPrompts();
    }
}
