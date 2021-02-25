export interface Item {
  icon?: string | null;
  label: string;
  url: string;
}

interface ItemAPI extends Item {
  order: number;
}
