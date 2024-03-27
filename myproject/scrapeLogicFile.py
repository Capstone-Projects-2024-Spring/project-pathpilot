import requests
import json
from bs4 import BeautifulSoup
def createURL(zipcode, loType):

    #url = f"https://www.google.com/maps/search/{loType}+{zipcode}"
    #business_type = loType #put type requested
    #zipcode = str(zipcode)  #put zipcode in there
    print(loType)
    print (url)
    return url

def doRequest(url):
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3"
    }
    response = requests.get(url)
    
    parseResult(response)

def parseResult(response): #parse result
    data = BeautifulSoup(response.text, 'html.parser')
    data1 = data.find_all("ul")
    
    for i in data1:
        businessArray=[]
        for li in i.find_all("li"):
            for h3 in li.find_all("h3"):
                print(h3.text, end=" ")
            for classThing in li.find_all(class_="css-14g69b3"):
                print(classThing.get('aria-label'))
    
    
    
    #businesses = []
    #for item in soup.find_all("h4", class_="css-1qn0b6x"):
     #   name = item.text.strip()
      #  businesses.append(name)
    #else:
    #    print("Failed to fetch data")
    #print(businesses)
    #for restaurant in businesses:
     #   print("Name:", name)
      #  print("-"*50)

url = "https://www.yelp.com/search?find_desc=restaurants&find_loc=Philadelphia%2C+PA+19122"
#createURL(19121, "restaurants")
doRequest(url)