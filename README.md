# The Joy of JavaScript (TJoJS)
Thank you for becoming an early adopter of The Joy of JavaScript (TJoJ), and welcome! To get the most out of this book, you’ll want to have a professional grasp of JavaScript either on the server or the client side, as well as an interest in learning new ways to write JavaScript.

In these strange and turbulent times of seclusion and social distancing, reading and writing  have become my escape. I hope that reading  this book can help you get through this “coronanxiety,” just as writing it is helping me, and that we can come out of this crisis stronger and more motivated.

We’re at the perfect point of inflection for a book like Joy of JavaScript. The language is moving at a frantic pace, and this book allows you to jump ahead and begin to grasp the stream of new proposals and modern programming idioms that will equip you to tackle today’s challenges in the cleanest, most elegant way; and have fun while doing it!

I began coding JavaScript many years ago, but really became passionate about it when I surfed the functional and reactive programming wave that began about four years ago. This opened up my eyes to a completely different perspective on the language, while inspiring me to write Manning titles like Functional Programming in JavaScript and RxJS in Action.

As excited as I was about writing those books, I always felt I was overlooking a whole dimension of the language: objects. Objects are the fabric of the language. This book reveals JavaScript’s true multi-paradigmic nature, and shows how all of the new features supports these paradigms. The book starts with foundational concepts that teach different alternatives for modeling your objects. The second part connects these pieces together in a compositional, functional manner. With the models in place, part three deals with how to properly architect and organize code around JavaScript’s new module system. Finally, you’ll learn how to code asynchronously using JavaScript’s data protocols, as well as how to scale to infinite amounts of data using streams. 

Unlike most JavaScript books and tutorials, this book relies entirely on plain, vanilla JavaScript with no dependencies on third-party libraries or frameworks. Throughout each chapter, you’ll learn about the new proposals and features that are currently being standardized and the paradigms that embrace these features.
The Joy of JavaScript is not a guide or cookbook for writing ECMAScript 2016, 2017, etc. You can find that easily online. Rather, it aims at showcasing new programming idioms, techniques, and sound computer science topics in the context of tackling a real-world problem—underpinning what we know today as modern JavaScript application development. 
Finally, if you have any questions, comments, or suggestions, please share them in Manning’s LiveBook platform: https://livebook.manning.com/book/the-joy-of-javascript/discussion.

—Luis Atencio

<p align="center">
    <img src="https://github.com/JoyOfJavaScript/joj/blob/master/img/cover.jpg" height="450" width="400" align="center" />
</p>

# Running the code
You have a couple of options to run the code. If you have Node.js v14 installed locally in your system or would like to upgrade, feel free to run the tests locally; otherwise, if for some reason you can't upgrade your system's Node.js version, you can run the code housed in a Docker container.

Assuming you have Git installed, you can download the code with the following git command:
~~~
git clone https://github.com/JoyOfJavaScript/joj.git
~~~

## Upgrading to Node.js 14
If you'd like to upgrade your system to Node.js 14, please follow these instructions: 

1. Run `node -v` to confirm your existing Node.js version
2. Run `sudo npm install -g n` to install the `n` package. This library makes upgrading Node.js simple
3. Upgrade to latest 14.x.x version running `sudo n 14.12.0`

### Running locally with your own installed version of Node.js
The repo contains two projects: *blockchain* and *chapter-listings* in `src` folder. You must first initialize *blockchain*. 

`cd` to the `blockchain` project and run: `npm install; npm run build`

Next, `cd` into `chapter-listings` projects and run `npm install`.

#### Running all tests
Now, you should be able to run all chapter listings by running: `npm run test-all`

You should > 200 unit tests passing. 

You can also run the `blockchain` tests by navigating to that folder and running the same command `npm run test-all`

You should see around 100 unit tests passing. 

#### Running an individual test
The Joy of JavaScript teaches a few non-standard, future features. Hence, to run an individual chapter listing test file, you must first transpile the code with Babel. 
In `chapter-listings` , run `npm run build`. This will transpile all files into `_babel` directory. 
To run a test, execute `npm run test ./_babel/src/ch05/[listing-number].spec.mjs`

## Running inside a container
If for some reason you can't upgrade your system's Node.js version, you can run the code inside a Docker container. 

First, you need to download and install the Docker Desktop plugin corresponding to your platform (MacOS, Windows, etc). You can find that in [https://www.docker.com/products/docker-desktop]

Once installed, navigate to the top level folder `joj` of the cloned repository. There you will find a `docker-compose.yml` file. 
With Docker, you only have the option to run all tests. To do so, just run: `docker-compose up`. This will run all *blockchain* tests first, then all *chapter-listings* tests. 
Afterwards, you can run `docker-compose down` to tear down the enrivonment. 
