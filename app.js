// Theme toggle logic
const appRoot = document.getElementById('app-root');
const themeToggle = document.getElementById('theme-toggle');

function setTheme(mode) {
  appRoot.classList.toggle('dark-mode', mode === 'dark');
  appRoot.classList.toggle('light-mode', mode === 'light');
  themeToggle.textContent = mode === 'dark' ? '☀️' : '🌙';
  localStorage.setItem('theme', mode);
}

function getPreferredTheme() {
  return localStorage.getItem('theme') || 'light';
}

// Initialize theme
setTheme(getPreferredTheme());

themeToggle.addEventListener('click', () => {
  const current = appRoot.classList.contains('dark-mode') ? 'dark' : 'light';
  setTheme(current === 'dark' ? 'light' : 'dark');
});

// Chat logic
const chatForm = document.getElementById('chat-form');
const chatInput = document.getElementById('chat-input');
const chatMessages = document.getElementById('chat-messages');

function appendMessage(text, sender = 'user') {
  const msgDiv = document.createElement('div');
  msgDiv.className = `message ${sender}`;
  msgDiv.textContent = text;
  chatMessages.appendChild(msgDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Show welcome message above chatbox
const welcomeDiv = document.getElementById('welcome-message');
welcomeDiv.textContent = 'The world of ideas is wide open. Where shall we wander today, My Master?';

// Overwrite getAIResponse to use puter.ai.chat
function getAIResponse(userMsg) {
  return puter.ai.chat(userMsg);
}

// Voice toggle logic
const voiceToggle = document.getElementById('voice-toggle');
let voiceEnabled = localStorage.getItem('voiceEnabled') !== 'false';
function updateVoiceToggle() {
  if (voiceEnabled) {
    voiceToggle.classList.add('active');
    voiceToggle.textContent = '🔊';
    voiceToggle.title = 'Voice ON';
  } else {
    voiceToggle.classList.remove('active');
    voiceToggle.textContent = '🔈';
    voiceToggle.title = 'Voice OFF';
  }
}
updateVoiceToggle();
voiceToggle.addEventListener('click', () => {
  voiceEnabled = !voiceEnabled;
  localStorage.setItem('voiceEnabled', voiceEnabled);
  updateVoiceToggle();
});

function speakAIResponse(text) {
  if (!voiceEnabled) return;
  if (!('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel(); // Stop any ongoing speech
  const utter = new window.SpeechSynthesisUtterance(text);
  utter.lang = 'en-US';
  utter.rate = 1;
  utter.pitch = 1;
  utter.volume = 1;
  window.speechSynthesis.speak(utter);
}

chatForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const userMsg = chatInput.value.trim();
  if (!userMsg) return;
  appendMessage(userMsg, 'user');
  chatInput.value = '';
  chatInput.focus();
  // Show AI typing indicator
  const aiTyping = document.createElement('div');
  aiTyping.className = 'message ai';
  aiTyping.textContent = 'AI is typing...';
  chatMessages.appendChild(aiTyping);
  chatMessages.scrollTop = chatMessages.scrollHeight;
  // Get AI response
  const aiMsg = await getAIResponse(userMsg);
  aiTyping.remove();
  appendMessage(aiMsg, 'ai');
  // Speak the AI response
  if (aiMsg && typeof aiMsg === 'string') {
    speakAIResponse(aiMsg);
  }
});
