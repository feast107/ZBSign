export class Location{
    static get Url(){ return "http://47.93.86.37:8999"; }
    static get Root(){ return `${this.Url}/signservice`; } 
    static get Activity(){ return `${this.Root}/activity`; }
    static get Stroke(){ return `${this.Root}/stroke`; }
    static get Dic(){ return `${this.Root}/dic` }

    static activity(method){
        return `${this.Activity}/${method}`;
    }
    static stroke(method){
        return `${this.Stroke}/${method}`;
    }
    static dic(method){
        return `${this.Dic}/${method}`;
    }
}