/* Non-SSL is simply App() */
require("uWebSockets.js")
	.App()
	.get("/", (res, req) => {
		res.end("Hi!")
	})
	.get("/id/:id", (res, req) => {
		res.writeHeader("x-powered-by", "benchmark").end(
			`${req.getParameter("id")} ${req.getQuery("name")}`
		)
	})
	.post("/json", (res, req) => {
		readJson(
			res,
			(obj) => {
				res.writeHeader("content-type", "application/json").end(
					JSON.stringify(obj)
				)
			},
			() => {
				res.end("Ok")
			}
		)
	})
	.listen(3000, (listenSocket) => {
		if (listenSocket) {
			console.log("Listening to port 3000")
		}
	})

function readJson(res, cb, err) {
	let buffer

	res.onData((ab, isLast) => {
		let chunk = Buffer.from(ab)
		if (isLast) {
			if (buffer) {
				cb(JSON.parse(Buffer.concat([buffer, chunk])))
			} else {
				cb(JSON.parse(chunk))
			}
		} else {
			if (buffer) {
				buffer = Buffer.concat([buffer, chunk])
			} else {
				buffer = Buffer.concat([chunk])
			}
		}
	})

	res.onAborted(err)
}
