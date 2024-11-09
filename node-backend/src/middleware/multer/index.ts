import multer from "multer";

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, "./public/uploads");
	},
	filename: function (req, file, cb) {
		const uniqueSuffix = Date.now();
		const originalFileName = file.originalname.split(".");
		cb(
			null,
			originalFileName[0].replace(/\s+/g, '') + "" + uniqueSuffix + "." + originalFileName[1]
		);
	},
});
const upload = multer({ storage: storage });

export default upload;
