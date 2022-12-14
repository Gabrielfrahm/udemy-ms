export interface Category {
  readonly category: string;
  description: string;
  events: Event[];
}

export interface Event {
  name: string;
  operation: string;
  value: number;
}
