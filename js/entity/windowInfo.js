class WindowInfo extends BaseInfo {
    constructor(id, tabs) {
        super([
            it => it.tabs,
            it => `${it.id}`
        ]);

        this.id = id;
        this.tabs = tabs;
    }

    static fromObj(obj) {
        return new WindowInfo(obj.id, (obj.tabs || []).map(it => TabInfo.fromObj(it)));
    }
}
