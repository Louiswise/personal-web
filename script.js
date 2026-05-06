const fallbackSiteData = {
  profile: {
    name: "鹿餐溪",
    title: "全国酒店代理人 / 小红书运营 / AI 创作者",
    email: "1132953465@qq.com",
    summary: "我把全国酒店代订经验、小红书内容运营和 AI 自动化工具连接起来，让客户看到更清晰、更稳定、更可信的服务能力。",
    resumeUrl: "assets/resumes/resume.pdf"
  },
  accounts: {
    email: "mailto:1132953465@qq.com",
    xiaohongshu: "https://www.xiaohongshu.com/user/profile/66a1cd04000000002401f514",
    xiaohongshuName: "云端出行定制"
  },
  resumeCards: [],
  skills: [],
  projects: [],
  notes: []
};

const customCursor = document.querySelector(".custom-cursor");
const cursorEnabled = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const escapeHtml = (value) =>
  String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

const renderList = (items = []) => items.map((item) => `<li>${escapeHtml(item)}</li>`).join("");

const renderTags = (items = []) =>
  items.map((item) => `<span class="project-tag">${escapeHtml(item)}</span>`).join("");

const renderResumeCards = (cards = []) => {
  const target = document.querySelector('[data-render="resume-cards"]');
  if (!target) return;

  target.innerHTML = cards
    .map(
      (card, index) => `
        <article class="resume-card spotlight-card reveal" data-reveal-delay="${index * 80}">
          <div class="resume-card-header">
            <span class="card-index">${escapeHtml(card.index)}</span>
            <span class="privacy-pill">公开版</span>
          </div>
          <div class="resume-card-body">
            <p class="resume-card-subtitle">${escapeHtml(card.subtitle)}</p>
            <h3>${escapeHtml(card.title)}</h3>
            <p>${escapeHtml(card.summary)}</p>
          </div>
          <div class="project-tags" aria-label="履历标签">${renderTags(card.highlights)}</div>
          <p class="privacy-note">${escapeHtml(card.privacyNote)}</p>
        </article>
      `
    )
    .join("");
};

const loadSiteData = async () => {
  try {
    const response = await fetch("data/site.json", { cache: "no-store" });
    if (!response.ok) throw new Error(`data/site.json ${response.status}`);
    return await response.json();
  } catch (error) {
    console.warn("使用内置备用数据。通过本地服务器或 Vercel 访问时会读取 data/site.json。", error);
    return fallbackSiteData;
  }
};

const setText = (selector, text) => {
  document.querySelectorAll(selector).forEach((element) => {
    element.textContent = text || "";
  });
};

const bindProfile = ({ profile, accounts }) => {
  Object.entries(profile || {}).forEach(([key, value]) => {
    setText(`[data-profile="${key}"]`, value);
  });

  Object.entries(accounts || {}).forEach(([key, value]) => {
    setText(`[data-account="${key}"]`, value);
    document.querySelectorAll(`[data-account-link="${key}"]`).forEach((link) => {
      if (!(link instanceof HTMLAnchorElement) || !value) return;
      link.href = value;
      if (key === "email") {
        link.textContent = profile.email || value.replace("mailto:", "");
      }
    });
  });
};

const renderSkills = (skills = []) => {
  const target = document.querySelector('[data-render="skills"]');
  if (!target) return;

  target.innerHTML = skills
    .map((skill, index) => {
      const className =
        index === 0
          ? "bento-card bento-large spotlight-card reveal"
          : index === skills.length - 1
            ? "bento-card bento-wide spotlight-card reveal"
            : "bento-card spotlight-card reveal";

      return `
        <article class="${className}" data-reveal-delay="${index * 80}">
          <span class="card-index">${escapeHtml(skill.index)}</span>
          <h3>${escapeHtml(skill.title)}</h3>
          <p>${escapeHtml(skill.description)}</p>
        </article>
      `;
    })
    .join("");
};

