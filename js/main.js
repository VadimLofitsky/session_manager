document.addEventListener("DOMContentLoaded", start);

let lsHelper = new LocalStorageHelper("sessions");

let btnGetStoredSessions;
let btnGetCurrentWindows;
let inputFileChooser;
let aSaveFile;
let fileReader;

let sessionsElement;
let windowsElement;

let carouselElement;
let carouselInnerElement;
let carouselControlPrev;
let carouselControlNext;

async function start() {
    btnGetStoredSessions = $("#btnGetStoredSessions");
    btnGetCurrentWindows = $("#btnGetCurrentWindows");
    inputFileChooser = $("#inputFileChooser");
    aSaveFile = $("#aSaveFile");

    carouselElement = new bootstrap.Carousel($("#carousel"));
    carouselInnerElement = $(".carousel-inner");
    carouselControlPrev = $(".carousel-control-prev");
    carouselControlNext = $(".carousel-control-next");

    sessionsElement = $("#sessions");
    windowsElement = $("#windows");

    addListeners();

    getCurrentWindowsSession().then(it => showSessions(it, false));
}

function addListeners() {
    let sessionTitleClickDispatcher = new ClickDispatcher(function(ev) {
        let classList = ev.target.classList;
        if(classList.contains("session-info-title") && !ev.target.readOnly || classList.contains("session-info-checkbox")) return;

        if([...classList.values()].some(c => c.startsWith("session-info"))) {
            switchActiveSession(ev.target.$_("session-info"));
        }
    });

    sessionsElement.addEventListener("click", (ev) => { sessionTitleClickDispatcher.dispatch(ev); });

    SessionInfoEl.externalOnCloseBtnHandler = sessionEl => showSessions(removeSession(sessionEl), true);

    btnGetStoredSessions.onclick = (ev) => showStoredSessions({ button: ev.target });

    btnGetCurrentWindows.classList.add("active");
    btnGetCurrentWindows.onclick = async (ev) => {
        getCurrentWindowsSession().then(it => {
            showSessions(it, false);
            carouselElement.to(1);
            properlyChangeStateOfToggleButtons(ev.target, btnGetStoredSessions);
        });
    };

    $("#btnSaveSession").onclick = (ev) => { saveSelected(it => showSessions(it, true), "Проверил, какие сессии, окна и страницы отмечены?"); };

    $("#btnOpenWindows").onclick = (ev) => { openWindows(); };

    fileReader = new FileReader();
    fileReader.addEventListener("load", () => {
        console.log(fileReader.result);
        const parsed = JSON.parse(fileReader.result);
        lsHelper.saveJson(fileReader.result);
        showStoredSessions({ fromObj: parsed });
    });

    inputFileChooser.addEventListener("change", ev => {
        const [file] = (ev.target.files || []);
        if(file) {
            fileReader.readAsText(file);
            ev.target.files = undefined;
        }
    });

    $("#btnLoadFromFile").onclick = (ev) => inputFileChooser.click();

    $("#btnSaveToFile").onclick = (ev) => {
        let url;
        try {
            const content = lsHelper.getAllAsString();
            url = URL.createObjectURL(new Blob([content], { type: "text/plain" }));
            aSaveFile.href = url;
            aSaveFile.download = `browser_sessions_${currDateStr()}.sm`;
            aSaveFile.click();
            URL.revokeObjectURL(url);
        } catch(e) {
            alert(e.message);
        } finally {
            if(url) {
                URL.revokeObjectURL(url);
            }
        }
    };

    carouselInnerElement.onclick = function (ev) {
        let targetClasses = ev.target.classList;
        if(targetClasses.contains("win-info-tab-checkbox") || targetClasses.contains("win-info-checkbox") || targetClasses.contains("session-info-checkbox")) {
            checkboxOnChange(ev.target);
        }
    };
}

function properlyChangeStateOfToggleButtons(thisToggleButton, anotherToggleButton) {
    thisToggleButton.classList.add("active");
    anotherToggleButton.classList.remove("active");
}

async function getCurrentWindowsSession() {
    let allTabs = await chrome.tabs.query({});

    let windows = [...Map.groupBy(allTabs, tab => tab.windowId).entries()]
        .map(entryArr => {
            let tabs = entryArr[1]
                .map(tab => new TabInfo(tab.id, tab.url, tab.title, tab.index))
                .sort((t1, t2) => t1.index - t2.index);
            return new WindowInfo(entryArr[0], tabs);
        });

    return [new SessionInfo(SessionInfo.UUID(), "", windows, currDateAndTimeStr())];
}

function showStoredSessions({fromObj, button}) {
    let sessions = getStoredSessions(fromObj);
    showSessions(sessions, true);
    carouselElement.to(0);
    if(button) properlyChangeStateOfToggleButtons(button, btnGetCurrentWindows);
}

function getStoredSessions(fromObj) {
    if(fromObj) {
        return fromObj.map(session => SessionInfo.fromObj(session));
    } else {
        return lsHelper.getAll().map(session => SessionInfo.fromObj(session));
    }
}

function showSessionWindows(sessionEl) {
    windowsElement.innerHTML = "";
    sessionEl.childrenEls.forEach(it => windowsElement.appendChild(it));
}

function showSessions(sessions, isStoredSession) {
    sessionsElement.innerHTML = "";
    windowsElement.innerHTML = "";
    sessions.forEach((session, index) => {
        sessionsElement.appendChild(new SessionInfoEl(session, index, isStoredSession));
    });

    if(isStoredSession) {
        properlyChangeStateOfToggleButtons(btnGetStoredSessions, btnGetCurrentWindows);
    } else {
        properlyChangeStateOfToggleButtons(btnGetCurrentWindows, btnGetStoredSessions);
    }

    if(sessionsElement.children.length !== 0) {
        showSessionWindows(sessionsElement.firstElementChild);
    }
}

function saveSelected(callback, confirmationText) {
    if(!confirm(confirmationText)) return;

    let sessions = [...sessionsElement.children]
        .map(sessionEl => sessionEl.toEntity())
        .filter(it => it !== null);

    callback(lsHelper.updateAllByUUID(sessions));
}

function removeSession(sessionEl) {
    return lsHelper.removeByUUID(sessionEl.dataset.uuid);
}

function switchActiveSession(target) {
    sessionsElement.$$(".active").forEach(el => el.classList.remove("active"));
    target.classList.add("active");
    showSessionWindows(target);
    carouselElement.to(1);
}

function checkboxOnChange(chbox) {
    chbox.parentEl.updateStateByExternalEvent(chbox.checked);
}

async function openWindows() {
    let pairs = windowsElement.$$(".win-info-tab-checkbox")
        .filter(el => el.checked)
        .map(el => new Pair(el.parentElement.parentElement, el));
    if(pairs.length === 0) return;

    [...Map.groupBy(pairs, it => it.first).entries()]
        .forEach((entryArr, index, all) => {
            let tabs = entryArr[1]
                .filter(pair => pair.second.checked)
                .map(pair => pair.second.nextElementSibling.href);
            if(tabs.length === 0) return null;

            chrome.windows.create({
                focused: index === all.length - 1,
                url: tabs
            });
        });
}
