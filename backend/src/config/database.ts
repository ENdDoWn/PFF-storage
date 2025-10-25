// Import the necessary commands
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { 
  DynamoDBDocumentClient, 
  QueryCommand, 
  PutCommand,
  TransactWriteCommand 
} from "@aws-sdk/lib-dynamodb";

// Load environment variables
const AWS_REGION = process.env.AWS_REGION || "us-east-1";
const TABLE_NAME = process.env.DYNAMODB_TABLE_NAME || "PFF_Storage_Table";
const AWS_ACCESS_KEY_ID = process.env.LAB_ACCESS_KEY_ID || "type";
const AWS_SECRET_ACCESS_KEY = process.env.LAB_SECRET_ACCESS_KEY || "script";
const AWS_SESSION_TOKEN = process.env.LAB_SESSION_TOKEN || "ด่า";

const client = new DynamoDBClient({
  region: AWS_REGION,
  credentials: {
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY,
    sessionToken: AWS_SESSION_TOKEN
  }
});

const docClient = DynamoDBDocumentClient.from(client);

const database = {
  docClient,
  client,
  TABLE_NAME,
  QueryCommand,
  PutCommand,
  TransactWriteCommand
};

export { 
  docClient, 
  client, 
  TABLE_NAME,
  QueryCommand,
  PutCommand,
  TransactWriteCommand
};

export default database;
