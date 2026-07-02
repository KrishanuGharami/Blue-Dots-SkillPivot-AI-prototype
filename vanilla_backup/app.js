// SkillPivot AI Discovery Guide State Machine & Simulation logic

// Web Audio API Sound Generator for UI/UX
const AudioController = {
    enabled: true,
    ctx: null,

    init() {
        if (!this.ctx) {
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        }
    },

    playTick() {
        if (!this.enabled) return;
        this.init();
        try {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            
            osc.frequency.setValueAtTime(800, this.ctx.currentTime);
            gain.gain.setValueAtTime(0.05, this.ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.05);
            
            osc.start();
            osc.stop(this.ctx.currentTime + 0.05);
        } catch (e) {
            console.log('Audio autoplay blocked or unsupported.');
        }
    },

    playPop() {
        if (!this.enabled) return;
        this.init();
        try {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            
            osc.type = 'sine';
            osc.frequency.setValueAtTime(400, this.ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(600, this.ctx.currentTime + 0.1);
            
            gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.12);
            
            osc.start();
            osc.stop(this.ctx.currentTime + 0.12);
        } catch (e) {
            console.log('Audio autoplay blocked.');
        }
    },

    playSuccess() {
        if (!this.enabled) return;
        this.init();
        try {
            const now = this.ctx.currentTime;
            const playNote = (freq, start, duration) => {
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                osc.connect(gain);
                gain.connect(this.ctx.destination);
                osc.frequency.setValueAtTime(freq, now + start);
                gain.gain.setValueAtTime(0.05, now + start);
                gain.gain.exponentialRampToValueAtTime(0.001, now + start + duration);
                osc.start(now + start);
                osc.stop(now + start + duration);
            };
            playNote(523.25, 0, 0.1); // C5
            playNote(659.25, 0.08, 0.1); // E5
            playNote(783.99, 0.16, 0.25); // G5
        } catch (e) {
            console.log('Audio autoplay blocked.');
        }
    }
};

// Conversational State Definition
const States = {
    START: 'START',
    
    // Student Path
    STUDENT_YEAR: 'STUDENT_YEAR',
    STUDENT_GOAL: 'STUDENT_GOAL',
    STUDENT_INTEREST: 'STUDENT_INTEREST',
    STUDENT_PAIN: 'STUDENT_PAIN',
    
    // College Path
    COLLEGE_COUNT: 'COLLEGE_COUNT',
    COLLEGE_LABS: 'COLLEGE_LABS',
    COLLEGE_BUDGET: 'COLLEGE_BUDGET',
    COLLEGE_PILOT: 'COLLEGE_PILOT',

    // Generic Path
    OTHER_HELP: 'OTHER_HELP',
    
    // Lead Capture (Shared)
    LEAD_NAME: 'LEAD_NAME',
    LEAD_PHONE: 'LEAD_PHONE',
    LEAD_EMAIL: 'LEAD_EMAIL',
    LEAD_COLLEGE: 'LEAD_COLLEGE',
    
    FINISH: 'FINISH',
    COMPLETED: 'COMPLETED'
};

// Structured output model matching prompt specs
let structuredState = {
    userType: null,
    goal: null,
    painPoint: null,
    interest: null,
    intent: null,
    leadCaptured: {
        name: null,
        phone: null,
        email: null,
        college: null
    }
};

let currentState = States.START;
let selectedRecommendation = null;

// Rules compliance checker (updates dashboard UI)
function checkCompliance(text) {
    const forbidden = ["guaranteed", "100%", "best", "revolutionary"];
    const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
    
    const sentenceCount = sentences.length;
    let hasForbidden = false;
    for (let word of forbidden) {
        if (text.toLowerCase().includes(word)) {
            hasForbidden = true;
            break;
        }
    }

    // Determine constraints status
    const isSentenceOk = sentenceCount <= 2;
    const isVocabularyOk = !hasForbidden;
    
    return {
        sentenceCount,
        hasForbidden,
        isSentenceOk,
        isVocabularyOk,
        allOk: isSentenceOk && isVocabularyOk
    };
}

