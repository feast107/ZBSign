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
