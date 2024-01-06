// this is where all api requests are handled

const express = require('express');
const https = require('https');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const nodeMailer = require('nodemailer');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const serviceAcct = require('path to your secret key'); // your firebase secret key

const app = express();
const salt = bcrypt.genSaltSync(10);

const admin = require('firebase-admin');
admin.initializeApp({
  credential: admin.credential.cert(serviceAcct),
  databaseURL: 'https://<database name>.firebaseio.com', // your firebase database url
});

const PORT = 8000;
app.use(cors());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// schema models you'll be using

const User = require('./models/user');
const Order = require('./models/order');
const Product = require('./models/product');

// connect to mongodb database with the provided url by mongodb

mongoose
  .connect('your mongodb url', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('connected to mongodb'))
  .catch(err => console.log('theres an error:', err));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// function to send verification email

const sendVerificationEmail = async (email, verificationToken) => {
  // initialize nodemailer

  const transporter = nodeMailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'email address@gmail.com', // sender email address
      pass: 'password', // sender email password
    },
  });

  const mailOptions = {
    from: '"Levon" <email address@gmail.com>', // sender address
    to: email,
    subject: 'Email verification',
    text: `Verification code: ${verificationToken}`,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.log('Error sending mail', error);
  }
};

// endpoint to register user

app.post('/register', async (req, res) => {
  try {
    const {firstName, lastName, email, password} = req.body;
    const user = await User.findOne({email});
    if (user) {
      return res.status(400).json({message: 'Email already existed'});
    } else {
      const hash = bcrypt.hashSync(password, salt); // hash the password
      const newUser = new User({
        firstName: (
          firstName[0].toUpperCase() + firstName.slice(1).toLowerCase()
        ).replace(/^\s+|\s+$/g, ''),
        lastName: (
          lastName[0].toUpperCase() + lastName.slice(1).toLowerCase()
        ).replace(/^\s+|\s+$/g, ''),
        email,
        password: hash,
      });
      newUser.verificationToken = crypto.randomBytes(3).toString('hex'); // store the verification token in the database
      await newUser.save();
      sendVerificationEmail(newUser.email, newUser.verificationToken); // send the token to the user's email
      return res.status(200).json();
    }
  } catch (error) {
    console.log('this is the error:', error);
    return res.status(500).json();
  }
});

// function to generate verification token

function generateSecretKey() {
  const secretKey = crypto.randomBytes(55).toString('hex');
  return secretKey;
}

const secretKey = generateSecretKey(); // verification token

// endpoint to login user

app.post('/login', async (req, res) => {
  try {
    const {email, password} = req.body;
    const user = await User.findOne({email});

    if (user) {
      // check if the password matches the hashed password

      const passwordMatches = bcrypt.compareSync(password, user.password);
      if (passwordMatches) {
        if (user.verified == false) {
          user.verificationToken = crypto.randomBytes(3).toString('hex');
          await user.save();
          sendVerificationEmail(user.email, user.verificationToken);
          return res.status(304).json({message: 'Unverified'});
        } else {
          const token = jwt.sign({userId: user._id}, secretKey); // sign the secret key with the userId
          return res.status(200).json({token});
        }
      } else {
        return res.status(404).json({message: 'Invalid email or password'});
      }
    } else {
      return res.status(404).json({message: 'Invalid email or password'});
    }
  } catch (error) {
    return res.status(500).json();
  }
});

// endpoint to verify code

app.post('/register/verify', async (req, res) => {
  try {
    const {email, verificationCode} = req.body;
    const user = await User.findOne({email});
    if (!user) {
      return res.status(404).json({message: 'Error getting user'});
    } else {
      if (user.verificationToken == verificationCode) {
        user.verified = true;
        user.verificationToken = undefined;
        // send notification to user
        user.notifications.push({
          header: 'Successful sign up',
          message: `Congratulations, ${user.firstName} on successfully signing up! Welcome to our community. Explore and enjoy the platform. If you have any questions or need assistance, feel free to contact us.`,
          sender: 'Levon',
          timestamp: new Date(Number(Date.now().toString())).toString(),
          seen: false,
        });
        await user.save();
        const token = jwt.sign({userId: user._id}, secretKey);
        return res.status(200).json({token});
      } else {
        return res.status(400).json({message: 'Invalid verification code'});
      }
    }
  } catch (error) {
    return res.status(500).json({message: 'Verification failed'});
  }
});

