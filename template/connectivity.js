(function() {
    var indicator = document.getElementById("internet-status");
    if (indicator && indicator.hidden) indicator = null;
    var dot = document.querySelector('.status-dot:not([data-static="true"])');
    if (!indicator && !dot) return;

    var defaultUrl = "https://ipwho.is/";
    var legacyUrl = "https://speed.cloudflare.com/__down?bytes=1";
    var url = document.body.dataset.connectivityUrl || defaultUrl;
    var checking = false;
    function setStatus(connected) {
        var label = connected ? (url === defaultUrl ? "Internet access confirmed" : "Connection check succeeded") : "Connection check not confirmed";
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
            var response = await fetch(url, {
                cache: "no-store",
                credentials: "omit",
                referrerPolicy: "no-referrer",
                signal: controller.signal
            });
            var valid = response.ok && !response.redirected;
            if (valid && url === defaultUrl) valid = (await response.json()).success === true;
            if (valid && url === legacyUrl) valid = (await response.arrayBuffer()).byteLength === 1;
            setStatus(valid && navigator.onLine);
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
