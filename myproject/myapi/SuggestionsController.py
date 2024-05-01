import cohere
import sqlite3

class SuggestionsController:
    def getAllInput(self, user_input):
        conn = sqlite3.connect('db.sqlite3')

        # Initialize database connection cursor
        cursor = conn.cursor()

        #Get all location types
        cursor.execute("SELECT * FROM myapi_locationtype WHERE id != 11 AND id != 13")
        location_types_raw = cursor.fetchall()
        all_location_types = []
        for type in location_types_raw:
            all_location_types.append(type[1])
        print(all_location_types)
        conn.close()

        #Set up cohere prompt
        locations_string = "List of possible locations: "
        types = ", ".join(all_location_types)
        locations_string = locations_string + types
        locations_string = locations_string.replace("+"," ")
        print(locations_string)

        total_prompt = "Return a list of which of these locations fit the prompt below. If the prompt is a random set of letters or does not match any of the location types, return 'No location types matched':\nPrompt: " + user_input + "\n" + locations_string
        print(total_prompt)

        #Get cohere response
        co = cohere.Client("keyhere")

        response = co.generate(
            prompt= total_prompt,
            temperature=0.6
        )

        #Get suggested location_types
        print(response.generations[0].text)
        suggested_location_types = self.parseAIResponse(response.generations[0].text, location_types_raw)

        return suggested_location_types


    def parseAIResponse(self,response, location_types):
        suggested_types = []
        type_test = []
        response = response.lower()
        print(location_types)

        for type in location_types:
            no_plus = type[1].replace("+"," ")
            if no_plus == "book store":
                if "bookstore" in response:
                    suggested_types.append(type[0])
                    type_test.append(type[1])
            elif no_plus in response:
                suggested_types.append(type[0])
                type_test.append(type[1])
        print(type_test)

        return suggested_types 
        

    def decideAppropriateResponse(response):
        pass

    def getAllLocationTypes():
        pass

suggestions_controller = SuggestionsController()
suggested_types = suggestions_controller.getAllInput("I want to spend a relaxing day in the city and I don't have a car")
print(suggested_types)