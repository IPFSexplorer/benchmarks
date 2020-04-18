import Queriable from "explorer-core/src/database/DAL/query/queriable";
import PrimaryKey from "explorer-core/src/database/DAL/decorators/primaryKey";
import Index from "explorer-core/src/database/DAL/decorators";

export default class User extends Queriable<User> {
    @PrimaryKey()
    name: string;

    @Index()
    age: number;

    toString() {
        return this.age;
    }
}
