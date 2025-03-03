using System.Text.Json.Nodes;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Bson;
using MongoDB.Driver;
using MongoDB.Driver.Core.Events;
using MongoDB.Driver.Linq;
using System.Globalization;

namespace litak_back_end.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RecordsController : ControllerBase
    {
        [HttpGet]
        //[Authorize(AuthenticationSchemes = "BasicAuthentication")]
        public async Task<List<object>> GetAllRecords()
        {
            var mongoClient = new MongoClient("mongodb+srv://admin:admin@sandbox.ioqzb.mongodb.net/");
            var database = mongoClient.GetDatabase("sample_weatherdata");

            var recordsCollection = database.GetCollection<BsonDocument>("records");
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

        [HttpPost]
        public async Task<IActionResult> SaveRecord([FromBody] JsonObject recordJson)
        {
            try
            {
                var record = BsonDocument.Parse(recordJson.ToString());
                var mongoClient = new MongoClient("mongodb+srv://admin:admin@sandbox.ioqzb.mongodb.net/");
                var database = mongoClient.GetDatabase("sample_weatherdata");

                var recordsCollection = database.GetCollection<BsonDocument>("records");
                var filter1 = Builders<BsonDocument>.Filter.Eq("userId", record["userId"]);
                var filter2 = Builders<BsonDocument>.Filter.Ne("flightStep.step", 6);
                var combinedFilter = Builders<BsonDocument>.Filter.And(filter1, filter2);

                var previousRecord = (await recordsCollection.FindAsync(combinedFilter)).FirstOrDefault();

                if (previousRecord is not null)
                {
                    await recordsCollection.ReplaceOneAsync(combinedFilter, record);
                }
                else
                {
                    await recordsCollection.InsertOneAsync(record);
                }

                return Ok("Record saved successfully");
            }
            catch (Exception ex)
            {
                return BadRequest("Invalid JSON data: " + ex.Message);
            }
        }

        [HttpPut]
        public async Task UpdateRecord(string recordId, [FromBody] JsonObject recordJson)
        {
            var document = BsonDocument.Parse(recordJson.ToString());

            if (document.Contains("endDate") && document["endDate"].IsString)
            {
                string dateString = document["endDate"].AsString;
                if (DateTime.TryParse(dateString, out DateTime date))
                {
                    document["endDate"] = date; // Update the endDate field with the parsed DateTime value
                }
            }

            var filter = Builders<BsonDocument>.Filter.Eq("_id", new ObjectId(recordId));

            var mongoClient = new MongoClient("mongodb+srv://admin:admin@sandbox.ioqzb.mongodb.net/");
            var database = mongoClient.GetDatabase("sample_weatherdata");
            var collection = database.GetCollection<BsonDocument>("records");

            var existingDocument = await collection.Find(filter).FirstOrDefaultAsync();

            UpdateCheckedInformationIfNotExists(existingDocument, document);
            await collection.ReplaceOneAsync(filter, document);
        }

        [HttpDelete]
        public async Task DeleteRecord(string recordId)
        {
            var mongoClient = new MongoClient("mongodb+srv://admin:admin@sandbox.ioqzb.mongodb.net/");
            var database = mongoClient.GetDatabase("sample_weatherdata");

            var recordsCollection = database.GetCollection<BsonDocument>("records");
            var filter = Builders<BsonDocument>.Filter.Eq("_id", new ObjectId(recordId));
            await recordsCollection.DeleteOneAsync(filter);
        }

        [HttpPost]
        [Route("delete-record-list")]
        public async Task DeleteRecords([FromBody] List<string> recordIds)
        {
            var mongoClient = new MongoClient("mongodb+srv://admin:admin@sandbox.ioqzb.mongodb.net/");
            var database = mongoClient.GetDatabase("sample_weatherdata");

            var recordsCollection = database.GetCollection<BsonDocument>("records");

            var filter = Builders<BsonDocument>.Filter.In("_id", recordIds.Select(id => new ObjectId(id)));

            await recordsCollection.DeleteManyAsync(filter);
        }

        [HttpGet("GetNotFinishedRecords")]
        public async Task<List<object>> GetNotFinishedRecords()
        {
            var mongoClient = new MongoClient("mongodb+srv://admin:admin@sandbox.ioqzb.mongodb.net/");
            var database = mongoClient.GetDatabase("sample_weatherdata");

            var recordsCollection = database.GetCollection<BsonDocument>("records");
            var filter = Builders<BsonDocument>.Filter.Ne("flightStep.step", 6);

            var records = (await recordsCollection.FindAsync(filter)).ToList();
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

        [HttpGet("GetNotFinishedRecordsOrItTenMinutesRange")]
        public async Task<List<object>> GetNotFinishedRecordsOrItTenMinutesRange([FromQuery] int timeRange)
        {
            var mongoClient = new MongoClient("mongodb+srv://admin:admin@sandbox.ioqzb.mongodb.net/");
            var database = mongoClient.GetDatabase("sample_weatherdata");

            var recordsCollection = database.GetCollection<BsonDocument>("records");


            var currentTimeUtc = DateTime.UtcNow; // Current UTC time
            var tenMinutesAgoLocal = currentTimeUtc.AddMinutes(-timeRange);
            var filter = Builders<BsonDocument>.Filter.Or(
                Builders<BsonDocument>.Filter.Ne("flightStep.step", 6),
                Builders<BsonDocument>.Filter.Gte("endDate", tenMinutesAgoLocal)
            );

            var records = (await recordsCollection.FindAsync(filter)).ToList();
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

        [HttpGet("GetRecordsForUser")]
        public async Task<List<object>> GetRecordsForUser([FromQuery] string userId)
        {
            var mongoClient = new MongoClient("mongodb+srv://admin:admin@sandbox.ioqzb.mongodb.net/");
            var database = mongoClient.GetDatabase("sample_weatherdata");

            var recordsCollection = database.GetCollection<BsonDocument>("records");
            var filter1 = Builders<BsonDocument>.Filter.Eq("userId", userId);
            var filter2 = Builders<BsonDocument>.Filter.Ne("flightStep.step", 6);
            var combinedFilter = Builders<BsonDocument>.Filter.And(filter1, filter2);

            var records = (await recordsCollection.FindAsync(combinedFilter)).ToList();
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

        [HttpGet("GetRecordById")]
        public async Task<List<object>> GetRecordById([FromQuery] string recordId)
        {
            var mongoClient = new MongoClient("mongodb+srv://admin:admin@sandbox.ioqzb.mongodb.net/");
            var database = mongoClient.GetDatabase("sample_weatherdata");

            var recordsCollection = database.GetCollection<BsonDocument>("records");
            var filter = Builders<BsonDocument>.Filter.Eq("_id", new ObjectId(recordId));

            var records = (await recordsCollection.FindAsync(filter)).ToList();
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

        [HttpGet("GetLastRecordByUserId")]
        public async Task<object> GetLastRecordByUserId([FromQuery] string userId)
        {
            var mongoClient = new MongoClient("mongodb+srv://admin:admin@sandbox.ioqzb.mongodb.net/");
            var database = mongoClient.GetDatabase("sample_weatherdata");

            var recordsCollection = database.GetCollection<BsonDocument>("records");

            var filter = Builders<BsonDocument>.Filter.Eq("userId", userId);
            var sort = Builders<BsonDocument>.Sort.Descending("dateOfFlight");
            var result = await recordsCollection.Find(filter).Sort(sort).Limit(1).FirstOrDefaultAsync();

            if(result is null){
                return null;
            }

            result["_id"] = result["_id"].AsObjectId.ToString();
            return BsonTypeMapper.MapToDotNetValue(result);
        }

        private static void UpdateCheckedInformationIfNotExists(BsonDocument? existingDocument, BsonDocument document)
        {
            if (existingDocument == null)
            {
                return;
            }

            var isFlightStepCheckedElement = existingDocument.Elements.FirstOrDefault(x=>x.Name == "isFlightStepChecked");
            var isLbzForwardStepCheckedElement = existingDocument.Elements.FirstOrDefault(x=>x.Name == "isLbzForwardStepChecked");
            var isLbzBackStepCheckedElement = existingDocument.Elements.FirstOrDefault(x=>x.Name == "isLbzBackStepChecked");
            var isReductionStepCheckedElement = existingDocument.Elements.FirstOrDefault(x=>x.Name == "isReductionStepChecked");

            if (isFlightStepCheckedElement.Name is not null)
            {
                if (!document.Contains(isFlightStepCheckedElement))
                {
                    document.Add(isFlightStepCheckedElement);
                }
            }

            if (isLbzForwardStepCheckedElement.Name is not null)
            {
                if (!document.Contains(isLbzForwardStepCheckedElement))
                {
                    document.Add(isLbzForwardStepCheckedElement);
                }
            }

            if (isLbzBackStepCheckedElement.Name is not null)
            {
                if (!document.Contains(isLbzBackStepCheckedElement))
                {
                    document.Add(isLbzBackStepCheckedElement);
                }
            }

            if (isReductionStepCheckedElement.Name is not null)
            {
                if (!document.Contains(isReductionStepCheckedElement))
                {
                    document.Add(isReductionStepCheckedElement);
                }
            }
        }

    }
}
