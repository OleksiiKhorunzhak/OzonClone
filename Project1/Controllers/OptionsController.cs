using System.Text.Json.Nodes;
using litak_back_end.Models;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Bson;
using MongoDB.Driver;
using Project1;

namespace litak_back_end.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OptionsController : ControllerBase
    {
        private readonly string _databaseName;
        private readonly IMongoClient mongoClient;

        public OptionsController(IConfiguration configuration, IMongoClient mongoClient)
        {
            _databaseName = configuration["ConnectionStrings:DatabaseName"];
            this.mongoClient = mongoClient;
        }

        [HttpGet]
        public async Task<List<object>> GetAllOptions()
        {
            var database = mongoClient.GetDatabase(_databaseName);
            
            var recordsCollection = database.GetCollection<BsonDocument>(CollectionNames.OptionsCollection);
            var records = (await recordsCollection.FindAsync(_ => true)).ToList();
            
            var convertedRecords = records.ConvertAll(record =>
            {
                if (record.Contains("_id") && record["_id"].IsObjectId)
                {
                    // Convert the ObjectId to a string
                    record["_id"] = record["_id"].AsObjectId.ToString();
                }
                return record;
            });
            
            return convertedRecords.ConvertAll(BsonTypeMapper.MapToDotNetValue);
        }

        [HttpPost]
        public async Task<IActionResult> SaveOptions(string optionsId, [FromBody] JsonObject recordJson)
        {
            try
            {
                var record = BsonDocument.Parse(recordJson.ToString());
                var database = mongoClient.GetDatabase(_databaseName);
                var replaceOptions = new ReplaceOptions { IsUpsert = true };
                var filter = Builders<BsonDocument>.Filter.Eq("_id", new ObjectId(optionsId));
                var recordsCollection = database.GetCollection<BsonDocument>(CollectionNames.OptionsCollection);
                await recordsCollection.ReplaceOneAsync(filter, record, replaceOptions);
                
                return Ok("Record saved successfully");
            }
            catch (Exception ex)
            {
                return BadRequest("Invalid JSON data: " + ex.Message);
            }
        }
        
        [HttpPut]
        public async Task UpdateOptions(string optionsId, [FromBody] JsonObject recordJson)
        {
            var record = BsonDocument.Parse(recordJson.ToString());
            var database = mongoClient.GetDatabase(_databaseName);
            var collection = database.GetCollection<BsonDocument>(CollectionNames.OptionsCollection);
            
            var filter = Builders<BsonDocument>.Filter.Eq("_id", new ObjectId(optionsId));

            await collection.ReplaceOneAsync(filter, record);
        }

        [HttpDelete]
        public async Task DeleteRecord(string optionsId)
        {
            var database = mongoClient.GetDatabase(_databaseName);

            var recordsCollection = database.GetCollection<BsonDocument>(CollectionNames.OptionsCollection);
            var filter = Builders<BsonDocument>.Filter.Eq("_id", new ObjectId(optionsId));
            await recordsCollection.DeleteOneAsync(filter);
        }
    }
}
