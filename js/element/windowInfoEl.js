class WindowInfoEl extends BaseInfoEl {
    constructor(entity, parentEl, index) {
        super(entity, parentEl,
            [
                it => it.state,
                it => it.childrenEls,
                it => `${it.entity.id}`
            ],
            `<input type="checkbox" class="win-info-checkbox form-check-input"/>`,
            "win-info-window", "card", "text-bg-primary", "mx-3", "mt-3");

        this.childrenEls = entity.tabs.map(tab => new TabInfoEl(tab, this));

        this.dataset.windowId = entity.id;
        this.dataset.index = index;

        let span = BaseInfoEl.fromHtml(`<span class="win-info-title">#${index}</span>`);
        let headDiv = BaseInfoEl.fromHtml(`<div class="win-info-head card-header m-sm-0"></div>`);
        headDiv.appendChild(this.checkbox);
        headDiv.appendChild(span);

        let tabsDiv = BaseInfoEl.fromHtml(`<div class="win-info-tabs card-body"></div>`);
        this.childrenEls.forEach(tabEl => tabsDiv.appendChild(tabEl));

        this.appendChild(headDiv);
        this.appendChild(tabsDiv);
    }

    toEntity() {
        if(this.state === BaseInfoEl.CHECKBOX_STATE_UNCHECKED) return null;

        let children = this.childrenEls.map(t => t.toEntity()).filter(it => it !== null);
        return new WindowInfo(this.entity.id, children);
    }
}

customElements.define("window-info", WindowInfoEl, { extends: "div" });
