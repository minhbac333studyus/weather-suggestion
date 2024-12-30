import AWS from "aws-sdk";
git

const dynamoDb = new AWS.DynamoDB.DocumentClient();

export async function handler(event) {
    try {
        const data = event ;
        const { id, email, longitude, latitude } = data;
        const params = {
            TableName: 'user-subscribe',
            Item: {
                id: id,
                email: email,
                longitude: Number(longitude),
                latitude: Number(latitude),
            },
        };
        await dynamoDb.put(params).promise();
        return { statusCode: 200, body: JSON.stringify({ message: "User added successfully" }) };
    } catch (error) {
        console.error(error);
        return { statusCode: 500, body: JSON.stringify({ message: "Failed to add user" }) };
    }
};
export async function getAllUser() {
    let params = {
        TableName: 'user-subscribe',
    };

    let scanResults = [];
    let items;
    do {
        items = await dynamoDb.scan(params).promise();
        items.Items.forEach((item) => scanResults.push(item));
        params.ExclusiveStartKey = items.LastEvaluatedKey;
    } while (typeof items.LastEvaluatedKey !== "undefined");

    console.log('Retrieved all items:', scanResults);
    return scanResults
}

// getAllUser();
// handler(event2).then(response => console.log(response));