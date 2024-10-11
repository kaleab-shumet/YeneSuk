export interface ProductInterface {
    name: string,
    sellingPrice: number,
    description: string,
    images: string[],
    category: string,

    quantity: number,

    rating?: number,

    _id?: string,
    createdAt?: string,
    updatedAt?: string
}