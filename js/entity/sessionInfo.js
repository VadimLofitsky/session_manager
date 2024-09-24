class SessionInfo extends BaseInfo {
    constructor(uuid, title, windows, date) {
        super([
            it => it.uuid,
            it => it.title,
            it => it.windows,
            it => it.date
        ]);

        this.uuid = uuid;
        this.title = title;
        this.windows = windows;
        this.date = date;
    }

    static fromObj(obj) {
        return new SessionInfo(
            obj.uuid,
            obj.title,
            (obj.windows || []).map(it => WindowInfo.fromObj(it)),
            obj.date
        );
    }

    static UUID() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'
            .replace(/[xy]/g, function (c) {
                const r = Math.random() * 16 | 0,
                    v = c === 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });
    }
}
