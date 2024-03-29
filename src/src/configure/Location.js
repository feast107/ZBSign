export class Location {
    static get Url() { return "http://47.93.86.37:8999"; }
    static get Root() { return `${this.Url}/signservice`; }
    static get Activity() { return `${this.Root}/activity`; }
    static get Stroke() { return `${this.Root}/stroke`; }
    static get Dic() { return `${this.Root}/dic` }
    static get Book() { return `${this.Root}/book` }
    static get Token() {
        return "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJ6YmgiLCJleHAiOjE2ODE1MzY3OTYsInVzZXJJZCI6IjYyNWFiMTY0ZTRiMGQ4ZDBjNjc2MGY5NCIsInVzZXJuYW1lIjoiMTU3MjY2NjA4MzYifQ.OLxzfpkILvroOd1R4mrdgDmC_wwLs8pKujdf_E_1n_I";
    }

    static activity(method) {
        return `${this.Activity}/${method}`;
    }
    static stroke(method) {
        return `${this.Stroke}/${method}`;
    }
    static dic(method) {
        return `${this.Dic}/${method}`;
    }
    static book(method) {
        return `${this.Book}/${method}`;
    }
}