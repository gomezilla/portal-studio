var Ajax = {
    post: function(url, data, fn) {
        var xhr = new XMLHttpRequest();
        xhr.open("POST", url, true);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4 && (xhr.status == 200 || xhr.status == 304)) {
                fn.call(this, xhr.responseText);
            }
        };
        xhr.send(data);
    }
};

var data = {};
var globalConfig = {};
var submitUrl;
var clientMac = getQueryStringKey("clientMac");
var apMac = getQueryStringKey("apMac");
var gatewayMac = getQueryStringKey("gatewayMac") || undefined;
var ssidName = getQueryStringKey("ssidName") || undefined;
var radioId = !!getQueryStringKey("radioId") ? Number(getQueryStringKey("radioId")) : undefined;
var vid = !!getQueryStringKey("vid") ? Number(getQueryStringKey("vid")) : undefined;
var originUrl = getQueryStringKey("originUrl");
var previewSite = getQueryStringKey("previewSite");

var hotspotMap = {
    2: "Form Auth",
    3: "Voucher",
    5: "Account",
    6: "SMS Access",
    8: "RADIUS Access"
};
if (window.portalStudioAccessLabels) {
    Object.keys(hotspotMap).forEach(function(type) {
        var label = window.portalStudioAccessLabels[type];
        if (typeof label === "string" && label.trim()) hotspotMap[type] = label;
    });
}

var errorHintMap = {
    "0": "Successful",
    "-1": "General error.",
    "-41500": "Invalid authentication type.",
    "-41501": "Failed to authenticate.",
    "-41502": "Voucher code is incorrect.(Ayaw'g Pataka)",
    "-41503": "Voucher is expired.(Gamit na.)",
    "-41504": "Voucher traffic has exceeded the limit.",
    "-41505": "The number of users has reached the limit.(Naa nay ni gamit)",
    "-41506": "Invalid authorization information.",
    "-41507": "Your authentication times out. You can get authenticated again until the next day.",
    "-41508": "Local User traffic has exceeded the limit.(Hurot na)",
    "-41512": "Local User is expired.",
    "-41513": "Local User is disabled.",
    "-41514": "MAC address is incorrect.",
    "-41515": "Local User Quota has exceeded the limit.",
    "-41516": "The number of users has reached the limit.",
    "-41517": "Incorrect password.",
    "-41518": "This SSID does not exist.",
    "-41519": "Invalid code.",
    "-41520": "The code is expired.",
    "-41521": "The number of users has reached the limit.",
    "-41522": "Failed to validate the code.",
    "-41523": "Failed to send verification code.",
    "-41524": "Authentication failed because the username does not exist.",
    "-41525": "Authentication failed because of wrong password.",
    "-41526": "Authentication failed because the client is invalid.",
    "-41527": "Authentication failed because the local user is invalid.",
    "-41528": "Failed to decrypt data.",
    "-41529": "Incorrect username or password.",
    "-41530": "Connecting to the RADIUS server times out.",
    "-41531": "Your code has reached your Wi-Fi data limit.",
    "-41532": "Your account has reached your Wi-Fi data limit.",
    "-41533": "Form authentication request is invalid.",
    "-43408": "Invalid LDAP configuration.",
    "-43409": "Invalid LDAP credentials.",
    "-41538": "Voucher is not effective."
};

if (window.portalStudioErrorMessages) {
    Object.keys(errorHintMap).forEach(function(code) {
        var customized = window.portalStudioErrorMessages[code];
        if (typeof customized === "string" && customized.trim()) {
            errorHintMap[code] = customized;
        }
    });
}

var isCommited;

function getQueryStringKey(key) {
    return getQueryStringAsObject()[key];
}

function getQueryStringAsObject() {
    var b, cv, e, k, ma, sk, v, r = {},
        d = function(v) { return decodeURIComponent(v); },
        q = window.location.search.substring(1),
        s = /([^&;=]+)=?([^&;]*)/g;
    ma = function(v) {
        if (typeof v != "object") {
            cv = v;
            v = {};
            v.length = 0;
            if (cv) { Array.prototype.push.call(v, cv); }
        }
        return v;
    };
    while (e = s.exec(q)) {
        b = e[1].indexOf("[");
        v = d(e[2]);
        if (b < 0) {
            k = d(e[1]);
            if (r[k]) {
                r[k] = ma(r[k]);
                Array.prototype.push.call(r[k], v);
            } else {
                r[k] = v;
            }
        } else {
            k = d(e[1].slice(0, b));
            sk = d(e[1].slice(b + 1, e[1].indexOf("]", b)));
            r[k] = ma(r[k]);
            if (sk) { r[k][sk] = v; } else { Array.prototype.push.call(r[k], v); }
        }
    }
    return r;
}

