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

// Create the DynamoDB client with credentials from environment
const client = new DynamoDBClient({
  region: "local",
  endpoint: "http://localhost:8000",
  // region: AWS_REGION,
  // credentials: {
  //   accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
  //   secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  // }
});

// Create the DocumentClient for easier JSON handling
const docClient = DynamoDBDocumentClient.from(client);

export { 
  docClient, 
  client, 
  TABLE_NAME,
  QueryCommand,
  PutCommand,
  TransactWriteCommand
};
