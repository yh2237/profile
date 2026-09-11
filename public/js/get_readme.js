document.addEventListener("DOMContentLoaded", () => {
    const target = document.getElementById("profile-readme");

    if (!target) {
        return;
    }

    const url = `data/README.local.md?v=${Date.now()}`;

    fetch(url, { cache: "no-cache" })
        .then((res) => {
            if (!res.ok) {
                throw new Error(`README fetch failed: ${res.status}`);
            }
            return res.text();
        })
        .then((md) => {
            if (!window.marked || !window.marked.parse) {
                target.textContent = md;
                return;
            }
            target.innerHTML = window.marked.parse(md);
        })
        .catch(() => {
            target.textContent = "README の読み込みに失敗しました。";
        });
});
