import BetterSqlite3 from 'better-sqlite3';

export class Database {
  private db: BetterSqlite3.Database;

  constructor(path: string, callback?: (err: Error | null) => void) {
    try {
      this.db = new BetterSqlite3(path, { fileMustExist: true });
      callback?.(null);
    } catch (err) {
      callback?.(err as Error);
    }
  }

  all<T>(query: string, callback: (err: Error | null, rows: T[]) => void): void {
    try {
      const rows = this.db.prepare(query).all() as T[];
      callback(null, rows);
    } catch (err) {
      callback(err as Error, []);
    }
  }

  get<T>(query: string, callback: (err: Error | null, row: T) => void): void {
    try {
      const row = this.db.prepare(query).get() as T;
      callback(null, row);
    } catch (err) {
      callback(err as Error, undefined);
    }
  }

  close(): void {
    this.db.close();
  }
}