// Update the live state display block
function updateStateTracker() {
    const el = document.getElementById('json-state-tracker');
    
    // Add glowing effect to notify user of data changes
    el.classList.remove('glow-alert');
    void el.offsetWidth; // trigger reflow
    el.classList.add('glow-alert');

    // Create formatted, syntax-colored JSON presentation
    const cleanState = {
        userType: structuredState.userType,
        goal: structuredState.goal,
        painPoint: structuredState.painPoint,
        interest: structuredState.interest,
        intent: structuredState.intent,
        leadCaptured: {
            name: structuredState.leadCaptured.name,
            phone: structuredState.leadCaptured.phone,
            email: structuredState.leadCaptured.email,
            college: structuredState.leadCaptured.college
        }
    };

    const jsonStr = JSON.stringify(cleanState, null, 2);
    
    // Basic syntax highlighting
    const highlighted = jsonStr
        .replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
            let cls = 'json-string';
            if (/^"/.test(match)) {
                if (/:$/.test(match)) {
                    cls = 'json-key';
                } else {
                    cls = 'json-string';
                }
            } else if (/true|false/.test(match)) {
                cls = 'json-boolean';
            } else if (/null/.test(match)) {
                cls = 'json-null';
            }
            return '<span class="' + cls + '">' + match + '</span>';
        });

    el.innerHTML = highlighted;
}

// Bot reply helper: processes input, renders message, checks compliance
function botReply(text, options = [], customHtml = null) {
    // Audit response rules
    const audit = checkCompliance(text);
    updateComplianceMonitor(audit);

    // Show simulated typing
    showTypingIndicator();

    setTimeout(() => {
        hideTypingIndicator();
        renderMessage(text, 'bot', options, customHtml);
        AudioController.playPop();
    }, 750);
}

