using System.Text.Json.Nodes;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Bson;
using MongoDB.Driver;

namespace litak_back_end.Controllers;

[Route("api/[controller]")]
[ApiController]
public class UsersController : ControllerBase
{
    [HttpGet]
    public async Task<List<object>> GetAllUsers()
    {
        var mongoClient =
            new MongoClient("mongodb+srv://admin:admin@sandbox.ioqzb.mongodb.net/");
        var database = mongoClient.GetDatabase("sample_weatherdata");

        var recordsCollection = database.GetCollection<BsonDocument>("users");
        var records = (await recordsCollection.FindAsync(_ => true)).ToList();

        var convertedRecords = records.ConvertAll(record =>
        {
            if (record.Contains("_id") && record["_id"].IsObjectId)
            {
                record["_id"] = record["_id"].AsObjectId.ToString();
            }

            return record;
        });

        return convertedRecords.ConvertAll(BsonTypeMapper.MapToDotNetValue);
    }
    
    [HttpGet("{username}/{userPassword}")]
    public async Task<object> GetUserByUserNameAndPassword(string username, string userPassword)
    {
        var mongoClient =
            new MongoClient("mongodb+srv://admin:admin@sandbox.ioqzb.mongodb.net/");
        var database = mongoClient.GetDatabase("sample_weatherdata");
        
        var filter = new BsonDocument(){ {"login", username}, {"password", userPassword}};
        
        var recordsCollection = database.GetCollection<BsonDocument>("users");
        var record = (await recordsCollection.FindAsync(filter)).FirstOrDefault();

        if (record == null)
            return BadRequest();


        if (record.Contains("_id") && record["_id"].IsObjectId)
        {
            record["_id"] = record["_id"].AsObjectId.ToString();
        }

        return BsonTypeMapper.MapToDotNetValue(record);
    }

    [HttpPost]
    public async Task<IActionResult> SaveUser([FromBody] JsonObject recordJson)
    {
        var record = BsonDocument.Parse(recordJson.ToString());
        var mongoClient =
            new MongoClient("mongodb+srv://admin:admin@sandbox.ioqzb.mongodb.net/");
        var database = mongoClient.GetDatabase("sample_weatherdata");

        var recordsCollection = database.GetCollection<BsonDocument>("users");
        var userWithTheSameLogin = Builders<BsonDocument>.Filter.Eq("login", record["login"]);

        var previousRecord = (await recordsCollection.FindAsync(userWithTheSameLogin)).FirstOrDefault();

        if (previousRecord is not null)
        {
            return BadRequest("User already exists");
        }

        await recordsCollection.InsertOneAsync(record);

        return Ok("Record saved successfully");
    }

    [HttpPut]
    public async Task UpdateUser(string userId, [FromBody] JsonObject recordJson)
    {
        var record = BsonDocument.Parse(recordJson.ToString());
        var mongoClient =
            new MongoClient("mongodb+srv://admin:admin@sandbox.ioqzb.mongodb.net/");
        var database = mongoClient.GetDatabase("sample_weatherdata");
        var collection = database.GetCollection<BsonDocument>("users");

        var filter = Builders<BsonDocument>.Filter.Eq("_id", new ObjectId(userId));

        await collection.ReplaceOneAsync(filter, record);
    }

    [HttpDelete]
    public async Task DeleteUser(string userId)
    {
        var mongoClient =
            new MongoClient("mongodb+srv://admin:admin@sandbox.ioqzb.mongodb.net/");
        var database = mongoClient.GetDatabase("sample_weatherdata");

        var recordsCollection = database.GetCollection<BsonDocument>("users");
        var filter = Builders<BsonDocument>.Filter.Eq("_id", new ObjectId(userId));
        await recordsCollection.DeleteOneAsync(filter);
    }
}