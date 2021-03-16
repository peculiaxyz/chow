using System;
using System.Collections.Generic;
using System.Text;

namespace ChowServerlessRestAPI
{
  public class MealOptionDto
  {
    public string Id { get; set; } = Guid.NewGuid().ToString();
    public string MealId { get; set; }
    public string Name { get; set; }
    public string Description { get; set; }
    public int Period { get; set; }
    public string Category { get; set; }
    public int DayOfTheWeek { get; set; } = new Random().Next(0, 6);
  }
}
