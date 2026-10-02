function esc(s) { const d = document.createElement("div"); d.textContent = s ?? ""; return d.innerHTML; }
let currentUserId = null;

document.addEventListener("DOMContentLoaded", async () => {
  const { data } = await supabaseClient.auth.getSession();
  if (!data.session) { location.href = "login.html"; return; }
  currentUserId = data.session.user.id;

  document.querySelectorAll(".tab-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".tab-btn").forEach((b) => b.classList.remove("active"));
      document.querySelectorAll(".tab-pane").forEach((p) => p.classList.remove("active"));
      btn.classList.add("active");
      document.getElementById("pane-" + btn.dataset.tab).classList.add("active");
    });
  });

  document.getElementById("submitVerificationBtn").addEventListener("click", submitVerification);

  loadEngineers();
  loadMyVerificationStatus();
});

async function loadEngineers() {
  const grid = document.getElementById("engineerGrid");
  const { data, error } = await supabaseClient.rpc("get_verified_engineers");

  if (error) { grid.innerHTML = `<div class="empty-state"><p>Couldn't load engineers.</p></div>`; return; }

  if (!data || data.length === 0) {
    grid.innerHTML = `<div class="empty-state"><p>No verified engineers listed yet.</p></div>`;
    return;
  }

  grid.innerHTML = data.map((e) => `
    <div class="card">
      <div class="e-name">👷 ${esc(e.full_name || "Engineer")}</div>
      ${e.province ? `<div class="e-row">📍 ${esc(e.province)}</div>` : ""}
      ${e.phone ? `<div class="e-row">📞 ${esc(e.phone)}</div>` : ""}
    </div>
  `).join("");
}

async function submitVerification() {
  const url = document.getElementById("fDocUrl").value.trim();
  const statusEl = document.getElementById("verifyStatus");
  const btn = document.getElementById("submitVerificationBtn");

  if (!url) { statusEl.textContent = "Document URL is required."; statusEl.style.color = "#ff6b6b"; return; }

  btn.disabled = true;
  const { error } = await supabaseClient.from("engineer_verifications").insert({
    user_id: currentUserId,
    document_url: url,
  });
  btn.disabled = false;

  if (error) {
    statusEl.textContent = "Failed: " + error.message;
    statusEl.style.color = "#ff6b6b";
  } else {
    statusEl.textContent = "Submitted! An admin will review it.";
    statusEl.style.color = "#22e0ab";
    document.getElementById("fDocUrl").value = "";
    loadMyVerificationStatus();
  }
}

async function loadMyVerificationStatus() {
  const el = document.getElementById("verificationStatusDisplay");
  const { data, error } = await supabaseClient
    .from("engineer_verifications")
    .select("status, created_at, rejection_reason")
    .eq("user_id", currentUserId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error || !data) { el.textContent = ""; return; }

  const labels = { pending: "⏳ Pending review", approved: "✓ Approved", rejected: "✕ Rejected" };
  el.textContent = `Latest submission: ${labels[data.status] || data.status}` + (data.rejection_reason ? ` — ${data.rejection_reason}` : "");
}
