# Deeplink example server

This is an example of using deeplink in a node.js express project

## Run

```bash
$ node app.js
```

Now, open browser and point it to [`http://localhost:3000/deeplink?url=cups%3A%2F%2Fmain`](http://localhost:3000/deeplink?url=cups%3A%2F%2Fmain)

You can try different browsers (desktop, android, ios). If you want to try it on your phone, you'll need to be on the same network as your PC and use the internal ip address instead of localhost.
Another option is to use a proxy tunnel like [ngrok](https://ngrok.com/).

Remember that the deeplink has to be url encoded:

> `app://main` becomes `app%3A%2F%2Fmain`

If you want to test it with a link on an html page, point your browser to [http://localhost:3000](http://localhost:3000)
