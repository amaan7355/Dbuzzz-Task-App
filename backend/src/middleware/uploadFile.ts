// import multer from "multer";
// import path from "path";


// const storage = multer.diskStorage({
//     destination: function (req: any, file: any, callback: any) {
//         const fs = require('fs');

//         let tourpathlarge =  "profile";
//         const imagePath = path.resolve(__dirname, '../../uploads/'+tourpathlarge);
//         if (!fs.existsSync(imagePath)){
//             fs.mkdirSync(imagePath, { recursive: true });
//         }
//         callback(null, imagePath);


//     },
//     filename: (req: any, file: any, cb: any) => {
//         cb(null, `${file.originalname}`);
//     }
// });

// export const upload = multer({ storage });

