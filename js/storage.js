class LocalStorageHelper {
    constructor(key) {
        this.key = key;
    }

    save(sessions) {
        localStorage[this.key] = JSON.stringify(sessions, (key, value) => key !== 'fieldExtractors' ? value : undefined);
    }

    getAll() {
        return JSON.parse(localStorage[this.key] || "[]");
    }

    getAllAsString() {
        return localStorage[this.key] || "[]";
    }

    remove(test) {
        let all = this.getAll();
        all.remove(test);
        this.save(all)
        return all;
    }

    removeByUUID(uuid) {
        return this.remove(it => it.uuid === uuid);
    }

    updateOrAdd(test, newValue) {
        let all = this.getAll();
        let index = all.findIndex(test);
        if(index !== -1) {
            all[index] = newValue;
        } else {
            all.push(newValue);
        }

        all.sort((s1, s2) => s2.date.compareTo(s1));
        this.save(all);
        return all;
    }

    updateAllByUUID(newSessions) {
        let allMap = new Map(this.getAll().map(it => [it.uuid, it]));
        newSessions.forEach(ns => allMap.set(ns.uuid, ns));
        let allSorted = [...allMap.values()]
            .sort((s1, s2) => s2.date.compareTo(s1));
        this.save(allSorted);
        return allSorted;
    }

    saveJson(json) {
        localStorage[this.key] = json;
    }
}
