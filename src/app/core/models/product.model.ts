export interface Product{
    id:number,
    name:string,
    description:string,
    price:number,
    imageUrl:string,
    availableSizes:string[],
    gender:string,
    categoryId?: number,
    imageUrls?: string[]
}
