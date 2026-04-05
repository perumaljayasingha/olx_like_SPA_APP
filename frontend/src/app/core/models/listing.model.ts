export type ItemCondition = 'NEW' | 'LIKE_NEW' | 'GOOD' | 'FAIR';
export type ListingStatus = 'DRAFT' | 'ACTIVE' | 'SOLD' | 'ARCHIVED';

export interface CategorySummary {
  id: number;
  name: string;
  slug: string;
}

export interface SellerSummary {
  id: number;
  fullName: string;
  email: string;
}

export interface Listing {
  id: number;
  title: string;
  description: string | null;
  price: number;
  itemCondition: ItemCondition;
  listingStatus: ListingStatus;
  city: string | null;
  imageUrl: string | null;
  category: CategorySummary;
  seller: SellerSummary;
  createdAt: string;
  updatedAt: string | null;
}

export interface PageResponse<T> {
  content: T[];
  page: {
    number: number;
    size: number;
    totalElements: number;
    totalPages: number;
  };
}

export interface CreateListingPayload {
  title: string;
  description?: string;
  price: number;
  itemCondition: ItemCondition;
  categoryId: number;
  sellerId: number;
  city?: string;
  imageUrl?: string;
  listingStatus?: ListingStatus;
}

export interface UpdateListingPayload {
  sellerId: number;
  title?: string;
  description?: string;
  price?: number;
  itemCondition?: ItemCondition;
  listingStatus?: ListingStatus;
  categoryId?: number;
  city?: string;
  imageUrl?: string;
}
