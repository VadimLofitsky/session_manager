class TabInfo extends BaseInfo {
    constructor(id, url, title, index) {
        super([
            it => it.url,
            it => it.title,
            it => `${it.index}`,
            it => `${it.id}`
        ]);

        this.id = id;
        this.url = url;
        this.title = title;
        this.index = index;
    }

    static fromObj(obj) {
        return new TabInfo(obj.id, obj.url, obj.title, obj.index);
    }
}
