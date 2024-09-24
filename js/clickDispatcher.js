class ClickDispatcher {
    constructor(clickHandler, dblclickHandler) {
        this.clickHandler = clickHandler;
        this.dblclickHandler = dblclickHandler;
        this.elements = [];
        this.timerHandler;
        this.DBL_CLICK_INTERVAL = 250;
    }

    add(el) {
        if(this.elements.length < 3) {
            this.elements.push(el);
        } else {
            this.elements.shift();
            this.elements.push(el);
        }
    }

    getLastInterval() {
        switch(this.elements.length) {
            case 3:
                return this.elements[2] - this.elements[1];
            case 2:
                return this.elements[1] - this.elements[0];
            case 1:
                return this.elements[0];
            case 0:
                return 1_000_000_000;
        }
    }

    invokeDblClickHandler(event) {
        this.timerHandler = undefined;
        event.stopPropagation();
        event.trueType = "dblclick";
        this.dblclickHandler(event);
    }

    invokeClickHandler(event) {
        event.trueType = "click";
        this.clickHandler(event);
    }

    dispatch(event) {
        this.add(Date.now());
        if(this.timerHandler || this.getLastInterval() < this.DBL_CLICK_INTERVAL) {
            if(this.dblclickHandler) {
                window.clearTimeout(this.timerHandler);
                this.timerHandler = undefined;
                this.invokeDblClickHandler(event);
            }
        } else {
            this.timerHandler = window.setTimeout(() => {
                this.timerHandler = undefined;
                if(this.getLastInterval() < this.DBL_CLICK_INTERVAL) {
                    if(this.dblclickHandler) {
                        this.invokeDblClickHandler(event);
                    }
                } else {
                    if(this.clickHandler) {
                        this.invokeClickHandler(event);
                    }
                }
            }, this.DBL_CLICK_INTERVAL);
        }
    }

    toString() {
        return this.elements.join(", ");
    }
}
