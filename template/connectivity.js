(function() {
    var indicator = document.getElementById("internet-status");
    var dot = document.querySelector(".status-dot");
    if (!indicator && !dot) return;

    var checking = false;
    function setStatus(connected) {
        var label = connected ? "Internet access confirmed" : "Internet access not confirmed";
        [indicator, dot].forEach(function(element) {
            if (!element) return;
            element.dataset.online = String(connected);
            element.setAttribute("aria-label", label);
            element.title = label;
        });
    }

    async function checkInternet() {
        if (checking) return;
        if (!navigator.onLine || !window.fetch || !window.AbortController) {
            setStatus(false);
            return;
        }
        checking = true;
        var controller = new AbortController();
        var timer = window.setTimeout(function() { controller.abort(); }, 5000);
        try {
            var response = await fetch("https://speed.cloudflare.com/__down?bytes=1", {
                cache: "no-store",
                credentials: "omit",
                referrerPolicy: "no-referrer",
                signal: controller.signal
            });
            var body = await response.arrayBuffer();
            setStatus(response.ok && body.byteLength === 1 && navigator.onLine);
        } catch (error) {
            setStatus(false);
        } finally {
            window.clearTimeout(timer);
            checking = false;
        }
    }

    window.addEventListener("online", checkInternet);
    window.addEventListener("offline", function() { setStatus(false); });
    window.setInterval(checkInternet, 30000);
    checkInternet();
}());
