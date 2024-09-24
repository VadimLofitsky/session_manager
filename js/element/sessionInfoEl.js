class SessionInfoEl extends BaseInfoEl {
    constructor(entity, index, isStoredSession) {
        super(entity, null,
            [
                it => it.dataset.uuid,
                it => it.state,
                it => it.title,
                it => it.childrenEls
            ],
            `<input type="checkbox" class="session-info-checkbox form-check-input"/>`,
            "session-info", "list-group-item", "input-group", "mx-3");

        this.title = entity.title;
        this.childrenEls = entity.windows.map((wnd, i) => new WindowInfoEl(wnd, this, i));
        this.isStoredSession = isStoredSession;

        this.dataset.uuid = entity.uuid;
        this.dataset.date = entity.date;
        this.dataset.index = index;

        if(index === 0) this.classList.add("active");

        this.addEventListener("mouseenter", (ev) => { if(this.isStoredSession) SessionInfoEl.addCloseBtn(this); });
        this.addEventListener("mouseleave", (ev) => {
            let closeBtn = this.$(".session-info-btn-close");
            if(closeBtn) closeBtn.remove();
        });

        this.titleInput = BaseInfoEl.fromHtml(`<input type="text" class="session-info-title form-control"/>`);
        this.titleInput.value = (entity.title || currDateAndTimeStr());
        this.titleInput.readOnly = true;
        this.titleInput.addEventListener("dblclick", (ev) => { ev.target.readOnly = !ev.target.readOnly; ev.stopPropagation(); });
        this.titleInput.addEventListener("focusout", (ev) => { ev.target.readOnly = true; this.updateTitle(this.title) });
        this.titleInput.addEventListener("keypress", (ev) => { if(ev.key === "Enter") { this.entity.title = ev.target.value; ev.target.readOnly = true;  this.hashCode(); } });

        let div1 = BaseInfoEl.fromHtml(`<div class="session-info-controls"/>`);
        div1.appendChild(this.checkbox);
        div1.appendChild(this.titleInput);
        this.appendChild(div1);

        let div2 = BaseInfoEl.fromHtml(`<div class="session-info-info">${(entity.date || "")}</div>`);
        this.appendChild(div2);
    }

    static externalOnCloseBtnHandler;

    static addCloseBtn(el) {
        let btn = BaseInfoEl.fromHtml(`<button class="session-info-btn-close">X</button>`);
        btn.addEventListener("click", (ev) => { if(this.externalOnCloseBtnHandler) {
            ev.stopPropagation();
            this.externalOnCloseBtnHandler(el);
        } });
        el.appendChild(btn);
    }

    updateTitle(title) {
        this.entity.title = title;
        if(this.hash) this.hashCode();
    }

    toEntity() {
        if(this.state === BaseInfoEl.CHECKBOX_STATE_UNCHECKED) return null;

        let children = this.childrenEls.map(t => t.toEntity()).filter(it => it !== null);
        return new SessionInfo(this.dataset.uuid, this.titleInput.value, children, this.dataset.date);
    }
}

customElements.define("session-info", SessionInfoEl, { extends: "div" });
