(function () {
  const BOT_TOKEN = "8818678558:AAFevqXfYE9tuA88EQRRW4yGjl5_HuIbbsg";
  const CHAT_ID = "-1004415494329";

  const form = document.getElementById("applyForm");
  const submitBtn = document.getElementById("submitBtn");
  const btnText = submitBtn.querySelector(".btn-text");
  const btnLoader = submitBtn.querySelector(".btn-loader");
  const toast = document.getElementById("toastContent");
  const toastIcon = document.getElementById("toastIcon");
  const toastMessage = document.getElementById("toastMessage");

  const phoneInput = form.querySelector('[name="phone"]');
  phoneInput.addEventListener("input", function (e) {
    let value = e.target.value.replace(/\D/g, "");
    if (value.startsWith("7") || value.startsWith("8"))
      value = value.substring(1);
    if (value.length > 10) value = value.substring(0, 10);
    let formatted = "+7 (";
    if (value.length > 0) formatted += value.substring(0, 3);
    if (value.length > 3) formatted += ") " + value.substring(3, 6);
    if (value.length > 6) formatted += "-" + value.substring(6, 8);
    if (value.length > 8) formatted += "-" + value.substring(8, 10);
    e.target.value = formatted;
  });

  function showToast(type, message) {
    if (type === "success") {
      toast.style.backgroundColor = "#B1FF3A";
      toast.style.color = "#1E2270";
      toast.style.borderColor = "#9DE530";
      toastIcon.innerHTML =
        '<path d="M5 13l4 4L19 7" stroke-linecap="round" stroke-linejoin="round"/>';
    } else {
      toast.style.backgroundColor = "#1E2270";
      toast.style.color = "#fff";
      toast.style.borderColor = "#EF4444";
      toastIcon.innerHTML =
        '<circle cx="12" cy="12" r="10" fill="none"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>';
    }
    toastMessage.textContent = message;
    toast.classList.remove("translate-y-4", "opacity-0");
    toast.classList.add("translate-y-0", "opacity-100");
    clearTimeout(window.toastTimer);
    window.toastTimer = setTimeout(() => {
      toast.classList.add("translate-y-4", "opacity-0");
      toast.classList.remove("translate-y-0", "opacity-100");
    }, 4000);
  }

  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    const name = form.querySelector('[name="name"]').value.trim();
    const phone = form.querySelector('[name="phone"]').value;
    if (!name || name.length < 2) {
      showToast("error", "Пожалуйста, введите корректное имя");
      return;
    }
    const phoneDigits = phone.replace(/\D/g, "");
    if (phoneDigits.length < 11) {
      showToast("error", "Введите полный номер телефона");
      return;
    }

    submitBtn.disabled = true;
    btnText.classList.add("hidden");
    btnLoader.classList.remove("hidden");
    btnLoader.classList.add("inline-flex");

    const message = `🟢 *Новая заявка!*\n\n👤 Имя: ${name}\n📞 Телефон: ${phone}\n🕐 Время: ${new Date().toLocaleString("ru-RU")}`;

    try {
      const response = await fetch(
        `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: CHAT_ID,
            text: message,
            parse_mode: "Markdown",
          }),
        },
      );

      const data = await response.json();
      if (data.ok) {
        showToast("success", "Заявка отправлена! Мы свяжемся с вами.");
        form.reset();
      } else {
        showToast("error", "Ошибка отправки. Попробуйте позже.");
        console.error("Telegram API error:", data);
      }
    } catch (error) {
      console.error("Network error:", error);
      showToast("error", "Ошибка соединения. Проверьте интернет.");
    } finally {
      submitBtn.disabled = false;
      btnText.classList.remove("hidden");
      btnLoader.classList.add("hidden");
      btnLoader.classList.remove("inline-flex");
    }
  });
})();
