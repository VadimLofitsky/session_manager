class BaseInfoEl extends HTMLDivElement {
    constructor(entity, parentEl, fieldExtractors, checkboxHtml, ...classes) {
        super("left");

        this.entity = entity;
        this.parentEl = parentEl;
        this.childrenEls;
        this.fieldExtractors = fieldExtractors;

        this.state = BaseInfoEl.CHECKBOX_STATE_CHECKED;

        classes.forEach(it => this.classList.add(it));

        this.checkbox = BaseInfoEl.fromHtml(checkboxHtml);
        this.checkbox.checked = true;
        this.checkbox.parentEl = this;
    }

    static CHECKBOX_STATE_CHECKED = "checked";
    static CHECKBOX_STATE_UNCHECKED = "unchecked";
    static CHECKBOX_STATE_INDETERMINATE = "indeterminate";

    static commonEquals(o1, o2, extractors) {
        return extractors.every(fn => fn(o1) === fn(o2));
    }

    static commonHashCode(obj, extractors) {
        return extractors.reduce((hash, fn) => hash + 31 * fn(obj), 0);
    }

    static fromHtml(html) {
        let tmp = document.createElement("div");
        tmp.innerHTML = html;
        return tmp.firstElementChild;
    }

    setCheckbox() {
        switch(this.state) {
            case BaseInfoEl.CHECKBOX_STATE_CHECKED:
                this.checkbox.checked = true;
                this.checkbox.indeterminate = false;
                break;
            case BaseInfoEl.CHECKBOX_STATE_UNCHECKED:
                this.checkbox.checked = false;
                this.checkbox.indeterminate = false;
                break;
            case BaseInfoEl.CHECKBOX_STATE_INDETERMINATE:
                this.checkbox.checked = false;
                this.checkbox.indeterminate = true;
                break;
        }
    }

    updateStateByExternalEvent(isChecked) {
        this.state = isChecked ? BaseInfoEl.CHECKBOX_STATE_CHECKED : BaseInfoEl.CHECKBOX_STATE_UNCHECKED;
        this.setCheckbox();
        if(this.childrenEls) this.childrenEls.forEach(it => it.onParentStateChanged(this.state));
        if(this.parentEl) this.parentEl.onChildStateChange(this.state);
    }

    onChildStateChange(childState) {
        if(!this.childrenEls) return;

        let prevSelectedState = this.state;
        switch(childState) {
            case BaseInfoEl.CHECKBOX_STATE_CHECKED:
                this.state = this.childrenEls.every(t => t.isSelected()) ? BaseInfoEl.CHECKBOX_STATE_CHECKED : BaseInfoEl.CHECKBOX_STATE_INDETERMINATE;
                break;
            case BaseInfoEl.CHECKBOX_STATE_UNCHECKED:
                this.state = this.childrenEls.every(t => !t.isSelected()) ? BaseInfoEl.CHECKBOX_STATE_UNCHECKED : BaseInfoEl.CHECKBOX_STATE_INDETERMINATE;
                break;
            case BaseInfoEl.CHECKBOX_STATE_INDETERMINATE:
                this.state = BaseInfoEl.CHECKBOX_STATE_INDETERMINATE;
                break;
        }

        if(this.state !== prevSelectedState) {
            this.setCheckbox();
            if(this.parentEl) this.parentEl.onChildStateChange(this.state);
        }
    }

    onParentStateChanged(parentState) {
        if(parentState === BaseInfoEl.CHECKBOX_STATE_INDETERMINATE) return;

        this.state = parentState;
        this.setCheckbox();
        if(this.childrenEls) this.childrenEls.forEach(it => it.onParentStateChanged(this.state));
    }

    isSelected() { return this.state !== BaseInfoEl.CHECKBOX_STATE_UNCHECKED; }

    equals(o) {
        return this == o ? true : BaseInfoEl.commonEquals(this, o, this.extractors);
    }

    hashCode() {
        return (this.hash || this.hash === 0) ? this.hash : BaseInfoEl.commonHashCode(this, this.fieldExtractors);
    }
}
