export interface Shoe {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  category: string;
  sizes: (number | string)[];
}

export interface OrderDetails {
  fullName: string;
  email: string;
  address: string;
  size: number | string;
  quantity: number;
  region: string;
}

export interface CartItem {
  id?: string;
  shoe: Shoe;
  size: number | string;
  quantity: number;
  region: string;
}