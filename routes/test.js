const express = require("express");
const router = express.Router();
const Test = require("../model/test123");
const admin = require("../model/student");
const Reg = require("../model/reg");
const product = require("../model/product");
const bodyParser = require("body-parser");
const { json } = require("body-parser");
const { response } = require("express");
const reg = require("../model/reg");
const res = require("express/lib/response");
const nodemailer = require("nodemailer");
const story = require("../model/story");
const student = require("../model/student");
const { aggregate } = require("../model/test123");
const _enum = require("../model/enum/enum");
const multer = require("multer");
const path = require("path");
const app = express();

router.get("/", (req, res) => {
  res.send("hello");
});

router.post("/test", async (req, res) => {
  const { name, age } = req.body;

  const test = new Test();
  test.name = name;
  test.age = age;
  // console.log(a1);
  try {
    const data = await test.save();
    res.json(data);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.get("/get", async (req, res) => {
  try {
    const data = await Test.find();
    res.json(data);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});
//get by id

router.get("/getdata", async (req, res) => {
  try {
    const data = await Test.findById(req.body.id);
    res.json(data);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});
//get by name
router.get("/getname", async (req, res) => {
  try {
    const name = req.body.name;
    const data = await Test.find({ name });
    res.json(data);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

//update api
router.post("/update", async (req, res) => {
  const data = {
    name: req.body.name,
    age: req.body.age,
  };
  const use = await Test.findByIdAndUpdate(req.body.id, {
    name: req.body.name,
    age: req.body.age,
  });
  // .then((data1) => {
  console.log(use);
  if (use) {
    res.json(data);
  } else {
    res.status(404).json({
      message: "data not updated",
    });
  }
});
//   console.log(data1);
//   console.log(testdata);

// })
// .catch((err) => {
//   res.status(404).json({
//     message: "data not updated",
//   });
// });

//delete api

router.post("/delete", async (req, res) => {
  Test.findByIdAndDelete(req.body._id)
    .then((data) => {
      console.log(data);
      res.status(200).send({ message: "data deleted" });
    })
    .catch((err) => {
      return res.status(404).send({
        message: "data not deleted",
      });
    });
});

//pagination api

// router.get("/pagination", (req, res) => {
//   var page = parseInt(req.body.page);
//   var size = parseInt(req.body.size);
//   var query = {};
//   if (page < 0 || page === 0) {
//     response = {
//       error: true,
//       message: "invalid page number, should start with 1",
//     };
//     return res.json(response);
//   }
//   query.skip = size * (page - 1);
//   query.limit = size;
//   // Find some documents
//   Test.find({}, {}, query, function (err, data) {
//     // Mongo command to fetch all data from collection.
//     if (err) {
//       response = { error: true, message: "Error fetching data" };
//     } else {
//       response = { error: false, message: data };
//     }
//     res.json(response);
//   });
// });

router.get("/pagination", (req, res) => {
  var page = parseInt(req.query.page) || 0; //for next page pass 1 here
  var limit = parseInt(req.query.limit) || 3;
  var query = {};
  Test.find(query)
    .sort({ update_at: -1 })
    .skip(page * limit) //Notice here
    .limit(limit)
    .exec((err, doc) => {
      if (err) {
        return res.json(err);
      }
      Test.countDocuments(query).exec((count_error, count) => {
        if (err) {
          return res.json(count_error);
        }
        return res.json({
          total: count,
          page: page,
          pageSize: doc.length,
          books: doc,
        });
      });
    });
});
//sorting
router.post("/sorting", async (req, res) => {
  try {
    const result = await Test.find().sort({ name: -1 });
    console.log(result);
    res.json(result);
  } catch (err) {
    console.log(err);
  }
});

//searching
router.get("/search", (req, res) => {
  const search = req.body.data;

  Test.find({ name: { $regex: search, $options: "$i" } }).then((data) => {
    res.send(data);
    console.log(data);
  });
});

module.exports = router;
//login
router.post("/login", async (req, res) => {
  const loginuser = await reg.find({
    gmail: req.body.gmail,
    password: req.body.password,
  });
  if (loginuser.length > 0) {
    return res.status(200).send({ message: "login success" });
  } else {
    res.status(400).send({ message: "correct username and password" });
  }
});

//registation data

router.post("/registation", async (req, res) => {
  const reg = new Reg({
    name: _enum.name,
  });
  try {
    const data = await reg.save();
    res.status(200).send({ data, message: "data register" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

//otp
router.post("/otp", async (req, res) => {
  const genotp = Math.floor(100000 + Math.random() * 900000);
  console.log(genotp);

  let user = await Reg.findByIdAndUpdate(req.body.id, { otp: genotp });

  console.log(user);
  if (user) {
    res.status(200).send({ message: "otp genrate" });
  } else {
    res.status(400).send({ message: "otp not genrated" });
  }
});

//send otp gmail
router.post("/sendotp", async (req, res) => {
  const sendotp = Math.floor(100000 + Math.random() * 900000);

  const gmail = req.body.gmail;
  let usersend = await Reg.findOneAndUpdate({ gmail: gmail }, { otp: sendotp });
  console.log(usersend);
  if (usersend) {
    var transport = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "patelhet04@gmail.com",
        pass: "Diku@4199",
        secure: true,
      },
    });
    var mailOptions = {
      from: "patelhet04@gmail.com",
      to: req.body.gmail,
      subject: "otp",
      html: `<html> ${sendotp} is your one time password(OTP) for verification </html>`,
    };
    transport.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
        return res.status(400).send("otp not send");
      } else {
        res.status(200).send("otp send");
      }
    });
  } else {
    res.status(400).send("otp not genrated");
  }
});
// verify otp api
router.post("/verifyotp", async (req, res) => {
  let user = await Reg.find({
    email_id: req.body.gmail,
    otp: req.body.otp,
  });
  if (user.length > 0) {
    return res.status(200).send("otp verified");
  } else {
    res.status(400).send("otp is incorrect");
  }
});

//get and join

router.get("/storydata", async (req, res) => {
  const getstory = new story({
    auther_name: req.body.auther_name,
    title: req.body.title,
    fan_name: req.body.fan_name,
    book_name: req.body.book_name,
  });
  try {
    const storydata = await getstory.save();
    res.json(storydata);
  } catch (err) {
    res.status(400).send("data not created");
  }
});

//join data
router.get("/joinget2", async (req, res) => {
  Reg.aggregate([
    { $match: { name: "ashish" } },
    {
      $lookup: {
        from: "stories",
        localField: "author_name",
        foreignField: "name",
        as: "storydetails",
      },
    },
  ])
    .then((data) => {
      console.log(data);

      res.status(200).send(data);
    })
    .catch((err) => {
      return res.status(404).send({
        message: "data not get",
      });
    });
});

// router.get("/joinget1", async (req, res) => {
//   Reg.aggregate([
//     {
//       $lookup: {
//         from: "stories",
//         localField: { name: "ashish" },
//         foreignField: { auther_name: "ashish" },
//         as: "storydetails",
//       },
//     },
//   ])
//     .then((data) => {
//       console.log(data);

//       res.status(200).send(data);
//     })
//     .catch((err) => {
//       return res.status(404).send({
//         message: "data not get",
//       });
//     });
// });

router.get("/zzz", async (req, res) => {
  // posted_by: {type: Schema.Types.ObjectId, ref: 'stories', required: true}

  Reg.aggregate([
    {
      $lookup: {
        from: "stories",
        localField: "name",
        foreignField: "author_name",
        as: "author_name",
      },
    },
    {
      $set: {
        author_name: { $arrayElemAt: ["$author_name.author_name", 0] },
      },
    },
    { $unwind: "$author_name" },
  ])
    .then((data) => {
      console.log(data);

      res.status(200).send(data);
    })
    .catch((err) => {
      return res.status(404).send({
        message: "data not get",
      });
    });
});

//change password

router.get("/changepass", async (req, res) => {
  let gmail = req.body.gmail;

  let user = await Reg.findOneAndUpdate(
    { gmail: gmail },
    { password: req.body.newpassword }
  );
  if (user) {
    return res.status(200).json({ message: "password changed" });
  } else {
    res.status(400).json({ message: "password not changed" });
  }
});

router.get("/changepass1", async (req, res) => {
  let password = req.body.password;
  let gmail = req.body.gmail;
  let user = await Reg.findOneAndUpdate(
    { password: password, gmail: gmail },
    { password: req.body.newpassword }
  );

  if (user) {
    return res.status(200).json({ message: "password changed" });
  } else {
    res.status(400).json({ message: "password not changed" });
  }
});

router.get("/fatch", async (req, res) => {
  // posted_by: {type: Schema.Types.ObjectId, ref: 'stories', required: true}
  let matchobj = {};
  if (req.body.id) {
    matchobj["id"] = mangoose.type.objectid(req.body.id);
  }
  let arg = {
    query: [
      {
        $match: { ...matchobj, isDelete: false },
      },
      {
        $lookup: {
          from: "regs",
          localField: "id",
          foreignField: "id",
          as: "regs",
        },
      },
    ],
  };
  let product_data = await genericfunction._basefetch(
    productmodel,
    arg,
    "aggregate"
  );
  if (product_data) {
    return _responsewrapper(false, product_data.error["message"], 400);
  }
  return _responsewrapper(true, "fetch successfully", 200, product_data);
});

// get data product
router.get("/productget", async (req, res) => {
  const data = new product({
    p_name: req.body.p_name,
    product_name: req.body.product_name,
    product_price: req.body.product_price,
    product_details: req.body.product_details,
  });
  console.log(data);
  const productdata = await data.save();
  res.send(productdata);
});

//get product join reg form

router.post("/product", async (req, res) => {
  const data = {
    name: req.body.name,
    // product_name: req.body.product_name,
    // product_price: req.body.product_price,
  };
  Reg.aggregate([
    { $match: { name: "ashish" } },
    {
      $lookup: {
        from: "products",
        localField: "p_name",
        foreignField: " name ",
        as: "product details",
      },
    },
  ])
    .then((data2) => {
      console.log(data2);
      res.status(200).send(data2);
    })
    .catch((err) => {
      return res.status(400).send({ message: "data not get" });
    });
});

//registation with image store database
app.use(bodyParser.json());
// app.use(
//   bodyParser.urlencoded({
//     limit: "500mb",
//     extended: true,
//     parameterLimit: 100000000,
//   })
// );
const storage = multer.diskStorage({
  destination: "./upload/images",
  filename: (req, file, cb) => {
    return cb(
      null,
      `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 3,
  },
});
app.use("/profile", express.static("upload/images"));

router.post("/upload", upload.single("profile"), (req, res) => {
  res.json({
    success: 1,
    profile_url: `${req.protocol}://${req.get("host")}/upload/images/${
      req.file.filename
    }`,
  });
});
function errHandler(err, req, res, next) {
  if (err instanceof multer.MulterError) {
    res.json({
      success: 0,
      message: err.message,
    });
  }
}