Ajax.post(
    '/portal/getPortalPageSetting',
    JSON.stringify({
        "clientMac": clientMac,
        "apMac": apMac,
        "gatewayMac": gatewayMac,
        "ssidName": ssidName,
        "radioId": radioId,
        "vid": vid,
        "originUrl": originUrl
    }),
    function(res) {
        res = JSON.parse(res);
        data = res.result;
        submitUrl = "/portal/auth";
        var landingUrl = data.landingUrl;
        isCommited = false;
        globalConfig = {
            authType: data.authType,
            hotspotTypes: !!data.hotspot && data.hotspot.enabledTypes || [],
            error: data.error || 'ok',
            countryCode: !!data.sms && data.sms.countryCode || 1
        };

        function showOperPrompt(message, isError, title) {
            var dialog = document.getElementById("oper-prompt");
            if (!dialog || !message) return;
            dialog.dataset.kind = isError ? "error" : "success";
            document.getElementById("oper-prompt-title").textContent = isError ? "Unable to connect" : (title || "Success");
            document.getElementById("oper-prompt-icon").textContent = isError ? "!" : "✓";
            document.getElementById("oper-prompt-close").textContent = isError ? "Retry" : "OK";
            document.getElementById("oper-prompt-message").textContent = message;
            if (!dialog.open) dialog.showModal();
        }

        function requireTermsAcceptance() {
            var section = document.getElementById("terms-acceptance");
            var checkbox = document.getElementById("terms-checkbox");
            if (!section || section.style.display === "none" || !checkbox || checkbox.checked) return true;
            showOperPrompt("Please agree to the Terms of Service before connecting to Wi-Fi.", true);
            checkbox.focus();
            return false;
        }

        document.getElementById("oper-prompt-close").addEventListener("click", function() {
            document.getElementById("oper-prompt").close();
        });
        document.getElementById("oper-prompt").addEventListener("click", function(event) {
            if (event.target === event.currentTarget) event.currentTarget.close();
        });
        document.getElementById("terms-open").addEventListener("click", function() {
            document.getElementById("terms-dialog").showModal();
        });
        document.getElementById("terms-close").addEventListener("click", function() {
            document.getElementById("terms-dialog").close();
        });
        document.getElementById("terms-done").addEventListener("click", function() {
            document.getElementById("terms-dialog").close();
        });
        document.getElementById("terms-dialog").addEventListener("click", function(event) {
            if (event.target === event.currentTarget) event.currentTarget.close();
        });

        function pageConfigParse() {
            if (res.errorCode !== 0) {
                showOperPrompt(errorHintMap[res.errorCode] || "The portal could not load. Please try again.", true);
            }
            document.getElementById("hotspot-section").style.display = "none";
            document.getElementById("input-voucher").style.display = "none";
            document.getElementById("input-user").style.display = "none";
            document.getElementById("input-password").style.display = "none";
            document.getElementById("input-simple").style.display = "none";
            document.getElementById("input-phone-num").style.display = "none";
            document.getElementById("input-phone-number").style.display = "none";
            document.getElementById("input-verify-code").style.display = "none";
            switch (globalConfig.authType) {
                case 0:
                    window.authType = 0;
                    break;
                case 1:
                    document.getElementById("input-simple").style.display = "block";
                    window.authType = 1;
                    break;
                case 2:
                    hotspotChang(2);
                    window.authType = 2;
                    break;
                case 15:
                    hotspotChang(15);
                    window.authType = 15;
                    break;
                case 11:
                    globalConfig.hotspotTypes = globalConfig.hotspotTypes.slice().sort(function(a, b) {
                        return (Number(b) === 3 ? 1 : 0) - (Number(a) === 3 ? 1 : 0);
                    });
                    var hotspotSelector = document.getElementById("hotspot-selector");
                    hotspotSelector.replaceChildren();
                    for (var i = 0; i < globalConfig.hotspotTypes.length; i++) {
                        var option = document.createElement("option");
                        option.value = globalConfig.hotspotTypes[i];
                        option.textContent = hotspotMap[globalConfig.hotspotTypes[i]] || "Access";
                        hotspotSelector.appendChild(option);
                    }
                    var tabs = document.getElementById("hotspot-tabs");
                    tabs.replaceChildren();
                    globalConfig.hotspotTypes.forEach(function(type) {
                        var button = document.createElement("button");
                        button.type = "button";
                        button.textContent = hotspotMap[type] || "Access";
                        button.dataset.type = type;
                        button.addEventListener("click", function() {
                            hotspotSelector.value = type;
                            hotspotChang(type);
                        });
                        tabs.appendChild(button);
                    });
                    var useTabs = document.body.dataset.accessStyle === "tabs";
                    tabs.hidden = !useTabs;
                    hotspotSelector.parentElement.hidden = useTabs;
                    hotspotChang(globalConfig.hotspotTypes[0]);
                    document.getElementById("hotspot-section").style.display = globalConfig.hotspotTypes.length > 1 ? "block" : "none";
                    break;
            }
        }

        function handleSubmit() {
            if (!requireTermsAcceptance()) return;
            var submitData = {};
            submitData['authType'] = window.authType;
            switch (window.authType) {
                case 3:
                    submitData['voucherCode'] = document.getElementById("voucherCode").value;
                    break;
                case 5:
                    submitData['localuser'] = document.getElementById("username").value;
                    submitData['localuserPsw'] = document.getElementById("password").value;
                    break;
                case 1:
                    submitData['simplePassword'] = document.getElementById("simplePassword").value;
                    break;
                case 0:
                    break;
                case 6:
                    submitData['phone'] = "+" + document.getElementById("country-code").value + document.getElementById("phone-number").value;
                    submitData['code'] = document.getElementById("verify-code").value;
                    break;
                case 2:
                case 8:
                    submitData['username'] = document.getElementById("username").value;
                    submitData['password'] = document.getElementById("password").value;
                    break;
                case 15:
                    submitData['ldapUsername'] = document.getElementById("username").value;
                    submitData['ldapPassword'] = document.getElementById("password").value;
                    break;
                default:
                    break;
            }

            if (isCommited == false) {
                submitData['clientMac'] = clientMac;
                submitData['apMac'] = apMac;
                submitData['gatewayMac'] = gatewayMac;
                submitData['ssidName'] = ssidName;
                submitData['radioId'] = radioId;
                submitData['vid'] = vid;
                if (window.authType == 2 || window.authType == 8 || window.authType === 15) {
                    if(window.authType === 15) {
                        submitUrl = '/portal/ldap/auth';
                    } else {
                        submitUrl = "/portal/radius/auth";
                    }
                    submitData['authType'] = window.authType;
                } else {
                    submitData['originUrl'] = originUrl;
                }

                function doAuth() {
                    Ajax.post(submitUrl, JSON.stringify(submitData).toString(), function(data) {
                        data = JSON.parse(data);
                        if (!!data && data.errorCode === 0) {
                            isCommited = true;
                            landingUrl = data.result || landingUrl;
                            showOperPrompt(errorHintMap["0"], false);
                            window.setTimeout(function() { window.location.href = landingUrl; }, 3000);
                        } else {
                            showOperPrompt(errorHintMap[data.errorCode] || "Authentication failed. Please check your details and try again.", true);
                        }
                    });
                }
                doAuth();
            }
        }

        function hotspotChang(type) {
            document.getElementById("input-voucher").style.display = "none";
            document.getElementById("input-user").style.display = "none";
            document.getElementById("input-password").style.display = "none";
            document.getElementById("input-phone-num").style.display = "none";
            document.getElementById("input-phone-number").style.display = "none";
            document.getElementById("input-verify-code").style.display = "none";
            document.getElementById("button-login").style.display = "block";
            window.authType = Number(type);
            document.querySelectorAll("#hotspot-tabs button").forEach(function(button) {
                var selected = Number(button.dataset.type) === Number(type);
                button.classList.toggle("active", selected);
                button.setAttribute("aria-pressed", String(selected));
            });
            switch (Number(type)) {
                case 3:
                    document.getElementById("input-voucher").style.display = "block";
                    break;
                case 5:
                case 2:
                case 8:
                case 15:
                    document.getElementById("input-user").style.display = "block";
                    document.getElementById("input-password").style.display = "block";
                    break;
                case 6:
                    document.getElementById("input-phone-num").style.display = "block";
                    document.getElementById("input-phone-number").style.display = "block";
                    document.getElementById("input-verify-code").style.display = "block";
                    break;
            }
        }

        globalConfig.countryCode = "+" + parseInt(globalConfig.countryCode, 10);
        document.getElementById("country-code").value = parseInt(globalConfig.countryCode, 10);
        document.getElementById("hotspot-selector").addEventListener("change", function() {
            var obj = document.getElementById("hotspot-selector");
            var opt = obj.options[obj.selectedIndex];
            hotspotChang(opt.value);
        });
        document.getElementById("button-login").addEventListener("click", handleSubmit);
        document.getElementById("get-code").addEventListener("click", function(e) {
            e.preventDefault();
            if (!requireTermsAcceptance()) return;
            var phoneNum = document.getElementById("phone-number").value;

            function sendSmsAuthCode() {
                Ajax.post("/portal/sendSmsAuthCode",
                    JSON.stringify({
                        clientMac: clientMac,
                        apMac: apMac,
                        gatewayMac: gatewayMac,
                        ssidName: ssidName,
                        radioId: radioId,
                        vid: vid,
                        phone: "+" + document.getElementById("country-code").value + phoneNum
                    }), function(data) {
                        data = JSON.parse(data);
                        if (data.errorCode !== 0) {
                            showOperPrompt(errorHintMap[data.errorCode] || "Could not send the verification code. Please try again.", true);
                        } else {
                            showOperPrompt("SMS has been sent successfully.", false);
                        }
                    }
                );
            }
            sendSmsAuthCode();
            showOperPrompt("Sending authorization code…", false, "Connection notice");
        });
        pageConfigParse();
    }
);