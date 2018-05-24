# Your Face Here 

[http://yourfacehere.someguywhocodes.com](http://yourfacehere.someguywhocodes.com)

Django / React app to upload a photo, detect faces using [AWS Rekognition](https://aws.amazon.com/rekognition/), and swap it out into a character splash art. 

This web app was built because it's fun. I also wanted to finally get around to trying out [Django](https://www.djangoproject.com/) while playing more with [React](https://reactjs.org/)


## User Flow

- Person lands on website
	- Frontend initializes session w/ backend
- Person uploads image
	- Backend transfers image to s3
	- Backend scans for faces and returns result to frontend
- Person chooses character art to swap faces with 
	- Multiple faces are supported in some splash art, if multiple faces are found.
	- Even if multiple faces are found, one of the discovered faces can be selected to be placed into a 1 face splash art. 
- Person submits face swap and receives the chosen character art with their own face replacing the characters face. 
	- Person gets option to share image or merge with a different character.


## Running Locally

### System Requirements

This app will require Python 3.6 and Node JS 9+.


### AWS and Imgur


This app uses [AWS Rekognition](https://aws.amazon.com/rekognition/) for face detection and [S3 buckets](https://aws.amazon.com/s3/) for image storage.

Your AWS API key can be set using boto friendly environment variables. 
Your S3 bucket must be configured in the [src/yourfacehere/settings/base.py](src/yourfacehere/settings/base.py) file 

#### Splash Images and AWS 
All of the splash images are configured in `src/yourface/splash/*face.py`. Each image data set is a relative hosted name from the configured AWS paths in your `src/yourfacehere/settings/base.py` file. They're all organized in folders by the number of faces and which category they belong to.  

You will want to change all of the data in the `*face.py` files to reflect your images

For example.  `https://s3.amazonaws.com/yourfacehere/splash/disney/1faces/Ursula.jpg` would be in the the `1face.py` file with `category_key="disney"` and `filename="Ursala.jpg"` values set. 

I have the faceless files set to private within AWS and only the backend app with the AWS key can access it. The regular splash files are public so they can be used on the frontend. 

Note that no CDN is currently used. 


### React Frontend

The frontend is a React based app, initialized with [create-react-app](https://www.github.com/facebook/create-react-app) and then ejected for more granular control. 

Load app dependencies with 
```
npm install
```

Entry point is located in `src/static/js/index.js`. 

Build goes to `src/static/build`. The backend app is [configured to use that path](src/yourfacehere/settings/base.py#L129) for it's static values.

```
# to run local build and watcher
npm run start
# or to create the static build served by the python backend
npm run build
``` 


### Python Backend


To run locally, setup and activate [virtual environment](https://docs.python.org/3/tutorial/venv.html)

Once your Python 3.6 virtual environment is activated, install requirements
```
pip install -r requirements.txt
```


After your requirements are successfully installed, you can run the backend. 
```
python src/manage.py runserver
```

The backend serves [API calls](src/api/views.py) and [renders out](src/yourfacehere/views.py) the [React frontend entry point](src/static/js/index.js).

You should be able to visit `http://localhost:8000` after the server successfully starts (note you will need to make sure to build the frontend to have the site served)


### Memcache Session Storage

If you want to use memcache for session storage, apply the following settings to `src/yourfacehere/settings/local.py` (or `base.py`) 

```
CACHES = {
    'default': {
        'BACKEND': 'django.core.cache.backends.memcached.MemcachedCache',
        'LOCATION': '127.0.0.1:11211',  # Set to your backend location
    }
}

```



## Contributing 
Aww, thanks! I would love to improve this pet project codebase. Let's follow a few simple rules for pull requests. 

1. There are no tests yet, so most PR's will be pulled down and tested locally before merging
	1. Also happy to accept PR's that start introducing tests.
1. All changes will get deployed out to the [hosted site](http://yourfacehere.someguywhocodes.com) _usually_ within a day or so.
1. If you are contributing [new art to be used](src/yourface/splash/1face.py), please include the original and faceless art image assets as uploads in the PR so they can be uploaded to the S3 bucket. 


## Deployed using ElasticBeanstalk

This app is deployed using [ElasticBeanstalk in AWS](https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/create-deploy-python-django.html).  Check out my `src/.ebextensions/` and `src/.elasticbeanstalk/` folders for some configuration pieces that are used for logging and static file serve settings.  


## IP of Art

All rights of the splash art used are reserved by their respectful intellectual property owners (Disney & Riot Games). They did not endorse this app. This app is not intended or structured to monetize.
