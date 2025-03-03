namespace litak_back_end.Models
{
    public class Record
    {
        public Guid RecordId { get; set; }
        public string Mission { get; set; }
        public string NickName { get; set; }
        public string Subdivision { get; set; }
        public string OperatorNumber { get; set; }
        public string HelperNumber { get; set; }
        public string PPONumber { get; set; }
        public string REBNumber { get; set; }
        public string DronAppointment { get; set; }
        public string DronModel { get; set; }
        public string ControlChannelFrequencyRange { get; set; }
        public string VideoChannelFrequencyRange { get; set; }
        public DateTime PlannedFlyDateTime { get; set; }
        public string RouteToTheTarget { get; set; }
        public string InitialRouteFromTheTarget { get; set; }
        public bool InitialRouteChangedFlag { get; set; }
        public string ChangedRouteFromTheTarget { get; set; }
        public bool EnteredDiscordChannel { get; set; }
        public bool PPOApprove { get; set; }
        public string PPODeclineReason { get; set; }
        public bool REBApprove { get; set; }
        public string REBDeclineReason { get; set; }
        public ActionAndTime TakeOff { get; set; }
        public ActionAndTime CrossingBattleLineForward { get; set; }
        public ActionAndTime Return { get; set; }
        public ActionAndTime CrossingBattleLineBack { get; set; }
        public string BoardingStatus { get; set; }
        public bool MissionFinishedFlag { get; set; }
    }
}
