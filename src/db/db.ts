import { IUser } from '../interfaces/user.interface';

class DbModel {
    private db: Map<string, IUser>;
  
    constructor() {
      this.db = new Map();
    }
  
    read() {
      return this.db;
    }

    set(item: IUser, id: string) {
        this.db.set(id, item);
    }
    
    put(item: IUser, id: string) {
        const itemToUpdate = item;

        if (item?.id) itemToUpdate.id = id;

        this.db.set(id, item);
    }
    
    get(id: string) {
        return this.db.get(id);
    }
    
    delete(id: string) {
        this.db.delete(id);
    }

    isAlreadyExist(id: string) {
        return this.db.has(id);
    }
}
  
export const db = new DbModel();