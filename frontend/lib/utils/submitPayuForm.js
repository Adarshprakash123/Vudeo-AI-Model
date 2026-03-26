export function submitPayuForm({ action, method = "POST", fields = {} }) {
  if (typeof document === "undefined") {
    return;
  }

  const form = document.createElement("form");
  form.method = method;
  form.action = action;
  form.style.display = "none";

  Object.entries(fields).forEach(([name, value]) => {
    const input = document.createElement("input");
    input.type = "hidden";
    input.name = name;
    input.value = value ?? "";
    form.appendChild(input);
  });

  document.body.appendChild(form);
  form.submit();
}
