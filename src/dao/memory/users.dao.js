
export default class UsersDao {
    constructor() {
        this.data = [];
    }

    async getAll() {
        return this.data;
    }

    async save(newElement) {
        this.data.push(newElement);
    }
}