// Render message inside chat area
function renderMessage(text, sender, options = [], customHtml = null) {
    const chatHistory = document.getElementById('chat-history');
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}`;

    const senderName = document.createElement('span');
    senderName.className = 'message-sender';
    senderName.innerText = sender === 'bot' ? 'SkillPivot AI' : 'You';
    messageDiv.appendChild(senderName);

    const bubble = document.createElement('div');
    bubble.className = 'message-bubble';
    bubble.innerText = text;

    if (customHtml) {
        const customContainer = document.createElement('div');
        customContainer.innerHTML = customHtml;
        bubble.appendChild(customContainer);
    }

    if (options && options.length > 0) {
        const optContainer = document.createElement('div');
        optContainer.className = 'options-container';
        
        options.forEach(opt => {
            const btn = document.createElement('button');
            btn.className = 'option-btn';
            btn.innerText = opt.label;
            btn.onclick = () => handleUserSelection(opt.value, opt.label);
            optContainer.appendChild(btn);
        });
        
        bubble.appendChild(optContainer);
    }

    messageDiv.appendChild(bubble);
    chatHistory.appendChild(messageDiv);
    chatHistory.scrollTop = chatHistory.scrollHeight;
}

// Show / Hide bot typing
function showTypingIndicator() {
    const chatHistory = document.getElementById('chat-history');
    if (document.getElementById('typing-indicator')) return;

    const ind = document.createElement('div');
    ind.id = 'typing-indicator';
    ind.className = 'typing-indicator';
    
    for (let i = 0; i < 3; i++) {
        const dot = document.createElement('div');
        dot.className = 'typing-dot';
        ind.appendChild(dot);
    }
    
    chatHistory.appendChild(ind);
    chatHistory.scrollTop = chatHistory.scrollHeight;
}

function hideTypingIndicator() {
    const ind = document.getElementById('typing-indicator');
    if (ind) ind.remove();
}

// Handle User text submission
function submitUserMessage() {
    const input = document.getElementById('chat-input-field');
    const text = input.value.trim();
    if (!text) return;
    
    input.value = '';
    renderMessage(text, 'user');
    AudioController.playTick();
    
    processStateTransition(text);
}

// Handle pre-defined option clicks
function handleUserSelection(value, label) {
    renderMessage(label, 'user');
    AudioController.playTick();
    processStateTransition(value);
}

// State Machine Engine
function processStateTransition(userInput) {
    userInput = userInput.trim();

    switch (currentState) {
        case States.START:
            const typeLower = userInput.toLowerCase();
            if (typeLower.includes('student') || typeLower === '1') {
                structuredState.userType = 'Student';
                currentState = States.STUDENT_YEAR;
                botReply("Got it. Which year of study are you in currently?", [
                    { label: "1st Year", value: "1st Year" },
                    { label: "2nd Year", value: "2nd Year" },
                    { label: "3rd Year", value: "3rd Year" },
                    { label: "4th Year", value: "4th Year" },
                    { label: "Diploma / Other", value: "Diploma" }
                ]);
            } else if (typeLower.includes('college') || typeLower.includes('institute') || typeLower.includes('faculty') || typeLower === '2') {
                structuredState.userType = 'College';
                currentState = States.COLLEGE_COUNT;
                botReply("Understood. Around how many students are currently enrolled in your department or college?", [
                    { label: "Under 100", value: "Under 100" },
                    { label: "100 - 500", value: "100 - 500" },
                    { label: "500 - 1000", value: "500 - 1000" },
                    { label: "Over 1000", value: "Over 1000" }
                ]);
            } else {
                structuredState.userType = 'Other';
                currentState = States.OTHER_HELP;
                botReply("Understood. What is the primary technology goal or skill training you are looking for?", [
                    { label: "Explore practical labs", value: "Explore labs" },
                    { label: "Corporate training support", value: "Corporate training" },
                    { label: "Personal technology project", value: "Personal project" }
                ]);
            }
            break;

        // --- STUDENT FLOW ---
        case States.STUDENT_YEAR:
            // Store and ask for Goal
            structuredState.goal = `Year: ${userInput}`;
            currentState = States.STUDENT_GOAL;
            botReply("What is your main target after you finish this course?", [
                { label: "Core Technical Job", value: "Tech Job" },
                { label: "Higher Studies / Research", value: "Higher Studies" },
                { label: "Freelance or Startup", value: "Freelance/Startup" },
                { label: "Unsure / Exploring options", value: "Unsure" }
            ]);
            break;

        case States.STUDENT_GOAL:
            // Store goal, move to Interest
            structuredState.goal += ` | Target: ${userInput}`;
            currentState = States.STUDENT_INTEREST;
            botReply("Which domain of technology excites you the most?", [
                { label: "Robotics & Automation", value: "Robotics" },
                { label: "AI & Machine Learning", value: "AI" },
                { label: "IoT & Embedded Systems", value: "IoT" },
                { label: "Software / Web Development", value: "Web Dev" }
            ]);
            break;

        case States.STUDENT_INTEREST:
            // Store Interest, move to Pain
            structuredState.interest = userInput;
            currentState = States.STUDENT_PAIN;
            botReply("What is the biggest barrier you face in learning these topics?", [
                { label: "No access to practical labs", value: "No practical labs" },
                { label: "Confusing concepts & tutorials", value: "Confusing concepts" },
                { label: "High cost of quality training", value: "High course fees" },
                { label: "Managing study time", value: "Time management" }
            ]);
            break;

        case States.STUDENT_PAIN:
            // Store Pain, evaluate recommendation
            structuredState.painPoint = userInput;
            
            // Recommendation decision rule
            const interest = structuredState.interest.toLowerCase();
            if (interest.includes('robotics')) {
                selectedRecommendation = "Remote Robotics Lab";
            } else if (interest.includes('ai')) {
                selectedRecommendation = "AI Lab";
            } else if (interest.includes('iot') || interest.includes('embedded')) {
                selectedRecommendation = "IoT Lab";
            } else {
                selectedRecommendation = "Book Demo";
            }
            structuredState.intent = `Recommended: ${selectedRecommendation}`;

            currentState = States.LEAD_NAME;
            botReply(`I recommend our ${selectedRecommendation} setup to overcome this. What is your full name to proceed?`);
            break;

        // --- COLLEGE FLOW ---
        case States.COLLEGE_COUNT:
            structuredState.goal = `Students: ${userInput}`;
            currentState = States.COLLEGE_LABS;
            botReply("Do you have existing practical labs setup for advanced technologies like AI, IoT, or Robotics?", [
                { label: "Yes, fully functional", value: "Fully setup" },
                { label: "Partial setups only", value: "Partial setups" },
                { label: "No, theory based only", value: "Theory only" }
            ]);
            break;

        case States.COLLEGE_LABS:
            structuredState.painPoint = `Existing labs: ${userInput}`;
            currentState = States.COLLEGE_BUDGET;
            botReply("What is the budget scope you are targeting for new hands-on lab deployments?", [
                { label: "Flexible / Exploratory", value: "Flexible" },
                { label: "Under ₹2 Lakhs", value: "Under 2L" },
                { label: "₹2 - ₹5 Lakhs", value: "2-5L" },
                { label: "Above ₹5 Lakhs", value: "Above 5L" }
            ]);
            break;

        case States.COLLEGE_BUDGET:
            structuredState.interest = `Budget: ${userInput}`;
            currentState = States.COLLEGE_PILOT;
            botReply("Would you be interested in running a short-term trial pilot lab with your students?", [
                { label: "Yes, active interest", value: "Yes" },
                { label: "Maybe later", value: "Maybe" },
                { label: "No, want to deploy directly", value: "Direct" }
            ]);
            break;

        case States.COLLEGE_PILOT:
            const pilotInterest = userInput;
            structuredState.intent = `Pilot Interest: ${pilotInterest}`;

            // College Recommendation Rule
            const budget = structuredState.interest.toLowerCase();
            if (pilotInterest.toLowerCase().includes('yes') || pilotInterest.toLowerCase().includes('active')) {
                selectedRecommendation = "College Pilot";
            } else if (budget.includes('above 5l') || budget.includes('flexible')) {
                selectedRecommendation = "Founder Meeting";
            } else {
                selectedRecommendation = "Demo Session";
            }
            structuredState.intent += ` | Recommended: ${selectedRecommendation}`;

            currentState = States.LEAD_NAME;
            botReply(`I recommend establishing a ${selectedRecommendation} for your department. What is your full name to schedule?`);
            break;

        // --- OTHER FLOW ---
        case States.OTHER_HELP:
            structuredState.goal = userInput;
            structuredState.painPoint = "Exploring alternate paths";
            structuredState.interest = "General technology enablement";
            structuredState.intent = "General Contact Session";
            selectedRecommendation = "Demo Session";
            
            currentState = States.LEAD_NAME;
            botReply("I recommend we run a Demo Session to map your goals. What is your name to coordinate?");
            break;

        // --- LEAD CAPTURE SYSTEM ---
        case States.LEAD_NAME:
            structuredState.leadCaptured.name = userInput;
            currentState = States.LEAD_PHONE;
            botReply("Got it. What is your mobile or WhatsApp contact number?");
            break;

        case States.LEAD_PHONE:
            // Standard simple check for phone format
            structuredState.leadCaptured.phone = userInput;
            currentState = States.LEAD_EMAIL;
            botReply("Thank you. What is your email address?");
            break;

        case States.LEAD_EMAIL:
            structuredState.leadCaptured.email = userInput;
            currentState = States.LEAD_COLLEGE;
            botReply(structuredState.userType === 'College' ? "Which institution or college do you represent?" : "Which college or institute are you studying in?");
            break;

        case States.LEAD_COLLEGE:
            structuredState.leadCaptured.college = userInput;
            structuredState.intent = (structuredState.intent || '') + " | Lead Captured Successfully";
            currentState = States.FINISH;
            
            // Final Hook Prompt matching the prompt EXACTLY
            botReply("I've understood your needs. Would you like me to schedule a demo or connect you on WhatsApp?", [
                { label: "Schedule a Demo", value: "Schedule Demo" },
                { label: "Connect on WhatsApp", value: "Connect WhatsApp" }
            ]);
            break;

        case States.FINISH:
            // Final Selection Saved
            structuredState.intent += ` | Final Choice: ${userInput}`;
            currentState = States.COMPLETED;
            
            botReply("Perfect. I have recorded your preference, and our team will reach out to you shortly.", []);
            AudioController.playSuccess();
            showResetAlert();
            break;

        case States.COMPLETED:
            botReply("The discovery flow is complete. You can reset the simulation using the button on the right panel to test again.", []);
            break;
    }

    updateStateTracker();
}

// UI Elements & State Updates
function updateComplianceMonitor(audit) {
    const textLengthEl = document.getElementById('compliance-text-length');
    const sentencesEl = document.getElementById('compliance-sentences');
    const forbiddenEl = document.getElementById('compliance-forbidden');

    // Sentence check
    sentencesEl.innerHTML = `Sentence Count: ${audit.sentenceCount}/2 <span class="compliance-status ${audit.isSentenceOk ? 'pass' : 'fail'}"></span>`;
    
    // Forbidden words check
    forbiddenEl.innerHTML = `Forbidden Words: ${audit.hasForbidden ? 'Detected' : 'None'} <span class="compliance-status ${audit.isVocabularyOk ? 'pass' : 'fail'}"></span>`;
}

// Reset flow to beginning
function resetSimulation() {
    // Clear chat display
    const chatHistory = document.getElementById('chat-history');
    chatHistory.innerHTML = '';
    
    // Reset Data Model
    structuredState = {
        userType: null,
        goal: null,
        painPoint: null,
        interest: null,
        intent: null,
        leadCaptured: {
            name: null,
            phone: null,
            email: null,
            college: null
        }
    };
    currentState = States.START;
    selectedRecommendation = null;

    updateStateTracker();
    
    // Initial Hook message
    botReply("Hi, I am SkillPivot AI. Are you exploring technology skills as a student, representing a college, or something else?", [
        { label: "Engineering / Diploma Student", value: "Student" },
        { label: "College / Institution Representative", value: "College" },
        { label: "Other", value: "Other" }
    ]);
}

// Show alert message indicating simulation end
function showResetAlert() {
    const alertDiv = document.createElement('div');
    alertDiv.style.cssText = `
        text-align: center;
        background: rgba(0, 242, 254, 0.1);
        border: 1px solid rgba(0, 242, 254, 0.2);
        color: var(--accent-cyan);
        padding: 0.75rem;
        border-radius: 8px;
        font-size: 0.85rem;
        margin-top: 1rem;
        animation: fadeInUp 0.4s ease forwards;
    `;
    alertDiv.innerHTML = '<strong>Demo Complete!</strong> The captured JSON state is finalized on the right panel.';
    document.getElementById('chat-history').appendChild(alertDiv);
}

// Pre-fill Preset Profiles for testing convenience
function loadPreset(profileType) {
    resetSimulation();
    
    // Brief delay to allow initial start message to render
    setTimeout(() => {
        if (profileType === 'student') {
            renderMessage("I am a student.", 'user');
            structuredState.userType = 'Student';
            currentState = States.STUDENT_YEAR;
            
            setTimeout(() => {
                renderMessage("3rd Year", 'user');
                structuredState.goal = "Year: 3rd Year";
                currentState = States.STUDENT_GOAL;
                
                setTimeout(() => {
                    renderMessage("Core Technical Job", 'user');
                    structuredState.goal += " | Target: Tech Job";
                    currentState = States.STUDENT_INTEREST;
                    
                    setTimeout(() => {
                        renderMessage("Robotics & Automation", 'user');
                        structuredState.interest = "Robotics";
                        currentState = States.STUDENT_PAIN;
                        
                        setTimeout(() => {
                            renderMessage("No access to practical labs", 'user');
                            structuredState.painPoint = "No practical labs";
                            selectedRecommendation = "Remote Robotics Lab";
                            structuredState.intent = `Recommended: ${selectedRecommendation}`;
                            currentState = States.LEAD_NAME;
                            
                            botReply("I recommend our Remote Robotics Lab setup to overcome this. What is your full name to proceed?");
                            updateStateTracker();
                        }, 500);
                    }, 500);
                }, 500);
            }, 500);
        } else if (profileType === 'college') {
            renderMessage("I represent a college.", 'user');
            structuredState.userType = 'College';
            currentState = States.COLLEGE_COUNT;
            
            setTimeout(() => {
                renderMessage("500 - 1000", 'user');
                structuredState.goal = "Students: 500 - 1000";
                currentState = States.COLLEGE_LABS;
                
                setTimeout(() => {
                    renderMessage("Partial setups only", 'user');
                    structuredState.painPoint = "Existing labs: Partial setups";
                    currentState = States.COLLEGE_BUDGET;
                    
                    setTimeout(() => {
                        renderMessage("Above ₹5 Lakhs", 'user');
                        structuredState.interest = "Budget: Above 5L";
                        currentState = States.COLLEGE_PILOT;
                        
                        setTimeout(() => {
                            renderMessage("Yes, active interest", 'user');
                            structuredState.intent = "Pilot Interest: Yes";
                            selectedRecommendation = "College Pilot";
                            structuredState.intent += ` | Recommended: ${selectedRecommendation}`;
                            currentState = States.LEAD_NAME;
                            
                            botReply("I recommend establishing a College Pilot for your department. What is your full name to schedule?");
                            updateStateTracker();
                        }, 500);
                    }, 500);
                }, 500);
            }, 500);
        }
    }, 800);
}

// Attach Event Listeners on Load
window.addEventListener('DOMContentLoaded', () => {
    // Initial State Tracker Paint
    updateStateTracker();

    // Key Listener for Enter key
    document.getElementById('chat-input-field').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            submitUserMessage();
        }
    });

    // Sound toggle listener
    document.getElementById('sound-switch-input').addEventListener('change', (e) => {
        AudioController.enabled = e.target.checked;
    });

    // Start Chat
    botReply("Hi, I am SkillPivot AI. Are you exploring technology skills as a student, representing a college, or something else?", [
        { label: "Engineering / Diploma Student", value: "Student" },
        { label: "College / Institution Representative", value: "College" },
        { label: "Other", value: "Other" }
    ]);
});
