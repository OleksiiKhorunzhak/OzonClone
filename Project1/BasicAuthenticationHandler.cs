using Microsoft.AspNetCore.Authentication;
using Microsoft.Extensions.Options;
using System.Net.Http.Headers;
using System.Security.Claims;
using System.Text;
using System.Text.Encodings.Web;
using MongoDB.Bson;
using MongoDB.Driver;

namespace litak_back_end;

public class BasicAuthenticationHandler : AuthenticationHandler<AuthenticationSchemeOptions>
{
    public BasicAuthenticationHandler(
        IOptionsMonitor<AuthenticationSchemeOptions> options,
        ILoggerFactory logger,
        UrlEncoder encoder,
        ISystemClock clock)
        : base(options, logger, encoder, clock)
    {
    }

    protected override async Task<AuthenticateResult> HandleAuthenticateAsync()
    {        
        if (!Request.Headers.ContainsKey("Authorization"))
            return AuthenticateResult.Fail("Missing Authorization Header");

        try
        {
            var credentials = Request.Headers["Authorization"].First().Split(":");
            var username = credentials[0];
            var password = credentials[1];

            var authResult = await IsAuthenticated(username, password);
            
            if (authResult)
            {
                var identity = new ClaimsIdentity("custom");
                var principal = new ClaimsPrincipal(identity);
                
                return AuthenticateResult.Success(new AuthenticationTicket(principal, new AuthenticationProperties(), "custom"));
            }
            else
            {
                return AuthenticateResult.Fail("Invalid username or password");
            }
        }
        catch
        {
            return AuthenticateResult.Fail("Invalid Authorization Header");
        }
    }

    private static async Task<bool> IsAuthenticated(string username, string password)
    {
        var mongoClient =
            new MongoClient("mongodb+srv://western-ozon-db:onTRaHx6EV8SgKdB@cluster0.jfg3y84.mongodb.net/");
        var database = mongoClient.GetDatabase("sample_weatherdata");
        var filter = new BsonDocument(){ {"login", username}, {"password", password}};
        
        var recordsCollection = database.GetCollection<BsonDocument>("users");
        var record = (await recordsCollection.FindAsync(filter))?.FirstOrDefault();
        
        return record is not null;
    }
}
