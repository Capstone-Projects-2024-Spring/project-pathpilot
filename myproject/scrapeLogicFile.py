import requests
import json
from bs4 import BeautifulSoup
def createURL(zipcode, loType):
    url = "https://www.google.com/maps/search/restaurants+in+<location>"
    url = url.replace("restaurants", loType) #put type requested
    url = url.replace("location", str(zipcode)) #put zipcode in there
    print(loType)
    print (url)
    return url

def doRequest(url):
    response = requests.get(url)
    html_content= response.text
    data = response.text
    with open('fileJ.json', 'w') as file:
        file.write(data)
    return html_content

def parseResult(html_content): #parse result
    soup = BeautifulSoup(html_content, 'html.parser')
    restaurants = soup.find_all("div", class_="section-result-details-container")
    print(restaurants)
    for restaurant in restaurants:
        name = restaurant.find("h3", class_="section-result-title").text.strip()
        address = restaurant.find("span", class_="section-result-location").text.strip()

        print("Name:", name)
        print("Address:", address)
        print("-"*50)

url = createURL(19121, "restaurants")
parseResult(doRequest(url))