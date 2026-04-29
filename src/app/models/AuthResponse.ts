import { Cart } from "./Cart";

export class AuthResponse{
    data? : any;
    cart?: Cart;
    message: string;
    success: boolean;
    token? : string;
}