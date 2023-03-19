import Request from "./Request";
import { Location } from "./Location";
export class User{
    constructor(){
        this.phoneNumber = "";
        this.isLogin = false;
    }
    async allBook(){
        return Request.get(Location.book(`queryBooks`)).result();
    }
}