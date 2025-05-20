export class Queue<T> {
  private items: T[];
  private maxSize: number;

  constructor(maxSize: number = Number.MAX_SAFE_INTEGER) {
    this.items = [];
    this.maxSize = maxSize;
  }

  /**
   * Add an item to the end of the queue
   * @param item The item to add
   * @returns boolean indicating if the item was successfully added
   */
  enqueue(item: T): boolean {
    if (this.items.length >= this.maxSize) {
      return false;
    }
    this.items.push(item);
    return true;
  }

  /**
   * Remove and return the first item from the queue
   * @returns The removed item or undefined if queue is empty
   */
  dequeue(): T | undefined {
    return this.items.shift();
  }

  /**
   * Get the first item without removing it
   * @returns The first item or undefined if queue is empty
   */
  peek(): T | undefined {
    return this.items[0];
  }

  /**
   * Check if the queue is empty
   * @returns boolean indicating if the queue is empty
   */
  isEmpty(): boolean {
    return this.items.length === 0;
  }

  /**
   * Get the current size of the queue
   * @returns number of items in the queue
   */
  size(): number {
    return this.items.length;
  }

  /**
   * Clear all items from the queue
   */
  clear(): void {
    this.items = [];
  }

  /**
   * Get all items in the queue
   * @returns Array of all items
   */
  getAll(): T[] {
    return [...this.items];
  }
} 