// endpoint to resend Verification code

app.post('/register/verify/resend-code', async (req, res) => {
  try {
    const {email} = req.body;
    const user = await User.findOne({email});
    if (!user) {
      return res.status(404).json({message: 'Error getting user'});
    } else {
      user.verificationToken = crypto.randomBytes(3).toString('hex');
      await user.save();
      sendVerificationEmail(user.email, user.verificationToken);
      return res.status(200).json({message: 'success'});
    }
  } catch (error) {
    return res.status(500).json({message: 'something went wrong'});
  }
});

// endpoint to get clothing category

app.get('/products/clothing', async (req, res) => {
  try {
    const page = req.query.page || 1;
    const pageSize = 10;
    const products = await Product.find({category: 'clothing'});
    const endIndex = page * pageSize;

    if (!products) {
      return res.status(404).json({message: 'No products to show'});
    }
    return res.status(200).json(products.slice(0, endIndex));
  } catch (error) {
    return res.status(500).json({message: 'Internal server error'});
  }
});

// endpoint to get notifications

app.get('/users/:userId/notifications', async (req, res) => {
  try {
    const userId = req.params.userId;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({message: 'user not found'});
    } else {
      if (user.notifications.length == 0) {
        return res.status(404).json({message: 'No notifications'});
      } else {
        res.status(200).json(user.notifications);
      }
    }
  } catch (error) {
    res.status(500).json({message: 'Internal server error'});
  }
});

// endpoint to get user profile

app.get('/users/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({message: 'user not found'});
    } else {
      return res.status(200).json(user);
    }
  } catch (error) {
    return res.status(500).json({message: 'Internal server error'});
  }
});

// endpoint to like/unlike product && add/remove product id from user's likes array

app.post('/likeProduct', async (req, res) => {
  try {
    const {productId, userId} = req.body;
    const product = await Product.findById(productId);
    const user = await User.findById(userId);
    if (!user && !product) {
      return res.status(404).json({message: 'error finding user or product'});
    } else {
      const likes = user.likedProducts.includes(productId);
      const users = product.usersThatLiked.includes(userId);
      if (likes && users) {
        user.likedProducts.splice(user.likedProducts.indexOf(productId), 1);
        await user.save();
        product.usersThatLiked.splice(
          product.usersThatLiked.indexOf(userId),
          1,
        );
        product.totalLikes = product.usersThatLiked.length;
        await product.save();
        return res.status(201).json({message: 'unliked'});
      } else {
        user.likedProducts.push(productId);
        await user.save();
        product.usersThatLiked.push(userId);
        product.totalLikes = product.usersThatLiked.length;
        await product.save();
        return res.status(200).json({message: 'product liked.'});
      }
    }
  } catch (error) {
    return res.status(500).json(error);
  }
});

// api to get all liked products

app.get('/users/:userId/likedProducts', async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId).populate('likedProducts');
    if (!user) {
      res.status(404).json({message: 'user not found'});
    }
    res.json(user.likedProducts);
  } catch (error) {
    return res.status(500).json({message: 'Internal server error'});
  }
});

// endpoint to rate product

app.post('/rateProduct', async (req, res) => {
  try {
    const {productId, userId, newRating} = req.body;
    const product = await Product.findById(productId);
    const user = await User.findById(userId);
    const populated = await Product.findById(productId).populate(
      'usersThatRated',
    );
    const newAverageRating = populated.usersThatRated.reduce((x, y) => {
      return x + y.ratedProducts.find(obj => obj.productId == productId).rating;
    }, 0);
    if (!user && !product) {
      return res.status(404).json({message: 'error finding user or product'});
    } else {
      const ratedProduct = user.ratedProducts.find(
        obj => obj.productId == productId,
      );
      const userThatRated = product.usersThatRated.includes(userId);
      if (ratedProduct && userThatRated) {
        user.ratedProducts.find(obj => obj.productId == productId).rating =
          newRating;
        await user.save();

        product.totalRatings.totalUsers = product.usersThatRated.length;
        product.totalRatings.averageRating =
          newAverageRating / product.usersThatRated.length;
        await product.save();
        return res.status(201).json({message: 'product already rated'});
      } else {
        user.ratedProducts.push({productId: productId, rating: newRating});
        await user.save();
        product.usersThatRated.push(userId);
        await product.save();

        product.totalRatings.totalUsers = product.usersThatRated.length;
        product.totalRatings.averageRating =
          newAverageRating / product.usersThatRated.length;
        await product.save();
        return res.status(200).json({message: 'product rated'});
      }
    }
  } catch (error) {
    return res.status(500).json(error);
  }
});

