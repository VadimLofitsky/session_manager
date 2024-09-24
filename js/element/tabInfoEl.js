class TabInfoEl extends BaseInfoEl {
    constructor(entity, parentEl) {
        super(entity, parentEl,
            [
                it => it.entity.url,
                it => it.state,
                it => `${it.entity.id}`,
            ],
            `<input type="checkbox" class="win-info-tab-checkbox form-check-input">`,
            "win-info-tab");

        this.dataset.tabId = entity.id;
        this.dataset.index = entity.index;

        let a = BaseInfoEl.fromHtml(`<a href="${entity.url}" class="win-info-tab-url card-text">${entity.title}</a>`);

        this.appendChild(this.checkbox);
        this.appendChild(a);
    }

    toEntity() {
        return this.state === BaseInfoEl.CHECKBOX_STATE_CHECKED
            ? new TabInfo(this.entity.id, this.entity.url, this.entity.title, this.entity.index)
            : null;
    }
}

customElements.define("tab-info", TabInfoEl, { extends: "div" });
