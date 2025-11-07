# furniture_recommendation_flow.py
from metaflow import FlowSpec, step, Parameter

# Furniture Recommendation System for Rental Market using Metaflow
class FurnitureRecommendationFlow(FlowSpec):

    # Input parameters for the flow
    user_style = Parameter("style", help="Preferred furniture style", default="Modern")
    user_budget = Parameter("budget", help="User budget in USD", default=500)

    @step
    def start(self):
        print("Starting Furniture Recommendation Flow...")
        
        # Sample furniture dataset
        self.furniture_data = [
            {"name": "Modern Sofa", "style": "Modern", "price": 450, "type": "Sofa"},
            {"name": "Classic Armchair", "style": "Classic", "price": 350, "type": "Chair"},
            {"name": "Rustic Table", "style": "Rustic", "price": 600, "type": "Table"},
            {"name": "Scandinavian Bed", "style": "Scandinavian", "price": 700, "type": "Bed"},
            {"name": "Minimalist Desk", "style": "Modern", "price": 300, "type": "Desk"},
            {"name": "Vintage Drawer", "style": "Classic", "price": 400, "type": "Drawer"},
        ]
        self.next(self.filter_furniture)

    @step
    def filter_furniture(self):
        # Filter furniture by user style and budget
        self.recommended = [
            item for item in self.furniture_data
            if item["style"].lower() == self.user_style.lower()
            and item["price"] <= self.user_budget
        ]
        self.next(self.display_results)

    @step
    def display_results(self):
        # Display recommendations
        if self.recommended:
            print(f"\nRecommended Furniture for style '{self.user_style}' and budget ${self.user_budget}:")
            for item in self.recommended:
                print(f"- {item['name']} (${item['price']}) [{item['type']}]")
        else:
            print(f"\nNo furniture found for style '{self.user_style}' within budget ${self.user_budget}.")

        self.next(self.end)

    @step
    def end(self):
        print("\nFlow completed successfully!")


if __name__ == "__main__":
    FurnitureRecommendationFlow()