//endpoint to add an address

app.post('/addNewAddress', async (req, res) => {
  try {
    const {mobileNo, houseAddress, street, postalCode, city, landmark, userId} =
      req.body;
    const newAddress = {
      mobileNo: mobileNo,
      street: street,
      city: city,
      landmark: landmark,
      houseAddress: houseAddress,
      postalCode: postalCode,
    };
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({message: 'error finding user'});
    }
    const addressAlreadyExists = user.addresses.find(
      obj =>
        obj.street === street &&
        obj.city === city &&
        obj.postalCode === postalCode &&
        obj.landmark === landmark &&
        obj.houseAddress == houseAddress,
    );
    if (addressAlreadyExists) {
      return res.status(400).json({message: 'address already exists'});
    } else {
      user.addresses.unshift(newAddress);
      await user.save();
      return res.status(200).json({message: 'success'});
    }
  } catch (error) {
    res.status(500).json({message: 'Internal server error'});
  }
});

// endpoint to edit address

app.post('/editAddress', async (req, res) => {
  try {
    const {
      mobileNo,
      houseAddress,
      street,
      postalCode,
      city,
      landmark,
      userId,
      objId,
    } = req.body;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({message: 'error finding user'});
    }
    const address = user.addresses.find(obj => obj._id == objId);
    if (address) {
      if (
        address.street === street &&
        address.city === city &&
        address.postalCode === postalCode &&
        address.landmark === landmark &&
        address.houseAddress === houseAddress &&
        address.mobileNo === mobileNo
      ) {
        return res.status(400).json({message: 'address isnt changed.'});
      } else {
        address.street = street;
        address.city = city;
        address.postalCode = postalCode;
        address.landmark = landmark;
        address.houseAddress = houseAddress;
        address.mobileNo = mobileNo;
        await user.save();
        return res.status(200).json({message: 'success'});
      }
    } else {
      return res.status(404).json({message: 'error finding address'});
    }
  } catch (error) {
    res.status(500).json({message: 'Internal server erro'});
  }
});

// endpoint to delete address

app.post('/deleteAddress', async (req, res) => {
  try {
    const {objId, userId} = req.body;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({message: 'error finding user'});
    }
    const address = user.addresses.find(obj => obj._id == objId);
    if (address) {
      user.addresses.splice(user.addresses.indexOf(address), 1);
      await user.save();
      return res.status(200).json({message: 'success'});
    } else {
      return res.status(400).json({message: 'error finding address'});
    }
  } catch (error) {
    res.status(500).json();
  }
});

// endpoint to create new Order

app.post('/order', async (req, res) => {
  try {
    const {
      userId,
      products,
      totalPrice,
      shippingAddress,
      paymentMethod,
      shippingPrice,
    } = req.body;
    const newOrder = new Order({
      user: userId,
      products: products,
      totalPrice: totalPrice,
      shippingAddress: shippingAddress,
      paymentMethod: paymentMethod,
      status: 'Pending',
      shippingPrice: shippingPrice,
    });
    await newOrder.save();

    const user = await User.findById(newOrder.user);
    if (user) {
      user.orders.unshift(newOrder._id);
      user.notifications.unshift({
        header: 'Order received',
        message: `${user.firstName}, your order has been received and is currently being processed. Go to your orders to track your latest order.`,
        sender: 'Levon',
        timestamp: new Date(Number(Date.now().toString())).toString(),
        seen: false,
      });
      await user.save();
      return res.status(200).json({message: 'success'});
    } else {
      return res.status(404).json({message: 'user not found'});
    }
  } catch (error) {
    return res.status(500).json();
  }
});

