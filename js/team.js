// ============================================
// DISCORD API INTEGRATION FOR TEAM PAGE
// Fetches and displays server members dynamically
// Separates human members from bots
// ============================================

const DISCORD_SERVER_ID = "1400134764996067428";
const DISCORD_WIDGET_API = `https://discord.com/api/guilds/${DISCORD_SERVER_ID}/widget.json`;

// ============================================
// FETCH DISCORD DATA
// ============================================
async function fetchDiscordMembers() {
  try {
    const response = await fetch(DISCORD_WIDGET_API);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching Discord data:", error);
    showError();
    return null;
  }
}

// ============================================
// CHECK IF MEMBER IS BOT
// ============================================
function isBot(member) {
  // Discord Widget API doesn't provide bot field or role information
  // We detect bots by matching usernames against common bot naming patterns
  // including keywords like "bot", "moderator", "music", "radio", etc.

  // Generic bot detection patterns (fallback)
  const botPatterns = [
    /bot$/i, // ends with "bot"
    /^bot/i, // starts with "bot"
    /\[bot\]/i, // contains [bot]
    /\(bot\)/i, // contains (bot)
    /Maki/i,
    /Apollo/i,
    /Medal/i,
    // /moderator/i, // common bot role names
    // /radio/i,
    // /music/i,
    // /reaction/i,
    // /auto/i,
    // /helper/i,
  ];

  // Check if username matches any generic bot pattern
  return botPatterns.some((pattern) => pattern.test(member.username));
}

// ============================================
// DISPLAY MEMBERS
// ============================================
function displayMembers(members) {
  const membersGrid = document.getElementById("membersGrid");
  const botsGrid = document.getElementById("botsGrid");

  if (!members || members.length === 0) {
    membersGrid.innerHTML = `
            <div class="no-members">
                <p>No members online at the moment</p>
            </div>
        `;
    botsGrid.innerHTML = `
            <div class="no-members">
                <p>No bots online at the moment</p>
            </div>
        `;
    return;
  }

  // Separate humans and bots using our detection function
  const humans = members.filter((member) => !isBot(member));
  const bots = members.filter((member) => isBot(member));

  // Sort members: online first, then by username
  const sortedHumans = humans.sort((a, b) => {
    if (a.status === "online" && b.status !== "online") return -1;
    if (a.status !== "online" && b.status === "online") return 1;
    return a.username.localeCompare(b.username);
  });

  const sortedBots = bots.sort((a, b) => {
    if (a.status === "online" && b.status !== "online") return -1;
    if (a.status !== "online" && b.status === "online") return 1;
    return a.username.localeCompare(b.username);
  });

  // Display humans
  if (sortedHumans.length > 0) {
    membersGrid.innerHTML = sortedHumans
      .map((member) => createMemberCard(member, false))
      .join("");
  } else {
    membersGrid.innerHTML = `
            <div class="no-members">
                <p>No human members online</p>
            </div>
        `;
  }

  // Display bots
  if (sortedBots.length > 0) {
    botsGrid.innerHTML = sortedBots
      .map((member) => createMemberCard(member, true))
      .join("");
  } else {
    botsGrid.innerHTML = `
            <div class="no-members">
                <p>No bots online</p>
            </div>
        `;
  }
}

// ============================================
// CREATE MEMBER CARD
// ============================================
function createMemberCard(member, isBotCard = false) {
  const statusClass = member.status === "online" ? "online" : "offline";
  const statusText = member.status === "online" ? "Online" : "Offline";

  // Get avatar URL or use default Discord avatar
  const avatarUrl =
    member.avatar_url || "https://cdn.discordapp.com/embed/avatars/0.png";

  // Bot badge
  const botBadge = isBotCard ? '<span class="bot-badge">🤖 BOT</span>' : "";

  // Get activity if available
  const activity = member.game
    ? `
        <div class="member-activity">
            <span class="activity-icon">🎮</span>
            <span class="activity-name">${escapeHtml(member.game.name)}</span>
        </div>
    `
    : "";

  return `
        <div class="member-card ${statusClass} ${isBotCard ? "bot-card" : ""}">
            <div class="member-avatar-container">
                <img src="${avatarUrl}" alt="${escapeHtml(
    member.username
  )}" class="member-avatar">
                <span class="status-indicator ${statusClass}"></span>
            </div>
            <div class="member-info">
                <h3 class="member-name">${escapeHtml(member.username)}</h3>
                ${botBadge}
                <span class="member-status ${statusClass}">${statusText}</span>
                ${activity}
            </div>
        </div>
    `;
}

// ============================================
// UPDATE STATISTICS
// ============================================
function updateStats(data) {
  const totalMembersEl = document.getElementById("totalMembers");
  const onlineMembersEl = document.getElementById("onlineMembers");
  const totalBotsEl = document.getElementById("totalBots");

  if (totalMembersEl && data.presence_count !== undefined) {
    animateNumber(totalMembersEl, data.presence_count);
  }

  if (onlineMembersEl && data.members) {
    const onlineCount = data.members.filter(
      (m) => m.status === "online" && !isBot(m)
    ).length;
    animateNumber(onlineMembersEl, onlineCount);
  }

  if (totalBotsEl && data.members) {
    const botCount = data.members.filter((m) => isBot(m)).length;
    animateNumber(totalBotsEl, botCount);
  }
}

// ============================================
// ANIMATE NUMBER
// ============================================
function animateNumber(element, target) {
  const duration = 1000;
  const start = 0;
  const startTime = performance.now();

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);

    const current = Math.floor(progress * target);
    element.textContent = current;

    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }

  requestAnimationFrame(update);
}

// ============================================
// SHOW ERROR
// ============================================
function showError() {
  const errorHTML = `
        <div class="error-message">
            <p>⚠️ Unable to load data</p>
            <p class="error-details">Make sure the Discord widget is enabled in server settings</p>
            <button onclick="loadMembers()" class="btn btn-primary mt-3">Retry</button>
        </div>
    `;

  const membersGrid = document.getElementById("membersGrid");
  const botsGrid = document.getElementById("botsGrid");

  membersGrid.innerHTML = errorHTML;
  botsGrid.innerHTML = "";
}

// ============================================
// SHOW LOADING
// ============================================
function showLoading() {
  const loadingHTML = `
        <div class="loading-container">
            <div class="loading-spinner"></div>
            <p>Loading...</p>
        </div>
    `;

  const membersGrid = document.getElementById("membersGrid");
  const botsGrid = document.getElementById("botsGrid");

  membersGrid.innerHTML = loadingHTML;
  botsGrid.innerHTML = loadingHTML;
}

// ============================================
// ESCAPE HTML
// ============================================
function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

// ============================================
// LOAD MEMBERS
// ============================================
async function loadMembers() {
  showLoading();

  const data = await fetchDiscordMembers();

  if (data) {
    displayMembers(data.members || []);
    updateStats(data);
  }
}

// ============================================
// INITIALIZE ON PAGE LOAD
// ============================================
document.addEventListener("DOMContentLoaded", () => {
  loadMembers();

  // Refresh members every 30 seconds
  setInterval(loadMembers, 30000);
});
