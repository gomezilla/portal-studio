(function() {
    var status = document.getElementById("speedtest-status");
    var downloadOutput = document.getElementById("download-speed");
    var uploadOutput = document.getElementById("upload-speed");
    var ispOutput = document.getElementById("isp-name");
    var timeoutMs = 15000;
    var downloadBytes = 2 * 1024 * 1024;
    var uploadBytes = 1 * 1024 * 1024;
    if (!status || !downloadOutput || !uploadOutput) {
        return;
    }

    function setStatus(message) {
        status.textContent = message;
    }

    function fetchWithTimeout(url, options, consumeResponse) {
        var controller = new AbortController();
        var timeout = window.setTimeout(function() {
            controller.abort();
        }, timeoutMs);

        options.signal = controller.signal;
        return fetch(url, options).then(function(response) {
            if (!response.ok) {
                throw new Error("The speed test server returned an error.");
            }
            return consumeResponse(response);
        }).finally(function() {
            window.clearTimeout(timeout);
        });
    }

    function measureDownload() {
        var startedAt = performance.now();
        var url = "https://speed.cloudflare.com/__down?bytes=" + downloadBytes + "&cache=" + Date.now();

        return fetchWithTimeout(url, { cache: "no-store" }, function(response) {
            if (!response.body || !response.body.getReader) {
                return response.arrayBuffer().then(function(data) {
                    return data.byteLength;
                });
            }

            var reader = response.body.getReader();
            var receivedBytes = 0;

            function readChunk() {
                return reader.read().then(function(result) {
                    if (result.done) {
                        return receivedBytes;
                    }
                    receivedBytes += result.value.byteLength;
                    return readChunk();
                });
            }

            return readChunk();
        }).then(function(receivedBytes) {
            var durationMs = performance.now() - startedAt;
            if (!receivedBytes || durationMs <= 0) {
                throw new Error("No download data was received.");
            }
            return receivedBytes * 8 / durationMs / 1000;
        });
    }

    function measureUpload() {
        var payload = new Uint8Array(uploadBytes);
        for (var i = 0; i < payload.length; i++) {
            payload[i] = i % 251;
        }

        var startedAt = performance.now();
        return fetchWithTimeout("https://speed.cloudflare.com/__up", {
            method: "POST",
            cache: "no-store",
            headers: { "Content-Type": "application/octet-stream" },
            body: payload
        }, function() {
            var durationMs = performance.now() - startedAt;
            if (durationMs <= 0) {
                throw new Error("The upload test did not complete.");
            }
            return uploadBytes * 8 / durationMs / 1000;
        });
    }

    function displaySpeed(element, speed) {
        element.textContent = speed < 10 ? speed.toFixed(1) : Math.round(speed).toString();
    }

    function loadISP() {
        if (!ispOutput || !window.fetch || !window.AbortController) {
            return;
        }

        var controller = new AbortController();
        var timeout = window.setTimeout(function() {
            controller.abort();
        }, 8000);

        fetch("https://ipwho.is/", {
            cache: "no-store",
            signal: controller.signal
        }).then(function(response) {
            if (!response.ok) {
                throw new Error("ISP lookup failed.");
            }
            return response.json();
        }).then(function(metadata) {
            var organization = metadata && metadata.connection && (metadata.connection.isp || metadata.connection.org);
            ispOutput.textContent = metadata && metadata.success && typeof organization === "string" && organization.trim()
                ? organization.trim()
                : "Unavailable";
        }).catch(function() {
            ispOutput.textContent = "Unavailable";
        }).finally(function() {
            window.clearTimeout(timeout);
        });
    }

    function runSpeedTest() {
        if (!window.fetch || !window.AbortController || !window.performance) {
            setStatus("Automatic speed testing is not supported by this browser.");
            return;
        }

        setStatus("Testing download…");
        measureDownload().then(function(downloadSpeed) {
            displaySpeed(downloadOutput, downloadSpeed);
            setStatus("Testing upload…");
            return measureUpload().then(function(uploadSpeed) {
                displaySpeed(uploadOutput, uploadSpeed);
                setStatus("Speed test complete.");
            }, function() {
                setStatus("Download measured. Upload test could not complete.");
            });
        }).catch(function() {
            setStatus("Speed test unavailable. Connect to Wi-Fi and reload to try again.");
        });
    }

    loadISP();
    runSpeedTest();
}());
