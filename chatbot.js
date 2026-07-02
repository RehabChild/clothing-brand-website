/* ===== RehabChild Chat Assistant ===== */
(function () {
  // ---- Real product data (kept in sync with shop.html) ----
  const PRODUCTS = [
    { name: "The Still Coat",   price: "GH₵ 980", category: "outerwear", img: "still-coat.jpg",     desc: "A long, quiet coat built for cold-weather stillness." },
    { name: "Rehab Tee",        price: "GH₵ 220", category: "tops",      img: "rehab-tee.jpg",       desc: "The everyday tee — soft cotton, brand signature fit." },
    { name: "Stage Trousers",   price: "GH₵ 420", category: "bottoms",   img: "stage-trousers.jpg",  desc: "Tailored trousers with room to move." },
    { name: "Healing Hoodie",   price: "GH₵ 380", category: "essentials",img: "healing-hoodie.jpg",  desc: "Heavyweight hoodie, the brand's core piece." },
    { name: "Quiet Shirt",      price: "GH₵ 290", category: "tops",      img: "quiet-shirt.jpg",     desc: "A relaxed button-up in muted tones." },
    { name: "The Rehab Jacket", price: "GH₵ 760", category: "outerwear", img: "rehab-jacket.jpg",    desc: "Structured outer layer, brand statement piece." },
    { name: "Still Shorts",     price: "GH₵ 240", category: "bottoms",   img: "still-shorts.jpg",    desc: "Lightweight shorts for warmer days." },
    { name: "Rehab Cap",        price: "GH₵ 160", category: "essentials",img: "rehab-cap.jpg",       desc: "Low-profile cap with subtle branding." },
    { name: "Stage Tote",       price: "GH₵ 195", category: "essentials",img: "stage-tote.jpg",      desc: "Canvas tote, everyday carry." }
  ];

  const PAGES = {
    home: "index.html", shop: "shop.html", lookbook: "lookbook.html",
    about: "about.html", contact: "contact.html"
  };

  function fmtProduct(p) {
    return `<a class="rc-product-card" href="${PAGES.shop}" target="_self">
      <img src="${p.img}" alt="${p.name}">
      <div><div class="rc-pname">${p.name}</div>
      <div class="rc-pprice">${p.price}</div></div>
    </a>`;
  }

  function productsByCategory(cat) {
    return PRODUCTS.filter(p => p.category === cat);
  }

  function cheapestUnder(amount) {
    return PRODUCTS.filter(p => parseInt(p.price.replace(/\D/g, "")) <= amount)
      .sort((a, b) => parseInt(a.price.replace(/\D/g, "")) - parseInt(b.price.replace(/\D/g, "")));
  }

  // ---- Intent matching ----
  function matchIntent(text) {
    const t = text.toLowerCase();
    if (/\b(hi|hello|hey|yo)\b/.test(t)) return "greeting";
    if (/(ship|deliver)/.test(t)) return "shipping";
    if (/(size|sizing|fit)/.test(t)) return "sizing";
    if (/(return|refund|exchange)/.test(t)) return "returns";
    if (/(contact|email|reach|whatsapp|phone)/.test(t)) return "contact";
    if (/(recommend|suggest|what should i (get|buy)|help me (find|choose))/.test(t)) return "recommend";
    if (/(hoodie|jacket|coat|tee|shirt|trouser|short|cap|tote)/.test(t)) return "specific_product";
    if (/(outerwear|jacket|coat)/.test(t)) return "cat_outerwear";
    if (/(top|shirt|tee)/.test(t)) return "cat_tops";
    if (/(bottom|trouser|short)/.test(t)) return "cat_bottoms";
    if (/(essential|accessor|cap|tote)/.test(t)) return "cat_essentials";
    if (/(cheap|budget|under|affordable)/.test(t)) return "budget";
    if (/(about|brand|story|who (are|is))/.test(t)) return "about";
    if (/(lookbook|collection|photos?)/.test(t)) return "lookbook";
    if (/(shop|buy|browse|products?)/.test(t)) return "shop";
    if (/(thank|thanks|thx)/.test(t)) return "thanks";
    return "unknown";
  }

  function botResponse(intent, raw) {
    switch (intent) {
      case "greeting":
        return { text: "Hey! Good to see you. What can I help you with?", chips: ["Shop", "Recommend me something", "Sizing", "Shipping"] };
      case "shop":
        return { text: `You can browse everything here: <a href="${PAGES.shop}">Shop the collection →</a>`, chips: ["Recommend me something", "Back to menu"] };
      case "lookbook":
        return { text: `Here's our latest visual lookbook: <a href="${PAGES.lookbook}">View Lookbook →</a>`, chips: ["Shop", "Back to menu"] };
      case "about":
        return { text: `You can read the full brand story here: <a href="${PAGES.about}">About RehabChild →</a>`, chips: ["Shop", "Back to menu"] };
      case "contact":
        return { text: `Best way to reach the team is our contact page — you can message us directly there: <a href="${PAGES.contact}">Contact →</a>`, chips: ["Back to menu"] };
      case "shipping":
        return { text: "I don't have exact shipping rates/timelines loaded yet — the team can confirm details for your location. Reach out here:", link: PAGES.contact, chips: ["Contact us", "Back to menu"] };
      case "sizing":
        return { text: "We don't have a size chart published yet — for the most accurate fit info, message the team directly and they'll help you out:", link: PAGES.contact, chips: ["Contact us", "Back to menu"] };
      case "returns":
        return { text: "Our return/exchange policy isn't published on the site yet — reach out and the team will sort you out:", link: PAGES.contact, chips: ["Contact us", "Back to menu"] };
      case "recommend":
        return { text: "Happy to help you find something. What are you shopping for?", chips: ["Outerwear", "Tops", "Bottoms", "Essentials", "Something under GH₵250"] };
      case "cat_outerwear":
        return { text: "Here's our outerwear:", products: productsByCategory("outerwear") };
      case "cat_tops":
        return { text: "Here's our tops:", products: productsByCategory("tops") };
      case "cat_bottoms":
        return { text: "Here's our bottoms:", products: productsByCategory("bottoms") };
      case "cat_essentials":
        return { text: "Here's our essentials:", products: productsByCategory("essentials") };
      case "budget": {
        const match = raw.match(/(\d{2,4})/);
        const amount = match ? parseInt(match[1]) : 250;
        const results = cheapestUnder(amount);
        return results.length
          ? { text: `Here's what we've got under GH₵${amount}:`, products: results }
          : { text: `Nothing under GH₵${amount} right now — our most affordable piece is the Rehab Cap at GH₵160.`, products: [PRODUCTS.find(p => p.name === "Rehab Cap")] };
      }
      case "specific_product": {
        const t = raw.toLowerCase();
        const found = PRODUCTS.find(p => t.includes(p.name.toLowerCase().replace("the ", "")));
        if (found) return { text: `${found.name} — ${found.desc}`, products: [found] };
        return { text: "I couldn't pin down that exact item — here's the full shop so you can browse:", chips: ["Shop", "Back to menu"] };
      }
      case "thanks":
        return { text: "Anytime! Let me know if you need anything else 🖤", chips: ["Back to menu"] };
      default:
        return { text: "I'm not totally sure about that one — but I can help you shop, find your size, or get in touch with the team.", chips: ["Shop", "Recommend me something", "Contact us"] };
    }
  }

  // ---- UI ----
  function buildUI() {
    const root = document.getElementById("rc-chatbot-root");
    if (!root) return;

    root.innerHTML = `
      <button id="rc-chat-toggle" aria-label="Open chat">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6">
          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
        </svg>
        <span id="rc-chat-badge">1</span>
      </button>

      <div id="rc-chat-window">
        <div id="rc-chat-header">
          <div>
            <div class="rc-title">RehabChild Assist</div>
            <div class="rc-sub">usually replies instantly</div>
          </div>
          <button id="rc-chat-close" aria-label="Close chat">×</button>
        </div>
        <div id="rc-chat-body"></div>
        <div id="rc-chat-input-row">
          <input id="rc-chat-input" type="text" placeholder="Ask me something..." autocomplete="off">
          <button id="rc-chat-send">Send</button>
        </div>
      </div>
    `;

    const toggle = document.getElementById("rc-chat-toggle");
    const win = document.getElementById("rc-chat-window");
    const closeBtn = document.getElementById("rc-chat-close");
    const body = document.getElementById("rc-chat-body");
    const input = document.getElementById("rc-chat-input");
    const send = document.getElementById("rc-chat-send");
    const badge = document.getElementById("rc-chat-badge");

    let greeted = false;

    toggle.addEventListener("click", () => {
      win.classList.toggle("rc-open");
      if (win.classList.contains("rc-open")) {
        badge.style.display = "none";
        if (!greeted) {
          greeted = true;
          addBotMessage({
            text: "Hi, welcome to RehabChild 🖤 I can help you navigate the site, find a product, or answer quick questions.",
            chips: ["Shop", "Recommend me something", "Sizing", "Shipping", "Contact us"]
          });
        }
        input.focus();
      }
    });
    closeBtn.addEventListener("click", () => win.classList.remove("rc-open"));

    function scrollDown() { body.scrollTop = body.scrollHeight; }

    function addUserMessage(text) {
      const el = document.createElement("div");
      el.className = "rc-msg rc-msg-user";
      el.textContent = text;
      body.appendChild(el);
      scrollDown();
    }

    function addBotMessage(res) {
      const el = document.createElement("div");
      el.className = "rc-msg rc-msg-bot";
      let html = res.text;
      if (res.link) html += ` <a href="${res.link}">Contact page →</a>`;
      el.innerHTML = html;
      body.appendChild(el);

      if (res.products && res.products.length) {
        const wrap = document.createElement("div");
        wrap.className = "rc-quick-replies";
        res.products.slice(0, 4).forEach(p => {
          wrap.innerHTML += fmtProduct(p);
        });
        body.appendChild(wrap);
      }

      if (res.chips && res.chips.length) {
        const chipWrap = document.createElement("div");
        chipWrap.className = "rc-quick-replies";
        res.chips.forEach(label => {
          const chip = document.createElement("button");
          chip.className = "rc-chip";
          chip.textContent = label;
          chip.addEventListener("click", () => handleUserInput(label === "Back to menu" ? "menu" : label));
          chipWrap.appendChild(chip);
        });
        body.appendChild(chipWrap);
      }
      scrollDown();
    }

    function handleUserInput(text) {
      if (!text.trim()) return;
      addUserMessage(text);
      input.value = "";
      if (text.toLowerCase() === "menu") {
        setTimeout(() => addBotMessage({ text: "Sure, what would you like to do?", chips: ["Shop", "Recommend me something", "Sizing", "Shipping", "Contact us"] }), 250);
        return;
      }
      const intent = matchIntent(text);
      setTimeout(() => addBotMessage(botResponse(intent, text)), 350);
    }

    send.addEventListener("click", () => handleUserInput(input.value));
    input.addEventListener("keydown", (e) => { if (e.key === "Enter") handleUserInput(input.value); });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", buildUI);
  } else {
    buildUI();
  }
})();
