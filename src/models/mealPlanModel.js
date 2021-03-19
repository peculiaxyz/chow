export class DailyMealPlanModel{
    constructor(){
        this.id = "";
        this.planId = "";
        this.meals = [];  // List of mealId consumed on a specific day
        this.comments = "";
        this.dateCreated = "";
        this.lastModified = "";
    }
}