const renderHomeProjects = (projects = []) => {
  const target = document.querySelector('[data-render="home-projects"]');
  if (!target) return;

  target.innerHTML = projects
    .map((project, index) => {
      const demoLink = project.demoUrl
        ? `<a class="button button-secondary button-small" href="${escapeHtml(project.demoUrl)}" target="_blank" rel="noreferrer">测试 AI 客服</a>`
        : "";

      return `
        <article class="project-row project-row-detailed spotlight-card reveal" data-reveal-delay="${index * 100}">
          <div class="project-row-heading">
            <span class="card-index">${escapeHtml(project.index)}</span>
            <h3>${escapeHtml(project.name)}</h3>
            <span class="project-status">${escapeHtml(project.status)}</span>
          </div>
          <div class="project-row-body">
            <p>${escapeHtml(project.summary || project.description)}</p>
            <div class="project-tags">${renderTags(project.skills)}</div>
            ${demoLink}
          </div>
        </article>
      `;
    })
    .join("");
};

const renderArticles = (projects = [], accounts = {}) => {
  const target = document.querySelector('[data-render="articles"]');
  if (!target) return;

  target.innerHTML = projects
    .map((project, index) => {
      const callout =
        project.anchor === "redbook"
          ? `<div class="inline-callout"><span>账号</span><a href="${escapeHtml(accounts.xiaohongshu)}" target="_blank" rel="noreferrer">${escapeHtml(accounts.xiaohongshuName)}</a></div>`
          : "";
      const demoCallout = project.demoUrl
        ? `<div class="inline-callout demo-callout"><span>${escapeHtml(project.demoText || "打开公开测试页面体验这个项目。")}</span><a class="button button-primary button-small" href="${escapeHtml(project.demoUrl)}" target="_blank" rel="noreferrer">打开测试页面</a></div>`
        : "";

      return `
        <article id="${escapeHtml(project.anchor || project.id)}" class="article-panel project-detail-card spotlight-card reveal" data-reveal-delay="${index * 80}">
          <div class="project-detail-header">
            <span class="card-index">${escapeHtml(project.index)}</span>
            <span class="project-category">${escapeHtml(project.category)}</span>
            <span class="project-status">${escapeHtml(project.status)}</span>
          </div>
          <h2>${escapeHtml(project.name)}</h2>
          <p class="project-summary">${escapeHtml(project.summary)}</p>

          <div class="project-visual-grid">
            <section class="project-fact">
              <span>问题</span>
              <p>${escapeHtml(project.problem)}</p>
            </section>
            <section class="project-fact">
              <span>结果</span>
              <ul>${renderList(project.result)}</ul>
            </section>
          </div>

          <section class="project-process">
            <span>我的做法</span>
            <ol>${renderList(project.solution)}</ol>
          </section>

          <div class="project-tags" aria-label="能力标签">${renderTags(project.skills)}</div>
          ${demoCallout}
          ${callout}
        </article>
      `;
    })
    .join("");
};

const renderNotes = (notes = []) => {
  const target = document.querySelector('[data-render="notes"]');
  if (!target) return;

  target.innerHTML = notes
    .map(
      (note, index) => `
        <article class="note spotlight-card reveal" data-reveal-delay="${index * 100}">
          <time datetime="2026-04-30">${escapeHtml(note.index)}</time>
          <h3>${escapeHtml(note.title)}</h3>
          <p>${escapeHtml(note.description)}</p>
        </article>
      `
    )
    .join("");
};

const initNavigation = () => {
  const menuButton = document.querySelector(".menu-toggle");
  const siteNav = document.querySelector(".site-nav");

  if (!menuButton || !siteNav) return;

  menuButton.addEventListener("click", () => {
    const isOpen = menuButton.getAttribute("aria-expanded") === "true";
    menuButton.setAttribute("aria-expanded", String(!isOpen));
    siteNav.classList.toggle("is-open", !isOpen);
  });

  siteNav.addEventListener("click", (event) => {
    if (event.target instanceof HTMLAnchorElement) {
      menuButton.setAttribute("aria-expanded", "false");
      siteNav.classList.remove("is-open");
    }
  });
};

