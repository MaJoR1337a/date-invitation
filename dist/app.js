const intro = document.querySelector("#intro");
const openInviteButton = document.querySelector("#open-invite");
const reopenIntroButton = document.querySelector("#reopen-intro");
const mainContent = document.querySelector("#main-content");
const dateForm = document.querySelector("#date-form");
const planPanel = document.querySelector("#plan-panel");
const planInputs = [...document.querySelectorAll('input[name="date-idea"]')];
const restaurantPicker = document.querySelector("#restaurant-picker");
const restaurantInputs = [...document.querySelectorAll('input[name="restaurant"]')];
const foodPicker = document.querySelector("#food-picker");
const foodInputs = [...document.querySelectorAll('input[name="food"]')];
const foodCustomNote = document.querySelector("#food-custom-note");
const timeInput = document.querySelector("#date-time");
const formError = document.querySelector("#form-error");
const finale = document.querySelector("#finale");
const finaleMessage = document.querySelector("#finale-message");
const finaleTicket = document.querySelector("#finale-ticket");
const closeFinaleButton = document.querySelector("#close-finale");
const changeAnswerButton = document.querySelector("#change-answer");
const copyAnswerButton = document.querySelector("#copy-answer");
const copyStatus = document.querySelector("#copy-status");
const particles = document.querySelector("#particles");
const touchEffects = document.querySelector("#touch-effects");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const FIXED_DATE = "2026-09-20";

let answerText = "";

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

function selectedPlan() {
  return document.querySelector('input[name="date-idea"]:checked');
}

function selectedFood() {
  return document.querySelector('input[name="food"]:checked');
}

function updatePlanFields(planInput, { scroll = false } = {}) {
  const plan = planInput?.dataset.plan || "restaurant";
  const showRestaurant = plan === "restaurant";
  const showFood = plan === "mentalist";

  restaurantPicker.hidden = !showRestaurant;
  foodPicker.hidden = !showFood;
  restaurantInputs.forEach((input) => {
    input.required = showRestaurant;
    if (!showRestaurant) input.checked = false;
  });
  foodInputs.forEach((input) => {
    input.required = showFood && input.value !== "Інша доставка";
    if (!showFood) input.checked = false;
  });
  if (!showFood) foodCustomNote.value = "";
  const customFoodSelected = showFood && selectedFood()?.value === "Інша доставка";
  document.querySelector("#food-suggestion").hidden = !customFoodSelected;
  foodCustomNote.required = customFoodSelected;
  formError.textContent = "";
  planPanel.classList.add("is-visible");

  if (scroll) {
    window.setTimeout(() => {
      planPanel.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "center" });
    }, reducedMotion ? 0 : 260);
  }
}

planInputs.forEach((radio) => {
  radio.addEventListener("change", () => updatePlanFields(radio, { scroll: true }));
});

restaurantInputs.forEach((radio) => {
  radio.addEventListener("change", () => {
    formError.textContent = "";
  });
});

foodInputs.forEach((radio) => {
  radio.addEventListener("change", () => {
    const customFoodSelected = radio.value === "Інша доставка";
    document.querySelector("#food-suggestion").hidden = !customFoodSelected;
    foodCustomNote.required = customFoodSelected;
    formError.textContent = "";
    if (customFoodSelected) foodCustomNote.focus();
  });
});

foodCustomNote.addEventListener("input", () => {
  formError.textContent = "";
});

timeInput.addEventListener("change", () => {
  formError.textContent = "";
});

updatePlanFields(selectedPlan());

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

function createTouchAffection(event) {
  if (!touchEffects) return;

  const count = event.pointerType === "touch" ? 4 : 1;
  const symbols = ["♡", "♥", "💋", "😘"];

  for (let index = 0; index < count; index += 1) {
    const affection = document.createElement("span");
    affection.className = "touch-affection";
    affection.textContent = symbols[index % symbols.length];
    affection.style.left = `${event.clientX + (Math.random() - 0.5) * 28}px`;
    affection.style.top = `${event.clientY + (Math.random() - 0.5) * 18}px`;
    affection.style.setProperty("--drift", `${(Math.random() - 0.5) * 80}px`);
    affection.style.setProperty("--spin", `${(Math.random() - 0.5) * 18}deg`);
    affection.style.setProperty("--delay", `${index * 45}ms`);
    touchEffects.append(affection);
    affection.addEventListener("animationend", () => affection.remove(), { once: true });
  }
}

document.addEventListener("pointerdown", createTouchAffection, { passive: true });

dateForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const plan = selectedPlan();
  const restaurant = selectedRestaurant();
  const food = selectedFood();
  const planKind = plan?.dataset.plan;

  if (!plan) {
    formError.textContent = "Обери варіант нашого вечора.";
    planInputs[0].focus();
    return;
  }

  if (planKind === "restaurant" && !restaurant) {
    formError.textContent = "Обери ресторан, у якому почнемо наш вечір.";
    restaurantInputs[0].focus();
    return;
  }

  if (planKind === "mentalist" && !food) {
    formError.textContent = "Обери, що замовимо до «Менталіста».";
    foodInputs[0].focus();
    return;
  }

  const customFood = food?.value === "Інша доставка" ? foodCustomNote.value.trim() : "";
  if (planKind === "mentalist" && food?.value === "Інша доставка" && !customFood) {
    formError.textContent = "Напиши, що саме хочеш замовити.";
    foodCustomNote.focus();
    return;
  }

  if (!timeInput.value) {
    formError.textContent = "Обери, о котрій ми зустрінемось 20 вересня.";
    timeInput.focus();
    return;
  }

  const formattedDay = formatDate(FIXED_DATE);
  const foodLabel = customFood || food?.value || "";
  formError.textContent = "";

  if (planKind === "restaurant") {
    finaleMessage.textContent = `20 вересня о ${timeInput.value} ми почнемо вечір у «${restaurant.value}», а після вечері прогуляємося Садом Шевченка. Уже звучить ідеально.`;
  } else if (planKind === "mentalist") {
    finaleMessage.textContent = `20 вересня о ${timeInput.value} дивимося «Менталіста» і замовляємо ${foodLabel}. Вечір для нас двох.`;
  }

  const ticketRows = [ticketRow("День", formattedDay), ticketRow("План", plan.value)];
  if (planKind === "restaurant") {
    ticketRows.push(ticketRow("Ресторан", restaurant.value));
  }
  if (planKind === "mentalist") {
    ticketRows.push(ticketRow("Серіал", "Менталіст"), ticketRow("Їжа", foodLabel));
  }
  ticketRows.push(ticketRow("Час", timeInput.value));
  if (planKind === "restaurant") ticketRows.push(ticketRow("Після вечері", "Сад Шевченка"));
  finaleTicket.replaceChildren(...ticketRows);

  answerText = [
    "Наше побачення 20 вересня 💌",
    `День: ${formattedDay}`,
    `План: ${plan.value}`,
    planKind === "restaurant" ? `Ресторан: ${restaurant.value}` : "",
    planKind === "mentalist" ? "Серіал: Менталіст" : "",
    planKind === "mentalist" ? `Їжа: ${foodLabel}` : "",
    `Час: ${timeInput.value}`,
    planKind === "restaurant" ? "Після вечері: прогулянка Садом Шевченка" : "",
  ].filter(Boolean).join("\n");

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
      title: "Обрати вечір і смаколики",
      description:
        "Обирає один із двох варіантів вечора, час і ресторан або їжу для побачення 20 вересня 2026 року, а потім показує фінальний квиток.",
      inputSchema: {
        type: "object",
        properties: {
          plan: {
            type: "string",
            enum: ["restaurant", "mentalist"],
            description: "restaurant — ресторан і Сад Шевченка; mentalist — серіал і доставка.",
          },
          restaurant: {
            type: "string",
            enum: ["Думки на смак", "NON", "Гостиная"],
            description: "Потрібен для плану restaurant.",
          },
          food: {
            type: "string",
            enum: ["Суші", "Піца", "Шаурма", "Бургери", "Шашлик", "Інша доставка"],
            description: "Потрібна для плану mentalist.",
          },
          customFood: {
            type: "string",
            maxLength: 100,
            description: "Власна пропозиція, якщо обрано Інша доставка.",
          },
          time: {
            type: "string",
            enum: ["17:00", "18:00", "19:00", "20:00"],
          },
        },
        required: ["plan", "time"],
        additionalProperties: false,
      },
      execute: async ({ plan, restaurant = "", food = "", customFood = "", time }) => {
        const planInput = planInputs.find((input) => input.dataset.plan === plan);
        if (!planInput) throw new Error("Оберіть один із двох варіантів вечора.");

        const restaurantInput = restaurantInputs.find((input) => input.value === restaurant);
        if (plan === "restaurant" && !restaurantInput) {
          throw new Error("Оберіть ресторан: Думки на смак, NON або Гостиная.");
        }

        const foodInput = foodInputs.find((input) => input.value === food);
        if (plan === "mentalist" && !foodInput) {
          throw new Error("Оберіть їжу: суші, піца, шаурма, бургери, шашлик або власна пропозиція.");
        }
        if (plan === "mentalist" && food === "Інша доставка" && !customFood.trim()) {
          throw new Error("Напишіть власну пропозицію доставки.");
        }

        const validTimes = [...timeInput.options].map((option) => option.value).filter(Boolean);
        if (!validTimes.includes(time)) throw new Error("Оберіть доступний час: 17:00, 18:00, 19:00 або 20:00.");

        mainContent.setAttribute("aria-hidden", "false");
        mainContent.classList.add("is-visible");
        intro.hidden = true;
        intro.classList.add("is-opening");
        document.body.classList.remove("is-locked");

        planInput.checked = true;
        updatePlanFields(planInput);
        if (restaurantInput) {
          restaurantInput.checked = true;
          restaurantInput.dispatchEvent(new Event("change", { bubbles: true }));
        }
        if (foodInput) {
          foodInput.checked = true;
          foodInput.dispatchEvent(new Event("change", { bubbles: true }));
        }
        foodCustomNote.value = customFood.slice(0, 100);
        foodCustomNote.dispatchEvent(new Event("input", { bubbles: true }));
        timeInput.value = time;
        timeInput.dispatchEvent(new Event("change", { bubbles: true }));
        dateForm.requestSubmit();

        return {
          status: "confirmation_shown",
          plan: planInput.value,
          restaurant: restaurantInput?.value || null,
          food: food === "Інша доставка" ? customFood : food || null,
          day: FIXED_DATE,
          time,
        };
      },
    });
  } catch {
    // The page remains fully usable when WebMCP is unavailable or disabled.
  }
}

registerDatePlannerTool();

document.body.classList.add("is-locked");
