# agood-yelpcamp

Yelpcamp is a full-stack CRUD application that acts as a simple Yelp clone for campgrounds. It lets the user create an account and submit campgrounds with ifnormation such as price, location, and images, as well as review campgrounds submitted by others. 
Visit the live application at https://agood-yelpcamp.herokuapp.com/

I created this app as a final project for Colt Steele's online Web Developer Bootcamp via Udemy. It is primarily built on Javascript using Node with Express for server-side scripting and MongoDB for data management. The visual styling makes use of Bootstrap 5.1.3. The clustermap on the index page and the individual maps on each campground's page use MapBox. Images are stored on Cloudinary, and the app is hosted on Heroku. All non-user uploaded images come from Unsplash.com.

While the project is functional as-is, there are various tweaks, improvements, and personalization changes that I plan to add in the future. Some of these include:
- Better image validation, as well as back-end deletion of images on Cloudinary on deletion of a campground.
- User pages where you can view all of the reviews made by an individual user
- Average campground rating
- Numerous UI improvements, both through independent styling as well as tweaking the look of existing Bootstrap implementation.
