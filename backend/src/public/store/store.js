// Basic state (for demo). In production get from API.
let userCoins =
  parseInt(
    document.getElementById("coinBalance").innerText.replace(/,/g, "")
  ) || 0;
const modal = document.getElementById("modal");
const modalTitle = document.getElementById("modalTitle");
const modalSubtitle = document.getElementById("modalSubtitle");
const modalBody = document.getElementById("modalBody");
const modalActions = document.getElementById("modalActions");
const modalConfirmBtn = document.getElementById("modalConfirmBtn");
const modalMessage = document.getElementById("modalMessage");

function formatCoins(n) {
  return n.toLocaleString();
}

// Open modal. mode: 'featured-pack' or 'item'
function openModal(mode, card = null) {
  modalMessage.style.display = "none";
  if (mode === "featured-pack") {
    const price = 1200;
    modalTitle.innerText = "Algorithm Master Bundle — Preview";
    modalSubtitle.innerText = "Price: $" + formatCoins(price);
    modalBody.innerHTML = `
                    <p style="margin-bottom:0.8rem;color:var(--text-secondary)">Guided videos, 150 problems, interview guide, certificate.</p>
                    <ul style="color:var(--text-secondary);list-style:disc;margin-left:1rem;">
                        <li>150 premium problems</li>
                        <li>Video explanations</li>
                        <li>Certificate</li>
                    </ul>
                `;
    modalConfirmBtn.onclick = () =>
      redeemDigital("Algorithm Master Bundle", price);
  } else if (mode === "item" && card) {
    const title = card.dataset.title || "Item";
    const price = parseInt(card.dataset.price || 0);
    const category = card.dataset.category || "digital";
    const description =
      card.querySelector(".product-description")?.innerText || "";
    modalTitle.innerText = title + " — Preview";
    modalSubtitle.innerText = "Price: $" + formatCoins(price);
    modalBody.innerHTML = `
                    <p style="margin-bottom:0.8rem;color:var(--text-secondary)">${description}</p>
                    <div style="display:flex;gap:1rem;margin-top:0.6rem;">
                        <div style="background:var(--card-bg);padding:.6rem;border-radius:8px;border:1px solid var(--border-color);min-width:110px;text-align:center;">
                            <div style="font-size:1rem;color:var(--text-secondary)">Difficulty</div>
                            <div style="font-family:Orbitron;margin-top:.4rem">${card.dataset.difficulty}</div>
                        </div>
                        <div style="background:var(--card-bg);padding:.6rem;border-radius:8px;border:1px solid var(--border-color);min-width:110px;text-align:center;">
                            <div style="font-size:1rem;color:var(--text-secondary)">Topic</div>
                            <div style="font-family:Orbitron;margin-top:.4rem">${card.dataset.topic}</div>
                        </div>
                    </div>
                `;

    if (category === "swag") {
      // shipping form
      modalBody.innerHTML += `
                        <div style="margin-top:1rem;">
                            <label style="display:block;color:var(--text-secondary);margin-bottom:6px">Shipping Address</label>
                            <textarea id="shippingAddress" style="width:100%;padding:0.6rem;background:var(--card-bg);border:1px solid var(--border-color);color:var(--text-primary);border-radius:8px;" placeholder="Full name, street, city, country, postal code"></textarea>
                        </div>
                    `;
      modalConfirmBtn.onclick = () => redeemSwag(title, price);
    } else {
      modalConfirmBtn.onclick = () => redeemDigital(title, price);
    }
  }

  modal.classList.add("active");
}

function closeModal() {
  modal.classList.remove("active");
  modalBody.innerHTML = "";
  modalConfirmBtn.onclick = null;
}

// Simulate digital redemption (instant)
function redeemDigital(title, price) {
  if (userCoins < price) {
    showModalMessage(
      "Not enough PlayCoins. Earn more by solving problems or contests.",
      false
    );
    return;
  }
  // deduct
  userCoins -= price;
  document.getElementById("coinBalance").innerText = formatCoins(userCoins);
  // visual feedback
  modalBody.innerHTML = `<p style="color:var(--text-secondary)">Thanks! "${title}" is unlocked and added to your library. Check your <strong>Library</strong> or Profile to access it.</p>`;
  showModalMessage("Redeemed successfully!", true);
  modalConfirmBtn.style.display = "none";
  setTimeout(() => {
    modalConfirmBtn.style.display = "";
  }, 1800);
}

