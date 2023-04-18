import Request from "../utils/Request";
import { Location } from "../configure/Location";
export class User{
    constructor(){
        this.phoneNumber = "";
        this.isLogin = false;
    }
    async allBook(){
        return Request.get(Location.book(`queryBooks`)).result();
    }
}