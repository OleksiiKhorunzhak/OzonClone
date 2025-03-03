namespace Project1.Extensions;

public static class DictionaryExtensions
{
    public static string GetStatus(this IDictionary<string, object>? record)
    {
        try
        {
            int step = (int)(record["flightStep"] as IDictionary<string, object>)["step"];

            return step switch
            {
                0 => "Початок",
                1 => "Політ",
                2 => "ЛБЗ Вперед",
                3 => "Повернення",
                4 => "ЛБЗ Назад",
                5 => "Початок зниження",
                6 => "Завершено",
                _ => string.Empty
            };
        }
        catch
        {
            return string.Empty;
        }
    }

    public static string GetNestedProperty(this IDictionary<string, object>? record, string key, string nested)
    {
        try
        {
            if (!record.ContainsKey(key))
            {
                return string.Empty;
            }

            var isBooleanResult = bool.TryParse((record[key] as Dictionary<string, object>)?[nested].ToString(), out bool boolResult);
            return isBooleanResult ? boolResult.ToString() : (string)(record[key] as Dictionary<string, object>)?[nested];
        }
        catch
        {
            return string.Empty;
        }
    }

    public static string GetRejection(this IDictionary<string, object>? record)
    {
        var rejectionReason = GetValue(record, "rejectedReason");

        if (record.GetBooleanValue("isRejectedbyPPO"))
        {
            return $"Заборонено ППО по причині: {rejectionReason}";
        }

        if (record.GetBooleanValue("isRejectedbyREB"))
        {
            return $"Заборонено РЕБ по причині: {rejectionReason}";
        }

        if (record.GetBooleanValue( "isRejectedbyAdmin"))
        {
            return $"Заборонено ЧЕРГОВОГО по причині: {rejectionReason}";
        }

        return string.Empty;
    }

    public static bool GetBooleanValue(this IDictionary<string, object>? record, string key)
    {
        try
        {
            if (!record.ContainsKey(key))
            {
                return false;
            }

            return (bool)record?[key];
        }
        catch
        {
            return false;
        }
    }

    public static string FormatDateTime(this IDictionary<string, object>? record, string key, bool isForMission = false)
    {
        try
        {
            if (!record.ContainsKey(key))
            {
                return string.Empty;
            }

            var formatter = isForMission == false ? "dd/MM/yy HH:mm" : "ddMMyy-HHmm";

            var isParsed = DateTimeOffset.TryParse(record[key].ToString(), out var date);

            if (!isParsed)
            {
                return string.Empty;
            }

            var kievTimeZone = TimeZoneInfo.FindSystemTimeZoneById("Europe/Kiev");
            var kievTime = TimeZoneInfo.ConvertTime(date, kievTimeZone);

            var res =  $"{kievTime.ToString(formatter)}";
            return res;
        }
        catch(Exception ex)
        {
            return string.Empty;
        }
    }

    public static string GetValue(this IDictionary<string, object> obj, string key)
    {
        try
        {
            if (!obj.ContainsKey(key))
            {
                return string.Empty;
            }

            return (string)obj[key];
        }
        catch (Exception ex)
        {
            return string.Empty;
        }
    }
}
