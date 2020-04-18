import PrimaryKey from "explorer-core/src/database/DAL/decorators/primaryKey";
import Queriable from "explorer-core/src/database/DAL/query/queriable";

export default class Author extends Queriable<Author> {
    @PrimaryKey() id: number;
    first_name: string;
    last_name: string;
    email: string;
    birthdate: string;
    added: string;

    constructor(init?: Partial<Author>) {
        super(init);
    }
}
