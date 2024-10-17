const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '../../../.env' });

async function main() {

    console.log(process.env);
    const Db = process.env.REACT_APP_ATLAS_URI;
    const client = new MongoClient(Db);

    try {
        await client.connect();
        const collections = await client.db('test').collections();
        collections.forEach((collection) =>
            console.log(collection.s.namespace.collection)
        );
    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
}

main();