// endpoint to verify user for payment. you must create a paystack account before you begin with this part.

app.post('/initialize-transaction', (req, res) => {
  try {
    const params = JSON.stringify({
      email: req.body.email,
      amount: req.body.amount,
      channels: req.body.channels,
    });

    const options = {
      hostname: 'api.paystack.co',
      port: 443,
      path: '/transaction/initialize',
      method: 'POST',
      headers: {
        Authorization: 'Bearer bearer token', // your paystack bearer token
        'Content-Type': 'application/json',
      },
    };

    const paystackRequest = https.request(options, paystackRes => {
      let data = '';

      paystackRes.on('data', chunk => {
        data += chunk;
      });

      paystackRes.on('end', () => {
        const responseData = JSON.parse(data);
        return res.status(200).json(responseData);
      });
    });

    paystackRequest.on('error', error => {
      console.error(error);
      res.status(500).json({error: 'Internal Server Error'});
    });

    paystackRequest.write(params);
    paystackRequest.end();
  } catch (error) {
    res.status(500).json({error: 'Internal Server Error'});
  }
});

// endpoint to verify payment status

app.get('/verify-transaction/:reference', async (req, res) => {
  try {
    const reference = req.params.reference;
    const options = {
      hostname: 'api.paystack.co',
      port: 443,
      path: `/transaction/verify/${reference}`,
      method: 'GET',
      headers: {
        Authorization: 'Bearer bearer token', // your paystack id
      },
    };

    const paystackRequest = https.request(options, paystackRes => {
      let data = '';

      paystackRes.on('data', chunk => {
        data += chunk;
      });

      paystackRes.on('end', () => {
        const responseData = JSON.parse(data);
        return res.status(200).json(responseData);
      });
    });

    paystackRequest.on('error', error => {
      console.error(error);
      return res.status(500).json({error: 'Internal Server Error'});
    });
    paystackRequest.end();
  } catch (error) {
    return res.status(500).json({error: 'Internal Server Error'});
  }
});

// endpoint to get all pending orders for admin. this should be in another app!

app.get('/all-orders', async (req, res) => {
  try {
    const orders = await Order.find({status: 'Pending'}).populate('user');

    if (!orders) {
      return res.status(404).json({message: 'No orders for now'});
    }
    return res.status(200).json(orders);
  } catch (error) {
    return res.status(500).json({message: 'Internal server error'});
  }
});

// endpoint to confirm or terminate order by admin. this should be in another app!

app.post('/orderConfirmation', async (req, res) => {
  try {
    const {orderId, confirmed, userId, adminId} = req.body;
    const order = await Order.findById(orderId);
    const user = await User.findById(userId);
    if (!order) {
      return res.status(404).json({message: 'order not found'});
    } else {
      if (confirmed) {
        order.status = 'Delivered';
        order.statusForAdmin.delivered = true;
        order.statusForAdmin.deliveredBy = adminId;
        await order.save();

        // increment the totalsales of the ordered products. there should be a better way to do this. like count the total number of delivered products of a particular product and assign that number to its total sales.
        order.products.map(async obj => {
          const sameId = await Product.findOne({_id: obj._id});
          if (sameId) {
            sameId.totalSales = sameId.totalSales + 1;
            await sameId.save();
          }
        });
        user.notifications.unshift({
          header: 'Order delivered',
          message: `${user.firstName}, your order was delivered at ${new Date(
            Number(Date.now().toString()),
          ).toString()}`,
          sender: 'Levon.com',
          timestamp: Date.now(),
          seen: false,
        });
        await user.save();
        return res.status(200).json({message: 'success'});
      } else {
        order.status = 'Failed';
        order.statusForAdmin.terminated = true;
        order.statusForAdmin.terminatedBy = adminId;
        await order.save();
        user.notifications.unshift({
          header: 'Order cancelled',
          message: `${user.firstName}, your order was cancelled at ${new Date(
            Number(Date.now().toString()),
          ).toString()}`,
          sender: 'Levon.com',
          timestamp: Date.now(),
          seen: false,
        });
        await user.save();
        return res.status(200).json({message: 'success'});
      }
    }
  } catch (error) {
    return res.status(500).json({message: 'server error'});
  }
});

