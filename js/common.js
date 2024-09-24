Node.prototype.$ = function(selector) { return this.querySelector(selector); }
Node.prototype.$$ = function(selector) { return [...this.querySelectorAll(selector)]; }
Node.prototype.$_ = function(parentClassname) {
    if(this.classList.contains(parentClassname)) return this; else return this.parentElement ? this.parentElement.$_(parentClassname) : undefined;
}

$ = selector => document.querySelector(selector);
$$ = selector => document.querySelectorAll(selector);

String.prototype.hashCode = function() {
    if(this.hash) return this.hash;
    this.hash = [...this].reduce((hash, ch) => hash * 31 + (ch.charCodeAt(0) & 255), 0);
    return this.hash;
};

String.prototype.compareTo = function(o) {
    return this > o ? 1 : (this === o ? 0 : -1);
}

Array.prototype.hashCode = function() {
    return (this.hash || this.hash === 0) ? this.hash : this.reduce((hash, el) => hash * 31 + el.hashCode(), 0);
}

Array.prototype.remove = function(el) {
    let pos = el instanceof Function ? this.findIndex(el) : this.indexOf(el);
    if(pos !== -1) this.splice(pos, 1);
}

class Pair {
    constructor(first, second) {
        this.first = first;
        this.second = second;
    }
}

function currDateStr() {
    let date = new Date();
    let year = date.getFullYear();
    let month = (date.getMonth() + 1).toString().padStart(2, "0");
    let day = date.getDate().toString().padStart(2, "0");

    return [year, month, day].join("-");
}

function currTimeStr() {
    let date = new Date();
    let hours = date.getHours().toString().padStart(2, "0");
    let minutes = date.getMinutes().toString().padStart(2, "0");
    let seconds = date.getSeconds().toString().padStart(2, "0");

    return [hours, minutes, seconds].join("-");
}

function currDateAndTimeStr() {
    return `${currDateStr()} ${currTimeStr()}`;
}
