using System;

namespace ChowServerlessRestAPI
{
  public class MealOptionDto
  {
    public string Id { get; set; }
    public string MealId { get; set; }
    public string Name { get; set; }
    public string Description { get; set; }
    public bool IsLocked { get; set; }
    public string Category { get; set; }
    public string Calories { get; set; }
    public string ThumbnailURL { get; set; }
    public string DateCreated { get; set; }
    public string LastModified { get; set; }
  }
}