// endpoint to get all orders for user

app.get('/:userId/orders', async (req, res) => {
  const userId = req.params.userId;
  try {
    const user = await User.findById(userId).populate('orders');

    if (!user) {
      return res.status(404).json({message: 'user not found'});
    }

    // res.json(orders);
    return res.status(200).json(user.orders);
  } catch (error) {
    return res.status(500).json({message: 'Internal server error'});
  }
});

// endpoint to check if user has made atleast one credit card payment before granting cash on delivery

app.post('/cash-on-delivery', async (req, res) => {
  try {
    const {userId} = req.body;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({message: 'User not found'});
    } else {
      const orders = await Order.findOne({
        status: 'Delivered',
        user: userId,
        paymentMethod: 'Credit Card',
      });
      if (!orders) {
        return res.status(404).json({message: 'no successful order'});
      } else {
        return res.status(200).json({message: 'eligible'});
      }
    }
  } catch (error) {
    return res.status(500).json({message: 'Internal server error'});
  }
});

// endpoint to search for products

app.get('/search/:query', async (req, res) => {
  try {
    const searchInput = req.params.query;
    const products = (await Product.find()).filter(item =>
      item.title.toLowerCase().includes(searchInput.toLowerCase()),
    );
    if (products) {
      const sortedProductsForSales = products.sort((a, b) => {
        return b.totalSales - a.totalSales;
      });

      const sortedProductsForRatings = sortedProductsForSales.sort((a, b) => {
        return b.totalRatings.averageRating - a.totalRatings.averageRating;
      });

      return res.status(200).json(sortedProductsForRatings);
    } else {
      return res.status(404).json({message: 'product not found'});
    }
  } catch (error) {
    return res.status(500).json({message: 'server error'});
  }
});

// endpoint to send message to user's device. you must create a firebase account before this part!

app.get('/sendMessage/:token/:userId/:type', async (req, res) => {
  try {
    const token = req.params.token;
    const userId = req.params.userId;
    const type = req.params.type;

    const user = await User.findById(userId);
    if (user) {
      if (user.deviceToken === token) {
        await admin
          .messaging()
          .send({
            token: token,
            data: {
              type: type,
              timestamp: new Date(Number(Date.now().toString())).toString(),
            },
            apns: {
              payload: {
                aps: {
                  'content-available': true,
                  priority: 'high',
                },
              },
            },
          })
          .then(response => {
            return res.status(200).json();
          })
          .catch(error => {
            return res.status(500).json({message: error});
          });
      } else {
        return res.status(400).json();
      }
    } else {
      return res.status(404).json();
    }
  } catch (error) {
    return res.status(500).json({message: error});
  }
});

// endpoint to refresh device token if it changes

app.post('/refreshToken', async (req, res) => {
  try {
    const {userId, newToken} = req.body;
    const user = await User.findById(userId);
    if (user) {
      user.deviceToken = newToken;
      await user.save();
      return res.status(200).json();
    } else {
      return res.status(404).json();
    }
  } catch (error) {
    return res.status(500).json();
  }
});

// endpoint to get recomended products

app.get('/recomended/:productId', async (req, res) => {
  try {
    const productId = req.params.productId;
    const product = await Product.findById(productId);

    if (product) {
      const products = await Product.find({
        category: product.category,
        subCategory: product.subCategory,
        gender: product.gender,
      });
      const sortedProductsForSales = products.sort((a, b) => {
        return b.totalSales - a.totalSales;
      });

      const sortedProductsForRatings = sortedProductsForSales.sort((a, b) => {
        return b.totalRatings.averageRating - a.totalRatings.averageRating;
      });

      return res
        .status(200)
        .json(
          sortedProductsForRatings
            .filter(item => item._id !== product._id)
            .slice(0, 6),
        );
    } else {
      return res.status(404).json();
    }
  } catch (error) {
    return res.status(500).json({message: error});
  }
});