// Simulate swag redemption (requires address)
function redeemSwag(title, price) {
  if (userCoins < price) {
    showModalMessage(
      "Not enough PlayCoins to redeem swag. Earn more and try again.",
      false
    );
    return;
  }
  const address = document.getElementById("shippingAddress")?.value.trim();
  if (!address) {
    showModalMessage(
      "Please enter a shipping address to redeem this item.",
      false
    );
    return;
  }
  // deduct
  userCoins -= price;
  document.getElementById("coinBalance").innerText = formatCoins(userCoins);
  modalBody.innerHTML = `<p style="color:var(--text-secondary)">Thanks! "${title}" has been ordered. You will receive an email for shipping confirmation. Shipping times vary by region.</p>`;
  showModalMessage("Order placed! We emailed you the next steps.", true);
  modalConfirmBtn.style.display = "none";
  setTimeout(() => {
    modalConfirmBtn.style.display = "";
  }, 1800);
}

function showModalMessage(text, success = true) {
  modalMessage.style.display = "block";
  modalMessage.style.color = success ? "var(--success)" : "var(--danger)";
  modalMessage.innerText = text;
}

// Search & Filters
const searchInput = document.getElementById("searchInput");
const topicFilter = document.getElementById("topicFilter");
const difficultyFilter = document.getElementById("difficultyFilter");
const priceFilter = document.getElementById("priceFilter");
const productGrid = document.getElementById("productGrid");
const productCards = Array.from(productGrid.children);

function applyFilters() {
  const query = searchInput.value.toLowerCase();
  const topic = topicFilter.value;
  const diff = difficultyFilter.value;
  const price = priceFilter.value;

  productCards.forEach((card) => {
    const title = (card.dataset.title || "").toLowerCase();
    const topicCard = (card.dataset.topic || "").toLowerCase();
    const diffCard = (card.dataset.difficulty || "").toLowerCase();
    const priceCard = parseInt(card.dataset.price || 0);

    let visible = true;

    if (query && !(title.includes(query) || topicCard.includes(query)))
      visible = false;
    if (topic !== "all" && topic !== topicCard) visible = false;
    if (diff !== "all" && diff !== diffCard) visible = false;
    if (price !== "all") {
      if (price === "free" && priceCard > 0) visible = false;
      else if (price === "0-500" && !(priceCard > 0 && priceCard <= 500))
        visible = false;
      else if (price === "500-1000" && !(priceCard > 500 && priceCard <= 1000))
        visible = false;
      else if (price === "1000+" && !(priceCard > 1000)) visible = false;
    }

    card.style.display = visible ? "" : "none";
  });
}

searchInput.addEventListener("input", applyFilters);
topicFilter.addEventListener("change", applyFilters);
difficultyFilter.addEventListener("change", applyFilters);
priceFilter.addEventListener("change", applyFilters);

// Category tabs
document.querySelectorAll(".category-tab").forEach((tab) => {
  tab.addEventListener("click", () => {
    document
      .querySelectorAll(".category-tab")
      .forEach((t) => t.classList.remove("active"));
    tab.classList.add("active");
    const cat = tab.dataset.category;
    if (cat === "all") {
      productCards.forEach((c) => (c.style.display = ""));
    } else {
      productCards.forEach((c) => {
        c.style.display = c.dataset.category === cat ? "" : "none";
      });
    }
  });
});

// Close modal on backdrop click
modal.addEventListener("click", (e) => {
  if (e.target === modal) closeModal();
});

// Quick preview when clicking card
productCards.forEach((card) => {
  card.addEventListener("dblclick", () => openModal("item", card));
});

// Accessibility: ESC closes modal
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && modal.classList.contains("active")) closeModal();
});


window.addEventListener("scroll", () => {
  const navbar = document.querySelector(".navbar");
  if (window.scrollY > 50) {
    navbar.style.background = "transparent";
  } else {
    navbar.style.background = "rgba(26, 26, 26, 0.95)";
  }
});
