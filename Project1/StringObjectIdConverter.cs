using MongoDB.Bson;
using MongoDB.Bson.Serialization;
using System;

// Configure BSON serialization settings

// Define a custom ObjectId converter
public class StringObjectIdConverter : IBsonSerializer<string>
{
    public Type ValueType => typeof(string);

    public string Deserialize(BsonDeserializationContext context, BsonDeserializationArgs args)
    {
        var bsonReader = context.Reader;
        if (bsonReader.GetCurrentBsonType() == BsonType.String)
        {
            var objectIdString = bsonReader.ReadString();
            if (ObjectId.TryParse(objectIdString, out var objectId))
            {
                return objectId.ToString();
            }
        }
        return null; // Handle other cases or invalid ObjectIds as needed
    }

    public void Serialize(BsonSerializationContext context, BsonSerializationArgs args, string value)
    {
        var bsonWriter = context.Writer;
        if (value != null && ObjectId.TryParse(value, out var objectId))
        {
            bsonWriter.WriteString(objectId.ToString());
        }
    }

    object IBsonSerializer.Deserialize(BsonDeserializationContext context, BsonDeserializationArgs args)
    {
        return Deserialize(context, args);
    }

    public void Serialize(BsonSerializationContext context, BsonSerializationArgs args, object value)
    {
        if (value is string stringValue)
        {
            Serialize(context, args, stringValue);
        }
        else
        {
            throw new InvalidOperationException($"Cannot serialize {value.GetType()} as a string ObjectId.");
        }
    }
}