document.addEventListener("DOMContentLoaded", () => {
    const body = document.body;
    const loader = document.getElementById("fontLoader");
    const progress = document.getElementById("fontProgress");
    const progressText = document.getElementById("fontProgressText");
    const liteButton = document.getElementById("liteModeButton");

    if (!body || !loader || !progress || !progressText || !liteButton) {
        return;
    }

    const params = new URLSearchParams(window.location.search);
    const delayParam = Number(params.get("delay"));
    const minDelay = Number.isFinite(delayParam) ? Math.max(0, delayParam) : 4000;

    let isFinished = false;
    let progressValue = 6;
    const startTime = Date.now();

    function setProgress(value) {
        const clamped = Math.max(0, Math.min(100, value));
        progress.style.width = `${clamped}%`;
        progressText.textContent = `${clamped}%`;
    }

    function finishLoading() {
        if (isFinished) {
            return;
        }
        isFinished = true;
        setProgress(100);
        body.classList.remove("font-loading");
    }

    function maybeFinishWhenReady() {
        const elapsed = Date.now() - startTime;
        if (elapsed < minDelay) {
            window.setTimeout(maybeFinishWhenReady, 120);
            return;
        }
        finishLoading();
    }

    const tick = window.setInterval(() => {
        if (isFinished) {
            window.clearInterval(tick);
            return;
        }
        progressValue = Math.min(progressValue + Math.random() * 8 + 6, 92);
        setProgress(Math.floor(progressValue));
    }, 150);

    if (document.fonts && document.fonts.load) {
        Promise.all([
            document.fonts.load('1em "WDXLLubrifontJPN"'),
            document.fonts.load('1em "Inter"')
        ])
            .then(() => {
                maybeFinishWhenReady();
            })
            .catch(() => {
                maybeFinishWhenReady();
            });
    } else {
        maybeFinishWhenReady();
    }

    liteButton.addEventListener("click", () => {
        body.classList.add("lite-mode");
        finishLoading();
    });
});
