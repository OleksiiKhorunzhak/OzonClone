using DocumentFormat.OpenXml;
using DocumentFormat.OpenXml.Packaging;
using DocumentFormat.OpenXml.Spreadsheet;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Bson;
using MongoDB.Driver;
using Project1.Extensions;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Threading.Tasks;

namespace litak_back_end.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RecordFileController : ControllerBase
    {
        private static List<string> _headers = new List<string>()
        {
            "Місія",
            "Створений",
            "Призначення",
            "Дрон",
            "Підрозділ",
            "Смуга",
            "Машршрут вперед",
            "Машршрут вперед змін",
            "Виліт",
            "ЛБЗ Вперед",
            "Повернення",
            "Машршрут назад",
            "Машршрут назад змін",
            "Зниження",
            "ЛБЗ назад",
            "Зниження інформація",
            "Висота польоту",
            "Частота відео",
            "Частота керування",
            "Район завдання",
            "Одобрено",
            "Заборона",
            "Скасованно пілотом",
            "Посадка",
            "Статус",
            "Закінчення",
        };

        [HttpGet]
        public async Task<IActionResult> BuildFile()
        {
            var records = await GetAllRecords();

            return await BuildExcelFile(records);
        }

        private async Task<List<object>> GetAllRecords()
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

        private async Task<IActionResult> BuildExcelFile(List<object> records)
        {
            var memoryStream = new MemoryStream();

            using (var spreadsheetDocument = SpreadsheetDocument.Create(memoryStream, SpreadsheetDocumentType.Workbook))
            {
                var workbookPart = spreadsheetDocument.AddWorkbookPart();
                workbookPart.Workbook = new Workbook();

                var worksheetPart = workbookPart.AddNewPart<WorksheetPart>();
                var sheetData = new SheetData();
                worksheetPart.Worksheet = new Worksheet(sheetData);

                var sheets = spreadsheetDocument.WorkbookPart.Workbook.AppendChild(new Sheets());

                var sheet = new Sheet()
                    { Id = spreadsheetDocument.WorkbookPart.GetIdOfPart(worksheetPart), SheetId = 1, Name = "Записи" };
                sheets.Append(sheet);

                var headerRow = new Row();
                for (int i = 0; i < _headers.Count; i++)
                {
                    headerRow.Append(
                        new Cell() { DataType = CellValues.String, CellValue = new CellValue(_headers[i]) });
                }

                sheetData.AppendChild(headerRow);
                
                foreach (var record in records)
                {
                    var recordRow = new Row();
                    BuildRecordCell(recordRow, record as IDictionary<string, object>);
                    sheetData.AppendChild(recordRow);
                }
            }

            memoryStream.Seek(0, SeekOrigin.Begin);
            var excelContentType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
            var excelFileName = $"{DateTime.Now:MM-dd-yyyy-HH-mm}.xlsx";

            return File(memoryStream, excelContentType, excelFileName);
        }

        private static void BuildRecordCell(Row rowData, IDictionary<string, object> record)
        {
            // Місія
            rowData.Append(CreateCell($"{record.FormatDateTime("dateOfFlight", true)}-{record.GetValue("operator")}",
                CellValues.String));

            // Створений
            rowData.Append(CreateCell($"{record.FormatDateTime("dateOfFlight")}", CellValues.Date));

            // Призначення
            rowData.Append(CreateCell($"{record.GetNestedProperty("assignment", "name")}", CellValues.String));

            // Дрон
            rowData.Append(CreateCell($"{record.GetNestedProperty("model", "name")}", CellValues.String));

            // Підрозділ
            rowData.Append(CreateCell($"{record.GetValue("unit")}", CellValues.String));

            // Смуга
            rowData.Append(CreateCell($"{record.GetValue("zone")}", CellValues.String));

            // Машршрут вперед
            rowData.Append(CreateCell($"{record.GetValue("routeForward")}", CellValues.String));

            // Машршрут вперед змін
            rowData.Append(CreateCell($"{record.GetValue("changedForwardRoute")}", CellValues.String));

            // Виліт
            rowData.Append(CreateCell($"{record.FormatDateTime("flightStartDate")}", CellValues.Date));

            // ЛБЗ Вперед
            rowData.Append(CreateCell($"{record.FormatDateTime("LBZForwardDate")}", CellValues.Date));

            // Повернення
            rowData.Append(CreateCell($"{record.FormatDateTime("returnDate")}", CellValues.Date));

            // Машршрут назад
            rowData.Append(CreateCell($"{record.GetValue("routeBack")}", CellValues.String));

            // Машршрут назад змін
            rowData.Append(CreateCell($"{record.GetValue("changedReturnRoute")}", CellValues.String));

            // Зниження
            rowData.Append(CreateCell($"{record.FormatDateTime("reductionDate")}", CellValues.Date));

            // ЛБЗ назад
            rowData.Append(CreateCell($"{record.FormatDateTime("LBZBackDate")}", CellValues.Date));

            // Зниження інформація
            var reductionInfo = record.GetValue("reductionDistance") != string.Empty
                ? $"{record.GetValue("reductionDistance")}км. Район {record.GetValue("reductionLocation")}"
                : null;
            rowData.Append(CreateCell($"{reductionInfo}", CellValues.String));

            // Висота польоту
            rowData.Append(CreateCell($"{record.GetValue("workingHeight")}", CellValues.String));

            // Частота відео
            rowData.Append(CreateCell($"{record.GetValue("videoRange")}", CellValues.String));

            // Частота керування
            rowData.Append(CreateCell($"{record.GetValue("controlRange")}", CellValues.String));

            // Район завдання
            rowData.Append(CreateCell($"{record.GetValue("taskPerformanceArea")}", CellValues.String));

            // Одобрено
            var isApproved = record.GetNestedProperty("flightStep", "isApproved") switch
            {
                "True" => "Так",
                "False" => "Ні",
                _ => string.Empty
            };
            rowData.Append(CreateCell($"{isApproved}", CellValues.String));

            // Заборона
            rowData.Append(CreateCell($"{record.GetRejection()}", CellValues.String));

            // Скасовано пілотом
            rowData.Append(CreateCell($"{record.GetValue("terminatedPilotReason")}", CellValues.String));

            // Посадка
            rowData.Append(CreateCell($"{record.GetValue("boardingStatus")}", CellValues.String));

            // Статус
            rowData.Append(CreateCell($"{record.GetStatus()}", CellValues.String));

            // Закінчення
            rowData.Append(CreateCell($"{record.FormatDateTime("endDate")}", CellValues.Date));
        }

        private static Cell CreateCell(string text, CellValues cellType)
        {
            return new Cell()
            {
                InlineString = new InlineString() { Text = new Text(text)},
                DataType = CellValues.InlineString,
            };
        }
    }
}
