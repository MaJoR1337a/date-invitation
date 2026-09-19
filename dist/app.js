const intro = document.querySelector("#intro");
const openInviteButton = document.querySelector("#open-invite");
const reopenIntroButton = document.querySelector("#reopen-intro");
const mainContent = document.querySelector("#main-content");
const dateForm = document.querySelector("#date-form");
const planPanel = document.querySelector("#plan-panel");
const restaurantPicker = document.querySelector("#restaurant-picker");
const restaurantInputs = [...document.querySelectorAll('input[name="restaurant"]')];
const dayInput = document.querySelector("#date-day");
const timeInput = document.querySelector("#date-time");
const noteInput = document.querySelector("#date-note");
const formError = document.querySelector("#form-error");
const finale = document.querySelector("#finale");
const finaleMessage = document.querySelector("#finale-message");
const finaleTicket = document.querySelector("#finale-ticket");
const closeFinaleButton = document.querySelector("#close-finale");
const changeAnswerButton = document.querySelector("#change-answer");
const copyAnswerButton = document.querySelector("#copy-answer");
const copyStatus = document.querySelector("#copy-status");
const particles = document.querySelector("#particles");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

let answerText = "";

function localToday() {
  const now = new Date();
  const offset = now.getTimezoneOffset() * 60000;
  return new Date(now.getTime() - offset).toISOString().split("T")[0];
}

dayInput.min = localToday();

function openInvitation() {
  mainContent.setAttribute("aria-hidden", "false");
  mainContent.classList.add("is-visible");
  intro.classList.add("is-opening");
  document.body.classList.remove("is-locked");

  window.setTimeout(() => {
    intro.hidden = true;
    document.querySelector("#hero-title").focus({ preventScroll: true });
  }, reducedMotion ? 20 : 760);
}

function showIntroAgain() {
  intro.hidden = false;
  requestAnimationFrame(() => intro.classList.remove("is-opening"));
  document.body.classList.add("is-locked");
  window.scrollTo({ top: 0, behavior: reducedMotion ? "auto" : "smooth" });
  openInviteButton.focus({ preventScroll: true });
}

openInviteButton.addEventListener("click", openInvitation);
reopenIntroButton.addEventListener("click", showIntroAgain);

document.querySelectorAll('input[name="date-idea"]').forEach((radio) => {
  radio.addEventListener("change", () => {
    restaurantPicker.hidden = radio.id !== "date-slow";
    planPanel.classList.add("is-visible");
    formError.textContent = "";
    window.setTimeout(() => {
      planPanel.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "center" });
    }, reducedMotion ? 0 : 260);
  });
});

restaurantInputs.forEach((radio) => {
  radio.addEventListener("change", () => {
    formError.textContent = "";
  });
});

function selectedIdea() {
  return document.querySelector('input[name="date-idea"]:checked');
}

function selectedRestaurant() {
  return document.querySelector('input[name="restaurant"]:checked');
}

function formatDate(dateValue) {
  const [year, month, day] = dateValue.split("-").map(Number);
  return new Intl.DateTimeFormat("uk-UA", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(year, month - 1, day));
}

function ticketRow(label, value) {
  const row = document.createElement("div");
  row.className = "ticket-row";

  const key = document.createElement("span");
  key.textContent = label;

  const detail = document.createElement("strong");
  detail.textContent = value;

  row.append(key, detail);
  return row;
}

function createParticles() {
  if (reducedMotion) return;
  particles.replaceChildren();

  for (let index = 0; index < 22; index += 1) {
    const particle = document.createElement("span");
    particle.className = "particle";
    particle.style.left = `${Math.random() * 100}%`;
    particle.style.setProperty("--drift", `${(Math.random() - 0.5) * 220}px`);
    particle.style.setProperty("--duration", `${3.4 + Math.random() * 2.3}s`);
    particle.style.setProperty("--delay", `${Math.random() * 0.8}s`);
    particle.style.opacity = `${0.5 + Math.random() * 0.5}`;
    particle.style.transform = `scale(${0.6 + Math.random() * 0.9})`;
    particles.append(particle);
  }

  window.setTimeout(() => particles.replaceChildren(), 6500);
}

dateForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const idea = selectedIdea();
  const restaurant = selectedRestaurant();

  if (!idea) {
    formError.textContent = "Спочатку обери настрій нашого побачення.";
    return;
  }

  if (idea.id === "date-slow" && !restaurant) {
    formError.textContent = "Обери ресторан, з якого почнемо наш вечір.";
    restaurantInputs[0].focus();
    return;
  }

  if (!dayInput.value || !timeInput.value) {
    formError.textContent = "Додай день і час, щоб я все правильно запланував.";
    (!dayInput.value ? dayInput : timeInput).focus();
    return;
  }

  const formattedDay = formatDate(dayInput.value);
  const note = noteInput.value.trim();
  const restaurantPlan = idea.id === "date-slow";
  const planDetail = restaurantPlan
    ? `вечеря в «${restaurant.value}» та прогулянка Садом Шевченка`
    : idea.dataset.detail;
  formError.textContent = "";

  finaleMessage.textContent = `Ти обрала «${idea.value}» — ${planDetail}. Уже звучить ідеально.`;
  finaleTicket.replaceChildren(
    ticketRow("Наш план", idea.value),
    ...(restaurantPlan ? [ticketRow("Ресторан", restaurant.value)] : []),
    ...(restaurantPlan ? [ticketRow("Після вечері", "Сад Шевченка")] : []),
    ticketRow("День", formattedDay),
    ticketRow("Час", timeInput.value),
    ...(note ? [ticketRow("Побажання", note)] : []),
  );

  answerText = [
    `Я обираю побачення «${idea.value}» 💌`,
    restaurantPlan ? `Ресторан: ${restaurant.value}` : "",
    restaurantPlan ? "Після вечері: прогулянка Садом Шевченка" : "",
    `День: ${formattedDay}`,
    `Час: ${timeInput.value}`,
    note ? `Моя підказка: ${note}` : "",
  ]
    .filter(Boolean)
    .join("\n");

  copyStatus.textContent = "";
  finale.showModal();
  createParticles();
});

function closeFinale() {
  finale.close();
}

closeFinaleButton.addEventListener("click", closeFinale);
changeAnswerButton.addEventListener("click", () => {
  closeFinale();
  planPanel.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "center" });
});

finale.addEventListener("click", (event) => {
  if (event.target === finale) closeFinale();
});

copyAnswerButton.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(answerText);
    copyStatus.textContent = "Відповідь скопійовано — тепер можна надіслати її мені ♡";
  } catch {
    copyStatus.textContent = "Не вдалося скопіювати. Зроби скриншот цього квитка ♡";
  }
});

async function registerDatePlannerTool() {
  const modelContext = document.modelContext || navigator.modelContext;
  if (!modelContext?.registerTool) return;

  try {
    await modelContext.registerTool({
      name: "choose_date_plan",
      title: "Обрати наше побачення",
      description:
        "Обирає один із трьох сценаріїв побачення, ресторан для першого сценарію, бажаний день, час і необов’язкову підказку, а потім показує фінальний квиток.",
      inputSchema: {
        type: "object",
        properties: {
          idea: {
            type: "string",
            enum: ["slow", "cinema", "adventure"],
            description:
              "slow — ресторан і Сад Шевченка, cinema — кіно під зорями, adventure — маленька пригода.",
          },
          restaurant: {
            type: "string",
            enum: ["Думки на смак", "NON", "Гостиная"],
            description: "Потрібно лише для сценарію slow.",
          },
          day: {
            type: "string",
            pattern: "^\\d{4}-\\d{2}-\\d{2}$",
            description: "Бажаний день у форматі YYYY-MM-DD, не раніше сьогоднішнього дня.",
          },
          time: {
            type: "string",
            enum: ["17:00", "18:00", "19:00", "20:00", "Нехай час буде сюрпризом"],
          },
          note: {
            type: "string",
            maxLength: 180,
            description: "Необов’язкове побажання до вечора.",
          },
        },
        required: ["idea", "day", "time"],
        additionalProperties: false,
      },
      execute: async ({ idea, restaurant = "", day, time, note = "" }) => {
        if (day < dayInput.min) {
          throw new Error("Обраний день уже минув. Оберіть сьогодні або пізнішу дату.");
        }

        const ideaInput = document.querySelector(`#date-${idea}`);
        if (!ideaInput) throw new Error("Невідомий сценарій побачення.");

        const restaurantInput = restaurantInputs.find((input) => input.value === restaurant);
        if (idea === "slow" && !restaurantInput) {
          throw new Error("Для цього сценарію оберіть ресторан: Думки на смак, NON або Гостиная.");
        }

        mainContent.setAttribute("aria-hidden", "false");
        mainContent.classList.add("is-visible");
        intro.hidden = true;
        intro.classList.add("is-opening");
        document.body.classList.remove("is-locked");

        ideaInput.checked = true;
        ideaInput.dispatchEvent(new Event("change", { bubbles: true }));
        if (restaurantInput) {
          restaurantInput.checked = true;
          restaurantInput.dispatchEvent(new Event("change", { bubbles: true }));
        }
        dayInput.value = day;
        timeInput.value = time;
        noteInput.value = note.slice(0, 180);
        dayInput.dispatchEvent(new Event("change", { bubbles: true }));
        timeInput.dispatchEvent(new Event("change", { bubbles: true }));
        noteInput.dispatchEvent(new Event("input", { bubbles: true }));
        dateForm.requestSubmit();

        return {
          status: "confirmation_shown",
          idea: ideaInput.value,
          restaurant: restaurantInput?.value || null,
          day,
          time,
          note: noteInput.value,
        };
      },
    });
  } catch {
    // The page remains fully usable when WebMCP is unavailable or disabled.
  }
}

registerDatePlannerTool();

document.body.classList.add("is-locked");
