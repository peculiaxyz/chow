using System;
using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using System.Collections.Generic;
using System.Linq;
using Microsoft.Azure.Documents.Client;
using Microsoft.Azure.Documents;
using Microsoft.Azure.Documents.Linq;

namespace ChowServerlessRestAPI
{
  public static class MealOptionsController
  {

    [FunctionName("GetAllMealOptions")]
    public static IActionResult GetAll(
        ILogger log,
        [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "mealoptions")] HttpRequest req,
        [CosmosDB(
                databaseName: "chowDB",
                collectionName: "mealsCollection",
                ConnectionStringSetting = "CosmosDBConnection",
                SqlQuery = "SELECT * FROM c order by c._ts desc")]
                IEnumerable<MealOptionDto> meals)
    {
      log.LogInformation($"mealsCollection contains {meals?.ToList().Count} items");
      return new OkObjectResult(meals.ToList());
    }



    [FunctionName("GetMealOptionByMealId")]
    public static IActionResult GetById(
    ILogger log,
    [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "mealoptions/{id}")] HttpRequest req,
    [CosmosDB(
                databaseName: "chowDB",
                collectionName: "mealsCollection",
                ConnectionStringSetting = "CosmosDBConnection",
                SqlQuery = "SELECT top 1 * FROM c where c.mealId = {id}")]
                IEnumerable<MealOptionDto> meals)
    {
      log.LogDebug("Seacrhing for meal with mealID={id}.");
      if (meals != null)
      {
        return new OkObjectResult(meals.First());
      }

      return new NotFoundResult();
    }


    [FunctionName("AddMealOption")]
    public static async Task<IActionResult> CreateNew(
            [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = "mealoptions")] HttpRequest req,
            [CosmosDB(databaseName: "chowDB", collectionName: "mealsCollection",
             ConnectionStringSetting = "CosmosDBConnection")] IDocumentClient cosmosDBClient,
            ILogger log)
    {
      string requestBody = String.Empty;
      using (StreamReader streamReader = new StreamReader(req.Body))
      {
        requestBody = await streamReader.ReadToEndAsync();
      }
      Uri collectionUri = UriFactory.CreateDocumentCollectionUri("chowDB", "mealsCollection");
      dynamic data = JsonConvert.DeserializeObject(requestBody);
      ResourceResponse<Document> newMeal = await cosmosDBClient.CreateDocumentAsync(collectionUri, data);
      // TODO: map to dto before reponse

      return new OkObjectResult(newMeal.Resource);
    }



    [FunctionName("UpdateMealOption")]
    public static async Task<IActionResult> Update(
        [HttpTrigger(AuthorizationLevel.Anonymous, "patch", "put", Route = "mealoptions")] HttpRequest req,
        [CosmosDB(databaseName: "chowDB", collectionName: "mealsCollection", ConnectionStringSetting = "CosmosDBConnection")] IDocumentClient cosmosDBClient,
        ILogger log)
    {
      string queryId = req.Query["id"];
      if (string.IsNullOrEmpty(queryId))
        return new BadRequestResult();

      string requestBody = String.Empty;
      using (StreamReader streamReader = new StreamReader(req.Body))
      {
        requestBody = await streamReader.ReadToEndAsync();
      }
      var updateData = JsonConvert.DeserializeObject<MealOptionDto>(requestBody);

      Uri docCollectionUri = UriFactory.CreateDocumentCollectionUri("chowDB", "mealsCollection");
      var docToUpdate = GetMealDocumentByMealId(cosmosDBClient, docCollectionUri, queryId);
      if (docToUpdate == null)
        return new NotFoundResult();

      Uri docUri = UriFactory.CreateDocumentUri("chowDB", "mealsCollection", docToUpdate.Id);
      if(!string.IsNullOrEmpty(updateData.Description)) docToUpdate.SetPropertyValue("description", updateData.Description);
      if (!string.IsNullOrEmpty(updateData.Category)) docToUpdate.SetPropertyValue("category", updateData.Category);
      docToUpdate.SetPropertyValue("DayOfTheWeek", updateData.DayOfTheWeek);
      if (!string.IsNullOrEmpty(updateData.Name))  docToUpdate.SetPropertyValue("name", updateData.Name);

      var opts = new RequestOptions() { EnableScriptLogging = true};
      ResourceResponse<Document> result = await cosmosDBClient.ReplaceDocumentAsync(docUri, docToUpdate, opts);
      if(result.StatusCode == System.Net.HttpStatusCode.OK)
        return new OkObjectResult(result.Resource);

      return new BadRequestResult();
    }


    [FunctionName("DeleteMealOption")]
    public static async Task<IActionResult> Delete(
        [HttpTrigger(AuthorizationLevel.Anonymous, "delete", Route = "mealoptions")] HttpRequest req,
        [CosmosDB(databaseName: "chowDB", collectionName: "mealsCollection", ConnectionStringSetting = "CosmosDBConnection")] IDocumentClient cosmosDBClient,
        ILogger log)
    {
      string queryId = req.Query["id"];
      if (string.IsNullOrEmpty(queryId))
        return new BadRequestResult();


      Uri docCollectionUri = UriFactory.CreateDocumentCollectionUri("chowDB", "mealsCollection");
      var docToDelete = GetMealDocumentByMealId(cosmosDBClient, docCollectionUri, queryId);
      if(docToDelete == null)
      {
        return new NotFoundResult();
      }
      // Leave this here in case we decide to use category as partition key later
      // var cat = docToDelete.GetPropertyValue<string>("category");

      var requestOpts = new RequestOptions() { PartitionKey = new PartitionKey(queryId)};
      Uri docUri = UriFactory.CreateDocumentUri("chowDB", "mealsCollection", docToDelete.Id);
      ResourceResponse<Document> result = await cosmosDBClient.DeleteDocumentAsync(docUri, requestOpts);

      if (result.StatusCode == System.Net.HttpStatusCode.NoContent)
        return new NoContentResult();

      return new BadRequestResult();
    }


    [FunctionName("SearchMealOptionsByDescription")]
    public static async Task<IActionResult> Run(
                [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "meals/search")] HttpRequest req,
                [CosmosDB(
                databaseName: "chowDB",
                collectionName: "mealsCollection",
                ConnectionStringSetting = "CosmosDBConnection")] IDocumentClient cosmosDBClient,
                ILogger log)
    {
      log.LogInformation("Executing SearchMealOptionsByDescription..");

      var searchterm = req.Query["query"];
      if (string.IsNullOrWhiteSpace(searchterm))
      {
        return (ActionResult)new NotFoundResult();
      }

      Uri collectionUri = UriFactory.CreateDocumentCollectionUri("chowDB", "mealsCollection");
      log.LogInformation($"Using Search term: {searchterm}");

      IDocumentQuery<MealOptionDto> query = cosmosDBClient.CreateDocumentQuery<MealOptionDto>(collectionUri)
          .Where(p => p.Description.Contains(searchterm))
          .AsDocumentQuery();

      var results = new List<MealOptionDto>();
      while (query.HasMoreResults)
      {
        foreach (var result in await query.ExecuteNextAsync())
        {
          results.Add(result);
        }
      }
      return new OkObjectResult(results);
    }


    private static Document GetMealDocumentByMealId(IDocumentClient cosmosDBClient, Uri docCollectionUri,  string mealId)
    {
      // TODO: Check stored procedures
      var query = new SqlQuerySpec("SELECT * FROM b WHERE b.mealId = @mealID",
                                   new SqlParameterCollection(new SqlParameter[] { new SqlParameter { Name = "@mealID", Value = mealId } }));

      // TODO: Change partition to meal cateory instead, e.g. lunch , supper or breakfast
      var feedOpts = new FeedOptions() { EnableCrossPartitionQuery = true, PartitionKey = new PartitionKey(mealId) };
      Document doc = cosmosDBClient.CreateDocumentQuery<Document>(docCollectionUri, query, feedOpts)
        .AsEnumerable()
        .SingleOrDefault();

      return doc;
    }
  }
}

