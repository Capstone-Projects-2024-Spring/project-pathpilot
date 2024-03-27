import requests
import json
from bs4 import BeautifulSoup
def createURL(zipcode, loType):
    url = f"https://www.yelp.com/search?find_desc={loType}&find_loc=Philadelphia%2C+PA+{zipcode}"
    print(loType)
    print (url)
    return url

def doRequest(url):
    
    response = requests.get(url)
    
    parseResult(response)

def parseResult(response): #parse result
    data = BeautifulSoup(response.text, 'html.parser')
    data1 = data.find_all("ul")
    num=0
    for i in data1:
        for li in i.find_all("li"):
            num+=1
            businessArray=[]
            for h3 in li.find_all("h3"):
                if(h3.text!=None):
                    businessArray.append(h3.text)
                #print(h3.text, end=" ")
            for ratingClass in li.find_all(class_="css-14g69b3"):
                if(ratingClass.get('aria-label') != None):
                    rating = str(ratingClass.get('aria-label'))
                    businessArray.append(rating)
            for priceRange in li.find_all(class_="priceRange__09f24__ZgJXy css-blvn7s"):
                if(priceRange.text != None):
                    priceIcon = str(priceRange.text)
                    businessArray.append(priceIcon)
                else:
                    businessArray.append("N/A")
            if businessArray!=[]:
                print(businessArray)
    
    
    
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

#url = "https://www.yelp.com/search?find_desc=restaurants&find_loc=Philadelphia%2C+PA+19122"
url = createURL(19122, "restaurants")
num=0
doRequest(url)
#while(num<=30): #cap at 300 to be safe, unlikely beyond that, program just stops when it cant reach site anymore
  #  val = num*10
   # tempUrl= url + f"&start={val}"
   # doRequest(tempUrl)
   # num+=1
#&start=10