class BaseInfo {
    constructor(fieldExtractors) {
        this.fieldExtractors = fieldExtractors;
        this.childrenEls;
    }

    static commonEquals(o1, o2, extractors) {
        return extractors.every(fn => fn(o1) === fn(o2));
    }

    static commonHashCode(obj, extractors) {
        return extractors.reduce((hash, fn) => hash + 31 * fn(obj), 0);
    }

    equals(o) {
        let _this = (obj || this);
        return _this == o ? true : BaseInfo.commonEquals(_this, o, this.extractors);
    }

    hashCode(obj) {
        let _this = (obj || this);
        return (this.hash || this.hash === 0) ? this.hash : BaseInfo.commonHashCode(_this, this.fieldExtractors);
    }
}