const initCursor = () => {
  if (!customCursor || !cursorEnabled) return;

  let cursorX = -120;
  let cursorY = -120;
  let targetX = -120;
  let targetY = -120;
  let clickTimer;
  const interactiveSelector = "a, button, input, textarea, select, summary, label, [role='button'], .button, .menu-toggle, .nav-cta";

  const hideCursor = () => {
    customCursor.classList.remove("is-visible", "is-hovering", "is-clicking");
    document.body.classList.remove("cursor-selecting");
  };

  const renderCursor = () => {
    cursorX += (targetX - cursorX) * 0.28;
    cursorY += (targetY - cursorY) * 0.28;
    customCursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0)`;
    requestAnimationFrame(renderCursor);
  };

  window.addEventListener(
    "pointermove",
    (event) => {
      targetX = event.clientX - 35;
      targetY = event.clientY - 35;
      customCursor.classList.add("is-visible");
    },
    { passive: true }
  );

  window.addEventListener("pointerleave", hideCursor);
  document.addEventListener("mouseout", (event) => {
    if (!event.relatedTarget && !event.toElement) hideCursor();
  });
  window.addEventListener("blur", hideCursor);
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) hideCursor();
  });

  document.addEventListener(
    "pointerdown",
    (event) => {
      const interactiveTarget = event.target instanceof Element && event.target.closest(interactiveSelector);
      if (interactiveTarget) document.body.classList.add("cursor-selecting");
      customCursor.classList.add("is-clicking");
      window.clearTimeout(clickTimer);
    },
    true
  );

  const clearPressedCursor = () => {
    document.body.classList.remove("cursor-selecting");
    clickTimer = window.setTimeout(() => customCursor.classList.remove("is-clicking"), 180);
  };

  window.addEventListener("pointerup", clearPressedCursor);
  window.addEventListener("pointercancel", clearPressedCursor);
  window.addEventListener("keyup", (event) => {
    if (event.key === "Escape") clearPressedCursor();
  });

  renderCursor();
};

const initSpotlights = () => {
  document.querySelectorAll(".spotlight-card").forEach((card) => {
    card.addEventListener("pointermove", (event) => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty("--spotlight-x", `${event.clientX - rect.left}px`);
      card.style.setProperty("--spotlight-y", `${event.clientY - rect.top}px`);
    });
  });
};

const initReveal = () => {
  const revealItems = document.querySelectorAll(".reveal");

  if (reduceMotion) {
    revealItems.forEach((item) => item.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const delay = Number(entry.target.dataset.revealDelay || 0);
        window.setTimeout(() => entry.target.classList.add("is-visible"), delay);
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.18 }
  );

  revealItems.forEach((item) => observer.observe(item));
};

const initParallax = () => {
  const parallaxHero = document.querySelector(".parallax-hero");
  if (!parallaxHero || reduceMotion) return;

  const updateHero = () => {
    const progress = Math.min(window.scrollY / (window.innerHeight * 0.5), 1);
    parallaxHero.style.opacity = String(1 - progress * 0.55);
    parallaxHero.style.transform = `translateY(${progress * 80}px) scale(${1 - progress * 0.045})`;
  };

  updateHero();
  window.addEventListener("scroll", updateHero, { passive: true });
};

const readDifyAnswer = (payload) => {
  const outputs = payload?.data?.outputs || payload?.outputs || {};
  const candidates = [
    outputs.response,
    outputs.responseString,
    outputs.answer,
    outputs.text,
    outputs.result,
    outputs.output
  ];
  const value = candidates.find((item) => typeof item === "string" && item.trim());
  if (value) return value;

  const firstString = Object.values(outputs).find((item) => typeof item === "string" && item.trim());
  return firstString || "AI customer service has replied, but the response format needs to be adjusted.";
};

const initAiAssistant = () => {
  const mount = document.querySelector("[data-ai-assistant]");
  const isEmbedded = Boolean(mount);
  const quickQuestions = [
    "热门酒店套餐有哪些？",
    "价格包含什么？",
    "可以升级房型吗？",
    "如何确认预订？",
    "有接送机服务吗？"
  ];
  const waitingStages = [
    { after: 0, tone: "正在处理", text: "已收到您的问题，正在为您查询相关信息", hint: "通常需要 5-15 秒" },
    { after: 1200, tone: "正在处理", text: "正在接收您的咨询", hint: "通常需要 5-15 秒" },
    { after: 2800, tone: "正在处理", text: "正在整理相关酒店信息", hint: "正在匹配更合适的答复" },
    { after: 5600, tone: "即将完成", text: "正在核对权益、房型与入住政策", hint: "还需要再核对几秒" },
    { after: 8500, tone: "查询稍慢", text: "当前查询稍慢，正在继续为您处理", hint: "这个问题需要多核对几秒，感谢您的耐心等待。" },
    { after: 15000, tone: "查询稍慢", text: "当前响应较慢，您可以继续等待，或稍后重新发送。", hint: "您可以继续等待，或使用下方操作。" },
    { after: 25000, tone: "可重新生成", text: "仍在等待结果，您可以重新生成或复制刚才的问题。", hint: "如需继续，我会重新为您发起一次查询。" }
  ];
  const requestTimeoutMs = 30000;
  const assistant = document.createElement("section");
  assistant.className = isEmbedded ? "ai-assistant ai-assistant-embedded is-open" : "ai-assistant";
  assistant.setAttribute("aria-label", "AI customer service");
  assistant.innerHTML = `
    ${isEmbedded ? "" : `<button class="ai-assistant-toggle" type="button" aria-expanded="false" aria-label="Open AI customer service">AI</button>`}
    <div class="ai-assistant-panel" aria-hidden="${isEmbedded ? "false" : "true"}">
      <div class="ai-assistant-header">
        <div>
          <strong>AI 客服</strong>
          <span>酒店咨询 / 预算 / 行程偏好</span>
        </div>
        ${isEmbedded ? "" : `<button class="ai-assistant-close" type="button" aria-label="Close AI customer service">x</button>`}
      </div>
      <div class="ai-quick-questions" aria-label="快捷咨询"></div>
      <div class="ai-assistant-messages" aria-live="polite">
        <div class="ai-message ai-message-bot">你好，我可以帮你了解酒店代订、预算建议和入住偏好。请直接输入问题。</div>
      </div>
      <form class="ai-assistant-form">
        <textarea name="query" rows="2" placeholder="输入你的问题..." required></textarea>
        <button type="submit">发送</button>
      </form>
    </div>
  `;

  if (mount) {
    mount.appendChild(assistant);
  } else {
    document.body.appendChild(assistant);
  }

  const toggle = assistant.querySelector(".ai-assistant-toggle");
  const close = assistant.querySelector(".ai-assistant-close");
  const panel = assistant.querySelector(".ai-assistant-panel");
  const messages = assistant.querySelector(".ai-assistant-messages");
  const form = assistant.querySelector(".ai-assistant-form");
  const input = form.querySelector("textarea");
  const submitButton = form.querySelector("button");
  const quickContainer = assistant.querySelector(".ai-quick-questions");
  const timers = new Set();
  let activeController = null;
  let pendingQuery = "";
  let isSubmitting = false;
  let shouldStickToBottom = true;
  let requestSerial = 0;
  let visitorId = window.localStorage.getItem("aiAssistantVisitorId");

  if (!visitorId) {
    visitorId = `visitor-${Date.now()}-${Math.random().toString(16).slice(2)}`;
    window.localStorage.setItem("aiAssistantVisitorId", visitorId);
  }

  const setOpen = (isOpen) => {
    assistant.classList.toggle("is-open", isOpen);
    if (toggle) toggle.setAttribute("aria-expanded", String(isOpen));
    panel.setAttribute("aria-hidden", String(!isOpen));
    if (isOpen) window.setTimeout(() => input.focus(), 120);
  };

  const trackTimer = (timer) => {
    timers.add(timer);
    return timer;
  };

  const clearTimers = () => {
    timers.forEach((timer) => window.clearTimeout(timer));
    timers.clear();
  };

  const isNearBottom = () => messages.scrollHeight - messages.scrollTop - messages.clientHeight < 88;

  const scrollToBottom = (force = false) => {
    if (!force && !shouldStickToBottom) return;
    messages.scrollTo({ top: messages.scrollHeight, behavior: reduceMotion ? "auto" : "smooth" });
  };

  const addMessage = (text, type) => {
    const message = document.createElement("div");
    message.className = `ai-message ai-message-${type}`;
    message.textContent = text;
    messages.appendChild(message);
    scrollToBottom(type === "user");
    return message;
  };

  const renderQuickQuestions = () => {
    quickContainer.innerHTML = quickQuestions
      .map((question) => `<button class="ai-quick-question" type="button">${escapeHtml(question)}</button>`)
      .join("");

    quickContainer.querySelectorAll(".ai-quick-question").forEach((button) => {
      button.addEventListener("click", () => {
        const question = button.textContent.trim();
        if (question) void submitQuery(question);
      });
    });
  };

  const setQuickQuestionsVisible = (visible) => {
    quickContainer.classList.toggle("is-collapsed", !visible);
  };

  const createWaitingMarkup = (stage, showActions = false, query = "") => `
    <div class="ai-waiting-message" data-waiting-stage>
      <div class="ai-waiting-topline">
        <span class="ai-waiting-tone">${escapeHtml(stage.tone)}</span>
        <span class="ai-typing-dots" aria-hidden="true"><i></i><i></i><i></i></span>
      </div>
      <p class="ai-waiting-text">${escapeHtml(stage.text)}</p>
      <div class="ai-waiting-skeleton" aria-hidden="true"><span></span><span></span></div>
      <div class="ai-soft-progress" aria-hidden="true"><span></span></div>
      <p class="ai-waiting-hint">${escapeHtml(stage.hint)}</p>
      ${
        showActions
          ? `<div class="ai-message-actions">
              <button type="button" data-ai-action="retry">重新生成</button>
              <button type="button" data-ai-action="copy" data-copy-text="${escapeHtml(query)}">复制我的问题</button>
              <button type="button" data-ai-action="quick">返回快捷咨询</button>
            </div>`
          : ""
      }
    </div>
  `;

  const bindMessageActions = (message, query) => {
    message.querySelectorAll("[data-ai-action]").forEach((button) => {
      button.addEventListener("click", () => {
        const action = button.dataset.aiAction;
        if (action === "retry") {
          if (activeController) activeController.abort();
          void submitQuery(query, { retry: true });
        }
        if (action === "copy") {
          navigator.clipboard?.writeText(query).catch((error) => console.warn("Copy failed", error));
        }
        if (action === "quick") {
          setQuickQuestionsVisible(true);
          quickContainer.scrollIntoView({ block: "nearest", behavior: reduceMotion ? "auto" : "smooth" });
        }
      });
    });
  };

  const updateWaitingMessage = (message, stage, query) => {
    if (!message || message.dataset.state !== "waiting") return;
    message.classList.remove("is-stage-changing");
    void message.offsetWidth;
    message.classList.add("is-stage-changing");
    message.innerHTML = createWaitingMarkup(stage, stage.after >= 25000, query);
    bindMessageActions(message, query);
    scrollToBottom();
  };

  const startWaitingStages = (message, query) => {
    waitingStages.forEach((stage) => {
      trackTimer(window.setTimeout(() => updateWaitingMessage(message, stage, query), stage.after));
    });
  };

  const setLoading = (loading) => {
    isSubmitting = loading;
    input.setAttribute("aria-busy", String(loading));
    submitButton.disabled = loading;
    submitButton.classList.toggle("is-loading", loading);
    submitButton.textContent = loading ? "处理中" : "发送";
  };

  const showErrorMessage = (message, query) => {
    message.dataset.state = "error";
    message.classList.add("ai-message-error");
    message.innerHTML = `
      <strong>抱歉，当前响应有些慢</strong>
      <p>您可以重新生成一次，我会重新为您查询。</p>
      <div class="ai-message-actions">
        <button type="button" data-ai-action="retry">重新生成</button>
      </div>
    `;
    bindMessageActions(message, query);
    scrollToBottom(true);
  };

  const submitQuery = async (query, options = {}) => {
    query = query.trim();
    if (!query) return;
    if (isSubmitting && query === pendingQuery && !options.retry) return;
    if (isSubmitting && !options.retry) return;

    if (activeController) {
      activeController.abort();
      activeController = null;
    }

    clearTimers();
    pendingQuery = query;
    shouldStickToBottom = true;
    setQuickQuestionsVisible(false);

    if (!options.retry) addMessage(query, "user");

    input.value = "";
    setLoading(true);

    const pendingMessage = addMessage("", "bot");
    pendingMessage.dataset.state = "waiting";
    updateWaitingMessage(pendingMessage, waitingStages[0], query);
    startWaitingStages(pendingMessage, query);

    activeController = new AbortController();
    const requestId = ++requestSerial;
    const timeout = trackTimer(window.setTimeout(() => activeController?.abort(), requestTimeoutMs));

    try {
      const response = await fetch("/api/dify/workflow", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: activeController.signal,
        body: JSON.stringify({
          inputs: { query },
          response_mode: "blocking",
          user: visitorId
        })
      });

      if (!response.ok) throw new Error(`Dify API ${response.status}`);
      const payload = await response.json();
      if (requestId !== requestSerial) return;
      clearTimers();
      pendingMessage.dataset.state = "done";
      pendingMessage.classList.remove("is-stage-changing");
      pendingMessage.textContent = readDifyAnswer(payload);
      scrollToBottom(true);
    } catch (error) {
      if (requestId !== requestSerial) return;
      clearTimers();
      if (error.name === "AbortError") {
        console.warn("AI assistant request aborted or timed out", error);
      } else {
        console.error(error);
      }
      showErrorMessage(pendingMessage, query);
    } finally {
      window.clearTimeout(timeout);
      timers.delete(timeout);
      if (requestId === requestSerial) {
        activeController = null;
        pendingQuery = "";
        setLoading(false);
        window.setTimeout(() => input.focus(), 100);
      }
    }
  };

  if (toggle) {
    toggle.addEventListener("click", () => setOpen(!assistant.classList.contains("is-open")));
  }

  if (close) {
    close.addEventListener("click", () => setOpen(false));
  }

  const inlineTrigger = document.querySelector("[data-ai-inline-trigger]");
  if (inlineTrigger && mount) {
    inlineTrigger.addEventListener("click", () => {
      mount.hidden = false;
      inlineTrigger.hidden = true;
      window.setTimeout(() => input.focus(), 120);
      scrollToBottom(true);
    });
  }

  messages.addEventListener(
    "scroll",
    () => {
      shouldStickToBottom = isNearBottom();
    },
    { passive: true }
  );

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    void submitQuery(input.value);
  });

  input.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      void submitQuery(input.value);
    }
  });

  window.addEventListener("pagehide", () => {
    clearTimers();
    activeController?.abort();
  });

  renderQuickQuestions();

  if (window.location.search.includes("ai_wait_demo=1")) {
    const originalFetch = window.fetch.bind(window);
    window.fetch = (url, options) => {
      if (String(url).includes("/api/dify/workflow")) {
        return new Promise((resolve) => {
          window.setTimeout(() => resolve(originalFetch(url, options)), 18000);
        });
      }
      return originalFetch(url, options);
    };
  }

  if (window.location.search.includes("ai_fail_demo=1")) {
    const originalFetch = window.fetch.bind(window);
    window.fetch = (url, options) => {
      if (String(url).includes("/api/dify/workflow")) {
        return Promise.reject(new Error("AI assistant failure demo"));
      }
      return originalFetch(url, options);
    };
  }
};

const boot = async () => {
  const siteData = await loadSiteData();
  bindProfile(siteData);
  renderResumeCards(siteData.resumeCards);
  renderSkills(siteData.skills);
  renderHomeProjects(siteData.projects);
  renderArticles(siteData.projects, siteData.accounts);
  renderNotes(siteData.notes);

  initNavigation();
  initCursor();
  initSpotlights();
  initReveal();
  initParallax();
  initAiAssistant();
};

boot();
