export class ResizeEvent {
    static on(delegate) {
        if (!this.delegates) {
            this.delegates = [];
        }
        this.delegates.push(delegate);
        window.onresize = (e) => {
            this.delegates.forEach((d) => {
                d(e.currentTarget.innerWidth, e.currentTarget.innerHeight);
            });
        };
    }
    static remove(delegate) {
        if (!this.delegates) return;
        let index = this.delegates.findIndex(delegate);
        if (index < 0) return;
        this.delegates.splice(index, 1);
    }
}

export class DomElement{
    static get display(){ return ""; }
    static get hidden(){ return "none"; }
    static changeIconParent(id ,target){
        let dom = document.getElementById(id);
        if(!dom || !dom.parentElement) return;
        dom.parentElement.style.display = target;
    }
}