import PrimaryKey from "explorer-core/src/database/DAL/decorators/primaryKey";
import Queriable from "explorer-core/src/database/DAL/query/queriable";

export default class Post extends Queriable<Post> {
    @PrimaryKey() id: number;
    author_id: number;
    title: string;
    description: string;
    content: string;
    date: Date;

    constructor(init?: Partial<Post>) {
        super(init);
    }
}
