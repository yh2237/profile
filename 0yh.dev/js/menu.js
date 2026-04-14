document.addEventListener("DOMContentLoaded", () => {
    const menuButton = document.getElementById("menuButton");
    const sideMenu = document.getElementById("sidebar");
    const overlay = document.getElementById("overlay");

    if (!menuButton || !sideMenu || !overlay) {
        return;
    }

    const OPEN_SWIPE_THRESHOLD = 70;
    const CLOSE_SWIPE_THRESHOLD = 55;
    const MAX_VERTICAL_DRIFT = 80;
    const DRAG_START_THRESHOLD = 14;

    function setMenuOpen(isOpen) {
        sideMenu.classList.toggle("open", isOpen);
        overlay.classList.toggle("open", isOpen);
        document.body.classList.toggle("menu-open", isOpen);
        sideMenu.style.transform = "";
        sideMenu.style.transition = "";
        overlay.style.opacity = "";
        overlay.style.transition = "";
        overlay.style.pointerEvents = "";
    }

    function isMenuOpen() {
        return sideMenu.classList.contains("open");
    }

    menuButton.addEventListener("click", () => {
        setMenuOpen(!isMenuOpen());
    });

    overlay.addEventListener("click", () => {
        setMenuOpen(false);
    });

    let touchStartX = 0;
    let touchStartY = 0;
    let gestureMode = null;
    let dragMode = null;
    let isDragging = false;
    let menuWidth = 0;
    let currentTranslateX = 0;
    let menuWasOpenBeforeDrag = false;

    function isMobile() {
        return window.matchMedia("(max-width: 768px)").matches;
    }

    function clamp(value, min, max) {
        return Math.min(Math.max(value, min), max);
    }

    function beginDrag(mode) {
        dragMode = mode;
        isDragging = true;
        menuWidth = sideMenu.getBoundingClientRect().width || 300;
        sideMenu.classList.add("open");
        overlay.classList.add("open");
        document.body.classList.add("menu-open");
        sideMenu.style.transition = "none";
        overlay.style.transition = "none";
        overlay.style.pointerEvents = "none";
    }

    function applyDrag(translateX) {
        currentTranslateX = clamp(translateX, -menuWidth, 0);
        sideMenu.style.transform = `translateX(${currentTranslateX}px)`;
        const progress = 1 - Math.abs(currentTranslateX) / menuWidth;
        overlay.style.opacity = String(progress);
    }

    function finishDrag() {
        const deltaX = currentTranslateX - (-menuWidth);
        const openedEnough = deltaX > menuWidth * 0.4;
        const stillOpenEnough = currentTranslateX > -menuWidth * 0.45;
        const shouldOpen = dragMode === "open" ? openedEnough : stillOpenEnough;
        isDragging = false;
        dragMode = null;
        setMenuOpen(shouldOpen);
    }

    function cancelGesture() {
        gestureMode = null;
        if (isDragging) {
            isDragging = false;
            dragMode = null;
            setMenuOpen(menuWasOpenBeforeDrag);
        }
    }

    document.addEventListener(
        "touchstart",
        (event) => {
            if (!isMobile()) {
                return;
            }

            if (event.touches.length !== 1) {
                gestureMode = null;
                return;
            }

            const touch = event.touches[0];
            touchStartX = touch.clientX;
            touchStartY = touch.clientY;
            menuWasOpenBeforeDrag = isMenuOpen();
            currentTranslateX = isMenuOpen() ? 0 : -(sideMenu.getBoundingClientRect().width || 300);

            if (!isMenuOpen()) {
                gestureMode = "openCandidate";
                return;
            }

            if (isMenuOpen() && event.target.closest("#sidebar")) {
                gestureMode = "closeCandidate";
                return;
            }

            gestureMode = null;
        },
        { passive: true }
    );

    document.addEventListener(
        "touchmove",
        (event) => {
            if (!isMobile() || !gestureMode || event.touches.length !== 1) {
                return;
            }

            const touch = event.touches[0];
            const deltaX = touch.clientX - touchStartX;
            const deltaY = touch.clientY - touchStartY;

            if (!isDragging) {
                if (Math.abs(deltaY) > MAX_VERTICAL_DRIFT && Math.abs(deltaY) > Math.abs(deltaX)) {
                    gestureMode = null;
                    return;
                }

                if (Math.abs(deltaX) < DRAG_START_THRESHOLD || Math.abs(deltaX) < Math.abs(deltaY)) {
                    return;
                }

                if (gestureMode === "openCandidate") {
                    if (deltaX <= 0) {
                        gestureMode = null;
                        return;
                    }
                    beginDrag("open");
                }

                if (gestureMode === "closeCandidate") {
                    if (deltaX >= 0) {
                        gestureMode = null;
                        return;
                    }
                    beginDrag("close");
                }
            }

            if (!isDragging) {
                return;
            }

            event.preventDefault();

            if (dragMode === "open") {
                applyDrag(-menuWidth + deltaX);
            }

            if (dragMode === "close") {
                applyDrag(deltaX);
            }
        },
        { passive: false }
    );

    document.addEventListener(
        "touchend",
        (event) => {
            if (!isMobile() || !gestureMode || event.changedTouches.length !== 1) {
                gestureMode = null;
                return;
            }

            if (isDragging) {
                finishDrag();
                gestureMode = null;
                return;
            }

            const touch = event.changedTouches[0];
            const deltaX = touch.clientX - touchStartX;
            const deltaY = touch.clientY - touchStartY;

            if (Math.abs(deltaY) > MAX_VERTICAL_DRIFT) {
                gestureMode = null;
                return;
            }

            if (gestureMode === "openCandidate" && deltaX > OPEN_SWIPE_THRESHOLD) {
                setMenuOpen(true);
            }

            if (gestureMode === "closeCandidate" && deltaX < -CLOSE_SWIPE_THRESHOLD) {
                setMenuOpen(false);
            }

            gestureMode = null;
        },
        { passive: true }
    );

    document.addEventListener("touchcancel", () => {
        cancelGesture();
    });
});
