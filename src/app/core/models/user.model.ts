export interface User{
    id:number;
    name:string;
    email:string;
    isBlocked:boolean;
    orders:{
        id:number;
        productName:string;
        price:number;
        date:string;
    }[]
}